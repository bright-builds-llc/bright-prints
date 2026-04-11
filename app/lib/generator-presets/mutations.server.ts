import type { PrismaClient } from "@prisma/client"

import type {
  PendingIntent,
  SessionFlashMessage
} from "~/lib/auth/session.server"
import {
  buildSignGeneratorPresetComparisonKey,
  generatorPresetNameMaxLength,
  normalizeGeneratorPresetName,
  type SignGeneratorPresetSnapshot
} from "~/lib/generator-presets/model"

type GeneratorPresetDb = Pick<PrismaClient, "generatorPreset">

export class GeneratorPresetMutationError extends Error {
  status: number

  constructor(message: string, status = 400) {
    super(message)
    this.name = "GeneratorPresetMutationError"
    this.status = status
  }
}

function isUniqueConstraintError(error: unknown) {
  return (
    error !== null &&
    typeof error === "object" &&
    "code" in error &&
    error.code === "P2002"
  )
}

function validatePresetName(name: string) {
  const normalizedName = normalizeGeneratorPresetName(name)

  if (!normalizedName) {
    throw new GeneratorPresetMutationError("Preset name is required.")
  }

  if (normalizedName.length > generatorPresetNameMaxLength) {
    throw new GeneratorPresetMutationError(
      `Preset names must stay under ${generatorPresetNameMaxLength} characters.`
    )
  }

  return normalizedName
}

async function requireOwnedPreset(
  db: GeneratorPresetDb,
  userId: string,
  presetId: string
) {
  const maybePreset = await db.generatorPreset.findFirst({
    where: {
      id: presetId,
      userId
    }
  })

  if (!maybePreset) {
    throw new GeneratorPresetMutationError(`Unknown preset "${presetId}"`, 404)
  }

  return maybePreset
}

export async function createGeneratorPreset(
  db: GeneratorPresetDb,
  userId: string,
  input: {
    generatorSlug: string
    name: string
    snapshot: SignGeneratorPresetSnapshot
  }
) {
  const normalizedName = validatePresetName(input.name)

  try {
    return await db.generatorPreset.create({
      data: {
        comparisonKey: buildSignGeneratorPresetComparisonKey(input.snapshot.values),
        generatorSlug: input.generatorSlug,
        name: normalizedName,
        snapshot: input.snapshot,
        userId
      }
    })
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      throw new GeneratorPresetMutationError(
        "A preset with that name already exists for this generator.",
        409
      )
    }

    throw error
  }
}

export async function renameGeneratorPreset(
  db: GeneratorPresetDb,
  userId: string,
  presetId: string,
  name: string
) {
  const normalizedName = validatePresetName(name)
  const preset = await requireOwnedPreset(db, userId, presetId)

  try {
    return await db.generatorPreset.update({
      data: {
        name: normalizedName
      },
      where: {
        id: preset.id
      }
    })
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      throw new GeneratorPresetMutationError(
        "A preset with that name already exists for this generator.",
        409
      )
    }

    throw error
  }
}

export async function deleteGeneratorPreset(
  db: GeneratorPresetDb,
  userId: string,
  presetId: string
) {
  const preset = await requireOwnedPreset(db, userId, presetId)

  await db.generatorPreset.delete({
    where: {
      id: preset.id
    }
  })

  return preset
}

export async function replayPendingGeneratorPresetIntent(
  db: GeneratorPresetDb,
  userId: string,
  pendingIntent: PendingIntent
): Promise<SessionFlashMessage | null> {
  switch (pendingIntent.kind) {
    case "save-generator-preset":
      await createGeneratorPreset(db, userId, {
        generatorSlug: pendingIntent.generatorSlug,
        name: pendingIntent.name,
        snapshot: pendingIntent.snapshot
      })
      return {
        kind: "success",
        message: "Preset saved."
      }
    case "rename-generator-preset":
      await renameGeneratorPreset(
        db,
        userId,
        pendingIntent.presetId,
        pendingIntent.name
      )
      return {
        kind: "success",
        message: "Preset renamed."
      }
    case "delete-generator-preset":
      await deleteGeneratorPreset(db, userId, pendingIntent.presetId)
      return {
        kind: "success",
        message: "Preset deleted."
      }
    default:
      return null
  }
}
