import { describe, expect, it, vi } from "vitest";

import { handleListMembershipAction } from "~/routes/list-membership";
import { handleSavePrintAction } from "~/routes/save-print";

describe("save-print action", () => {
  it("redirects signed-out bookmark attempts into auth with pending intent", async () => {
    // Arrange
    const request = new Request("http://example.com/actions/save-print", {
      body: new URLSearchParams({
        intent: "save-bookmark",
        printSlug: "sample-featured-print",
        returnTo: "/prints/sample-featured-print"
      }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST"
    });
    const mockSession = { set: vi.fn() };
    const deps = {
      commitAuthSession: vi.fn().mockResolvedValue("cookie=value"),
      getAuthSession: vi.fn().mockResolvedValue(mockSession),
      getDb: vi.fn().mockReturnValue({}),
      removePrintFromBookmarks: vi.fn(),
      resolveCurrentUserFromSession: vi.fn().mockResolvedValue(null),
      savePrintToBookmarks: vi.fn(),
      setPendingIntent: vi.fn()
    };

    // Act
    const response = (await handleSavePrintAction(request, {
      ...deps,
      sanitizeReturnTo: (value: string | null | undefined) => value ?? "/catalog"
    } as never)) as Response;

    // Assert
    expect(response.status).toBe(302);
    expect(response.headers.get("Location")).toBe("/account?mode=sign-in");
    expect(deps.setPendingIntent).toHaveBeenCalledWith(
      mockSession,
      { kind: "save-bookmark", printSlug: "sample-featured-print" },
      "/prints/sample-featured-print"
    );
  });

  it("returns stable action data for signed-in bookmark saves", async () => {
    // Arrange
    const request = new Request("http://example.com/actions/save-print", {
      body: new URLSearchParams({
        intent: "save-bookmark",
        printSlug: "sample-featured-print",
        returnTo: "/prints/sample-featured-print"
      }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST"
    });
    const deps = {
      commitAuthSession: vi.fn(),
      getAuthSession: vi.fn().mockResolvedValue({}),
      getDb: vi.fn().mockReturnValue({}),
      removePrintFromBookmarks: vi.fn(),
      resolveCurrentUserFromSession: vi.fn().mockResolvedValue({ id: "user-1" }),
      savePrintToBookmarks: vi.fn().mockResolvedValue({ id: "bookmarks" }),
      setPendingIntent: vi.fn()
    };

    // Act
    const result = await handleSavePrintAction(request, {
      ...deps,
      sanitizeReturnTo: (value: string | null | undefined) => value ?? "/catalog"
    } as never);

    // Assert
    expect(result).toEqual({
      intent: "save-bookmark",
      ok: true,
      printSlug: "sample-featured-print",
      saved: true
    });
  });
});

describe("list-membership action", () => {
  it("redirects signed-out list create attempts into auth with generic pending intent", async () => {
    // Arrange
    const request = new Request("http://example.com/actions/list-membership", {
      body: new URLSearchParams({
        intent: "create-list",
        name: "Desk Favorites",
        returnTo: "/prints/sample-featured-print"
      }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST"
    });
    const mockSession = { set: vi.fn() };
    const deps = {
      addPrintToList: vi.fn(),
      commitAuthSession: vi.fn().mockResolvedValue("cookie=value"),
      createCustomList: vi.fn(),
      deleteCustomList: vi.fn(),
      getAuthSession: vi.fn().mockResolvedValue(mockSession),
      getDb: vi.fn().mockReturnValue({}),
      removePrintFromList: vi.fn(),
      renameCustomList: vi.fn(),
      resolveCurrentUserFromSession: vi.fn().mockResolvedValue(null),
      setPendingIntent: vi.fn()
    };

    // Act
    const response = (await handleListMembershipAction(request, {
      ...deps,
      sanitizeReturnTo: (value: string | null | undefined) => value ?? "/library"
    } as never)) as Response;

    // Assert
    expect(response.status).toBe(302);
    expect(deps.setPendingIntent).toHaveBeenCalledWith(
      mockSession,
      { kind: "create-list", name: "Desk Favorites" },
      "/prints/sample-featured-print"
    );
  });

  it("returns the stable list contract for signed-in list creation", async () => {
    // Arrange
    const request = new Request("http://example.com/actions/list-membership", {
      body: new URLSearchParams({
        intent: "create-list",
        name: "Desk Favorites",
        returnTo: "/library"
      }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST"
    });
    const deps = {
      addPrintToList: vi.fn(),
      commitAuthSession: vi.fn(),
      createCustomList: vi.fn().mockResolvedValue({ id: "list-1" }),
      deleteCustomList: vi.fn(),
      getAuthSession: vi.fn().mockResolvedValue({}),
      getDb: vi.fn().mockReturnValue({}),
      removePrintFromList: vi.fn(),
      renameCustomList: vi.fn(),
      resolveCurrentUserFromSession: vi.fn().mockResolvedValue({ id: "user-1" }),
      setPendingIntent: vi.fn()
    };

    // Act
    const result = await handleListMembershipAction(request, {
      ...deps,
      sanitizeReturnTo: (value: string | null | undefined) => value ?? "/library"
    } as never);

    // Assert
    expect(result).toEqual({
      intent: "create-list",
      listId: "list-1",
      ok: true
    });
  });
});
