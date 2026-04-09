import { useEffect, useReducer } from "react";
import { Link, useFetcher } from "react-router";

import { ShimmerButton } from "~/components/ui/shimmer-button";
import { buildGeneratorPresetStatus } from "~/lib/generator-presets/model";
import type { RuntimeGeneratorPreset } from "~/lib/generator-presets/server";
import {
  buildSuggestedSignPresetName,
  type SignGeneratorValues,
} from "~/lib/generators/sign";
import type { GeneratorPresetActionResult } from "~/routes/generator-preset";

type GeneratorPresetPanelProps = {
  currentUser: { id: string } | null;
  generatorSlug: string;
  presets: RuntimeGeneratorPreset[];
  presetsEnabled: boolean;
  returnTo: string;
  values: SignGeneratorValues;
};

type PanelState = {
  maybeTrackedPresetId: string | null;
  saveName: string;
};

type PanelAction =
  | { presetId: string | null; type: "delete-complete" }
  | { nextName: string; presetId: string | null; type: "save-complete" }
  | { saveName: string; type: "save-name-changed" };

function reducePanelState(state: PanelState, action: PanelAction): PanelState {
  switch (action.type) {
    case "delete-complete":
      return state.maybeTrackedPresetId === action.presetId
        ? { ...state, maybeTrackedPresetId: null }
        : state;
    case "save-complete":
      return {
        maybeTrackedPresetId: action.presetId,
        saveName: action.nextName,
      };
    case "save-name-changed":
      return {
        ...state,
        saveName: action.saveName,
      };
  }
}

