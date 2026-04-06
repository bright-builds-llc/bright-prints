import { describe, expect, it } from "vitest";

import { assessPrintLaunchCapability, buildPrintRequestContactHref } from "~/lib/prints/launch";
import { printSchema } from "~/lib/content/schema";

const physicalPrint = printSchema.parse({
  availability: "physical-print",
  categories: ["desk"],
  creatorSlug: "peter",
  description: "Physical print",
  discovery: {
    accentTone: "berry",
    catalogRank: 30,
    eyebrow: "Studio Object",
    mark: "Desk Sign"
  },
  featured: true,
  files: [],
  openSource: false,
  publishedOn: "2026-02-26",
  printDetails: {
    layerHeightMm: 0.16,
    material: "PLA",
    specialSteps: ["Best printed with a smooth top surface."]
  },
  schemaVersion: 1,
  slug: "stackable-desk-sign",
  summary: "Physical print",
  title: "Stackable Desk Sign"
});

describe("assessPrintLaunchCapability", () => {
  it("reports a supported launch action only for allowlisted hosts and file types", () => {
    // Arrange
    const options = {
      maybeFileTypeLabel: "3MF",
      maybeFileUrl: "https://www.printables.com/model/1234/files/sample-ready.3mf",
      siteOrigin: "https://www.printables.com"
    };

    // Act
    const assessment = assessPrintLaunchCapability(options);

    // Assert
    expect(assessment.maybeLaunchAction).toMatchObject({
      external: true,
      kind: "launch",
      label: "Open in PrusaSlicer"
    });
  });

  it("falls back honestly when the host is not allowlisted", () => {
    // Arrange
    const options = {
      maybeFileTypeLabel: "3MF",
      maybeFileUrl: "http://127.0.0.1:4183/prints/sample-featured-print/files/0/download",
      siteOrigin: "http://127.0.0.1:4183"
    };

    // Act
    const assessment = assessPrintLaunchCapability(options);

    // Assert
    expect(assessment.maybeLaunchAction).toBeNull();
    expect(assessment.fallbackDescription).toContain("Download the print-ready file instead.");
  });
});

describe("buildPrintRequestContactHref", () => {
  it("creates a stateless request link seeded from the print title and slug", () => {
    // Arrange
    const repositoryUrl = "git@github.com:bright-builds-llc/bright-prints.git";

    // Act
    const href = buildPrintRequestContactHref(physicalPrint, repositoryUrl);

    // Assert
    expect(href).toContain("https://github.com/bright-builds-llc/bright-prints/issues/new");
    expect(href).toContain("Physical+print+request%3A+Stackable+Desk+Sign");
    expect(href).toContain("Slug%3A+stackable-desk-sign");
  });
});
