import type { Prisma, PrismaClient } from "@prisma/client";

import type { PendingIntent } from "~/lib/auth/session.server";
import {
  describeSignGeneratorValues,
  maybeParseSignGeneratorValues,
  type SignGeneratorValues,
} from "~/lib/generators/sign";

type GeneratorPresetDb = Pick<
  PrismaClient,
  "$transaction" | "savedGeneratorPreset"
>;
type GeneratorPresetTx = Pick<PrismaClient, "savedGeneratorPreset">;

export type RuntimeGeneratorPreset = {
  createdAt: string;
  generatorSlug: string;
  id: string;
  name: string;
  summary: string;
  updatedAt: string;
  values: SignGeneratorValues;
};

export class GeneratorPresetMutationError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "GeneratorPresetMutationError";
    this.status = status;
  }
}

function normalizePresetName(name: string): string {
  return name.trim();
}

function serializeSignGeneratorValues(values: SignGeneratorValues) {
  return {
    cornerRadiusMm: values.cornerRadiusMm,
    heightMm: values.heightMm,
    text: values.text,
    thicknessMm: values.thicknessMm,
    widthMm: values.widthMm,
  };
}

function readPresetValues(
  generatorSlug: string,
  rawValues: Prisma.JsonValue,
): SignGeneratorValues | null {
  if (generatorSlug !== "sign") {
    return null;
  }

  return maybeParseSignGeneratorValues(rawValues);
}

async function requireOwnedPreset(
  tx: GeneratorPresetTx,
  userId: string,
  presetId: string,
) {
  const maybePreset = await tx.savedGeneratorPreset.findFirst({
    where: {
      id: presetId,
      userId,
    },
  });

  if (!maybePreset) {
    throw new GeneratorPresetMutationError(
      `Unknown preset "${presetId}".`,
      404,
    );
  }

  return maybePreset;
}

function maybeHandleDuplicateName(error: unknown): never {
  if (
    error &&
    typeof error === "object" &&
    "code" in error &&
    error.code === "P2002"
  ) {
    throw new GeneratorPresetMutationError(
      "A preset with that name already exists for this generator.",
      409,
    );
  }

  throw error;
}

export async function loadRuntimeGeneratorPresets(
  db: GeneratorPresetDb,
  userId: string,
  generatorSlug: string,
): Promise<RuntimeGeneratorPreset[]> {
  const presets = await db.savedGeneratorPreset.findMany({
    orderBy: {
      updatedAt: "desc",
    },
    where: {
      generatorSlug,
      userId,
    },
  });

  return presets.flatMap((preset: (typeof presets)[number]) => {
    const maybeValues = readPresetValues(preset.generatorSlug, preset.values);

    if (!maybeValues) {
      return [];
    }

    return [
      {
        createdAt: preset.createdAt.toISOString(),
        generatorSlug: preset.generatorSlug,
        id: preset.id,
        name: preset.name,
        summary: describeSignGeneratorValues(maybeValues),
        updatedAt: preset.updatedAt.toISOString(),
        values: maybeValues,
      },
    ];
  });
}

export async function createGeneratorPreset(
  db: GeneratorPresetDb,
  input: {
    generatorSlug: string;
    name: string;
    userId: string;
    values: SignGeneratorValues;
  },
) {
  const normalizedName = normalizePresetName(input.name);

  if (!normalizedName) {
    throw new GeneratorPresetMutationError("Preset name is required.");
  }

  if (input.generatorSlug !== "sign") {
    throw new GeneratorPresetMutationError(
      `Unsupported generator preset "${input.generatorSlug}".`,
      400,
    );
  }

  try {
    return await db.savedGeneratorPreset.create({
      data: {
        generatorSlug: input.generatorSlug,
        name: normalizedName,
        userId: input.userId,
        values: serializeSignGeneratorValues(input.values),
      },
    });
  } catch (error) {
    maybeHandleDuplicateName(error);
  }
}

export async function renameGeneratorPreset(
  db: GeneratorPresetDb,
  userId: string,
  presetId: string,
  name: string,
) {
  const normalizedName = normalizePresetName(name);

  if (!normalizedName) {
    throw new GeneratorPresetMutationError("Preset name is required.");
  }

  try {
    return await db.$transaction(async (transactionClient) => {
      const tx = transactionClient as unknown as GeneratorPresetTx;
      const preset = await requireOwnedPreset(tx, userId, presetId);

      return tx.savedGeneratorPreset.update({
        data: {
          name: normalizedName,
        },
        where: {
          id: preset.id,
        },
      });
    });
  } catch (error) {
    maybeHandleDuplicateName(error);
  }
}

export async function deleteGeneratorPreset(
  db: GeneratorPresetDb,
  userId: string,
  presetId: string,
) {
  return db.$transaction(async (transactionClient) => {
    const tx = transactionClient as unknown as GeneratorPresetTx;
    const preset = await requireOwnedPreset(tx, userId, presetId);

    await tx.savedGeneratorPreset.delete({
      where: {
        id: preset.id,
      },
    });

    return preset;
  });
}

export async function replayPendingGeneratorPresetIntent(
  db: GeneratorPresetDb,
  userId: string,
  pendingIntent: PendingIntent,
) {
  switch (pendingIntent.kind) {
    case "save-generator-preset":
      await createGeneratorPreset(db, {
        generatorSlug: pendingIntent.generatorSlug,
        name: pendingIntent.name,
        userId,
        values: pendingIntent.values,
      });
      return {
        kind: "success" as const,
        message: "Preset saved.",
      };
    case "rename-generator-preset":
      await renameGeneratorPreset(
        db,
        userId,
        pendingIntent.presetId,
        pendingIntent.name,
      );
      return {
        kind: "success" as const,
        message: "Preset renamed.",
      };
    case "delete-generator-preset":
      await deleteGeneratorPreset(db, userId, pendingIntent.presetId);
      return {
        kind: "success" as const,
        message: "Preset deleted.",
      };
    default:
      return null;
  }
}
