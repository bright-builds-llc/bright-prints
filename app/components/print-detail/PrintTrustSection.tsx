import type { PrintDetailTrustField } from "~/lib/prints/detail";

type PrintTrustSectionProps = {
  fields: PrintDetailTrustField[];
};

function buildUnavailableNote(label: string): string {
  switch (label) {
    case "License":
      return "License details have not been added yet.";
    case "Source Files":
      return "This print does not currently publish source files.";
    case "File Provenance":
      return "There are no file destinations to label yet.";
    default:
      return "Unavailable";
  }
}

export function PrintTrustSection({ fields }: PrintTrustSectionProps) {
  return (
    <section className="print-trust-section" aria-labelledby="print-trust-heading" id="print-trust">
      <div className="print-section-head">
        <p className="eyebrow">Trust</p>
        <h2 id="print-trust-heading">Know what is here and what is not</h2>
        <p>Key trust fields stay visible even when the answer is simply that the data is unavailable.</p>
      </div>

      <dl className="print-trust-grid">
        {fields.map((field) => (
          <div key={field.label} className="print-trust-card">
            <dt>{field.label}</dt>
            <dd>
              {field.href ? (
                <a href={field.href} rel="noreferrer" target="_blank">
                  {field.value}
                </a>
              ) : (
                field.value
              )}
            </dd>
            {field.isUnavailable ? <p>{buildUnavailableNote(field.label)}</p> : null}
          </div>
        ))}
      </dl>
    </section>
  );
}
