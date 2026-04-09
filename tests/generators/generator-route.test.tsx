import { beforeEach, describe, expect, it, vi } from "vitest";

import { resetServerEnvForTests } from "~/lib/env.server";

describe("generator detail loader", () => {
  beforeEach(() => {
    delete process.env.DATABASE_URL;
    delete process.env.SESSION_SECRET;
    resetServerEnvForTests();
    vi.resetModules();
  });

  it("keeps saved presets disabled when auth runtime is unavailable", async () => {
    // Arrange
    const { loader } = await import("~/routes/generator-detail");

    // Act
    const result = await loader({
      context: {} as never,
      params: { slug: "sign" },
      request: new Request("http://example.com/generators/sign"),
      unstable_pattern: "/generators/:slug" as never,
      unstable_url: new URL("http://example.com/generators/sign"),
    } as never);

    // Assert
    expect(result.currentUser).toBeNull();
    expect(result.presets).toEqual([]);
    expect(result.presetsEnabled).toBe(false);
  });
});
