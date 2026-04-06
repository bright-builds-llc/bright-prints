# Phase 3: Print Detail, Files, and Launch Actions - Context

**Gathered:** 2026-04-05
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver richer print detail pages that help visitors understand the object, access the right files with confidence, see whether the print is free, physical, or both, and use supported print-launch actions when available. This phase deepens the print detail experience only; broader commerce depth, accounts, and generator behavior remain separate phases.

</domain>

<decisions>
## Implementation Decisions

### Detail page hierarchy
- Use a two-column hero on desktop with the large print visual on the left and the title, summary, availability, and action block on the right.
- Put the files and action section immediately after the hero before deeper print specifications.
- Keep the top of the page editorial and breathable, then shift into more compact data blocks lower on the page.
- Keep related prints at the bottom as clearly secondary content.

### File presentation and labeling
- Separate files into explicit `Print-Ready Files` and `Source Files` sections, with print-ready files first.
- Each file row should show the file label, short purpose text, and file type so visitors understand the difference before downloading.
- When a relevant file group is unavailable, keep that group visible with clear inactive or explanatory treatment instead of hiding the concept entirely.
- External file destinations should stay in the same file list, clearly marked as external before click.

### Print-state and action behavior
- Use one context-sensitive primary CTA based on the strongest immediate next action for the print, with secondary actions alongside it.
- Show an explicit availability panel near the hero and actions that states whether the print is a free download, physical print, or both.
- Treat slicer-launch behavior as a specialized secondary action that appears only when supported, with clear download fallback messaging when it is not.
- For physical-print availability in this phase, use a lightweight request or contact-style action rather than deeper storefront or checkout behavior.

### Trust and printing guidance
- Show core print guidance by default in concise sections rather than hiding most of it behind disclosures.
- Present special print steps as a short checklist or callout block, and omit the section entirely when there are no special steps.
- Show licensing and file-provenance information in a dedicated trust section near the file area.
- For key trust fields that are missing, show an explicit placeholder such as `Unavailable` instead of hiding the field.

### Claude's Discretion
- Exact visual styling, spacing, and responsive breakpoints within the established Bright Prints design language.
- Exact wording for purpose text, availability labels, and trust microcopy as long as the meaning stays aligned with these decisions.
- Whether compact technical sections use cards, definition lists, or other lightweight structured presentation patterns.

</decisions>

<specifics>
## Specific Ideas

- The current Phase 2 print detail route is intentionally lightweight, so Phase 3 should convert it into the first truly useful object page rather than just adding more decorative content.
- The page should preserve the editorial feel established in discovery while still answering the practical user question, "What can I do with this print right now?"
- `Print-Ready Files` should feel like the default action path for people who want to make the object, while `Source Files` should read as remix or reference assets.
- Trust matters more than density: the product should be explicit about what exists, what is unavailable, and what requires an external destination.

</specifics>

<deferred>
## Deferred Ideas

- Full storefront-style purchase flow or native checkout behavior belongs to later commerce work.
- Account-linked saving, bookmarking, or personal library actions belong to the accounts phase.
- Generator-specific output behavior or deeper model customization belongs to the generator phase.

</deferred>

---

*Phase: 03-print-detail-files-and-launch-actions*
*Context gathered: 2026-04-05*
