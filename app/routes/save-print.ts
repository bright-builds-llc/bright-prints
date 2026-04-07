import { data, redirect } from "react-router";

import type { Route } from "./+types/save-print";

type SaveIntent = "remove-bookmark" | "save-bookmark";
type SaveSession = {
  set: (key: string, value: unknown) => void;
};
type SaveDb = Record<string, unknown>;

type SaveActionDeps = {
  commitAuthSession: (session: SaveSession) => Promise<string>;
  getAuthSession: (cookieHeader?: string | null) => Promise<SaveSession>;
  getDb: () => SaveDb;
  removePrintFromBookmarks: (db: SaveDb, userId: string, printSlug: string) => Promise<unknown>;
  resolveCurrentUserFromSession: (
    db: SaveDb,
    session: SaveSession
  ) => Promise<{ id: string } | null>;
  sanitizeReturnTo: (maybeReturnTo: string | null | undefined) => string;
  savePrintToBookmarks: (db: SaveDb, userId: string, printSlug: string) => Promise<unknown>;
  setPendingIntent: (
    session: SaveSession,
    pendingIntent: { kind: "remove-bookmark" | "save-bookmark"; printSlug: string },
    maybeReturnTo?: string | null
  ) => void;
};

function parseSaveIntent(maybeIntent: string | null): SaveIntent | null {
  if (maybeIntent === "save-bookmark" || maybeIntent === "remove-bookmark") {
    return maybeIntent;
  }

  return null;
}

export async function handleSavePrintAction(request: Request, deps: SaveActionDeps) {
  const formData = await request.formData();
  const printSlug = String(formData.get("printSlug") ?? "").trim();
  const returnTo = deps.sanitizeReturnTo(String(formData.get("returnTo") ?? "/catalog"));
  const intent = parseSaveIntent(String(formData.get("intent") ?? null));

  if (!printSlug || !intent) {
    return data({ intent, ok: false, printSlug }, { status: 400 });
  }

  const db = deps.getDb();
  const session = await deps.getAuthSession(request.headers.get("Cookie"));
  const maybeCurrentUser = await deps.resolveCurrentUserFromSession(db, session);

  if (!maybeCurrentUser) {
    deps.setPendingIntent(
      session,
      intent === "save-bookmark"
        ? { kind: "save-bookmark", printSlug }
        : { kind: "remove-bookmark", printSlug },
      returnTo
    );

    return redirect("/account?mode=sign-in", {
      headers: {
        "Set-Cookie": await deps.commitAuthSession(session)
      }
    });
  }

  if (intent === "save-bookmark") {
    await deps.savePrintToBookmarks(db, maybeCurrentUser.id, printSlug);
  } else {
    await deps.removePrintFromBookmarks(db, maybeCurrentUser.id, printSlug);
  }

  return {
    intent,
    ok: true,
    printSlug,
    saved: intent === "save-bookmark"
  };
}

export async function action({ request }: Route.ActionArgs) {
  const {
    commitAuthSession,
    getAuthSession,
    resolveCurrentUserFromSession,
    sanitizeReturnTo,
    setPendingIntent
  } = await import("~/lib/auth/session.server");
  const { getDb } = await import("~/lib/db.server");
  const { removePrintFromBookmarks, savePrintToBookmarks } = await import(
    "~/lib/library/mutations.server"
  );

  return handleSavePrintAction(request, {
    commitAuthSession,
    getAuthSession,
    getDb,
    removePrintFromBookmarks,
    resolveCurrentUserFromSession,
    sanitizeReturnTo,
    savePrintToBookmarks,
    setPendingIntent
  } as never);
}
