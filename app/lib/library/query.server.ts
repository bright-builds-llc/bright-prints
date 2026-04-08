import type { PrismaClient, SavedPrintListKind } from "@prisma/client";

import { ensureBookmarksList } from "~/lib/library/lists.server";

type LibraryDb = Pick<PrismaClient, "savedPrintList">;

export type RuntimeLibraryList = {
  id: string;
  kind: SavedPrintListKind;
  name: string;
  items: Array<{
    printSlug: string;
  }>;
};

export async function loadRuntimeLibraryLists(
  db: LibraryDb,
  userId: string
): Promise<RuntimeLibraryList[]> {
  await ensureBookmarksList(db as never, userId);

  const savedLists = await db.savedPrintList.findMany({
    include: {
      items: {
        orderBy: {
          createdAt: "desc"
        },
        select: {
          printSlug: true
        }
      }
    },
    orderBy: {
      createdAt: "asc"
    },
    where: {
      userId
    }
  });

  return [...savedLists].sort((left, right) => {
    if (left.kind === "BOOKMARKS" && right.kind !== "BOOKMARKS") {
      return -1;
    }

    if (left.kind !== "BOOKMARKS" && right.kind === "BOOKMARKS") {
      return 1;
    }

    return left.createdAt.getTime() - right.createdAt.getTime();
  });
}
