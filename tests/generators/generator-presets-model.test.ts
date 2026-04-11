import { describe, expect, it } from "vitest"

import { generatorSchema } from "~/lib/content/schema"
import {
  buildGeneratorPresetHref,
  buildSignGeneratorPresetComparisonKey,
  buildSignGeneratorPresetSnapshot,
  deriveGeneratorPresetState,
  parseSignGeneratorPresetSnapshot,
  type RuntimeGeneratorPreset
} from "~/lib/generator-presets/model"

const signGenerator = generatorSchema.parse({
  availability: "open-source",
  categories: ["signage"],
  creatorSlug: "bright-builds",
  definition: {
    type: "sign-v1"
  },
  description: "Generator",
  discovery: {
    accentTone: "verdigris",
    catalogRank: 1,
    eyebrow: "Generator",
    mark: "BP"
  },
  outputFormat: "3mf",
  parameters: [
    {
      defaultValue: "HELLO",
      label: "Text",
      maxLength: 12,
      name: "text",
      type: "text"
    },
    {
      defaultValue: 120,
      label: "Width",
      max: 200,
      min: 60,
      name: "width-mm",
      type: "number",
      unit: "mm"
    },
    {
      defaultValue: 60,
      label: "Height",
      max: 120,
      min: 30,
      name: "height-mm",
      type: "number",
      unit: "mm"
    },
    {
      defaultValue: 4,
      label: "Thickness",
      max: 12,
      min: 2,
      name: "thickness-mm",
      type: "number",
      unit: "mm"
    },
    {
      defaultValue: 6,
      label: "Corner Radius",
      max: 20,
      min: 0,
      name: "corner-radius-mm",
      type: "number",
      unit: "mm"
    }
  ],
  publishedOn: "2026-04-08",
  schemaVersion: 1,
  slug: "sign",
  summary: "Generator",
  title: "Sign Generator"
})

function buildPreset(
  overrides?: Partial<RuntimeGeneratorPreset>
): RuntimeGeneratorPreset {
  const snapshot = buildSignGeneratorPresetSnapshot(signGenerator, {
    cornerRadiusMm: 6,
    heightMm: 60,
    text: "HELLO",
    thicknessMm: 4,
    widthMm: 120
  })

  return {
    comparisonKey: buildSignGeneratorPresetComparisonKey(snapshot.values),
    createdAt: "2026-04-11T00:00:00.000Z",
    generatorSlug: "sign",
    id: "preset-1",
    name: "Desk Sign",
    snapshot,
    summary: {
      size: "120 x 60 mm",
      text: "HELLO"
    },
    updatedAt: "2026-04-11T00:00:00.000Z",
    ...overrides
  }
}

describe("generator preset model helpers", () => {
  it("normalizes saved sign text into a stable snapshot", () => {
    // Arrange
    const values = {
      cornerRadiusMm: 6,
      heightMm: 60,
      text: " hello  world ",
      thicknessMm: 4,
      widthMm: 120
    }

    // Act
    const snapshot = buildSignGeneratorPresetSnapshot(signGenerator, values)

    // Assert
    expect(snapshot.values.text).toBe("HELLO WORLD")
  })

  it("rejects malformed saved snapshots", () => {
    // Arrange
    const malformedSnapshot = {
      kind: "sign-v2",
      values: {}
    }

    // Act
    const parsedSnapshot = parseSignGeneratorPresetSnapshot(malformedSnapshot)

    // Assert
    expect(parsedSnapshot).toBeNull()
  })

  it("reports saved state when current values match a preset", () => {
    // Arrange
    const preset = buildPreset()

    // Act
    const state = deriveGeneratorPresetState({
      currentComparisonKey: preset.comparisonKey,
      maybeTrackedPresetId: null,
      presets: [preset]
    })

    // Assert
    expect(state).toEqual({
      kind: "saved",
      preset
    })
  })

  it("prefers the tracked preset when reopened state matches multiple presets", () => {
    // Arrange
    const preset = buildPreset()
    const duplicatePreset = buildPreset({
      id: "preset-2",
      name: "Desk Sign Copy"
    })

    // Act
    const state = deriveGeneratorPresetState({
      currentComparisonKey: preset.comparisonKey,
      maybeTrackedPresetId: duplicatePreset.id,
      presets: [preset, duplicatePreset]
    })

    // Assert
    expect(state).toEqual({
      kind: "saved",
      preset: duplicatePreset
    })
  })

  it("reports edited state when a tracked preset no longer matches", () => {
    // Arrange
    const preset = buildPreset()
    const comparisonKey = buildSignGeneratorPresetComparisonKey({
      cornerRadiusMm: 6,
      heightMm: 60,
      text: "HELLO AGAIN",
      thicknessMm: 4,
      widthMm: 120
    })

    // Act
    const state = deriveGeneratorPresetState({
      currentComparisonKey: comparisonKey,
      maybeTrackedPresetId: preset.id,
      presets: [preset]
    })

    // Assert
    expect(state).toEqual({
      kind: "edited",
      preset
    })
  })

  it("builds deep links back into generator preset context", () => {
    // Arrange / Act
    const href = buildGeneratorPresetHref("sign", "preset-1")

    // Assert
    expect(href).toBe("/generators/sign?preset=preset-1")
  })
})
