import { describe, expect, it, vi } from "vitest";

describe("library route module", () => {
  it("redirects signed-out visitors into the account route", async () => {
    // Arrange
    vi.doMock("~/lib/auth/session.server", () => ({
      getCurrentUserFromRequest: vi.fn().mockResolvedValue(null)
    }));
    const { loader } = await import("~/routes/library");

    // Act
    const response = (await loader({
      context: {} as never,
      params: {},
      request: new Request("http://example.com/library"),
      unstable_pattern: "/library" as never,
      unstable_url: new URL("http://example.com/library")
    } as never)) as Response;

    // Assert
    expect(response.status).toBe(302);
    expect(response.headers.get("Location")).toBe("/account?mode=sign-in");
  });
});
