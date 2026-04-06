import type { PrintDetailFileSection } from "~/lib/prints/detail";

type PrintFileSectionsProps = {
  sections: PrintDetailFileSection[];
};

export function PrintFileSections({ sections }: PrintFileSectionsProps) {
  return (
    <section className="print-file-sections" aria-labelledby="print-file-sections-heading">
      <div className="print-section-head">
        <p className="eyebrow">Files</p>
        <h2 id="print-file-sections-heading">Choose the right file path</h2>
        <p>
          Print-ready assets stay separate from editable source files so the next step
          is obvious before you click anything.
        </p>
      </div>

      <div className="print-file-section-grid">
        {sections.map((section) => (
          <section
            key={section.kind}
            className="print-file-section-card"
            id={section.kind === "print-ready" ? "print-ready-files" : "source-files"}
          >
            <div className="print-file-section-copy">
              <p className="eyebrow">{section.status === "available" ? "Available" : "Unavailable"}</p>
              <h3>{section.title}</h3>
              <p>{section.description}</p>
            </div>

            {section.items.length > 0 ? (
              <ul className="print-file-list">
                {section.items.map((item) => (
                  <li key={`${section.kind}-${item.label}`} className="print-file-row">
                    <div>
                      <strong>{item.label}</strong>
                      <p>{item.purpose}</p>
                    </div>
                    <dl>
                      <div>
                        <dt>Type</dt>
                        <dd>{item.fileTypeLabel}</dd>
                      </div>
                      <div>
                        <dt>Provenance</dt>
                        <dd>{item.provenanceLabel}</dd>
                      </div>
                    </dl>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="print-file-empty">{section.description}</p>
            )}
          </section>
        ))}
      </div>
    </section>
  );
}
