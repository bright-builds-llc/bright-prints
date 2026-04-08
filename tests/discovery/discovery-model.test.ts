import { describe, expect, it } from "vitest";

import { filterDiscoveryItems, parseDiscoveryQuery } from "~/lib/discovery/filter";
import { buildDiscoveryItems, buildHomeDiscoveryModel } from "~/lib/discovery/model";
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
        catalogRank: 40,
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
      summary: "Sign Generator",
      title: "Sign Generator"
    })
  ],
  prints: [
    printSchema.parse({
      availability: "both",
      categories: ["featured", "desk"],
      creatorSlug: "peter",
      description: "Description",
      discovery: {
        accentTone: "verdigris",
        catalogRank: 10,
        eyebrow: "Open Source Print",
        featuredRank: 1,
        mark: "Sample Print"
      },
      featured: true,
      files: [],
      openSource: true,
      printDetails: {
        material: "PLA",
        specialSteps: []
      },
      publishedOn: "2026-04-01",
      schemaVersion: 1,
      slug: "sample-featured-print",
      summary: "Summary",
      title: "Sample Featured Print"
    })
  ]
};

describe("discovery model", () => {
  it("normalizes prints and generators into one discovery list", () => {
    // Arrange / Act
    const items = buildDiscoveryItems(content);

    // Assert
    expect(items).toHaveLength(2);
    expect(items[0]?.kind).toBe("print");
    expect(items[1]?.kind).toBe("generator");
  });

  it("builds the home model from featured items", () => {
    // Arrange
    const items = buildDiscoveryItems(content);

    // Act
    const home = buildHomeDiscoveryModel(items);

    // Assert
    expect(home.heroItem.slug).toBe("sample-featured-print");
    expect(home.generatorSpotlight?.slug).toBe("sign");
  });

  it("filters a unified catalog from query params", () => {
    // Arrange
    const items = buildDiscoveryItems(content);
    const query = parseDiscoveryQuery(
      new URLSearchParams({
        q: "sign",
        type: "generators"
      })
    );

    // Act
    const filtered = filterDiscoveryItems(items, query);

    // Assert
    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.kind).toBe("generator");
  });
});