function formatPresetTimestamp(isoTimestamp: string) {
  return new Date(isoTimestamp).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function GeneratorPresetPanel({
  currentUser,
  generatorSlug,
  presets,
  presetsEnabled,
  returnTo,
  values,
}: GeneratorPresetPanelProps) {
  const fetcher = useFetcher<GeneratorPresetActionResult>();
  const [state, dispatch] = useReducer(reducePanelState, {
    maybeTrackedPresetId: null,
    saveName: buildSuggestedSignPresetName(values),
  });
  const isMutating = fetcher.state !== "idle";
  const notice = fetcher.data?.message ?? null;
  const status = buildGeneratorPresetStatus({
    maybeTrackedPresetId: state.maybeTrackedPresetId,
    presets,
    values,
  });

  useEffect(() => {
    if (!fetcher.data?.ok) {
      return;
    }

    if (fetcher.data.intent === "save-generator-preset") {
      dispatch({
        nextName: buildSuggestedSignPresetName(values),
        presetId: fetcher.data.presetId,
        type: "save-complete",
      });
      return;
    }

    if (fetcher.data.intent === "delete-generator-preset") {
      dispatch({
        presetId: fetcher.data.presetId,
        type: "delete-complete",
      });
    }
  }, [fetcher.data, values]);

  return (
    <section
      aria-labelledby="generator-presets-heading"
      className="generator-presets-shell"
    >
      <div className="generator-section-head">
        <p className="eyebrow">Presets</p>
        <h2 id="generator-presets-heading">Saved generator presets</h2>
        <p>
          Save named generator setups, rename them in place, and keep the
          current state readable while you iterate.
        </p>
      </div>

      {!presetsEnabled ? (
        <p className="generator-status-message">
          Saved presets are unavailable until `DATABASE_URL` and
          `SESSION_SECRET` are configured for this environment.
        </p>
      ) : (
        <>
          <div
            className={`generator-preset-status generator-preset-status-${status.kind}`}
          >
            <strong>{status.label}</strong>
            <span>{status.detail}</span>
          </div>

          {notice ? (
            <p aria-live="polite" className="generator-status-message">
              {notice}
            </p>
          ) : null}

          <fetcher.Form
            action="/actions/generator-preset"
            className="generator-preset-save-form"
            method="post"
          >
            <input name="intent" type="hidden" value="save-generator-preset" />
            <input name="generatorSlug" type="hidden" value={generatorSlug} />
            <input name="returnTo" type="hidden" value={returnTo} />
            <input name="text" type="hidden" value={values.text} />
            <input name="widthMm" type="hidden" value={values.widthMm} />
            <input name="heightMm" type="hidden" value={values.heightMm} />
            <input
              name="thicknessMm"
              type="hidden"
              value={values.thicknessMm}
            />
            <input
              name="cornerRadiusMm"
              type="hidden"
              value={values.cornerRadiusMm}
            />

            <div className="generator-field">
              <label htmlFor="preset-name">Preset name</label>
              <input
                disabled={isMutating}
                id="preset-name"
                name="name"
                onChange={(event) =>
                  dispatch({
                    saveName: event.target.value,
                    type: "save-name-changed",
                  })
                }
                type="text"
                value={state.saveName}
              />
              <p className="generator-field-note">
                {currentUser
                  ? "Use a short label you can recognize later."
                  : "Sign in to save the current generator setup to your account."}
              </p>
            </div>

            <div className="generator-form-actions">
              <ShimmerButton disabled={isMutating} type="submit">
                {currentUser ? "Save preset" : "Sign in to save"}
              </ShimmerButton>
              {!currentUser ? (
                <Link
                  className="home-secondary-action"
                  prefetch="intent"
                  to="/account?mode=sign-in"
                >
                  Open account
                </Link>
              ) : null}
            </div>
          </fetcher.Form>

          {currentUser ? (
            presets.length > 0 ? (
              <div className="generator-preset-list">
                {presets.map((preset) => {
                  const isCurrentPreset = status.presetId === preset.id;
                  const badgeLabel =
                    status.kind === "edited" && isCurrentPreset
                      ? "Edited"
                      : isCurrentPreset
                        ? "Current"
                        : null;

                  return (
                    <article
                      className="generator-preset-card"
                      key={`${preset.id}-${preset.name}`}
                    >
                      <div className="generator-preset-card-head">
                        <div>
                          <h3>{preset.name}</h3>
                          <p>{preset.summary}</p>
                        </div>
                        {badgeLabel ? (
                          <span className="generator-preset-badge">
                            {badgeLabel}
                          </span>
                        ) : null}
                      </div>

                      <p className="generator-field-note">
                        Updated {formatPresetTimestamp(preset.updatedAt)}
                      </p>

                      <div className="generator-preset-actions">
                        <fetcher.Form
                          action="/actions/generator-preset"
                          className="generator-preset-inline-form"
                          method="post"
                        >
                          <input
                            name="intent"
                            type="hidden"
                            value="rename-generator-preset"
                          />
                          <input
                            name="presetId"
                            type="hidden"
                            value={preset.id}
                          />
                          <input
                            name="returnTo"
                            type="hidden"
                            value={returnTo}
                          />
                          <label
                            className="sr-only"
                            htmlFor={`rename-${preset.id}`}
                          >
                            Rename {preset.name}
                          </label>
                          <input
                            defaultValue={preset.name}
                            disabled={isMutating}
                            id={`rename-${preset.id}`}
                            name="name"
                            type="text"
                          />
                          <button
                            className="generator-preset-action"
                            disabled={isMutating}
                            type="submit"
                          >
                            Rename
                          </button>
                        </fetcher.Form>

                        <fetcher.Form
                          action="/actions/generator-preset"
                          method="post"
                        >
                          <input
                            name="intent"
                            type="hidden"
                            value="delete-generator-preset"
                          />
                          <input
                            name="presetId"
                            type="hidden"
                            value={preset.id}
                          />
                          <input
                            name="returnTo"
                            type="hidden"
                            value={returnTo}
                          />
                          <button
                            className="generator-preset-action generator-preset-action-danger"
                            disabled={isMutating}
                            type="submit"
                          >
                            Delete
                          </button>
                        </fetcher.Form>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <p className="generator-status-message">
                No presets saved yet. Save the current setup to keep a reusable
                starting point on your account.
              </p>
            )
          ) : null}
        </>
      )}
    </section>
  );
}
