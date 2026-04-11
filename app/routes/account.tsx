import { data, Form, Link, redirect } from "react-router";
import type { PrismaClient } from "@prisma/client";
import type {
  PendingIntent,
  SessionFlashMessage
} from "~/lib/auth/session.server";

import type { Route } from "./+types/account";
import accountStyles from "./account.css?url";

type AccountMode = "create-account" | "sign-in";

type AccountDb = PrismaClient;
type AccountSession = {
  get: (key: "pendingIntent" | "returnTo") => PendingIntent | string | undefined;
  set: (key: string, value: unknown) => void;
  unset: (key: string) => void;
};

type AccountActionData = {
  formError: string | null;
};

type AccountActionDeps = {
  commitAuthSession: (session: AccountSession) => Promise<string>;
  createDatabaseSession: (
    db: AccountDb,
    userId: string
  ) => Promise<{ token: string }>;
  createUserAccount: (
    db: AccountDb,
    input: { displayName?: string; email: string; password: string }
  ) => Promise<{ id: string }>;
  getAuthSession: (cookieHeader?: string | null) => Promise<AccountSession>;
  getDb: () => AccountDb;
  replayPendingIntentAfterAuth: (options: {
    replayIntent: (
      pendingIntent: PendingIntent,
      userId: string
    ) => Promise<SessionFlashMessage | null>;
    session: AccountSession;
    userId: string;
  }) => Promise<{ redirectTo: string; replayed: boolean }>;
  setAuthToken: (session: AccountSession, authToken: string) => void;
  setFlashMessage: (
    session: AccountSession,
    flash: SessionFlashMessage
  ) => void;
  signInUserWithPassword: (
    db: AccountDb,
    input: { email: string; password: string }
  ) => Promise<{ id: string } | null>;
};

function parseMode(maybeMode: string | null): AccountMode {
  return maybeMode === "create-account" ? "create-account" : "sign-in";
}

function buildDefaultFlash(mode: AccountMode, replayed: boolean): SessionFlashMessage {
  if (replayed) {
    return {
      kind: "success",
      message:
        mode === "create-account"
          ? "Account created. Finishing your original action."
          : "Signed in. Finishing your original action."
    };
  }

  return {
    kind: "success",
    message: mode === "create-account" ? "Account created." : "Signed in."
  };
}

function describePendingIntent(pendingIntent: PendingIntent | null): string | null {
  if (!pendingIntent) {
    return null;
  }

  switch (pendingIntent.kind) {
    case "save-bookmark":
      return "Sign in to finish saving this print to Bookmarks.";
    case "remove-bookmark":
      return "Sign in to finish removing this print from Bookmarks.";
    case "save-generator-preset":
      return "Sign in to finish saving this generator preset.";
    case "rename-generator-preset":
      return "Sign in to finish renaming this generator preset.";
    case "delete-generator-preset":
      return "Sign in to finish deleting this generator preset.";
    case "create-list":
      return "Sign in to finish creating your list.";
    case "rename-list":
      return "Sign in to finish renaming your list.";
    case "delete-list":
      return "Sign in to finish deleting your list.";
    case "add-print-to-list":
      return "Sign in to finish adding this print to your list.";
    case "remove-print-from-list":
      return "Sign in to finish removing this print from your list.";
  }
}

export const links: Route.LinksFunction = () => [
  { rel: "stylesheet", href: accountStyles }
];

export async function loader({ request }: Route.LoaderArgs) {
  const { getAuthSession, getCurrentUserFromRequest } = await import(
    "~/lib/auth/session.server"
  );
  const currentUser = await getCurrentUserFromRequest(request);
  const session = await getAuthSession(request.headers.get("Cookie"));
  const { pendingIntent } = {
    pendingIntent: session.get("pendingIntent") ?? null
  };
  const url = new URL(request.url);

  return {
    currentUser,
    mode: parseMode(url.searchParams.get("mode")),
    pendingMessage: describePendingIntent(pendingIntent)
  };
}

export async function handleAccountSubmission(
  request: Request,
  deps: AccountActionDeps
) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const displayName = String(formData.get("displayName") ?? "").trim();
  const mode = parseMode(String(formData.get("mode") ?? null));

  if (!email || !password) {
    return data<AccountActionData>(
      { formError: "Email and password are required." },
      { status: 400 }
    );
  }

  if (mode === "create-account" && password.length < 8) {
    return data<AccountActionData>(
      { formError: "Use at least 8 characters for the password." },
      { status: 400 }
    );
  }

  const db = deps.getDb();
  const session = await deps.getAuthSession(request.headers.get("Cookie"));

  try {
    const user =
      mode === "create-account"
        ? await deps.createUserAccount(db, { displayName, email, password })
        : await deps.signInUserWithPassword(db, { email, password });

    if (!user) {
      return data<AccountActionData>(
        { formError: "Email or password did not match an existing account." },
        { status: 400 }
      );
    }

    const storedSession = await deps.createDatabaseSession(db, user.id);
    deps.setAuthToken(session, storedSession.token);

    const replayResult = await deps.replayPendingIntentAfterAuth({
      replayIntent: async () => null,
      session,
      userId: user.id
    });

    deps.setFlashMessage(session, buildDefaultFlash(mode, replayResult.replayed));

    return redirect(replayResult.redirectTo, {
      headers: {
        "Set-Cookie": await deps.commitAuthSession(session)
      }
    });
  } catch (error: unknown) {
    if (
      mode === "create-account" &&
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return data<AccountActionData>(
        { formError: "An account with that email already exists." },
        { status: 400 }
      );
    }

    throw error;
  }
}

