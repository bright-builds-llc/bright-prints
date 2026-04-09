import { useState } from "react";

import { LuminousPanel } from "~/components/ui/LuminousPanel";
import { ShimmerActionButton } from "~/components/ui/ShimmerAction";
import { ShimmerText } from "~/components/ui/ShimmerText";

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
    <LuminousPanel
      as="footer"
      className="build-provenance"
      tone="paper"
      aria-label="Build provenance"
    >
      <div className="build-provenance-copy">
        <p className="eyebrow">
          <ShimmerText tone="accent">Build Provenance</ShimmerText>
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
      <ShimmerActionButton onClick={handleCopy} tone="secondary" type="button">
        {copied ? "Copied" : "Copy Build Summary"}
      </ShimmerActionButton>
    </LuminousPanel>
  );
}
