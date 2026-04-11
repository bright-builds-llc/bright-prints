import { useState } from "react"
import { Link, useFetcher } from "react-router"

import type { GeneratorRecord } from "~/lib/content/schema"
import {
  buildSignGeneratorPresetComparisonKey,
  buildSignGeneratorPresetSnapshot,
  deriveGeneratorPresetState,
  generatorPresetNameMaxLength,
  type RuntimeGeneratorPreset
} from "~/lib/generator-presets/model"
import type {
  SignGeneratorValidation,
  SignGeneratorValues
} from "~/lib/generators/sign"
import { ShimmerButton } from "~/components/ui/shimmer-button"

type PresetActionData = {
  formError?: string | null
  intent: string | null
  name?: string
  ok: boolean
  presetId?: string
}

type GeneratorPresetPanelProps = {
  currentUser: { id: string } | null
  generator: GeneratorRecord
  presets: RuntimeGeneratorPreset[]
  returnTo: string
  validation: SignGeneratorValidation
  values: SignGeneratorValues
}

function formatPresetDate(isoDate: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short"
  }).format(new Date(isoDate))
}

function PresetRow(props: {
  isTracked: boolean
  preset: RuntimeGeneratorPreset
  returnTo: string
}) {
  const { isTracked, preset, returnTo } = props
  const renameFetcher = useFetcher<PresetActionData>()
  const deleteFetcher = useFetcher<PresetActionData>()

  return (
    <li className="generator-preset-row">
      <div className="generator-preset-row-head">
        <div>
          <p className="generator-preset-name">{preset.name}</p>
          <p className="generator-preset-summary">
            {preset.summary.text} · {preset.summary.size}
          </p>
        </div>
        <p className="generator-preset-meta">
          Updated {formatPresetDate(preset.updatedAt)}
        </p>
      </div>

      {isTracked ? (
        <p className="generator-preset-state">Current saved baseline</p>
      ) : null}

      <div className="generator-preset-inline-actions">
        <renameFetcher.Form
          action="/actions/generator-presets"
          className="generator-preset-rename-form"
          method="post"
        >
          <input name="intent" type="hidden" value="rename-generator-preset" />
          <input name="presetId" type="hidden" value={preset.id} />
          <input name="returnTo" type="hidden" value={returnTo} />
          <input
            aria-label="Rename preset"
            defaultValue={preset.name}
            id={`preset-name-${preset.id}`}
            maxLength={generatorPresetNameMaxLength}
            name="name"
            type="text"
          />
          <button
            className="home-secondary-action"
            disabled={renameFetcher.state !== "idle"}
            type="submit"
          >
            Rename
          </button>
        </renameFetcher.Form>

        <deleteFetcher.Form action="/actions/generator-presets" method="post">
          <input name="intent" type="hidden" value="delete-generator-preset" />
          <input name="presetId" type="hidden" value={preset.id} />
          <input name="returnTo" type="hidden" value={returnTo} />
          <button
            className="generator-preset-delete-button"
            disabled={deleteFetcher.state !== "idle"}
            type="submit"
          >
            Delete
          </button>
        </deleteFetcher.Form>
      </div>

      {renameFetcher.data?.formError ? (
        <p className="generator-error-message">{renameFetcher.data.formError}</p>
      ) : null}
      {deleteFetcher.data?.formError ? (
        <p className="generator-error-message">{deleteFetcher.data.formError}</p>
      ) : null}
    </li>
  )
}

export function GeneratorPresetPanel(props: GeneratorPresetPanelProps) {
  const { currentUser, generator, presets, returnTo, validation, values } = props
  const saveFetcher = useFetcher<PresetActionData>()
  const [presetName, setPresetName] = useState("")
  const hasValidationIssues = Object.keys(validation.issues).length > 0
  const currentComparisonKey = buildSignGeneratorPresetComparisonKey(values)
  const maybeCurrentMatchingPreset =
    presets.find((preset) => preset.comparisonKey === currentComparisonKey) ?? null
  const [initialTrackedPresetId] = useState<string | null>(
    () => maybeCurrentMatchingPreset?.id ?? null
  )
  const maybeSavedPresetId =
    saveFetcher.data?.ok &&
    saveFetcher.data.intent === "save-generator-preset" &&
    saveFetcher.data.presetId
      ? saveFetcher.data.presetId
      : null
  const maybeSaveSnapshot = !hasValidationIssues
    ? buildSignGeneratorPresetSnapshot(generator, values)
    : null
  const presetState = deriveGeneratorPresetState({
    currentComparisonKey,
    maybeTrackedPresetId:
      maybeCurrentMatchingPreset?.id ?? maybeSavedPresetId ?? initialTrackedPresetId,
    presets
  })

  return (
    <section
      className="generator-preset-shell"
      aria-labelledby="generator-preset-heading"
    >
      <div className="generator-section-head">
        <p className="eyebrow">Presets</p>
        <h2 id="generator-preset-heading">Save this setup</h2>
        <p>
          Save a named preset for this generator, keep the list nearby, and track
          whether the current values still match a saved setup.
        </p>
      </div>

      <p className="generator-preset-status" aria-live="polite">
        {presetState.kind === "saved"
          ? `Current values match "${presetState.preset.name}".`
          : presetState.kind === "edited"
            ? `Current values were edited after "${presetState.preset.name}" was saved.`
            : "Current values are not saved yet."}
      </p>

      {!currentUser ? (
        <p className="generator-preset-helper">
          Signing in only matters when you want to keep presets. The generator
          itself stays open.
        </p>
      ) : null}

      {hasValidationIssues ? (
        <p className="generator-preset-helper">
          Fix the current generator issues before saving a preset.
        </p>
      ) : null}

      <saveFetcher.Form
        action="/actions/generator-presets"
        className="generator-preset-save-form"
        method="post"
      >
        <input name="intent" type="hidden" value="save-generator-preset" />
        <input name="generatorSlug" type="hidden" value={generator.slug} />
        <input name="returnTo" type="hidden" value={returnTo} />
        <input
          name="snapshot"
          type="hidden"
          value={maybeSaveSnapshot ? JSON.stringify(maybeSaveSnapshot) : ""}
        />
        <label htmlFor="generator-preset-name">Preset name</label>
        <input
          id="generator-preset-name"
          maxLength={generatorPresetNameMaxLength}
          name="name"
          onChange={(event) => setPresetName(event.target.value)}
          placeholder="Desk sign v1"
          type="text"
          value={presetName}
        />
        <div className="generator-preset-save-actions">
          <ShimmerButton
            disabled={
              saveFetcher.state !== "idle" ||
              !presetName.trim() ||
              !maybeSaveSnapshot
            }
            type="submit"
          >
            Save Preset
          </ShimmerButton>
          {!currentUser ? (
            <Link className="home-secondary-action" prefetch="intent" to="/account?mode=sign-in">
              Sign In
            </Link>
          ) : null}
        </div>
      </saveFetcher.Form>

      {saveFetcher.data?.formError ? (
        <p className="generator-error-message">{saveFetcher.data.formError}</p>
      ) : null}

      {currentUser ? (
        presets.length > 0 ? (
          <ul className="generator-preset-list">
            {presets.map((preset) => (
              <PresetRow
                isTracked={
                  presetState.kind !== "unsaved" &&
                  presetState.preset.id === preset.id
                }
                key={preset.id}
                preset={preset}
                returnTo={returnTo}
              />
            ))}
          </ul>
        ) : (
          <p className="generator-preset-empty">
            No presets saved for this generator yet.
          </p>
        )
      ) : null}
    </section>
  )
}
