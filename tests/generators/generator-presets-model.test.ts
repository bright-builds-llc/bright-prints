import { describe, expect, it } from "vitest";

import { buildGeneratorPresetStatus } from "~/lib/generator-presets/model";

describe("generator preset status model", () => {
  const presets = [
    {
      createdAt: "2026-04-09T00:00:00.000Z",
      generatorSlug: "sign",
      id: "preset-1",
      name: "Desk sign",
      summary: "Desk · 120 x 40 mm · 3 mm thick",
      updatedAt: "2026-04-09T00:00:00.000Z",
      values: {
        cornerRadiusMm: 4,
        heightMm: 40,
        text: "Desk",
        thicknessMm: 3,
        widthMm: 120,
      },
    },
  ];

  it("marks exact tracked matches as saved", () => {
    // Arrange
    const values = {
      cornerRadiusMm: 4,
      heightMm: 40,
      text: "Desk",
      thicknessMm: 3,
      widthMm: 120,
    };

    // Act
    const result = buildGeneratorPresetStatus({
      maybeTrackedPresetId: "preset-1",
      presets,
      values,
    });

    // Assert
    expect(result).toEqual({
      detail: "Current generator values exactly match the last saved preset.",
      kind: "saved",
      label: "Saved as Desk sign",
      presetId: "preset-1",
    });
  });

  it("marks diverged tracked presets as edited", () => {
    // Arrange
    const values = {
      cornerRadiusMm: 4,
      heightMm: 50,
      text: "Desk",
      thicknessMm: 3,
      widthMm: 120,
    };

    // Act
    const result = buildGeneratorPresetStatus({
      maybeTrackedPresetId: "preset-1",
      presets,
      values,
    });

    // Assert
    expect(result).toEqual({
      detail:
        "Current generator values have changed since the last saved preset.",
      kind: "edited",
      label: "Edited from Desk sign",
      presetId: "preset-1",
    });
  });

  it("marks unmatched values as unsaved", () => {
    // Arrange
    const values = {
      cornerRadiusMm: 2,
      heightMm: 30,
      text: "New",
      thicknessMm: 2,
      widthMm: 90,
    };

    // Act
    const result = buildGeneratorPresetStatus({
      maybeTrackedPresetId: null,
      presets,
      values,
    });

    // Assert
    expect(result).toEqual({
      detail: "Save the current configuration to keep it tied to your account.",
      kind: "unsaved",
      label: "Unsaved configuration",
      presetId: null,
    });
  });
});
