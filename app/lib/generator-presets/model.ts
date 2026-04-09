import type { RuntimeGeneratorPreset } from "~/lib/generator-presets/server";
import {
  areSignGeneratorValuesEqual,
  type SignGeneratorValues,
} from "~/lib/generators/sign";

export type GeneratorPresetStatus =
  | {
      detail: string;
      kind: "edited";
      label: string;
      presetId: string;
    }
  | {
      detail: string;
      kind: "saved";
      label: string;
      presetId: string;
    }
  | {
      detail: string;
      kind: "unsaved";
      label: string;
      presetId: null;
    };

export function buildGeneratorPresetStatus(options: {
  maybeTrackedPresetId: string | null;
  presets: RuntimeGeneratorPreset[];
  values: SignGeneratorValues;
}): GeneratorPresetStatus {
  const { maybeTrackedPresetId, presets, values } = options;
  const maybeTrackedPreset = maybeTrackedPresetId
    ? presets.find((preset) => preset.id === maybeTrackedPresetId)
    : null;
  const maybeMatchingPreset = presets.find((preset) =>
    areSignGeneratorValuesEqual(preset.values, values),
  );

  if (
    maybeTrackedPreset &&
    areSignGeneratorValuesEqual(maybeTrackedPreset.values, values)
  ) {
    return {
      detail: "Current generator values exactly match the last saved preset.",
      kind: "saved",
      label: `Saved as ${maybeTrackedPreset.name}`,
      presetId: maybeTrackedPreset.id,
    };
  }

  if (maybeTrackedPreset) {
    return {
      detail:
        "Current generator values have changed since the last saved preset.",
      kind: "edited",
      label: `Edited from ${maybeTrackedPreset.name}`,
      presetId: maybeTrackedPreset.id,
    };
  }

  if (maybeMatchingPreset) {
    return {
      detail: "Current generator values match an existing saved preset.",
      kind: "saved",
      label: `Saved as ${maybeMatchingPreset.name}`,
      presetId: maybeMatchingPreset.id,
    };
  }

  return {
    detail: "Save the current configuration to keep it tied to your account.",
    kind: "unsaved",
    label: "Unsaved configuration",
    presetId: null,
  };
}
