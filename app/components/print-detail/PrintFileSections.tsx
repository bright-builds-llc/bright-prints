import type { PrintDetailFileSection } from "~/lib/prints/detail";
import { LuminousPanel } from "~/components/ui/luminous-panel";

type PrintFileSectionsProps = {
  sections: PrintDetailFileSection[];
};

export function PrintFileSections({ sections }: PrintFileSectionsProps) {
  return (
    <LuminousPanel
      aria-labelledby="print-file-sections-heading"
      className="print-file-sections"
      tone="paper"
    >
      <div className="print-section-head">
        <p className="eyebrow">Files</p>
        <h2 id="print-file-sections-heading">Choose the right file path</h2>
        <p>
          Print-ready assets stay separate from editable source files so the
          next step is obvious before you click anything.
        </p>
      </div>

      <div className="print-file-section-grid">
        {sections.map((section) => (
          <section
            key={section.kind}
            className="print-file-section-card"
            data-status={section.status}
            id={
              section.kind === "print-ready"
                ? "print-ready-files"
                : "source-files"
            }
          >
            <div className="print-file-section-copy">
              <div className="print-file-status-row">
                <p className="eyebrow">
                  {section.status === "available" ? "Available" : "Unavailable"}
                </p>
                <span className="print-file-status-pill">
                  {section.status === "available"
                    ? `${section.items.length} file${section.items.length === 1 ? "" : "s"}`
                    : "Unavailable"}
                </span>
              </div>
              <h3>{section.title}</h3>
              <p>{section.description}</p>
            </div>

            {section.items.length > 0 ? (
              <ul className="print-file-list">
                {section.items.map((item) => (
                  <li
                    key={`${section.kind}-${item.label}`}
                    className="print-file-row"
                  >
                    <div>
                      <div className="print-file-link-heading">
                        {item.href ? (
                          <a
                            aria-label={`${item.label} (${item.isExternal ? "opens external destination" : "downloads from Bright Prints"})`}
                            href={item.href}
                            rel={
                              item.isExternal
                                ? "noopener noreferrer"
                                : undefined
                            }
                            target={item.isExternal ? "_blank" : undefined}
                          >
                            {item.label}
                          </a>
                        ) : (
                          item.label
                        )}
                        <span className="print-file-link-note">
                          {item.isExternal
                            ? "External destination"
                            : "Direct download"}
                        </span>
                      </div>
                      <p>{item.purpose}</p>
                    </div>
                    <dl className="print-file-meta">
                      <div>
                        <dt>Type</dt>
                        <dd>{item.fileTypeLabel}</dd>
                      </div>
                      <div>
                        <dt>Provenance</dt>
                        <dd>
                          {item.provenanceLabel}
                          {item.isExternal ? " destination" : ""}
                        </dd>
                      </div>
                    </dl>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="print-file-empty">
                <strong>{section.title} unavailable</strong>
                <p>{section.description}</p>
              </div>
            )}
          </section>
        ))}
      </div>
    </LuminousPanel>
  );
}
