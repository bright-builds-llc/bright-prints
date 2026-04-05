# Phase 2: Discovery and Catalog Experience - Context

**Gathered:** 2026-04-05
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase delivers the first polished visitor journey from a featured home page into a searchable, filterable catalog and then into dedicated print detail pages. It defines how visitors discover prints and generators and how they decide to click through, without adding new capabilities beyond this discovery/catalog boundary.

</domain>

<decisions>
## Implementation Decisions

### Home page composition
- Use an editorial asymmetric hero, not a rotating carousel.
- Lead with open-source 3D prints plus customizable generators as the primary message; storefront language is secondary.
- Keep the top-level actions limited to `Browse Prints` and `Try a Generator`.
- Keep the landing page restrained in Phase 2:
  - featured prints section
  - short "what Bright Prints offers" explanation band
  - featured generator spotlight

### Catalog card density
- Use a spacious editorial gallery rather than a dense marketplace grid.
- Each card should show only:
  - strong image
  - title
  - one-line summary
  - 2-3 lightweight badges such as `Open Source`, `Generator`, or category/material
- Cards should stay visually calm with one primary click target; no cluttered hover-action controls.
- Keep one unified catalog where prints and generators appear together, with clear labeling and filtering instead of separate top-level catalog experiences.

### Search and filtering behavior
- Search should cover title, summary, category, and print/generator labels.
- Keep filters intentionally tight in Phase 2:
  - type (`Prints` / `Generators`)
  - availability (`Open Source` / `Physical Print`)
  - category/material only when the content is populated well enough
- Present filters in a compact top toolbar using chips or dropdowns, not a heavy left sidebar.
- Keep sorting minimal:
  - curated/recommended default
  - `Newest`
  - `Title A-Z`

### Entry into detail pages
- Make the whole card clickable as the dominant action from the catalog.
- Keep transitions subtle and fast rather than dramatic or theatrical.
- Cards should earn the click primarily through visual intrigue, supported by concise utility cues.
- Cards should imply rich detail pages through polish and concise badges, not by previewing large lists of specs or settings.

### Claude's Discretion
- Exact spacing, typography, card ratio, and responsive breakpoints
- Micro-interaction tuning for hover/focus states
- Badge visual language and icon choices
- Exact wording of short supporting copy as long as it preserves the locked positioning above

</decisions>

<specifics>
## Specific Ideas

- The home page should feel editorial and selective rather than like a generic storefront template.
- The catalog should feel elegant and scannable, not like an enterprise faceted-search UI.
- Clicking into a detail page should feel like entering the object, not opening a product form.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within the Phase 2 scope boundary.

</deferred>

---

*Phase: 02-discovery-and-catalog-experience*
*Context gathered: 2026-04-05*
