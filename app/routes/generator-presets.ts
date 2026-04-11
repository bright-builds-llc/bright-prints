import { data, redirect } from "react-router"

import type { Route } from "./+types/generator-presets"

import {
  GeneratorPresetMutationError,
  createGeneratorPreset,
  deleteGeneratorPreset,
  renameGeneratorPreset
} from "~/lib/generator-presets/mutations.server"
import {
  buildSignGeneratorPresetSnapshot,
  parseSignGeneratorPresetSnapshot,
  type SignGeneratorPresetSnapshot
} from "~/lib/generator-presets/model"

type GeneratorPresetIntent =
  | "delete-generator-preset"
  | "rename-generator-preset"
  | "save-generator-preset"

type GeneratorPresetSession = {
  set: (key: string, value: unknown) => void
}

type GeneratorPresetDb = Record<string, unknown>

type GeneratorPresetActionDeps = {
  commitAuthSession: (session: GeneratorPresetSession) => Promise<string>
  createGeneratorPreset: (
    db: GeneratorPresetDb,
    userId: string,
    input: {
      generatorSlug: string
      name: string
      snapshot: SignGeneratorPresetSnapshot
    }
  ) => Promise<{ comparisonKey: string; generatorSlug: string; id: string; name: string }>
  deleteGeneratorPreset: (
    db: GeneratorPresetDb,
    userId: string,
    presetId: string
  ) => Promise<{ id: string }>
  getAuthSession: (cookieHeader?: string | null) => Promise<GeneratorPresetSession>
  getDb: () => GeneratorPresetDb
  parseSavePresetRequest: (
    formData: FormData
  ) => Promise<
    | {
        generatorSlug: string
        name: string
        snapshot: SignGeneratorPresetSnapshot
      }
    | null
  >
  renameGeneratorPreset: (
    db: GeneratorPresetDb,
    userId: string,
    presetId: string,
    name: string
  ) => Promise<{ id: string; name: string }>
  resolveCurrentUserFromSession: (
    db: GeneratorPresetDb,
    session: GeneratorPresetSession
  ) => Promise<{ id: string } | null>
  sanitizeReturnTo: (maybeReturnTo: string | null | undefined) => string
  setPendingIntent: (
    session: GeneratorPresetSession,
    pendingIntent:
      | {
          kind: "save-generator-preset"
          generatorSlug: string
          name: string
          snapshot: SignGeneratorPresetSnapshot
        }
      | { kind: "rename-generator-preset"; name: string; presetId: string }
      | { kind: "delete-generator-preset"; presetId: string },
    maybeReturnTo?: string | null
  ) => void
}

function parsePresetIntent(maybeIntent: string | null): GeneratorPresetIntent | null {
  switch (maybeIntent) {
    case "delete-generator-preset":
    case "rename-generator-preset":
    case "save-generator-preset":
      return maybeIntent
    default:
      return null
  }
}

async function parseSavePresetRequest(formData: FormData) {
  const generatorSlug = String(formData.get("generatorSlug") ?? "").trim()
  const name = String(formData.get("name") ?? "").trim()
  const maybeSerializedSnapshot = String(formData.get("snapshot") ?? "")

  if (!generatorSlug || !name || !maybeSerializedSnapshot) {
    return null
  }

  let maybeSnapshotJson: unknown = null

  try {
    maybeSnapshotJson = JSON.parse(maybeSerializedSnapshot)
  } catch {
    return null
  }

  const maybeSnapshot = parseSignGeneratorPresetSnapshot(maybeSnapshotJson)

  if (!maybeSnapshot) {
    return null
  }

  const { findGeneratorBySlug } = await import("~/lib/content/public")
  const { loadPublicContent } = await import("~/lib/content/load.server")

  const content = await loadPublicContent()
  const maybeGenerator = findGeneratorBySlug(content, generatorSlug)

  if (!maybeGenerator) {
    return null
  }

  try {
    return {
      generatorSlug,
      name,
      snapshot: buildSignGeneratorPresetSnapshot(
        maybeGenerator,
        maybeSnapshot.values
      )
    }
  } catch {
    return null
  }
}

