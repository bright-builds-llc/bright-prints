import { describe, expect, it } from "vitest";

import {
  buildGeneratedSignArtifact,
  buildSignPreviewLayout,
  getDefaultSignValues,
  validateSignValues
} from "~/lib/generators/sign";
import { generatorSchema } from "~/lib/content/schema";

const signGenerator = generatorSchema.parse({
  availability: "open-source",
  categories: ["signs", "customizable"],
  creatorSlug: "peter",
  definition: {
    paddingMm: 4,
    previewCellInsetRatio: 0.12,
    textReliefMm: 0.8,
    type: "sign-v1"
  },
  description: "Generator",
  discovery: {
    accentTone: "copper",
    catalogRank: 40,
    eyebrow: "Generator",
    mark: "Text to 3MF"
  },
  outputFormat: "3mf",
  parameters: [
    {
      defaultValue: "Bright Prints",
      label: "Sign Text",
      maxLength: 40,
      name: "text",
      type: "text"
    },
    {
      defaultValue: 100,
      label: "Width",
      max: 240,
      min: 40,
      name: "width-mm",
      step: 1,
      type: "number",
      unit: "mm"
    },
    {
      defaultValue: 32,
      label: "Height",
      max: 80,
      min: 16,
      name: "height-mm",
      step: 1,
      type: "number",
      unit: "mm"
    },
    {
      defaultValue: 3,
      label: "Thickness",
      max: 8,
      min: 2,
      name: "thickness-mm",
      step: 0.5,
      type: "number",
      unit: "mm"
    },
    {
      defaultValue: 4,
      label: "Corner Radius",
      max: 12,
      min: 0,
      name: "corner-radius-mm",
      step: 0.5,
      type: "number",
      unit: "mm"
    }
  ],
  publishedOn: "2026-03-29",
  schemaVersion: 1,
  slug: "sign",
  summary: "Summary",
  title: "Sign Generator"
});

describe("sign generator helpers", () => {
  it("returns defaults from the repo-backed parameter definitions", () => {
    // Arrange / Act
    const defaults = getDefaultSignValues(signGenerator);

    // Assert
    expect(defaults).toEqual({
      cornerRadiusMm: 4,
      heightMm: 32,
      text: "Bright Prints",
      thicknessMm: 3,
      widthMm: 100
    });
  });

  it("validates unsupported glyphs and out-of-range geometry", () => {
    // Arrange / Act
    const validation = validateSignValues(signGenerator, {
      cornerRadiusMm: 99,
      heightMm: 32,
      text: "Hello🙂",
      thicknessMm: 3,
      widthMm: 20
    });

    // Assert
    expect(validation.issues.text).toMatch(/letters, numbers/i);
    expect(validation.issues.widthMm).toMatch(/between 40 and 240/i);
    expect(validation.issues.cornerRadiusMm).toBeDefined();
  });

  it("builds preview geometry and a real 3mf download artifact", async () => {
    // Arrange
    const values = {
      cornerRadiusMm: 4,
      heightMm: 32,
      text: "Bright",
      thicknessMm: 3,
      widthMm: 100
    };
    const preview = buildSignPreviewLayout({
      definition: signGenerator.definition,
      sanitizedText: "BRIGHT",
      values
    });

    // Act
    const artifact = await buildGeneratedSignArtifact({
      definition: signGenerator.definition,
      generator: signGenerator,
      values
    });

    // Assert
    expect(preview.glyphRects.length).toBeGreaterThan(0);
    expect(artifact.downloadName).toMatch(/\.3mf$/);
    expect(artifact.metadata.outputFormat).toBe("3mf");
    expect(artifact.metadata.vertexCount).toBeGreaterThan(0);
    expect(artifact.metadata.triangleCount).toBeGreaterThan(0);
  });
});
