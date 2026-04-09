import type { PrismaClient } from "@prisma/client";

import type { PendingIntent } from "~/lib/auth/session.server";
import {
  bookmarksListName,
  ensureBookmarksList,
} from "~/lib/library/lists.server";

type LibraryDb = Pick<
  PrismaClient,
  "$transaction" | "savedPrintList" | "savedPrintListItem"
>;
type LibraryTx = Pick<PrismaClient, "savedPrintList" | "savedPrintListItem">;

export class LibraryMutationError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "LibraryMutationError";
    this.status = status;
  }
}

function normalizeListName(name: string): string {
  return name.trim();
}

async function requireOwnedList(tx: LibraryTx, userId: string, listId: string) {
  const maybeList = await tx.savedPrintList.findFirst({
    where: {
      id: listId,
      userId,
    },
  });

  if (!maybeList) {
    throw new LibraryMutationError(`Unknown list "${listId}"`, 404);
  }

  return maybeList;
}

export async function savePrintToBookmarks(
  db: LibraryDb,
  userId: string,
  printSlug: string,
) {
  return db.$transaction(async (transactionClient) => {
    const tx = transactionClient as unknown as LibraryTx;
    const bookmarks = await ensureBookmarksList(
      tx as unknown as LibraryDb,
      userId,
    );

    await tx.savedPrintListItem.upsert({
      create: {
        listId: bookmarks.id,
        printSlug,
      },
      update: {},
      where: {
        listId_printSlug: {
          listId: bookmarks.id,
          printSlug,
        },
      },
    });

    return bookmarks;
  });
}

export async function removePrintFromBookmarks(
  db: LibraryDb,
  userId: string,
  printSlug: string,
) {
  return db.$transaction(async (transactionClient) => {
    const tx = transactionClient as unknown as LibraryTx;
    const bookmarks = await ensureBookmarksList(
      tx as unknown as LibraryDb,
      userId,
    );

    await tx.savedPrintListItem.deleteMany({
      where: {
        listId: bookmarks.id,
        printSlug,
      },
    });

    return bookmarks;
  });
}

export async function createCustomList(
  db: LibraryDb,
  userId: string,
  name: string,
) {
  const normalizedName = normalizeListName(name);

  if (!normalizedName) {
    throw new LibraryMutationError("List name is required.");
  }

  if (normalizedName === bookmarksListName) {
    throw new LibraryMutationError("Bookmarks is reserved.");
  }

  return db.savedPrintList.create({
    data: {
      kind: "CUSTOM",
      name: normalizedName,
      userId,
    },
  });
}

export async function renameCustomList(
  db: LibraryDb,
  userId: string,
  listId: string,
  name: string,
) {
  const normalizedName = normalizeListName(name);

  if (!normalizedName) {
    throw new LibraryMutationError("List name is required.");
  }

  return db.$transaction(async (transactionClient) => {
    const tx = transactionClient as unknown as LibraryTx;
    const list = await requireOwnedList(tx, userId, listId);

    if (list.kind === "BOOKMARKS") {
      throw new LibraryMutationError("Bookmarks cannot be renamed.");
    }

    return tx.savedPrintList.update({
      data: {
        name: normalizedName,
      },
      where: {
        id: list.id,
      },
    });
  });
}

export async function deleteCustomList(
  db: LibraryDb,
  userId: string,
  listId: string,
) {
  return db.$transaction(async (transactionClient) => {
    const tx = transactionClient as unknown as LibraryTx;
    const list = await requireOwnedList(tx, userId, listId);

    if (list.kind === "BOOKMARKS") {
      throw new LibraryMutationError("Bookmarks cannot be deleted.");
    }

    await tx.savedPrintList.delete({
      where: {
        id: list.id,
      },
    });

    return list;
  });
}

export async function addPrintToList(
  db: LibraryDb,
  userId: string,
  listId: string,
  printSlug: string,
) {
  return db.$transaction(async (transactionClient) => {
    const tx = transactionClient as unknown as LibraryTx;
    await requireOwnedList(tx, userId, listId);

    return tx.savedPrintListItem.upsert({
      create: {
        listId,
        printSlug,
      },
      update: {},
      where: {
        listId_printSlug: {
          listId,
          printSlug,
        },
      },
    });
  });
}

export async function removePrintFromList(
  db: LibraryDb,
  userId: string,
  listId: string,
  printSlug: string,
) {
  return db.$transaction(async (transactionClient) => {
    const tx = transactionClient as unknown as LibraryTx;
    await requireOwnedList(tx, userId, listId);

    await tx.savedPrintListItem.deleteMany({
      where: {
        listId,
        printSlug,
      },
    });

    return { listId, printSlug };
  });
}

export async function replayPendingLibraryIntent(
  db: LibraryDb,
  userId: string,
  pendingIntent: PendingIntent,
) {
  switch (pendingIntent.kind) {
    case "save-bookmark":
      await savePrintToBookmarks(db, userId, pendingIntent.printSlug);
      return {
        kind: "success" as const,
        message: "Saved to Bookmarks.",
      };
    case "remove-bookmark":
      await removePrintFromBookmarks(db, userId, pendingIntent.printSlug);
      return {
        kind: "success" as const,
        message: "Removed from Bookmarks.",
      };
    case "create-list":
      await createCustomList(db, userId, pendingIntent.name);
      return {
        kind: "success" as const,
        message: "List created.",
      };
    case "rename-list":
      await renameCustomList(
        db,
        userId,
        pendingIntent.listId,
        pendingIntent.name,
      );
      return {
        kind: "success" as const,
        message: "List renamed.",
      };
    case "delete-list":
      await deleteCustomList(db, userId, pendingIntent.listId);
      return {
        kind: "success" as const,
        message: "List deleted.",
      };
    case "add-print-to-list":
      await addPrintToList(
        db,
        userId,
        pendingIntent.listId,
        pendingIntent.printSlug,
      );
      return {
        kind: "success" as const,
        message: "Print added to list.",
      };
    case "remove-print-from-list":
      await removePrintFromList(
        db,
        userId,
        pendingIntent.listId,
        pendingIntent.printSlug,
      );
      return {
        kind: "success" as const,
        message: "Print removed from list.",
      };
  }
}
