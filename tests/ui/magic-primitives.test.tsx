import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { BuildProvenance } from "~/components/chrome/BuildProvenance";
import { SectionHeading } from "~/components/discovery/SectionHeading";
import { GeneratedArtifactPanel } from "~/components/generator/GeneratedArtifactPanel";
import {
  ShimmerActionAnchor,
  ShimmerActionButton,
} from "~/components/ui/ShimmerAction";
import { LuminousPanel } from "~/components/ui/LuminousPanel";
import { ShimmerText } from "~/components/ui/ShimmerText";

describe("Phase 8 Magic UI primitives", () => {
  it("renders a repo-owned luminous panel primitive", () => {
    // Arrange / Act
    const markup = renderToStaticMarkup(
      createElement(LuminousPanel, {
        as: "section",
        children: createElement("p", { children: "Panel content" }),
        className: "example-panel",
        tone: "accent",
      }),
    );

    // Assert
    expect(markup).toContain("luminous-panel");
    expect(markup).toContain("luminous-panel--accent");
    expect(markup).toContain("example-panel");
  });

  it("renders shared shimmer text and action primitives", () => {
    // Arrange / Act
    const textMarkup = renderToStaticMarkup(
      createElement(ShimmerText, { children: "Accent text", tone: "accent" }),
    );
    const buttonMarkup = renderToStaticMarkup(
      createElement(ShimmerActionButton, {
        children: "Do thing",
        tone: "primary",
        type: "button",
      }),
    );
    const anchorMarkup = renderToStaticMarkup(
      createElement(ShimmerActionAnchor, {
        children: "Open thing",
        href: "/example",
        tone: "secondary",
      }),
    );

    // Assert
    expect(textMarkup).toContain("shimmer-text");
    expect(buttonMarkup).toContain("ui-action--primary");
    expect(anchorMarkup).toContain("ui-action--secondary");
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
    expect(sectionMarkup).toContain("shimmer-text");
    expect(artifactMarkup).toContain("luminous-panel");
    expect(provenanceMarkup).toContain("luminous-panel");
  });
});
