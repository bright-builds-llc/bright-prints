import { randomBytes } from "node:crypto";

import type { PrismaClient, User } from "@prisma/client";
import {
  createCookieSessionStorage,
  type Session,
  type SessionStorage,
} from "react-router";

import { getServerEnv } from "~/lib/env.server";
import type { SignGeneratorValues } from "~/lib/generators/sign";

export type PendingIntent =
  | { kind: "save-bookmark"; printSlug: string }
  | { kind: "remove-bookmark"; printSlug: string }
  | { kind: "create-list"; name: string }
  | { kind: "rename-list"; listId: string; name: string }
  | { kind: "delete-list"; listId: string }
  | { kind: "add-print-to-list"; listId: string; printSlug: string }
  | { kind: "remove-print-from-list"; listId: string; printSlug: string }
  | {
      kind: "save-generator-preset";
      generatorSlug: string;
      name: string;
      values: SignGeneratorValues;
    }
  | { kind: "rename-generator-preset"; name: string; presetId: string }
  | { kind: "delete-generator-preset"; presetId: string };

export type SessionFlashMessage = {
  kind: "error" | "success";
  message: string;
};

type SessionData = {
  authToken?: string;
  flash?: SessionFlashMessage;
  pendingIntent?: PendingIntent;
  returnTo?: string;
};

type SessionStore = Pick<PrismaClient, "session">;
type UserStore = Pick<PrismaClient, "session">;

let maybeSessionStorage: SessionStorage<SessionData> | null = null;

function buildAuthSessionStorage(): SessionStorage<SessionData> {
  const { NODE_ENV, SESSION_SECRET: maybeSessionSecret } = getServerEnv();

  if (!maybeSessionSecret) {
    throw new Error(
      "SESSION_SECRET is required before auth session features can run.",
    );
  }

  return createCookieSessionStorage<SessionData>({
    cookie: {
      httpOnly: true,
      name: "__bright_prints_session",
      path: "/",
      sameSite: "lax",
      secrets: [maybeSessionSecret],
      secure: NODE_ENV === "production",
    },
  });
}

function getSessionStorage(): SessionStorage<SessionData> {
  if (!maybeSessionStorage) {
    maybeSessionStorage = buildAuthSessionStorage();
  }

  return maybeSessionStorage;
}

export async function getAuthSession(cookieHeader?: string | null) {
  return getSessionStorage().getSession(cookieHeader);
}

export async function commitAuthSession(session: Session<SessionData>) {
  return getSessionStorage().commitSession(session);
}

export async function destroyAuthSession(session: Session<SessionData>) {
  return getSessionStorage().destroySession(session);
}

export function resetAuthSessionStorageForTests() {
  maybeSessionStorage = null;
}

export function getAuthToken(session: Session<SessionData>): string | null {
  return session.get("authToken") ?? null;
}

export function setAuthToken(session: Session<SessionData>, authToken: string) {
  session.set("authToken", authToken);
}

export function clearAuthToken(session: Session<SessionData>) {
  session.unset("authToken");
}

export function getFlashMessage(
  session: Session<SessionData>,
): SessionFlashMessage | null {
  const maybeFlash = session.get("flash");

  if (!maybeFlash) {
    return null;
  }

  session.unset("flash");
  return maybeFlash;
}

export function setFlashMessage(
  session: Session<SessionData>,
  flash: SessionFlashMessage,
) {
  session.set("flash", flash);
}

export function sanitizeReturnTo(
  maybeReturnTo: string | null | undefined,
): string {
  if (
    !maybeReturnTo ||
    !maybeReturnTo.startsWith("/") ||
    maybeReturnTo.startsWith("//")
  ) {
    return "/catalog";
  }

  if (maybeReturnTo.startsWith("/account")) {
    return "/catalog";
  }

  return maybeReturnTo;
}

export function setPendingIntent(
  session: Session<SessionData>,
  pendingIntent: PendingIntent,
  maybeReturnTo?: string | null,
) {
  session.set("pendingIntent", pendingIntent);
  session.set("returnTo", sanitizeReturnTo(maybeReturnTo));
}

export function readPendingIntent(session: Session<SessionData>): {
  pendingIntent: PendingIntent | null;
  returnTo: string;
} {
  return {
    pendingIntent: session.get("pendingIntent") ?? null,
    returnTo: sanitizeReturnTo(session.get("returnTo")),
  };
}

export function clearPendingIntent(session: Session<SessionData>) {
  session.unset("pendingIntent");
  session.unset("returnTo");
}

export async function createDatabaseSession(
  db: SessionStore,
  userId: string,
  now = new Date(),
) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 30);

  return db.session.create({
    data: {
      expiresAt,
      token,
      userId,
    },
  });
}

export async function resolveCurrentUserFromSession(
  db: UserStore,
  session: Session<SessionData>,
  now = new Date(),
): Promise<User | null> {
  const maybeToken = getAuthToken(session);

  if (!maybeToken) {
    return null;
  }

  const maybeStoredSession = await db.session.findUnique({
    include: {
      user: true,
    },
    where: {
      token: maybeToken,
    },
  });

  if (!maybeStoredSession) {
    return null;
  }

  if (maybeStoredSession.expiresAt <= now) {
    await db.session.deleteMany({
      where: {
        token: maybeToken,
      },
    });

    clearAuthToken(session);
    return null;
  }

  return maybeStoredSession.user;
}

export async function getCurrentUserFromRequest(
  request: Request,
): Promise<User | null> {
  try {
    const { getDb } = await import("~/lib/db.server");
    const session = await getAuthSession(request.headers.get("Cookie"));
    return resolveCurrentUserFromSession(getDb(), session);
  } catch {
    return null;
  }
}

export async function replayPendingIntentAfterAuth(options: {
  replayIntent: (
    pendingIntent: PendingIntent,
    userId: string,
  ) => Promise<SessionFlashMessage | null>;
  session: Session<SessionData>;
  userId: string;
}) {
  const { replayIntent, session, userId } = options;
  const { pendingIntent, returnTo } = readPendingIntent(session);

  if (!pendingIntent) {
    return {
      redirectTo: returnTo,
      replayed: false,
    };
  }

  const maybeFlash = await replayIntent(pendingIntent, userId);

  if (maybeFlash) {
    setFlashMessage(session, maybeFlash);
  }

  clearPendingIntent(session);

  return {
    redirectTo: returnTo,
    replayed: true,
  };
}
