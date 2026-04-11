import type { PrismaClient } from "@prisma/client"

import {
  buildGeneratorPresetSummary,
  parseSignGeneratorPresetSnapshot,
  type RuntimeGeneratorPreset
} from "~/lib/generator-presets/model"

type GeneratorPresetDb = Pick<PrismaClient, "generatorPreset">

function toRuntimeGeneratorPreset(
  preset: Awaited<ReturnType<GeneratorPresetDb["generatorPreset"]["findMany"]>>[number]
): RuntimeGeneratorPreset | null {
  const maybeSnapshot = parseSignGeneratorPresetSnapshot(preset.snapshot)

  if (!maybeSnapshot) {
    return null
  }

  return {
    comparisonKey: preset.comparisonKey,
    createdAt: preset.createdAt.toISOString(),
    generatorSlug: preset.generatorSlug,
    id: preset.id,
    name: preset.name,
    snapshot: maybeSnapshot,
    summary: buildGeneratorPresetSummary(maybeSnapshot),
    updatedAt: preset.updatedAt.toISOString()
  }
}

function toRuntimeGeneratorPresets(
  presets: Awaited<ReturnType<GeneratorPresetDb["generatorPreset"]["findMany"]>>
): RuntimeGeneratorPreset[] {
  return presets.flatMap((preset) => {
    const maybeRuntimePreset = toRuntimeGeneratorPreset(preset)

    return maybeRuntimePreset ? [maybeRuntimePreset] : []
  })
}

export async function loadGeneratorPresets(
  db: GeneratorPresetDb,
  userId: string,
  generatorSlug: string
): Promise<RuntimeGeneratorPreset[]> {
  const presets = await db.generatorPreset.findMany({
    orderBy: {
      updatedAt: "desc"
    },
    where: {
      generatorSlug,
      userId
    }
  })

  return toRuntimeGeneratorPresets(presets)
}

export async function loadGeneratorPresetById(
  db: GeneratorPresetDb,
  userId: string,
  presetId: string
): Promise<RuntimeGeneratorPreset | null> {
  const maybePreset = await db.generatorPreset.findFirst({
    where: {
      id: presetId,
      userId
    }
  })

  if (!maybePreset) {
    return null
  }

  return toRuntimeGeneratorPreset(maybePreset)
}

export async function loadGeneratorPresetLibraryEntries(
  db: GeneratorPresetDb,
  userId: string
): Promise<RuntimeGeneratorPreset[]> {
  const presets = await db.generatorPreset.findMany({
    orderBy: {
      updatedAt: "desc"
    },
    where: {
      userId
    }
  })

  return toRuntimeGeneratorPresets(presets)
}
