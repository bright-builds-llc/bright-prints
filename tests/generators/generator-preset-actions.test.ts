import { describe, expect, it, vi } from "vitest";

import type { GeneratorPresetActionResult } from "~/routes/generator-preset";
import { handleGeneratorPresetAction } from "~/routes/generator-preset";

describe("generator-preset action", () => {
  it("redirects signed-out preset saves into auth with a pending intent", async () => {
    // Arrange
    const request = new Request("http://example.com/actions/generator-preset", {
      body: new URLSearchParams({
        cornerRadiusMm: "4",
        generatorSlug: "sign",
        heightMm: "40",
        intent: "save-generator-preset",
        name: "Desk sign",
        returnTo: "/generators/sign",
        text: "Desk",
        thicknessMm: "3",
        widthMm: "120",
      }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    });
    const mockSession = { set: vi.fn() };
    const deps = {
      commitAuthSession: vi.fn().mockResolvedValue("cookie=value"),
      createGeneratorPreset: vi.fn(),
      deleteGeneratorPreset: vi.fn(),
      getAuthSession: vi.fn().mockResolvedValue(mockSession),
      getDb: vi.fn().mockReturnValue({}),
      presetsEnabled: true,
      renameGeneratorPreset: vi.fn(),
      resolveCurrentUserFromSession: vi.fn().mockResolvedValue(null),
      sanitizeReturnTo: (value: string | null | undefined) =>
        value ?? "/generators/sign",
      setPendingIntent: vi.fn(),
    };

    // Act
    const response = (await handleGeneratorPresetAction(
      request,
      deps as never,
    )) as Response;

    // Assert
    expect(response.status).toBe(302);
    expect(response.headers.get("Location")).toBe("/account?mode=sign-in");
    expect(deps.setPendingIntent).toHaveBeenCalledWith(
      mockSession,
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
  });

  it("returns a stable payload for signed-in preset saves", async () => {
    // Arrange
    const request = new Request("http://example.com/actions/generator-preset", {
      body: new URLSearchParams({
        cornerRadiusMm: "4",
        generatorSlug: "sign",
        heightMm: "40",
        intent: "save-generator-preset",
        name: "Desk sign",
        returnTo: "/generators/sign",
        text: "Desk",
        thicknessMm: "3",
        widthMm: "120",
      }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    });
    const deps = {
      commitAuthSession: vi.fn(),
      createGeneratorPreset: vi
        .fn()
        .mockResolvedValue({ id: "preset-1", name: "Desk sign" }),
      deleteGeneratorPreset: vi.fn(),
      getAuthSession: vi.fn().mockResolvedValue({}),
      getDb: vi.fn().mockReturnValue({}),
      presetsEnabled: true,
      renameGeneratorPreset: vi.fn(),
      resolveCurrentUserFromSession: vi
        .fn()
        .mockResolvedValue({ id: "user-1" }),
      sanitizeReturnTo: (value: string | null | undefined) =>
        value ?? "/generators/sign",
      setPendingIntent: vi.fn(),
    };

    // Act
    const result = await handleGeneratorPresetAction(request, deps as never);

    // Assert
    expect(result).toEqual({
      intent: "save-generator-preset",
      message: "Preset saved.",
      name: "Desk sign",
      ok: true,
      presetId: "preset-1",
    });
  });

  it("fails cleanly when preset infrastructure is disabled", async () => {
    // Arrange
    const request = new Request("http://example.com/actions/generator-preset", {
      body: new URLSearchParams({
        cornerRadiusMm: "4",
        generatorSlug: "sign",
        heightMm: "40",
        intent: "save-generator-preset",
        name: "Desk sign",
        text: "Desk",
        thicknessMm: "3",
        widthMm: "120",
      }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    });

    // Act
    const response = (await handleGeneratorPresetAction(request, {
      commitAuthSession: vi.fn(),
      createGeneratorPreset: vi.fn(),
      deleteGeneratorPreset: vi.fn(),
      getAuthSession: vi.fn(),
      getDb: vi.fn(),
      presetsEnabled: false,
      renameGeneratorPreset: vi.fn(),
      resolveCurrentUserFromSession: vi.fn(),
      sanitizeReturnTo: (value: string | null | undefined) =>
        value ?? "/generators/sign",
      setPendingIntent: vi.fn(),
    } as never)) as {
      data: GeneratorPresetActionResult;
      init?: { status?: number };
    };

    // Assert
    expect(response.init?.status).toBe(503);
    expect(response.data).toEqual({
      intent: "save-generator-preset",
      message:
        "Saved presets are unavailable until DATABASE_URL and SESSION_SECRET are configured.",
      ok: false,
      presetId: null,
    });
  });
});
