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
  const summary = [
    `Version: ${fallback(buildInfo.version)}`,
    `Commit: ${fallback(buildInfo.commit)}`,
    `Built: ${fallback(buildInfo.timestamp)}`
  ].join("\n");

  async function handleCopy(event: React.MouseEvent<HTMLButtonElement>) {
    await navigator.clipboard.writeText(summary);
    event.currentTarget.textContent = "Copied";
  }

  return (
    <footer className="build-provenance" aria-label="Build provenance">
      <div className="build-provenance-copy">
        <p className="eyebrow">Build Provenance</p>
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
      <button className="home-secondary-action" onClick={handleCopy} type="button">
        Copy Build Summary
      </button>
    </footer>
  );
}
