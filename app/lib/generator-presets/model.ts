import { z } from "zod"

import type { GeneratorRecord } from "~/lib/content/schema"
import {
  validateSignValues,
  type SignGeneratorValues
} from "~/lib/generators/sign"
import { sanitizeSignText } from "~/lib/generators/sign-font"

export const generatorPresetNameMaxLength = 48

const signGeneratorPresetValuesSchema = z.object({
  cornerRadiusMm: z.number(),
  heightMm: z.number(),
  text: z.string(),
  thicknessMm: z.number(),
  widthMm: z.number()
})

const signGeneratorPresetSnapshotSchema = z.object({
  kind: z.literal("sign-v1"),
  values: signGeneratorPresetValuesSchema
})

export type SignGeneratorPresetSnapshot = z.infer<
  typeof signGeneratorPresetSnapshotSchema
>

export type RuntimeGeneratorPreset = {
  comparisonKey: string
  createdAt: string
  generatorSlug: string
  id: string
  name: string
  snapshot: SignGeneratorPresetSnapshot
  summary: {
    size: string
    text: string
  }
  updatedAt: string
}

export type GeneratorPresetState =
  | { kind: "edited"; preset: RuntimeGeneratorPreset }
  | { kind: "saved"; preset: RuntimeGeneratorPreset }
  | { kind: "unsaved" }

export class GeneratorPresetModelError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "GeneratorPresetModelError"
  }
}

export function buildGeneratorPresetHref(generatorSlug: string, presetId: string) {
  return `/generators/${generatorSlug}?preset=${presetId}`
}

export function normalizeGeneratorPresetName(name: string) {
  return name.trim()
}

export function normalizeSignGeneratorPresetValues(
  values: SignGeneratorValues
): SignGeneratorValues {
  const { sanitizedText } = sanitizeSignText(values.text)

  return {
    cornerRadiusMm: values.cornerRadiusMm,
    heightMm: values.heightMm,
    text: sanitizedText,
    thicknessMm: values.thicknessMm,
    widthMm: values.widthMm
  }
}

export function buildSignGeneratorPresetComparisonKey(
  values: SignGeneratorValues
) {
  return JSON.stringify(normalizeSignGeneratorPresetValues(values))
}

export function buildSignGeneratorPresetSnapshot(
  generator: GeneratorRecord,
  values: SignGeneratorValues
): SignGeneratorPresetSnapshot {
  const validation = validateSignValues(generator, values)

  if (Object.keys(validation.issues).length > 0) {
    throw new GeneratorPresetModelError(
      "Only valid generator values can be saved as presets."
    )
  }

  return {
    kind: "sign-v1",
    values: {
      ...normalizeSignGeneratorPresetValues(values),
      text: validation.sanitizedText
    }
  }
}

export function parseSignGeneratorPresetSnapshot(
  maybeSnapshot: unknown
): SignGeneratorPresetSnapshot | null {
  const result = signGeneratorPresetSnapshotSchema.safeParse(maybeSnapshot)

  if (!result.success) {
    return null
  }

  return {
    kind: "sign-v1",
    values: normalizeSignGeneratorPresetValues(result.data.values)
  }
}

export function buildGeneratorPresetSummary(
  snapshot: SignGeneratorPresetSnapshot
) {
  return {
    size: `${snapshot.values.widthMm} x ${snapshot.values.heightMm} mm`,
    text: snapshot.values.text
  }
}

export function deriveGeneratorPresetState(options: {
  currentComparisonKey: string
  maybeTrackedPresetId: string | null
  presets: RuntimeGeneratorPreset[]
}): GeneratorPresetState {
  const { currentComparisonKey, maybeTrackedPresetId, presets } = options
  const maybeTrackedPreset =
    maybeTrackedPresetId
      ? presets.find((preset) => preset.id === maybeTrackedPresetId) ?? null
      : null

  if (
    maybeTrackedPreset &&
    maybeTrackedPreset.comparisonKey === currentComparisonKey
  ) {
    return {
      kind: "saved",
      preset: maybeTrackedPreset
    }
  }

  const maybeMatchingPreset =
    presets.find((preset) => preset.comparisonKey === currentComparisonKey) ?? null

  if (maybeMatchingPreset) {
    return {
      kind: "saved",
      preset: maybeMatchingPreset
    }
  }

  if (!maybeTrackedPresetId) {
    return {
      kind: "unsaved"
    }
  }

  if (!maybeTrackedPreset) {
    return {
      kind: "unsaved"
    }
  }

  return {
    kind: "edited",
    preset: maybeTrackedPreset
  }
}
