import { beforeEach, describe, expect, it, vi } from "vitest";

import { printSchema } from "~/lib/content/schema";

function buildActionRequest(formValues: Record<string, string>) {
  const formData = new FormData();

  for (const [key, value] of Object.entries(formValues)) {
    formData.set(key, value);
  }

  return new Request("http://example.com/actions/commerce-interest", {
    body: formData,
    method: "POST",
  });
}

const physicalPrint = printSchema.parse({
  availability: "physical-print",
  categories: ["desk"],
  commerce: {
    interestMode: "interest",
    leadTime: "7-10 business days",
    notes: "Use the request flow to ask about a finished physical version.",
    provider: "direct",
    reference: "stackable-desk-sign",
  },
  creatorSlug: "peter",
  description: "Physical print",
  discovery: {
    accentTone: "berry",
    catalogRank: 30,
    eyebrow: "Studio Object",
    mark: "Desk Sign",
  },
  featured: true,
  files: [],
  openSource: false,
  publishedOn: "2026-02-26",
  printDetails: {
    layerHeightMm: 0.16,
    material: "PLA",
    specialSteps: ["Best printed with a smooth top surface."],
  },
  schemaVersion: 1,
  slug: "stackable-desk-sign",
  summary: "Physical print",
  title: "Stackable Desk Sign",
});

describe("commerce interest route", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("rejects invalid email submissions before touching the runtime services", async () => {
    // Arrange
    const loadPublicContent = vi.fn();
    vi.doMock("~/lib/content/load.server", () => ({ loadPublicContent }));
    const { action } = await import("~/routes/commerce-interest");

    // Act
    const response = await action({
      context: {} as never,
      params: {},
      request: buildActionRequest({
        contact: "not-an-email",
        note: "Desk setup",
        printSlug: "stackable-desk-sign",
      }),
      unstable_pattern: "/actions/commerce-interest" as never,
      unstable_url: new URL("http://example.com/actions/commerce-interest"),
    } as never);

    // Assert
    expect(response.init?.status).toBe(400);
    expect(response.data).toEqual({
      message:
        "Enter a valid email address before sending a physical-print request.",
      ok: false,
    });
    expect(loadPublicContent).not.toHaveBeenCalled();
  });

  it("records an interest request for configured physical-print records", async () => {
    // Arrange
    const createCommerceInterest = vi
      .fn()
      .mockResolvedValue({ id: "intent-1" });
    const getCurrentUserFromRequest = vi
      .fn()
      .mockResolvedValue({ id: "user-1" });
    const getDb = vi.fn().mockReturnValue({ commerceIntent: {} });

    vi.doMock("~/lib/commerce/intent.server", () => ({
      createCommerceInterest,
    }));
    vi.doMock("~/lib/content/load.server", () => ({
      loadPublicContent: vi.fn().mockResolvedValue({ prints: [physicalPrint] }),
    }));
    vi.doMock("~/lib/content/public", () => ({
      findPrintBySlug: vi.fn().mockReturnValue(physicalPrint),
    }));
    vi.doMock("~/lib/auth/session.server", () => ({
      getCurrentUserFromRequest,
    }));
    vi.doMock("~/lib/db.server", () => ({
      getDb,
    }));

    const { action } = await import("~/routes/commerce-interest");

    // Act
    const response = await action({
      context: {} as never,
      params: {},
      request: buildActionRequest({
        contact: "person@example.com",
        note: "Need one for the front desk.",
        printSlug: "stackable-desk-sign",
      }),
      unstable_pattern: "/actions/commerce-interest" as never,
      unstable_url: new URL("http://example.com/actions/commerce-interest"),
    } as never);

    // Assert
    expect(response.data).toEqual({
      message: "Interest request sent. We will follow up by email.",
      ok: true,
    });
    expect(getCurrentUserFromRequest).toHaveBeenCalledOnce();
    expect(getDb).toHaveBeenCalledOnce();
    expect(createCommerceInterest).toHaveBeenCalledWith({
      contact: "person@example.com",
      db: { commerceIntent: {} },
      note: "Need one for the front desk.",
      print: physicalPrint,
      userId: "user-1",
    });
  });
});
