import type {
  SignGeneratorValues,
  SignGeneratorValidation,
} from "~/lib/generators/sign";
import type { SignGeneratorDefinition } from "~/lib/content/schema";
import { LuminousPanel } from "~/components/ui/luminous-panel";
import { buildSignPreviewLayout } from "~/lib/generators/sign";

type GeneratorPreviewProps = {
  definition: SignGeneratorDefinition;
  validation: SignGeneratorValidation;
  values: SignGeneratorValues;
};

export function GeneratorPreview({
  definition,
  validation,
  values,
}: GeneratorPreviewProps) {
  const previewText = validation.sanitizedText.trim() || "SIGN";
  const layout = buildSignPreviewLayout({
    definition,
    sanitizedText: previewText,
    values,
  });

  return (
    <LuminousPanel
      aria-labelledby="generator-preview-heading"
      className="generator-preview-shell"
      tone="accent"
    >
      <div className="generator-section-head">
        <p className="eyebrow">Preview</p>
        <h2 id="generator-preview-heading">Live sign preview</h2>
        <p>
          The preview stays approximate and fast while the downloadable `3mf`
          uses the same geometry inputs.
        </p>
      </div>

      <svg
        className="generator-preview-svg"
        viewBox={`0 0 ${values.widthMm} ${values.heightMm}`}
        role="img"
      >
        <title>{`${previewText} sign preview`}</title>
        <rect
          fill="#f8fafc"
          height={values.heightMm}
          rx={values.cornerRadiusMm}
          ry={values.cornerRadiusMm}
          stroke="#176b5f"
          strokeWidth="1.2"
          width={values.widthMm}
          x="0"
          y="0"
        />
        {layout.glyphRects.map((glyphRect, index) => (
          <rect
            key={`${glyphRect.x}-${glyphRect.y}-${index}`}
            fill="#145e56"
            height={glyphRect.height}
            rx={Math.min(glyphRect.width, glyphRect.height) * 0.18}
            width={glyphRect.width}
            x={glyphRect.x}
            y={glyphRect.y}
          />
        ))}
      </svg>
    </LuminousPanel>
  );
}
