import { useFetcher } from "react-router";

import { LuminousPanel } from "~/components/ui/luminous-panel";

type PrintCommerceInterestProps = {
  leadTime: string | null;
  notes: string | null;
  printSlug: string;
};

export function PrintCommerceInterest({
  leadTime,
  notes,
  printSlug,
}: PrintCommerceInterestProps) {
  const fetcher = useFetcher<{ message?: string; ok?: boolean }>();
  const isSubmitting = fetcher.state !== "idle";
  const statusMessage = isSubmitting
    ? "Sending your physical-print request."
    : (fetcher.data?.message ??
      "Request a finished physical print without leaving the page.");
  const submitLabel = isSubmitting ? "Sending Request" : "Submit Interest";

  return (
    <LuminousPanel
      className="print-commerce-interest"
      aria-labelledby="print-commerce-interest-heading"
      tone="accent"
    >
      <div className="print-section-head">
        <p className="eyebrow">Physical Print</p>
        <h2 id="print-commerce-interest-heading">Request this print</h2>
        <p aria-live="polite" className="print-commerce-status">
          {statusMessage}
        </p>
        {leadTime ? <p>Lead time: {leadTime}</p> : null}
        {notes ? <p>{notes}</p> : null}
      </div>

      <fetcher.Form
        action="/actions/commerce-interest"
        aria-busy={isSubmitting}
        className="print-commerce-form"
        method="post"
      >
        <input name="printSlug" type="hidden" value={printSlug} />
        <div className="print-commerce-field">
          <label htmlFor={`commerce-contact-${printSlug}`}>Email</label>
          <input
            autoComplete="email"
            disabled={isSubmitting}
            id={`commerce-contact-${printSlug}`}
            name="contact"
            placeholder="you@example.com"
            required
            type="email"
          />
        </div>
        <div className="print-commerce-field">
          <label htmlFor={`commerce-note-${printSlug}`}>Note</label>
          <textarea
            disabled={isSubmitting}
            id={`commerce-note-${printSlug}`}
            name="note"
            rows={3}
          />
        </div>
        <button
          className="home-primary-action"
          disabled={isSubmitting}
          type="submit"
        >
          {submitLabel}
        </button>
      </fetcher.Form>
    </LuminousPanel>
  );
}
