import { useState } from "react";

import { AnimatedShinyText } from "~/components/ui/animated-shiny-text";
import { ShimmerButton } from "~/components/ui/shimmer-button";

type BuildProvenanceProps = {
  buildInfo: {
    commit: string | null;
    timestamp: string | null;
    version: string | null;
  };
};

function fallback(value: string | null) {
  return value ?? "Unavailable";
}

export function BuildProvenance({ buildInfo }: BuildProvenanceProps) {
  const [copied, setCopied] = useState(false);
  const summary = [
    `Version: ${fallback(buildInfo.version)}`,
    `Commit: ${fallback(buildInfo.commit)}`,
    `Built: ${fallback(buildInfo.timestamp)}`,
  ].join("\n");

  async function handleCopy() {
    await navigator.clipboard.writeText(summary);
    setCopied(true);
  }

  return (
    <footer aria-label="Build provenance">
      <div className="build-provenance rounded-[1.6rem]">
        <div className="build-provenance-copy">
          <p className="eyebrow">
            <AnimatedShinyText className="text-[0.8rem] font-bold tracking-[0.14em] uppercase text-accent">
              Build Provenance
            </AnimatedShinyText>
          </p>
          <dl className="build-provenance-grid">
            <div>
              <dt>Version</dt>
              <dd>{fallback(buildInfo.version)}</dd>
            </div>
            <div>
              <dt>Commit</dt>
              <dd>{fallback(buildInfo.commit)}</dd>
            </div>
            <div>
              <dt>Built</dt>
              <dd>{fallback(buildInfo.timestamp)}</dd>
            </div>
          </dl>
        </div>
        <ShimmerButton
          background="rgba(255,255,255,0.78)"
          onClick={handleCopy}
          shimmerColor="#176b5f"
          type="button"
        >
          {copied ? "Copied" : "Copy Build Summary"}
        </ShimmerButton>
      </div>
    </footer>
  );
}
