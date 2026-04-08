import { describe, expect, it, vi } from "vitest";

import { buildCommerceIntentMetadata, createCommerceInterest } from "~/lib/commerce/intent.server";
import { printSchema } from "~/lib/content/schema";

const physicalPrint = printSchema.parse({
  availability: "physical-print",
  categories: ["desk"],
  commerce: {
    interestMode: "interest",
    leadTime: "7-10 business days",
    notes: "Use the request flow to ask about a finished physical version.",
    provider: "direct",
    reference: "stackable-desk-sign"
  },
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

describe("commerce intent helpers", () => {
  it("builds provider-agnostic metadata from the public print record", () => {
    // Arrange / Act
    const metadata = buildCommerceIntentMetadata(physicalPrint);

    // Assert
    expect(metadata).toEqual({
      availability: "physical-print",
      commerce: physicalPrint.commerce,
      title: "Stackable Desk Sign"
    });
  });

  it("creates an interest record with the public commerce snapshot", async () => {
    // Arrange
    const create = vi.fn().mockResolvedValue({ id: "intent-1" });

    // Act
    await createCommerceInterest({
      contact: "person@example.com",
      db: { commerceIntent: { create } } as never,
      note: "Need this for a desk setup.",
      print: physicalPrint,
      userId: "user-1"
    });

    // Assert
    expect(create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        contact: "person@example.com",
        printSlug: "stackable-desk-sign",
        provider: "direct",
        status: "interest",
        userId: "user-1"
      })
    });
    expect(create.mock.calls[0]?.[0]?.data.metadata).toMatchObject({
      availability: "physical-print",
      note: "Need this for a desk setup.",
      title: "Stackable Desk Sign"
    });
  });
});
