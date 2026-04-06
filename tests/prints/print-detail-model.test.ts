import { describe, expect, it } from "vitest";

import { buildPrintDetailModel } from "~/lib/prints/detail";
import type { PublicContentIndex } from "~/lib/content/public";
import {
  creatorSchema,
  generatorSchema,
  printSchema
} from "~/lib/content/schema";

function buildContent(prints: Array<ReturnType<typeof printSchema.parse>>): PublicContentIndex {
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
    prints
  };
}

function buildPrint(overrides: Partial<ReturnType<typeof printSchema.parse>>) {
  return printSchema.parse({
    availability: "open-source",
    categories: ["desk"],
    creatorSlug: "peter",
    description: "Fixture-backed print",
    discovery: {
      accentTone: "slate",
      catalogRank: 20,
      eyebrow: "Desk Utility",
      mark: "Cable Clip"
    },
    featured: true,
    files: [],
    openSource: true,
    publishedOn: "2026-03-18",
    printDetails: {
      layerHeightMm: 0.2,
      material: "PETG",
      specialSteps: []
    },
    schemaVersion: 1,
    slug: "cable-clip",
    summary: "Fixture-backed print",
    title: "Cable Clip",
    ...overrides
  });
}

describe("buildPrintDetailModel", () => {
  it("groups repo and external files while preferring print-ready downloads", () => {
    // Arrange
    const print = buildPrint({
      files: [
        {
          kind: "print-ready",
          label: "Print-Ready 3MF",
          purpose: "Ready for direct slicer import.",
          repoPath: "files/cable-clip-ready.3mf"
        },
        {
          externalUrl: "https://example.com/cable-clip-source.step",
          kind: "source",
          label: "Source Model STEP",
          purpose: "Editable source geometry."
        }
      ],
      license: {
        name: "CC BY 4.0",
        url: "https://creativecommons.org/licenses/by/4.0/"
      }
    });
    const relatedPrint = buildPrint({
      categories: ["desk", "utility"],
      discovery: {
        accentTone: "berry",
        catalogRank: 30,
        eyebrow: "Studio Object",
        mark: "Desk Sign"
      },
      slug: "desk-sign",
      summary: "Related print",
      title: "Desk Sign"
    });
    const content = buildContent([print, relatedPrint]);

    // Act
    const detail = buildPrintDetailModel(content, print);

    // Assert
    expect(detail.actionIntents.primary.kind).toBe("download");
    expect(detail.actionIntents.primary.label).toBe("Download Print-Ready Files");
    expect(detail.fileSections.map((section) => section.title)).toEqual([
      "Print-Ready Files",
      "Source Files"
    ]);
    expect(detail.fileSections[0]?.items[0]).toMatchObject({
      fileTypeLabel: "3MF",
      provenanceLabel: "Repo file"
    });
    expect(detail.fileSections[1]?.items[0]).toMatchObject({
      fileTypeLabel: "STEP",
      provenanceLabel: "External"
    });
    expect(detail.trustFields[0]).toMatchObject({
      isUnavailable: false,
      value: "CC BY 4.0"
    });
    expect(detail.relatedItems).toHaveLength(1);
  });

  it("keeps missing trust fields and file groups visible for physical-print only records", () => {
    // Arrange
    const print = buildPrint({
      availability: "physical-print",
      files: [],
      openSource: false,
      slug: "desk-sign",
      summary: "Physical print",
      title: "Desk Sign"
    });
    const content = buildContent([print]);

    // Act
    const detail = buildPrintDetailModel(content, print);

    // Assert
    expect(detail.actionIntents.primary.kind).toBe("request-contact");
    expect(detail.availabilityPanel.label).toBe("Physical Print");
    expect(detail.fileSections.every((section) => section.status === "unavailable")).toBe(true);
    expect(detail.fileSections.map((section) => section.description)).toEqual([
      "No print-ready files are currently shared for this print.",
      "No source files are currently shared for this print."
    ]);
    expect(detail.trustFields).toContainEqual({
      href: null,
      isUnavailable: true,
      label: "License",
      value: "Unavailable"
    });
    expect(detail.trustFields).toContainEqual({
      href: null,
      isUnavailable: true,
      label: "File Provenance",
      value: "Unavailable"
    });
    expect(detail.guidance.material).toBe("PETG");
  });

  it("keeps request-contact secondary for mixed availability when files exist", () => {
    // Arrange
    const print = buildPrint({
      availability: "both",
      files: [
        {
          kind: "print-ready",
          label: "Print-Ready 3MF",
          purpose: "Ready for slicer import.",
          repoPath: "files/sample-ready.3mf"
        }
      ],
      slug: "sample-featured-print",
      summary: "Mixed availability",
      title: "Sample Featured Print"
    });
    const content = buildContent([print]);

    // Act
    const detail = buildPrintDetailModel(content, print);

    // Assert
    expect(detail.actionIntents.primary.kind).toBe("download");
    expect(detail.actionIntents.secondary).toContainEqual({
      description: "Ask about a finished physical version without leaving the download path behind.",
      kind: "request-contact",
      label: "Ask About a Physical Print"
    });
    expect(detail.trustFields).toContainEqual({
      href: null,
      isUnavailable: true,
      label: "Source Files",
      value: "Unavailable"
    });
  });

  it("falls back to browsing when an open-source record has no files yet", () => {
    // Arrange
    const print = buildPrint({
      files: [],
      slug: "draft-open-source-print",
      summary: "No files yet",
      title: "Draft Open Source Print"
    });
    const content = buildContent([print]);

    // Act
    const detail = buildPrintDetailModel(content, print);

    // Assert
    expect(detail.actionIntents.primary).toEqual({
      description: "Browse the catalog while this print's file access remains unavailable.",
      kind: "browse-catalog",
      label: "Browse More Prints"
    });
    expect(detail.actionIntents.secondary).toEqual([]);
  });
});
