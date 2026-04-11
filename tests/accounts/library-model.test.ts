import { describe, expect, it } from "vitest";

import { buildLibraryModel } from "~/lib/library/model";
import { buildSignGeneratorPresetComparisonKey } from "~/lib/generator-presets/model";
import { creatorSchema, generatorSchema, printSchema } from "~/lib/content/schema";

function buildContent() {
  return {
    creators: [
      creatorSchema.parse({
        bio: "Creator",
        displayName: "Peter Ryszkiewicz",
        schemaVersion: 1,
        slug: "peter"
      })
    ],
    generators: [
      generatorSchema.parse({
        availability: "open-source",
        categories: ["customizable"],
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
          mark: "Sign"
        },
        outputFormat: "3mf",
        parameters: [
          {
            defaultValue: "Bright Prints",
            label: "Text",
            maxLength: 40,
            name: "text",
            type: "text"
          }
        ],
        publishedOn: "2026-03-29",
        schemaVersion: 1,
        slug: "sign",
        summary: "Generator",
        title: "Sign Generator"
      })
    ],
    prints: [
      printSchema.parse({
        availability: "open-source",
        categories: ["desk"],
        creatorSlug: "peter",
        description: "Sample",
        discovery: {
          accentTone: "slate",
          catalogRank: 20,
          eyebrow: "Desk Utility",
          mark: "Clip"
        },
        featured: true,
        files: [],
        openSource: true,
        publishedOn: "2026-03-18",
        printDetails: { material: "PETG", specialSteps: [] },
        schemaVersion: 1,
        slug: "clip",
        summary: "Clip",
        title: "Clip"
      }),
      printSchema.parse({
        availability: "both",
        categories: ["desk"],
        creatorSlug: "peter",
        description: "Sign",
        discovery: {
          accentTone: "berry",
          catalogRank: 30,
          eyebrow: "Studio Object",
          mark: "Desk Sign"
        },
        featured: true,
        files: [],
        openSource: true,
        publishedOn: "2026-04-01",
        printDetails: { material: "PLA", specialSteps: [] },
        schemaVersion: 1,
        slug: "sign-print",
        summary: "Sign",
        title: "Sign Print"
      })
    ]
  };
}

describe("buildLibraryModel", () => {
  it("keeps Bookmarks first and resolves saved prints from public content", () => {
    // Arrange
    const model = buildLibraryModel({
      content: buildContent(),
      generatorPresets: [],
      maybeSelectedListId: null,
      runtimeLists: [
        {
          id: "bookmarks",
          items: [{ printSlug: "clip" }],
          kind: "BOOKMARKS",
          name: "Bookmarks"
        },
        {
          id: "custom-1",
          items: [{ printSlug: "sign-print" }],
          kind: "CUSTOM",
          name: "Desk Favorites"
        }
      ]
    });

    // Assert
    expect(model.lists[0]).toMatchObject({ isSelected: true, name: "Bookmarks" });
    expect(model.selectedList.prints[0]?.item.slug).toBe("clip");
  });

  it("builds discovery-forward empty states", () => {
    // Arrange
    const model = buildLibraryModel({
      content: buildContent(),
      generatorPresets: [],
      maybeSelectedListId: "bookmarks",
      runtimeLists: [
        {
          id: "bookmarks",
          items: [],
          kind: "BOOKMARKS",
          name: "Bookmarks"
        }
      ]
    });

    // Assert
    expect(model.emptyState).toMatchObject({
      ctaHref: "/catalog?type=prints",
      title: "Bookmarks are empty"
    });
  });

  it("builds dedicated library preset entries with deep links", () => {
    // Arrange
    const model = buildLibraryModel({
      content: buildContent(),
      generatorPresets: [
        {
          comparisonKey: buildSignGeneratorPresetComparisonKey({
            cornerRadiusMm: 6,
            heightMm: 60,
            text: "HELLO",
            thicknessMm: 4,
            widthMm: 120
          }),
          createdAt: "2026-04-11T00:00:00.000Z",
          generatorSlug: "sign",
          id: "preset-1",
          name: "Desk Sign",
          snapshot: {
            kind: "sign-v1",
            values: {
              cornerRadiusMm: 6,
              heightMm: 60,
              text: "HELLO",
              thicknessMm: 4,
              widthMm: 120
            }
          },
          summary: {
            size: "120 x 60 mm",
            text: "HELLO"
          },
          updatedAt: "2026-04-11T00:00:00.000Z"
        }
      ],
      maybeSelectedListId: "bookmarks",
      runtimeLists: [
        {
          id: "bookmarks",
          items: [],
          kind: "BOOKMARKS",
          name: "Bookmarks"
        }
      ]
    });

    // Assert
    expect(model.generatorPresets).toEqual([
      expect.objectContaining({
        generatorTitle: "Sign Generator",
        href: "/generators/sign?preset=preset-1",
        name: "Desk Sign",
        text: "HELLO"
      })
    ]);
  });
});
