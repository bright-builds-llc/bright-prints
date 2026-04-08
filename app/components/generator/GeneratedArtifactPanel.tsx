import type { GeneratedSignArtifact } from "~/lib/generators/sign";

type GeneratedArtifactPanelProps = {
  artifact: GeneratedSignArtifact | null;
  statusMessage: string | null;
};

export function GeneratedArtifactPanel({
  artifact,
  statusMessage
}: GeneratedArtifactPanelProps) {
  return (
    <section className="generator-artifact-shell" aria-labelledby="generator-artifact-heading">
      <div className="generator-section-head">
        <p className="eyebrow">Output</p>
        <h2 id="generator-artifact-heading">Generated artifact</h2>
      </div>

      <p aria-live="polite" className="generator-status-message">
        {statusMessage ?? "Generate a sign to see the downloadable artifact and metadata."}
      </p>

      {artifact ? (
        <div className="generator-artifact-card">
          <a className="home-primary-action" download={artifact.downloadName} href={artifact.objectUrl}>
            Download 3MF
          </a>
          <dl className="generator-metadata-grid">
            <div>
              <dt>Text</dt>
              <dd>{artifact.metadata.text}</dd>
            </div>
            <div>
              <dt>Size</dt>
              <dd>{`${artifact.metadata.widthMm} x ${artifact.metadata.heightMm} mm`}</dd>
            </div>
            <div>
              <dt>Thickness</dt>
              <dd>{`${artifact.metadata.thicknessMm} mm`}</dd>
            </div>
            <div>
              <dt>Corner Radius</dt>
              <dd>{`${artifact.metadata.cornerRadiusMm} mm`}</dd>
            </div>
            <div>
              <dt>Vertices</dt>
              <dd>{artifact.metadata.vertexCount}</dd>
            </div>
            <div>
              <dt>Triangles</dt>
              <dd>{artifact.metadata.triangleCount}</dd>
            </div>
            <div>
              <dt>Generated</dt>
              <dd>{artifact.metadata.generatedAt}</dd>
            </div>
            <div>
              <dt>Format</dt>
              <dd>{artifact.metadata.outputFormat.toUpperCase()}</dd>
            </div>
          </dl>
        </div>
      ) : null}
    </section>
  );
}
