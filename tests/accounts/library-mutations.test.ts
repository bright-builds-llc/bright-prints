import { describe, expect, it, vi } from "vitest";

import {
  createCustomList,
  deleteCustomList,
  replayPendingLibraryIntent,
  savePrintToBookmarks
} from "~/lib/library/mutations.server";

describe("library mutation helpers", () => {
  it("creates bookmarks and dedupes bookmark saves through upsert", async () => {
    // Arrange
    const findFirst = vi.fn().mockResolvedValue(null);
    const createList = vi.fn().mockResolvedValue({ id: "bookmarks" });
    const upsert = vi.fn().mockResolvedValue({});
    const db = {
      $transaction: async (
        callback: (tx: {
          savedPrintList: {
            create: typeof createList;
            findFirst: typeof findFirst;
          };
          savedPrintListItem: {
            upsert: typeof upsert;
          };
        }) => Promise<unknown>
      ) =>
        callback({
          savedPrintList: {
            create: createList,
            findFirst
          },
          savedPrintListItem: {
            upsert
          }
        }),
      savedPrintList: {
        create: createList,
        findFirst
      }
    };

    // Act
    await savePrintToBookmarks(db as never, "user-1", "sample-featured-print");

    // Assert
    expect(createList).toHaveBeenCalled();
    expect(upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          listId_printSlug: {
            listId: "bookmarks",
            printSlug: "sample-featured-print"
          }
        }
      })
    );
  });

  it("blocks deleting the fixed bookmarks list", async () => {
    // Arrange
    const db = {
      $transaction: async (
        callback: (tx: {
          savedPrintList: {
            delete: ReturnType<typeof vi.fn>;
            findFirst: ReturnType<typeof vi.fn>;
          };
        }) => Promise<unknown>
      ) =>
        callback({
          savedPrintList: {
            delete: vi.fn(),
            findFirst: vi.fn().mockResolvedValue({
              id: "bookmarks",
              kind: "BOOKMARKS"
            })
          }
        })
    };

    // Act / Assert
    await expect(deleteCustomList(db as never, "user-1", "bookmarks")).rejects.toThrow(
      /cannot be deleted/i
    );
  });

  it("replays generic list intents through the shared mutation dispatcher", async () => {
    // Arrange
    const db = {
      savedPrintList: {
        create: vi.fn().mockResolvedValue({ id: "custom-1" })
      }
    };

    // Act
    const result = await replayPendingLibraryIntent(db as never, "user-1", {
      kind: "create-list",
      name: "Desk Favorites"
    });

    // Assert
    expect(result).toEqual({
      kind: "success",
      message: "List created."
    });
  });

  it("rejects a custom list named Bookmarks", async () => {
    // Arrange
    const db = {
      savedPrintList: {
        create: vi.fn()
      }
    };

    // Act / Assert
    await expect(createCustomList(db as never, "user-1", "Bookmarks")).rejects.toThrow(
      /reserved/i
    );
  });
});
