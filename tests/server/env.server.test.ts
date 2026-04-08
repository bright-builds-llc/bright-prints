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

  it("accepts a sufficiently long session secret", () => {
    // Arrange
    const input = {
      NODE_ENV: "development",
      SESSION_SECRET: "a-very-long-session-secret"
    };

    // Act
    const result = parseServerEnv(input);

    // Assert
    expect(result.SESSION_SECRET).toBe("a-very-long-session-secret");
  });

  it("accepts optional build provenance fields", () => {
    // Arrange
    const input = {
      BUILD_COMMIT: "abc1234",
      BUILD_TIMESTAMP: "2026-04-08T15:58:58Z",
      BUILD_VERSION: "v1.0.0+phase6",
      NODE_ENV: "production"
    };

    // Act
    const result = parseServerEnv(input);

    // Assert
    expect(result.BUILD_COMMIT).toBe("abc1234");
    expect(result.BUILD_TIMESTAMP).toBe("2026-04-08T15:58:58Z");
    expect(result.BUILD_VERSION).toBe("v1.0.0+phase6");
  });
});
