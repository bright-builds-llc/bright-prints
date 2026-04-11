import { describe, expect, it, vi } from "vitest"

import { handleGeneratorPresetAction } from "~/routes/generator-presets"
import { type SignGeneratorPresetSnapshot } from "~/lib/generator-presets/model"

const snapshot: SignGeneratorPresetSnapshot = {
  kind: "sign-v1",
  values: {
    cornerRadiusMm: 6,
    heightMm: 60,
    text: "HELLO",
    thicknessMm: 4,
    widthMm: 120
  }
}

describe("generator-presets action", () => {
  it("redirects signed-out preset saves into auth with a replayable intent", async () => {
    // Arrange
    const request = new Request("http://example.com/actions/generator-presets", {
      body: new URLSearchParams({
        generatorSlug: "sign",
        intent: "save-generator-preset",
        name: "Desk Sign",
        returnTo: "/generators/sign",
        snapshot: JSON.stringify(snapshot)
      }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST"
    })
    const mockSession = { set: vi.fn() }
    const deps = {
      commitAuthSession: vi.fn().mockResolvedValue("cookie=value"),
      createGeneratorPreset: vi.fn(),
      deleteGeneratorPreset: vi.fn(),
      getAuthSession: vi.fn().mockResolvedValue(mockSession),
      getDb: vi.fn().mockReturnValue({}),
      parseSavePresetRequest: vi.fn().mockResolvedValue({
        generatorSlug: "sign",
        name: "Desk Sign",
        snapshot
      }),
      renameGeneratorPreset: vi.fn(),
      resolveCurrentUserFromSession: vi.fn().mockResolvedValue(null),
      setPendingIntent: vi.fn()
    }

    // Act
    const response = (await handleGeneratorPresetAction(request, {
      ...deps,
      sanitizeReturnTo: (value: string | null | undefined) => value ?? "/catalog"
    } as never)) as Response

    // Assert
    expect(response.status).toBe(302)
    expect(response.headers.get("Location")).toBe("/account?mode=sign-in")
    expect(deps.setPendingIntent).toHaveBeenCalledWith(
      mockSession,
      {
        generatorSlug: "sign",
        kind: "save-generator-preset",
        name: "Desk Sign",
        snapshot
      },
      "/generators/sign"
    )
  })

  it("returns stable action data for signed-in preset saves", async () => {
    // Arrange
    const request = new Request("http://example.com/actions/generator-presets", {
      body: new URLSearchParams({
        generatorSlug: "sign",
        intent: "save-generator-preset",
        name: "Desk Sign",
        returnTo: "/generators/sign",
        snapshot: JSON.stringify(snapshot)
      }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST"
    })
    const deps = {
      commitAuthSession: vi.fn(),
      createGeneratorPreset: vi.fn().mockResolvedValue({
        comparisonKey: "{\"text\":\"HELLO\"}",
        generatorSlug: "sign",
        id: "preset-1",
        name: "Desk Sign"
      }),
      deleteGeneratorPreset: vi.fn(),
      getAuthSession: vi.fn().mockResolvedValue({}),
      getDb: vi.fn().mockReturnValue({}),
      parseSavePresetRequest: vi.fn().mockResolvedValue({
        generatorSlug: "sign",
        name: "Desk Sign",
        snapshot
      }),
      renameGeneratorPreset: vi.fn(),
      resolveCurrentUserFromSession: vi.fn().mockResolvedValue({ id: "user-1" }),
      setPendingIntent: vi.fn()
    }

    // Act
    const result = await handleGeneratorPresetAction(request, {
      ...deps,
      sanitizeReturnTo: (value: string | null | undefined) => value ?? "/catalog"
    } as never)

    // Assert
    expect(result).toEqual({
      comparisonKey: "{\"text\":\"HELLO\"}",
      intent: "save-generator-preset",
      name: "Desk Sign",
      ok: true,
      presetId: "preset-1"
    })
  })
})
