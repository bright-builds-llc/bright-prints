import type { PrismaClient } from "@prisma/client";

export const bookmarksListName = "Bookmarks";

type ListStore = Pick<
  PrismaClient,
  "$transaction" | "savedPrintList" | "savedPrintListItem"
>;

export async function ensureBookmarksList(db: ListStore, userId: string) {
  const maybeExisting = await db.savedPrintList.findFirst({
    where: {
      kind: "BOOKMARKS",
      userId,
    },
  });

  if (maybeExisting) {
    return maybeExisting;
  }

  try {
    return await db.savedPrintList.create({
      data: {
        kind: "BOOKMARKS",
        name: bookmarksListName,
        userId,
      },
    });
  } catch {
    const bookmarks = await db.savedPrintList.findFirst({
      where: {
        kind: "BOOKMARKS",
        userId,
      },
    });

    if (!bookmarks) {
      throw new Error(
        `Could not create or locate Bookmarks for user "${userId}"`,
      );
    }

    return bookmarks;
  }
}

export async function getBookmarkedPrintSlugs(
  db: ListStore,
  userId: string,
): Promise<string[]> {
  const bookmarks = await ensureBookmarksList(db, userId);
  const items = await db.savedPrintListItem.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      printSlug: true,
    },
    where: {
      listId: bookmarks.id,
    },
  });

  return items.map((item: { printSlug: string }) => item.printSlug);
}

export async function getCustomListSummaries(
  db: ListStore,
  userId: string,
  maybePrintSlug?: string,
) {
  const customLists = await db.savedPrintList.findMany({
    include: {
      items: maybePrintSlug
        ? {
            select: {
              printSlug: true,
            },
            where: {
              printSlug: maybePrintSlug,
            },
          }
        : false,
    },
    orderBy: {
      createdAt: "asc",
    },
    where: {
      kind: "CUSTOM",
      userId,
    },
  });

  return customLists.map(
    (list: {
      id: string;
      items: Array<{ printSlug: string }>;
      name: string;
    }) => ({
      containsPrint: maybePrintSlug ? list.items.length > 0 : false,
      id: list.id,
      name: list.name,
    }),
  );
}
