import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { BuildProvenance } from "~/components/chrome/BuildProvenance";
import { SectionHeading } from "~/components/discovery/SectionHeading";
import { GeneratedArtifactPanel } from "~/components/generator/GeneratedArtifactPanel";
import { AnimatedShinyText } from "~/components/ui/animated-shiny-text";
import { ShimmerButton } from "~/components/ui/shimmer-button";

describe("Phase 8 Magic UI primitives", () => {
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
});
