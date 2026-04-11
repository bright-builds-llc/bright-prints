import type { PrintDetailGuidance, PrintDetailHero } from "~/lib/prints/detail";
import { LuminousPanel } from "~/components/ui/luminous-panel";

type PrintSpecsSectionProps = {
  guidance: PrintDetailGuidance;
  hero: PrintDetailHero;
};

export function PrintSpecsSection({ guidance, hero }: PrintSpecsSectionProps) {
  const categories =
    hero.categories.length > 0 ? hero.categories.join(", ") : "Unavailable";

  return (
    <LuminousPanel
      aria-labelledby="print-specs-heading"
      className="print-specs-section"
      tone="accent"
    >
      <div className="print-section-head">
        <p className="eyebrow">Print Guidance</p>
        <h2 id="print-specs-heading">Model details and settings</h2>
      </div>

      <dl className="print-spec-grid">
        <div>
          <dt>Creator</dt>
          <dd>{hero.creatorName}</dd>
        </div>
        <div>
          <dt>Published</dt>
          <dd>{hero.publishedOn}</dd>
        </div>
        <div>
          <dt>Categories</dt>
          <dd>{categories}</dd>
        </div>
        <div>
          <dt>Material</dt>
          <dd>{guidance.material}</dd>
        </div>
        <div>
          <dt>Layer Height</dt>
          <dd>{guidance.layerHeight}</dd>
        </div>
      </dl>

      {guidance.specialSteps.length > 0 ? (
        <section
          className="print-special-steps"
          aria-labelledby="print-special-steps-heading"
        >
          <p className="eyebrow">Special Steps</p>
          <h3 id="print-special-steps-heading">
            Worth checking before you print
          </h3>
          <ul>
            {guidance.specialSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </LuminousPanel>
  );
}
