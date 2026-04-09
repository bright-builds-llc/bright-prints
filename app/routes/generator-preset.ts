import { data, redirect } from "react-router";

import type { Route } from "./+types/generator-preset";

import type { SignGeneratorValues } from "~/lib/generators/sign";

type GeneratorPresetIntent =
  | "delete-generator-preset"
  | "rename-generator-preset"
  | "save-generator-preset";

type GeneratorPresetSession = {
  set: (key: string, value: unknown) => void;
};

type GeneratorPresetDb = Record<string, unknown>;

type GeneratorPresetActionDeps = {
  commitAuthSession: (session: GeneratorPresetSession) => Promise<string>;
  createGeneratorPreset: (
    db: GeneratorPresetDb,
    input: {
      generatorSlug: string;
      name: string;
      userId: string;
      values: SignGeneratorValues;
    },
  ) => Promise<{ id: string; name: string }>;
  deleteGeneratorPreset: (
    db: GeneratorPresetDb,
    userId: string,
    presetId: string,
  ) => Promise<{ id: string }>;
  getAuthSession: (
    cookieHeader?: string | null,
  ) => Promise<GeneratorPresetSession>;
  getDb: () => GeneratorPresetDb;
  presetsEnabled: boolean;
  renameGeneratorPreset: (
    db: GeneratorPresetDb,
    userId: string,
    presetId: string,
    name: string,
  ) => Promise<{ id: string; name: string }>;
  resolveCurrentUserFromSession: (
    db: GeneratorPresetDb,
    session: GeneratorPresetSession,
  ) => Promise<{ id: string } | null>;
  sanitizeReturnTo: (maybeReturnTo: string | null | undefined) => string;
  setPendingIntent: (
    session: GeneratorPresetSession,
    pendingIntent:
      | {
          kind: "save-generator-preset";
          generatorSlug: string;
          name: string;
          values: SignGeneratorValues;
        }
      | { kind: "rename-generator-preset"; name: string; presetId: string }
      | { kind: "delete-generator-preset"; presetId: string },
    maybeReturnTo?: string | null,
  ) => void;
};

export type GeneratorPresetActionResult =
  | {
      intent: GeneratorPresetIntent | null;
      message: string;
      ok: false;
      presetId: string | null;
    }
  | {
      intent: GeneratorPresetIntent;
      message: string;
      name?: string;
      ok: true;
      presetId: string | null;
    };

function parsePresetIntent(
  maybeIntent: string | null,
): GeneratorPresetIntent | null {
  switch (maybeIntent) {
    case "delete-generator-preset":
    case "rename-generator-preset":
    case "save-generator-preset":
      return maybeIntent;
    default:
      return null;
  }
}

function maybeParsePresetValues(
  formData: FormData,
): SignGeneratorValues | null {
  const maybeWidthMm = Number(formData.get("widthMm"));
  const maybeHeightMm = Number(formData.get("heightMm"));
  const maybeThicknessMm = Number(formData.get("thicknessMm"));
  const maybeCornerRadiusMm = Number(formData.get("cornerRadiusMm"));
  const text = String(formData.get("text") ?? "");

  if (
    Number.isNaN(maybeWidthMm) ||
    Number.isNaN(maybeHeightMm) ||
    Number.isNaN(maybeThicknessMm) ||
    Number.isNaN(maybeCornerRadiusMm)
  ) {
    return null;
  }

  return {
    cornerRadiusMm: maybeCornerRadiusMm,
    heightMm: maybeHeightMm,
    text,
    thicknessMm: maybeThicknessMm,
    widthMm: maybeWidthMm,
  };
}