export async function action({ request }: Route.ActionArgs) {
  const {
    commitAuthSession,
    createDatabaseSession,
    getAuthSession,
    replayPendingIntentAfterAuth,
    setAuthToken,
    setFlashMessage
  } = await import("~/lib/auth/session.server");
  const { getDb } = await import("~/lib/db.server");
  const { createUserAccount, signInUserWithPassword } = await import(
    "~/lib/auth/user.server"
  );
  const { replayPendingLibraryIntent } = await import("~/lib/library/mutations.server");
  const { replayPendingGeneratorPresetIntent } = await import(
    "~/lib/generator-presets/mutations.server"
  );

  async function replayPendingIntent(db: AccountDb, pendingIntent: PendingIntent, userId: string) {
    if (
      pendingIntent.kind === "save-generator-preset" ||
      pendingIntent.kind === "rename-generator-preset" ||
      pendingIntent.kind === "delete-generator-preset"
    ) {
      return replayPendingGeneratorPresetIntent(db as never, userId, pendingIntent)
    }

    return replayPendingLibraryIntent(db as never, userId, pendingIntent)
  }

  return handleAccountSubmission(request, {
    commitAuthSession,
    createDatabaseSession,
    createUserAccount,
    getAuthSession,
    getDb,
    replayPendingIntentAfterAuth: (options: {
      replayIntent: (
        pendingIntent: PendingIntent,
        userId: string
      ) => Promise<SessionFlashMessage | null>;
      session: AccountSession;
      userId: string;
    }) =>
      replayPendingIntentAfterAuth({
        ...options,
        replayIntent: (pendingIntent: PendingIntent, userId: string) =>
          replayPendingIntent(getDb(), pendingIntent, userId)
      } as never),
    setAuthToken,
    setFlashMessage,
    signInUserWithPassword
  } as never);
}

export function meta({ data }: Route.MetaArgs) {
  return [
    {
      title:
        data?.mode === "create-account"
          ? "Create Account | Bright Prints"
          : "Sign In | Bright Prints"
    }
  ];
}

type AccountScreenProps = Route.ComponentProps & {
  FormComponent?: typeof Form | "form";
  LinkComponent?: typeof Link | "a";
};

export function AccountScreen({
  actionData,
  loaderData,
  FormComponent = Form,
  LinkComponent = Link
}: AccountScreenProps) {
  const heading =
    loaderData.mode === "create-account" ? "Create your account" : "Sign in to keep saving";
  const description =
    loaderData.mode === "create-account"
      ? "Create an account only when saving or organizing prints needs identity."
      : "Sign in to keep your saved prints and list organization in one place.";
  const switchHref =
    loaderData.mode === "create-account" ? "/account?mode=sign-in" : "/account?mode=create-account";
  const switchLabel =
    loaderData.mode === "create-account"
      ? "Already have an account? Sign in"
      : "Need an account? Create one";

  return (
    <main className="account-page">
      <section className="account-card">
        <p className="eyebrow">Account</p>
        <h1>{heading}</h1>
        <p>{description}</p>
        {loaderData.pendingMessage ? <p>{loaderData.pendingMessage}</p> : null}
        {actionData?.formError ? (
          <p aria-live="polite" className="account-error">
            {actionData.formError}
          </p>
        ) : null}

        <FormComponent className="account-form" method="post">
          <input name="mode" type="hidden" value={loaderData.mode} />
          {loaderData.mode === "create-account" ? (
            <div className="account-field">
              <label htmlFor="displayName">Display name</label>
              <input id="displayName" name="displayName" type="text" />
            </div>
          ) : null}

          <div className="account-field">
            <label htmlFor="email">Email</label>
            <input autoComplete="email" id="email" name="email" type="email" />
          </div>

          <div className="account-field">
            <label htmlFor="password">Password</label>
            <input
              autoComplete={
                loaderData.mode === "create-account" ? "new-password" : "current-password"
              }
              id="password"
              name="password"
              type="password"
            />
          </div>

          <button className="home-primary-action" type="submit">
            {loaderData.mode === "create-account" ? "Create Account" : "Sign In"}
          </button>
        </FormComponent>

        <p className="account-switch">
          {LinkComponent === "a" ? (
            <a href={switchHref}>{switchLabel}</a>
          ) : (
            <LinkComponent prefetch="intent" to={switchHref}>
              {switchLabel}
            </LinkComponent>
          )}
        </p>
      </section>
    </main>
  );
}

export default function AccountRoute(props: Route.ComponentProps) {
  return <AccountScreen {...props} />;
}
