import { describe, expect, it } from "vitest";

import { parseServerEnv } from "~/lib/env.server";

describe("parseServerEnv", () => {
  it("allows DATABASE_URL to be absent during early foundation work", () => {
    // Arrange
    const input = { NODE_ENV: "development" };

    // Act
    const result = parseServerEnv(input);

    // Assert
    expect(result.DATABASE_URL).toBeUndefined();
    expect(result.NODE_ENV).toBe("development");
  });

  it("rejects malformed database URLs", () => {
    // Arrange
    const input = {
      DATABASE_URL: "not-a-url",
      NODE_ENV: "development"
    };

    // Act / Assert
    expect(() => parseServerEnv(input)).toThrow();
  });

  it("rejects unknown NODE_ENV values", () => {
    // Arrange
    const input = {
      DATABASE_URL: "postgresql://user:pass@localhost:5432/bright_prints?schema=public",
      NODE_ENV: "staging"
    };

    // Act / Assert
    expect(() => parseServerEnv(input)).toThrow();
  });
});
