import { describe, expect, it } from "vitest";

import { filterDiscoveryItems, parseDiscoveryQuery } from "~/lib/discovery/filter";
import { buildDiscoveryItems } from "~/lib/discovery/model";
import type { PublicContentIndex } from "~/lib/content/public";
import { creatorSchema, generatorSchema, printSchema } from "~/lib/content/schema";

const content: PublicContentIndex = {
  creators: [
    creatorSchema.parse({
      bio: "Maker",
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
        catalogRank: 30,
        eyebrow: "Generator",
        featuredRank: 1,
        mark: "Text to 3MF"
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
      summary: "Sign generator",
      title: "Sign Generator"
    })
  ],
  prints: [
    printSchema.parse({
      availability: "both",
      categories: ["desk", "featured"],
      creatorSlug: "peter",
      description: "Desk sign",
      discovery: {
        accentTone: "verdigris",
        catalogRank: 10,
        eyebrow: "Open Source Print",
        featuredRank: 1,
        mark: "Sample"
      },
      featured: true,
      files: [],
      openSource: true,
      printDetails: { specialSteps: [] },
      publishedOn: "2026-04-01",
      schemaVersion: 1,
      slug: "sample-featured-print",
      summary: "Desk object",
      title: "Sample Featured Print"
    })
  ]
};

describe("catalog routing", () => {
  it("keeps filter state inside URL search params", () => {
    // Arrange / Act
    const query = parseDiscoveryQuery(
      new URLSearchParams({
        availability: "open-source",
        q: "desk",
        sort: "title",
        type: "prints"
      })
    );

    // Assert
    expect(query.type).toBe("prints");
    expect(query.availability).toBe("open-source");
    expect(query.sort).toBe("title");
    expect(query.q).toBe("desk");
  });

  it("filters the unified catalog through query state", () => {
    // Arrange
    const items = buildDiscoveryItems(content);
    const query = parseDiscoveryQuery(
      new URLSearchParams({
        type: "prints",
        category: "desk"
      })
    );

    // Act
    const filtered = filterDiscoveryItems(items, query);

    // Assert
    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.href).toBe("/prints/sample-featured-print");
  });
});
