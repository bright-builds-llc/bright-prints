import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createMemoryRouter, RouterProvider } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockUseReducedMotion } = vi.hoisted(() => ({
  mockUseReducedMotion: vi.fn(() => false),
}));

vi.mock("motion/react", async () => {
  const actual =
    await vi.importActual<typeof import("motion/react")>("motion/react");

  return {
    ...actual,
    useReducedMotion: mockUseReducedMotion,
  };
});

import { BuildProvenance } from "~/components/chrome/BuildProvenance";
import { SectionHeading } from "~/components/discovery/SectionHeading";
import { GeneratedArtifactPanel } from "~/components/generator/GeneratedArtifactPanel";
import { GeneratorPreview } from "~/components/generator/GeneratorPreview";
import { LibraryPresetSection } from "~/components/library/LibraryPresetSection";
import { PrintTrustSection } from "~/components/print-detail/PrintTrustSection";
import { AnimatedShinyText } from "~/components/ui/animated-shiny-text";
import { LuminousPanel } from "~/components/ui/luminous-panel";
import { ShimmerButton } from "~/components/ui/shimmer-button";

describe("Phase 8 Magic UI primitives", () => {
  beforeEach(() => {
    mockUseReducedMotion.mockReturnValue(false);
  });

  it("renders installed Magic UI button primitives", () => {
    // Arrange / Act
    const buttonMarkup = renderToStaticMarkup(
      createElement(ShimmerButton, { type: "button" }, "Do thing"),
    );

    // Assert
    expect(buttonMarkup).toContain("animate-shimmer-slide");
  });

  it("renders installed Magic UI shiny text", () => {
    // Arrange / Act
    const textMarkup = renderToStaticMarkup(
      createElement(
        AnimatedShinyText,
        { className: "text-accent" },
        "Accent text",
      ),
    );

    // Assert
    expect(textMarkup).toContain("animate-shiny-text");
  });

  it("includes reduced-motion fallbacks for shimmer text and buttons", () => {
    // Arrange / Act
    const buttonMarkup = renderToStaticMarkup(
      createElement(ShimmerButton, { type: "button" }, "Do thing"),
    );
    const textMarkup = renderToStaticMarkup(
      createElement(AnimatedShinyText, null, "Accent text"),
    );

    // Assert
    expect(buttonMarkup).toContain("motion-reduce:hidden");
    expect(buttonMarkup).toContain("motion-reduce:transition-none");
    expect(textMarkup).toContain("motion-reduce:animate-none");
    expect(textMarkup).toContain("motion-reduce:bg-none");
  });

  it("adopts the new primitives on shared discovery, generator, and shell surfaces", () => {
    // Arrange / Act
    const sectionMarkup = renderToStaticMarkup(
      createElement(SectionHeading, {
        body: "Body copy",
        eyebrow: "Generator Spotlight",
        title: "Shared heading",
      }),
    );
    const artifactMarkup = renderToStaticMarkup(
      createElement(GeneratedArtifactPanel, {
        artifact: null,
        statusMessage: null,
      }),
    );
    const provenanceMarkup = renderToStaticMarkup(
      createElement(BuildProvenance, {
        buildInfo: {
          commit: null,
          timestamp: null,
          version: null,
        },
      }),
    );

    // Assert
    expect(sectionMarkup).toContain("animate-shiny-text");
    expect(artifactMarkup).toContain("Generated artifact");
    expect(provenanceMarkup).toContain("animate-shimmer-slide");
  });

  it("renders the shared luminous panel wrapper without extra providers", () => {
    // Arrange / Act
    const panelMarkup = renderToStaticMarkup(
      createElement(
        LuminousPanel,
        { className: "test-panel", tone: "accent" },
        createElement("p", null, "Panel body"),
      ),
    );

    // Assert
    expect(panelMarkup).toContain("luminous-panel");
    expect(panelMarkup).toContain("Panel body");
  });

  it("uses a static shared panel treatment when reduced motion is preferred", () => {
    // Arrange
    mockUseReducedMotion.mockReturnValue(true);

    // Act
    const panelMarkup = renderToStaticMarkup(
      createElement(
        LuminousPanel,
        { className: "test-panel", tone: "accent" },
        createElement("p", null, "Panel body"),
      ),
    );

    // Assert
    expect(panelMarkup).toContain('data-reduced-motion="true"');
    expect(panelMarkup).toContain("Panel body");
  });

  it("applies the shared surface layer to generator, library, and print-detail sections", () => {
    // Arrange / Act
    const previewMarkup = renderToStaticMarkup(
      createElement(GeneratorPreview, {
        definition: {
          paddingMm: 4,
          previewCellInsetRatio: 0.12,
          textReliefMm: 0.8,
          type: "sign-v1",
        },
        validation: {
          issues: {},
          sanitizedText: "HELLO",
        },
        values: {
          cornerRadiusMm: 6,
          heightMm: 60,
          text: "HELLO",
          thicknessMm: 4,
          widthMm: 120,
        },
      }),
    );
    const presetRouter = createMemoryRouter(
      [
        {
          element: createElement(LibraryPresetSection, {
            presets: [
              {
                generatorSlug: "sign",
                generatorTitle: "Sign Generator",
                href: "/generators/sign?preset=preset-1",
                id: "preset-1",
                name: "Desk Sign",
                size: "120 x 60 mm",
                text: "HELLO",
                updatedAt: "2026-04-11T00:00:00.000Z",
              },
            ],
          }),
          path: "/library",
        },
      ],
      { initialEntries: ["/library"] },
    );
    const presetMarkup = renderToStaticMarkup(
      createElement(RouterProvider, { router: presetRouter }),
    );
    const trustMarkup = renderToStaticMarkup(
      createElement(PrintTrustSection, {
        fields: [
          {
            href: null,
            isUnavailable: true,
            label: "License",
            value: "Unavailable",
          },
        ],
      }),
    );

    // Assert
    expect(previewMarkup).toContain("luminous-panel");
    expect(previewMarkup).toContain("Live sign preview");
    expect(presetMarkup).toContain("luminous-panel");
    expect(presetMarkup).toContain("Resume saved generator work");
    expect(trustMarkup).toContain("luminous-panel");
    expect(trustMarkup).toContain("Know what is here and what is not");
  });

  it("keeps generator, library, and print-detail shared panels readable under reduced motion", () => {
    // Arrange
    mockUseReducedMotion.mockReturnValue(true);

    // Act
    const previewMarkup = renderToStaticMarkup(
      createElement(GeneratorPreview, {
        definition: {
          paddingMm: 4,
          previewCellInsetRatio: 0.12,
          textReliefMm: 0.8,
          type: "sign-v1",
        },
        validation: {
          issues: {},
          sanitizedText: "HELLO",
        },
        values: {
          cornerRadiusMm: 6,
          heightMm: 60,
          text: "HELLO",
          thicknessMm: 4,
          widthMm: 120,
        },
      }),
    );
    const presetRouter = createMemoryRouter(
      [
        {
          element: createElement(LibraryPresetSection, {
            presets: [
              {
                generatorSlug: "sign",
                generatorTitle: "Sign Generator",
                href: "/generators/sign?preset=preset-1",
                id: "preset-1",
                name: "Desk Sign",
                size: "120 x 60 mm",
                text: "HELLO",
                updatedAt: "2026-04-11T00:00:00.000Z",
              },
            ],
          }),
          path: "/library",
        },
      ],
      { initialEntries: ["/library"] },
    );
    const presetMarkup = renderToStaticMarkup(
      createElement(RouterProvider, { router: presetRouter }),
    );
    const trustMarkup = renderToStaticMarkup(
      createElement(PrintTrustSection, {
        fields: [
          {
            href: null,
            isUnavailable: true,
            label: "License",
            value: "Unavailable",
          },
        ],
      }),
    );

    // Assert
    expect(previewMarkup).toContain('data-reduced-motion="true"');
    expect(previewMarkup).toContain("Live sign preview");
    expect(presetMarkup).toContain('data-reduced-motion="true"');
    expect(presetMarkup).toContain("Resume saved generator work");
    expect(trustMarkup).toContain('data-reduced-motion="true"');
    expect(trustMarkup).toContain("Know what is here and what is not");
  });
});
