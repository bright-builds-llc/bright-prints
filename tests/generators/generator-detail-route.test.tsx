import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createMemoryRouter, RouterProvider } from "react-router";
import { describe, expect, it } from "vitest";

import { GeneratorPresetPanel } from "~/components/generator/GeneratorPresetPanel";
import { generatorSchema } from "~/lib/content/schema";
import {
  buildSignGeneratorPresetComparisonKey,
  buildSignGeneratorPresetSnapshot,
} from "~/lib/generator-presets/model";

const signGenerator = generatorSchema.parse({
  availability: "open-source",
  categories: ["signage"],
  creatorSlug: "bright-builds",
  definition: {
    type: "sign-v1",
  },
  description: "Generator",
  discovery: {
    accentTone: "verdigris",
    catalogRank: 1,
    eyebrow: "Generator",
    mark: "BP",
  },
  outputFormat: "3mf",
  parameters: [
    {
      defaultValue: "HELLO",
      label: "Text",
      maxLength: 12,
      name: "text",
      type: "text",
    },
    {
      defaultValue: 120,
      label: "Width",
      max: 200,
      min: 60,
      name: "width-mm",
      type: "number",
      unit: "mm",
    },
    {
      defaultValue: 60,
      label: "Height",
      max: 120,
      min: 30,
      name: "height-mm",
      type: "number",
      unit: "mm",
    },
    {
      defaultValue: 4,
      label: "Thickness",
      max: 12,
      min: 2,
      name: "thickness-mm",
      type: "number",
      unit: "mm",
    },
    {
      defaultValue: 6,
      label: "Corner Radius",
      max: 20,
      min: 0,
      name: "corner-radius-mm",
      type: "number",
      unit: "mm",
    },
  ],
  publishedOn: "2026-04-08",
  schemaVersion: 1,
  slug: "sign",
  summary: "Generator",
  title: "Sign Generator",
});

describe("generator preset panel", () => {
  it("renders saved-state copy and preset summaries for signed-in users", () => {
    // Arrange
    const snapshot = buildSignGeneratorPresetSnapshot(signGenerator, {
      cornerRadiusMm: 6,
      heightMm: 60,
      text: "HELLO",
      thicknessMm: 4,
      widthMm: 120,
    });
    const router = createMemoryRouter(
      [
        {
          element: createElement(GeneratorPresetPanel, {
            currentUser: { id: "user-1" },
            generator: signGenerator,
            maybeTrackedPresetId: "preset-1",
            presets: [
              {
                comparisonKey: buildSignGeneratorPresetComparisonKey(
                  snapshot.values,
                ),
                createdAt: "2026-04-11T00:00:00.000Z",
                generatorSlug: "sign",
                id: "preset-1",
                name: "Desk Sign",
                snapshot,
                summary: {
                  size: "120 x 60 mm",
                  text: "HELLO",
                },
                updatedAt: "2026-04-11T00:00:00.000Z",
              },
            ],
            returnTo: "/generators/sign",
            validation: {
              issues: {},
              sanitizedText: "HELLO",
            },
            values: snapshot.values,
          }),
          path: "/generators/sign",
        },
        {
          action: async () => null,
          path: "/actions/generator-presets",
        },
      ],
      { initialEntries: ["/generators/sign"] },
    );

    // Act
    const markup = renderToStaticMarkup(
      createElement(RouterProvider, { router }),
    );

    // Assert
    expect(markup).toContain("Current values match &quot;Desk Sign&quot;.");
    expect(markup).toContain("Desk Sign");
    expect(markup).toContain("HELLO");
    expect(markup).toContain("/generators/sign?preset=preset-1");
    expect(markup).toContain("Open Preset");
    expect(markup).toContain("luminous-panel");
  });
});