export async function handleGeneratorPresetAction(
  request: Request,
  deps: GeneratorPresetActionDeps
) {
  const formData = await request.formData()
  const intent = parsePresetIntent(String(formData.get("intent") ?? null))
  const presetId = String(formData.get("presetId") ?? "").trim()
  const name = String(formData.get("name") ?? "").trim()
  const returnTo = deps.sanitizeReturnTo(String(formData.get("returnTo") ?? "/catalog"))

  if (!intent) {
    return data({ intent, ok: false }, { status: 400 })
  }

  const maybeSaveInput =
    intent === "save-generator-preset"
      ? await deps.parseSavePresetRequest(formData)
      : null

  if (intent === "save-generator-preset" && !maybeSaveInput) {
    return data({ intent, ok: false }, { status: 400 })
  }

  if (intent === "rename-generator-preset" && (!presetId || !name)) {
    return data({ intent, ok: false }, { status: 400 })
  }

  if (intent === "delete-generator-preset" && !presetId) {
    return data({ intent, ok: false }, { status: 400 })
  }

  const db = deps.getDb()
  const session = await deps.getAuthSession(request.headers.get("Cookie"))
  const maybeCurrentUser = await deps.resolveCurrentUserFromSession(db, session)

  if (!maybeCurrentUser) {
    const pendingIntent =
      intent === "save-generator-preset" && maybeSaveInput
        ? {
            kind: "save-generator-preset" as const,
            generatorSlug: maybeSaveInput.generatorSlug,
            name: maybeSaveInput.name,
            snapshot: maybeSaveInput.snapshot
          }
        : intent === "rename-generator-preset"
          ? {
              kind: "rename-generator-preset" as const,
              name,
              presetId
            }
          : {
              kind: "delete-generator-preset" as const,
              presetId
            }

    deps.setPendingIntent(session, pendingIntent, returnTo)

    return redirect("/account?mode=sign-in", {
      headers: {
        "Set-Cookie": await deps.commitAuthSession(session)
      }
    })
  }

  switch (intent) {
    case "save-generator-preset": {
      if (!maybeSaveInput) {
        return data({ intent, ok: false }, { status: 400 })
      }

      const preset = await deps.createGeneratorPreset(
        db,
        maybeCurrentUser.id,
        maybeSaveInput
      )

      return {
        comparisonKey: preset.comparisonKey,
        intent,
        name: preset.name,
        ok: true,
        presetId: preset.id
      }
    }
    case "rename-generator-preset": {
      const preset = await deps.renameGeneratorPreset(
        db,
        maybeCurrentUser.id,
        presetId,
        name
      )

      return {
        intent,
        name: preset.name,
        ok: true,
        presetId: preset.id
      }
    }
    case "delete-generator-preset": {
      const preset = await deps.deleteGeneratorPreset(
        db,
        maybeCurrentUser.id,
        presetId
      )

      return {
        intent,
        ok: true,
        presetId: preset.id
      }
    }
  }
}

export async function action({ request }: Route.ActionArgs) {
  const {
    commitAuthSession,
    getAuthSession,
    resolveCurrentUserFromSession,
    sanitizeReturnTo,
    setPendingIntent
  } = await import("~/lib/auth/session.server")
  const { getDb } = await import("~/lib/db.server")

  try {
    return await handleGeneratorPresetAction(request, {
      commitAuthSession,
      createGeneratorPreset,
      deleteGeneratorPreset,
      getAuthSession,
      getDb,
      parseSavePresetRequest,
      renameGeneratorPreset,
      resolveCurrentUserFromSession,
      sanitizeReturnTo,
      setPendingIntent
    } as never)
  } catch (error) {
    if (error instanceof GeneratorPresetMutationError) {
      return data(
        { formError: error.message, intent: null, ok: false },
        { status: error.status }
      )
    }

    throw error
  }
}
