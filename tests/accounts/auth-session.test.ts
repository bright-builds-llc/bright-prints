import { beforeEach, describe, expect, it, vi } from "vitest";

import { resetServerEnvForTests } from "~/lib/env.server";
import {
  commitAuthSession,
  createDatabaseSession,
  getAuthSession,
  readPendingIntent,
  replayPendingIntentAfterAuth,
  resetAuthSessionStorageForTests,
  resolveCurrentUserFromSession,
  setAuthToken,
  setPendingIntent,
} from "~/lib/auth/session.server";
import { hashPassword, verifyPassword } from "~/lib/auth/password.server";

describe("auth password helpers", () => {
  it("hashes and verifies passwords", async () => {
    // Arrange
    const password = "correct horse battery staple";

    // Act
    const passwordHash = await hashPassword(password);

    // Assert
    await expect(verifyPassword(password, passwordHash)).resolves.toBe(true);
    await expect(verifyPassword("wrong-password", passwordHash)).resolves.toBe(
      false,
    );
  });
});

describe("auth session helpers", () => {
  beforeEach(() => {
    process.env.SESSION_SECRET = "test-session-secret-12345";
    resetServerEnvForTests();
    resetAuthSessionStorageForTests();
  });

  it("serializes generic pending intents in the signed cookie session", async () => {
    const session = await getAuthSession();

    // Act
    setPendingIntent(
      session,
      {
        kind: "save-generator-preset",
        generatorSlug: "sign",
        name: "Desk sign",
        values: {
          cornerRadiusMm: 4,
          heightMm: 40,
          text: "Desk",
          thicknessMm: 3,
          widthMm: 120,
        },
      },
      "/generators/sign",
    );
    const serializedCookie = await commitAuthSession(session);
    const restoredSession = await getAuthSession(serializedCookie);

    // Assert
    expect(readPendingIntent(restoredSession)).toEqual({
      pendingIntent: {
        kind: "save-generator-preset",
        generatorSlug: "sign",
        name: "Desk sign",
        values: {
          cornerRadiusMm: 4,
          heightMm: 40,
          text: "Desk",
          thicknessMm: 3,
          widthMm: 120,
        },
      },
      returnTo: "/generators/sign",
    });
  });

  it("looks up the current user from the persisted auth token and expires old sessions", async () => {
    // Arrange
    const deleteMany = vi.fn();
    const sessionStore = {
      session: {
        deleteMany,
        findUnique: vi
          .fn()
          .mockResolvedValueOnce({
            expiresAt: new Date(Date.now() + 60_000),
            user: { email: "peter@example.com", id: "user-1" },
          })
          .mockResolvedValueOnce({
            expiresAt: new Date(Date.now() - 60_000),
            user: { email: "peter@example.com", id: "user-1" },
          }),
      },
    };
    const session = await getAuthSession();
    setAuthToken(session, "session-token");

    // Act
    const maybeUser = await resolveCurrentUserFromSession(
      sessionStore as never,
      session,
    );
    const maybeExpiredUser = await resolveCurrentUserFromSession(
      sessionStore as never,
      session,
    );

    // Assert
    expect(maybeUser).toMatchObject({
      email: "peter@example.com",
      id: "user-1",
    });
    expect(maybeExpiredUser).toBeNull();
    expect(deleteMany).toHaveBeenCalledWith({
      where: { token: "session-token" },
    });
  });

  it("replays and clears generic pending intent payloads after auth", async () => {
    // Arrange
    const replayIntent = vi.fn().mockResolvedValue({
      kind: "success",
      message: "Saved.",
    });
    const session = await getAuthSession();
    setPendingIntent(
      session,
      { kind: "save-bookmark", printSlug: "sample-featured-print" },
      "/prints/sample-featured-print",
    );

    // Act
    const result = await replayPendingIntentAfterAuth({
      replayIntent,
      session,
      userId: "user-1",
    });

    // Assert
    expect(result).toEqual({
      redirectTo: "/prints/sample-featured-print",
      replayed: true,
    });
    expect(replayIntent).toHaveBeenCalledWith(
      { kind: "save-bookmark", printSlug: "sample-featured-print" },
      "user-1",
    );
    expect(readPendingIntent(session)).toEqual({
      pendingIntent: null,
      returnTo: "/catalog",
    });
  });

  it("creates database-backed sessions with tokens and expiry", async () => {
    // Arrange
    const create = vi.fn().mockImplementation(async ({ data }) => data);

    // Act
    const storedSession = await createDatabaseSession(
      { session: { create } } as never,
      "user-1",
      new Date("2026-04-07T00:00:00.000Z"),
    );

    // Assert
    expect(storedSession.userId).toBe("user-1");
    expect(storedSession.token).toHaveLength(64);
    expect(storedSession.expiresAt.toISOString()).toBe(
      "2026-05-07T00:00:00.000Z",
    );
  });
});
