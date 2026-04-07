import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { resetServerEnvForTests } from "~/lib/env.server";
import { resetAuthSessionStorageForTests } from "~/lib/auth/session.server";
import { AccountScreen, handleAccountSubmission } from "~/routes/account";

describe("AccountRoute", () => {
  it("renders explicit labels for sign-in and create-account flows", () => {
    // Arrange
    const signInMarkup = renderToStaticMarkup(
      createElement(AccountScreen, {
        actionData: undefined,
        FormComponent: "form",
        LinkComponent: "a",
        loaderData: { currentUser: null, mode: "sign-in", pendingMessage: null } as never,
        matches: [] as never,
        params: {} as never
      })
    );
    const createMarkup = renderToStaticMarkup(
      createElement(AccountScreen, {
        actionData: undefined,
        FormComponent: "form",
        LinkComponent: "a",
        loaderData: {
          currentUser: null,
          mode: "create-account",
          pendingMessage: "Sign in to finish saving this print to Bookmarks."
        } as never,
        matches: [] as never,
        params: {} as never
      })
    );

    // Assert
    expect(signInMarkup).toContain("Sign In");
    expect(signInMarkup).toContain("Email");
    expect(signInMarkup).toContain("Password");
    expect(createMarkup).toContain("Create Account");
    expect(createMarkup).toContain("Display name");
    expect(createMarkup).toContain("Sign in to finish saving this print to Bookmarks.");
  });

  it("creates a session and redirects back to the stored returnTo after sign-in", async () => {
    // Arrange
    process.env.SESSION_SECRET = "test-session-secret-12345";
    resetServerEnvForTests();
    resetAuthSessionStorageForTests();

    const request = new Request("http://example.com/account", {
      body: new URLSearchParams({
        email: "peter@example.com",
        mode: "sign-in",
        password: "password-123"
      }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST"
    });
    const mockSession = {
      get: vi.fn().mockImplementation((key: string) => {
        if (key === "pendingIntent") {
          return { kind: "save-bookmark", printSlug: "sample-featured-print" };
        }

        if (key === "returnTo") {
          return "/prints/sample-featured-print";
        }

        return undefined;
      }),
      set: vi.fn(),
      unset: vi.fn()
    };
    const deps = {
      commitAuthSession: vi.fn().mockResolvedValue("session-cookie=value"),
      createDatabaseSession: vi.fn().mockResolvedValue({ token: "session-token" }),
      createUserAccount: vi.fn(),
      getAuthSession: vi.fn().mockResolvedValue(mockSession),
      getDb: vi.fn().mockReturnValue({}),
      replayPendingIntentAfterAuth: vi.fn().mockResolvedValue({
        redirectTo: "/prints/sample-featured-print",
        replayed: true
      }),
      setAuthToken: vi.fn(),
      setFlashMessage: vi.fn(),
      signInUserWithPassword: vi.fn().mockResolvedValue({ id: "user-1" })
    };

    // Act
    const response = (await handleAccountSubmission(request, deps as never)) as Response;

    // Assert
    expect(response.status).toBe(302);
    expect(response.headers.get("Location")).toBe("/prints/sample-featured-print");
    expect(deps.createDatabaseSession).toHaveBeenCalled();
    expect(deps.replayPendingIntentAfterAuth).toHaveBeenCalled();
  });
});