export async function handleGeneratorPresetAction(
  request: Request,
  deps: GeneratorPresetActionDeps,
) {
  const formData = await request.formData();
  const intent = parsePresetIntent(String(formData.get("intent") ?? null));
  const generatorSlug = String(formData.get("generatorSlug") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const presetId = String(formData.get("presetId") ?? "").trim();
  const returnTo = deps.sanitizeReturnTo(
    String(
      formData.get("returnTo") ?? `/generators/${generatorSlug || "sign"}`,
    ),
  );

  if (!intent) {
    return data<GeneratorPresetActionResult>(
      {
        intent,
        message: "Unknown preset action.",
        ok: false,
        presetId: presetId || null,
      },
      { status: 400 },
    );
  }

  if (!deps.presetsEnabled) {
    return data<GeneratorPresetActionResult>(
      {
        intent,
        message:
          "Saved presets are unavailable until DATABASE_URL and SESSION_SECRET are configured.",
        ok: false,
        presetId: presetId || null,
      },
      { status: 503 },
    );
  }

  const maybeValues =
    intent === "save-generator-preset"
      ? maybeParsePresetValues(formData)
      : null;

  if (
    (intent === "save-generator-preset" &&
      (!generatorSlug || !maybeValues || !name)) ||
    (intent === "rename-generator-preset" && (!presetId || !name)) ||
    (intent === "delete-generator-preset" && !presetId)
  ) {
    return data<GeneratorPresetActionResult>(
      {
        intent,
        message: "Preset action data is incomplete.",
        ok: false,
        presetId: presetId || null,
      },
      { status: 400 },
    );
  }

  const db = deps.getDb();
  const session = await deps.getAuthSession(request.headers.get("Cookie"));
  const maybeCurrentUser = await deps.resolveCurrentUserFromSession(
    db,
    session,
  );

  if (!maybeCurrentUser) {
    const pendingIntent =
      intent === "save-generator-preset"
        ? {
            kind: "save-generator-preset" as const,
            generatorSlug,
            name,
            values: maybeValues as SignGeneratorValues,
          }
        : intent === "rename-generator-preset"
          ? {
              kind: "rename-generator-preset" as const,
              name,
              presetId,
            }
          : {
              kind: "delete-generator-preset" as const,
              presetId,
            };

    deps.setPendingIntent(session, pendingIntent, returnTo);

    return redirect("/account?mode=sign-in", {
      headers: {
        "Set-Cookie": await deps.commitAuthSession(session),
      },
    });
  }

  try {
    switch (intent) {
      case "save-generator-preset": {
        const preset = await deps.createGeneratorPreset(db, {
          generatorSlug,
          name,
          userId: maybeCurrentUser.id,
          values: maybeValues as SignGeneratorValues,
        });

        return {
          intent,
          message: "Preset saved.",
          name: preset.name,
          ok: true,
          presetId: preset.id,
        } satisfies GeneratorPresetActionResult;
      }
      case "rename-generator-preset": {
        const preset = await deps.renameGeneratorPreset(
          db,
          maybeCurrentUser.id,
          presetId,
          name,
        );

        return {
          intent,
          message: "Preset renamed.",
          name: preset.name,
          ok: true,
          presetId: preset.id,
        } satisfies GeneratorPresetActionResult;
      }
      case "delete-generator-preset": {
        const preset = await deps.deleteGeneratorPreset(
          db,
          maybeCurrentUser.id,
          presetId,
        );

        return {
          intent,
          message: "Preset deleted.",
          ok: true,
          presetId: preset.id,
        } satisfies GeneratorPresetActionResult;
      }
    }
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Preset action failed unexpectedly.";
    const status =
      error &&
      typeof error === "object" &&
      "status" in error &&
      typeof error.status === "number"
        ? error.status
        : 400;

    return data<GeneratorPresetActionResult>(
      {
        intent,
        message,
        ok: false,
        presetId: presetId || null,
      },
      { status },
    );
  }
}

export async function action({ request }: Route.ActionArgs) {
  const {
    commitAuthSession,
    getAuthSession,
    resolveCurrentUserFromSession,
    sanitizeReturnTo,
    setPendingIntent,
  } = await import("~/lib/auth/session.server");
  const { getDb } = await import("~/lib/db.server");
  const { getServerEnv } = await import("~/lib/env.server");
  const {
    createGeneratorPreset,
    deleteGeneratorPreset,
    renameGeneratorPreset,
  } = await import("~/lib/generator-presets/server");

  const serverEnv = getServerEnv();

  return handleGeneratorPresetAction(request, {
    commitAuthSession,
    createGeneratorPreset,
    deleteGeneratorPreset,
    getAuthSession,
    getDb,
    presetsEnabled: Boolean(serverEnv.DATABASE_URL && serverEnv.SESSION_SECRET),
    renameGeneratorPreset,
    resolveCurrentUserFromSession,
    sanitizeReturnTo,
    setPendingIntent,
  } as never);
}
