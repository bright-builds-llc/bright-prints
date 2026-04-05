import { describe, expect, it } from "vitest";

import {
  assertCreatorReferences,
  buildFoundationContent,
  type PublicContentIndex
} from "~/lib/content/public";
import { creatorSchema, generatorSchema, printSchema } from "~/lib/content/schema";

describe("content schema", () => {
  it("rejects prints without a creator slug", () => {
    // Arrange
    const invalidPrint = {
      categories: [],
      description: "Missing creator reference",
      featured: false,
      files: [],
      openSource: true,
      printDetails: { specialSteps: [] },
      schemaVersion: 1,
      slug: "missing-creator",
      summary: "Broken print",
      title: "Broken Print"
    };

    // Act
    const result = printSchema.safeParse(invalidPrint);

    // Assert
    expect(result.success).toBe(false);
  });

  it("fails when a print references an unknown creator", () => {
    // Arrange
    const content: PublicContentIndex = {
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
          description: "Generator",
          discovery: {
            accentTone: "copper",
            catalogRank: 10,
            eyebrow: "Generator",
            featuredRank: 1,
            mark: "Text to 3MF"
          },
          outputFormat: "3mf",
          parameters: [
            {
              defaultValue: 100,
              label: "Width",
              max: 200,
              min: 10,
              name: "width-mm",
              step: 1,
              type: "number",
              unit: "mm"
            }
          ],
          publishedOn: "2026-03-29",
          schemaVersion: 1,
          slug: "sign",
          summary: "Sign",
          title: "Sign Generator"
        })
      ],
      prints: [
        printSchema.parse({
          availability: "both",
          categories: [],
          creatorSlug: "nobody",
          description: "Broken reference",
          discovery: {
            accentTone: "slate",
            catalogRank: 20,
            eyebrow: "Print",
            featuredRank: 1,
            mark: "Broken"
          },
          featured: true,
          files: [],
          openSource: true,
          publishedOn: "2026-03-28",
          printDetails: { specialSteps: [] },
          schemaVersion: 1,
          slug: "broken-print",
          summary: "Broken",
          title: "Broken Print"
        })
      ]
    };

    // Act / Assert
    expect(() => assertCreatorReferences(content)).toThrow(/unknown creator/i);
  });

  it("builds a small foundation snapshot from validated content", () => {
    // Arrange
    const content: PublicContentIndex = {
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
          description: "Generator",
          discovery: {
            accentTone: "copper",
            catalogRank: 10,
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
          summary: "Sign",
          title: "Sign Generator"
        })
      ],
      prints: [
        printSchema.parse({
          availability: "open-source",
          categories: ["featured"],
          creatorSlug: "peter",
          description: "Valid",
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
          publishedOn: "2026-04-01",
          printDetails: { specialSteps: [] },
          schemaVersion: 1,
          slug: "sample",
          summary: "Summary",
          title: "Sample"
        })
      ]
    };

    // Act
    const foundation = buildFoundationContent(content);

    // Assert
    expect(foundation.creatorCount).toBe(1);
    expect(foundation.featuredPrints).toHaveLength(1);
    expect(foundation.generators).toHaveLength(1);
  });
});
