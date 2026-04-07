import { data, redirect } from "react-router";

import type { Route } from "./+types/list-membership";

type ListIntent =
  | "add-print-to-list"
  | "create-list"
  | "delete-list"
  | "remove-print-from-list"
  | "rename-list";

type ListSession = {
  set: (key: string, value: unknown) => void;
};
type ListDb = Record<string, unknown>;

type ListActionDeps = {
  addPrintToList: (db: ListDb, userId: string, listId: string, printSlug: string) => Promise<unknown>;
  commitAuthSession: (session: ListSession) => Promise<string>;
  createCustomList: (db: ListDb, userId: string, name: string) => Promise<{ id: string }>;
  deleteCustomList: (db: ListDb, userId: string, listId: string) => Promise<{ id: string }>;
  getAuthSession: (cookieHeader?: string | null) => Promise<ListSession>;
  getDb: () => ListDb;
  removePrintFromList: (db: ListDb, userId: string, listId: string, printSlug: string) => Promise<unknown>;
  renameCustomList: (
    db: ListDb,
    userId: string,
    listId: string,
    name: string
  ) => Promise<{ id: string }>;
  resolveCurrentUserFromSession: (
    db: ListDb,
    session: ListSession
  ) => Promise<{ id: string } | null>;
  sanitizeReturnTo: (maybeReturnTo: string | null | undefined) => string;
  setPendingIntent: (
    session: ListSession,
    pendingIntent:
      | { kind: "create-list"; name: string }
      | { kind: "rename-list"; listId: string; name: string }
      | { kind: "delete-list"; listId: string }
      | { kind: "add-print-to-list"; listId: string; printSlug: string }
      | { kind: "remove-print-from-list"; listId: string; printSlug: string },
    maybeReturnTo?: string | null
  ) => void;
};

function parseListIntent(maybeIntent: string | null): ListIntent | null {
  switch (maybeIntent) {
    case "add-print-to-list":
    case "create-list":
    case "delete-list":
    case "remove-print-from-list":
    case "rename-list":
      return maybeIntent;
    default:
      return null;
  }
}

export async function handleListMembershipAction(
  request: Request,
  deps: ListActionDeps
) {
  const formData = await request.formData();
  const intent = parseListIntent(String(formData.get("intent") ?? null));
  const listId = String(formData.get("listId") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const printSlug = String(formData.get("printSlug") ?? "").trim();
  const returnTo = deps.sanitizeReturnTo(String(formData.get("returnTo") ?? "/library"));

  if (!intent) {
    return data({ intent, ok: false }, { status: 400 });
  }

  const db = deps.getDb();
  const session = await deps.getAuthSession(request.headers.get("Cookie"));
  const maybeCurrentUser = await deps.resolveCurrentUserFromSession(db, session);

  if (!maybeCurrentUser) {
    const pendingIntent =
      intent === "create-list"
        ? { kind: "create-list" as const, name }
        : intent === "rename-list"
          ? { kind: "rename-list" as const, listId, name }
          : intent === "delete-list"
            ? { kind: "delete-list" as const, listId }
            : intent === "add-print-to-list"
              ? { kind: "add-print-to-list" as const, listId, printSlug }
              : { kind: "remove-print-from-list" as const, listId, printSlug };

    deps.setPendingIntent(session, pendingIntent, returnTo);

    return redirect("/account?mode=sign-in", {
      headers: {
        "Set-Cookie": await deps.commitAuthSession(session)
      }
    });
  }

  switch (intent) {
    case "create-list": {
      const list = await deps.createCustomList(db, maybeCurrentUser.id, name);
      return { intent, listId: list.id, ok: true };
    }
    case "rename-list": {
      const list = await deps.renameCustomList(db, maybeCurrentUser.id, listId, name);
      return { intent, listId: list.id, ok: true };
    }
    case "delete-list": {
      const list = await deps.deleteCustomList(db, maybeCurrentUser.id, listId);
      return { intent, listId: list.id, ok: true };
    }
    case "add-print-to-list": {
      await deps.addPrintToList(db, maybeCurrentUser.id, listId, printSlug);
      return { intent, listId, ok: true, printSlug };
    }
    case "remove-print-from-list": {
      await deps.removePrintFromList(db, maybeCurrentUser.id, listId, printSlug);
      return { intent, listId, ok: true, printSlug };
    }
  }
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
  const {
    addPrintToList,
    createCustomList,
    deleteCustomList,
    removePrintFromList,
    renameCustomList
  } = await import("~/lib/library/mutations.server");

  return handleListMembershipAction(request, {
    addPrintToList,
    commitAuthSession,
    createCustomList,
    deleteCustomList,
    getAuthSession,
    getDb,
    removePrintFromList,
    renameCustomList,
    resolveCurrentUserFromSession,
    sanitizeReturnTo,
    setPendingIntent
  } as never);
}
