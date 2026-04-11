import type { PrismaClient } from "@prisma/client"

import {
  buildGeneratorPresetSummary,
  parseSignGeneratorPresetSnapshot,
  type RuntimeGeneratorPreset
} from "~/lib/generator-presets/model"

type GeneratorPresetDb = Pick<PrismaClient, "generatorPreset">

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

  return presets.flatMap((preset) => {
    const maybeSnapshot = parseSignGeneratorPresetSnapshot(preset.snapshot)

    if (!maybeSnapshot) {
      return []
    }

    return [
      {
        comparisonKey: preset.comparisonKey,
        createdAt: preset.createdAt.toISOString(),
        generatorSlug: preset.generatorSlug,
        id: preset.id,
        name: preset.name,
        snapshot: maybeSnapshot,
        summary: buildGeneratorPresetSummary(maybeSnapshot),
        updatedAt: preset.updatedAt.toISOString()
      }
    ]
  })
}
