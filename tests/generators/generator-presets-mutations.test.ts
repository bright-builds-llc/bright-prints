import { describe, expect, it, vi } from "vitest"

import {
  createGeneratorPreset,
  deleteGeneratorPreset,
  replayPendingGeneratorPresetIntent,
  renameGeneratorPreset
} from "~/lib/generator-presets/mutations.server"
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

describe("generator preset mutation helpers", () => {
  it("creates presets with trimmed names and a comparison key", async () => {
    // Arrange
    const create = vi.fn().mockResolvedValue({ id: "preset-1" })
    const db = {
      generatorPreset: {
        create
      }
    }

    // Act
    await createGeneratorPreset(db as never, "user-1", {
      generatorSlug: "sign",
      name: "  Desk Sign  ",
      snapshot
    })

    // Assert
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          comparisonKey: expect.any(String),
          name: "Desk Sign"
        })
      })
    )
  })

  it("rejects renaming presets the user does not own", async () => {
    // Arrange
    const db = {
      generatorPreset: {
        findFirst: vi.fn().mockResolvedValue(null)
      }
    }

    // Act / Assert
    await expect(
      renameGeneratorPreset(db as never, "user-1", "preset-1", "Desk Sign")
    ).rejects.toThrow(/unknown preset/i)
  })

  it("deletes owned presets after lookup", async () => {
    // Arrange
    const deletePreset = vi.fn().mockResolvedValue({ id: "preset-1" })
    const db = {
      generatorPreset: {
        delete: deletePreset,
        findFirst: vi.fn().mockResolvedValue({
          id: "preset-1",
          userId: "user-1"
        })
      }
    }

    // Act
    await deleteGeneratorPreset(db as never, "user-1", "preset-1")

    // Assert
    expect(deletePreset).toHaveBeenCalledWith({
      where: {
        id: "preset-1"
      }
    })
  })

  it("replays saved preset intents through the shared dispatcher", async () => {
    // Arrange
    const db = {
      generatorPreset: {
        create: vi.fn().mockResolvedValue({ id: "preset-1" })
      }
    }

    // Act
    const result = await replayPendingGeneratorPresetIntent(db as never, "user-1", {
      generatorSlug: "sign",
      kind: "save-generator-preset",
      name: "Desk Sign",
      snapshot
    })

    // Assert
    expect(result).toEqual({
      kind: "success",
      message: "Preset saved."
    })
  })
})
