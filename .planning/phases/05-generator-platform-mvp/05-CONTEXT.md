# Phase 5: Generator Platform MVP - Context

**Gathered:** 2026-04-08
**Status:** Ready for planning

<domain>
## Phase Boundary

Ship the first real generator page for Bright Prints: a schema-driven sign generator that accepts bounded inputs, blocks invalid states before generation, produces a downloadable `3mf` artifact in-browser, and exposes generated metadata alongside the output. This phase is about the generator experience itself, not a backend CAD worker, social sharing, or saved presets.

</domain>

<decisions>
## Implementation Decisions

### Generator page shape
- The existing `/generators/:slug` route becomes the real generator tool surface rather than a lightweight entry page.
- The page should keep the editorial Bright Prints look, but the working structure is practical: parameter form and preview first, generated artifact and metadata nearby.
- The route should stay loader-driven for repo-backed generator content, then use client-side state for live parameter editing and generation.

### Validation and interaction
- Invalid states are blocked before generation runs.
- Validation feedback should stay inline and explicit for text and dimensional fields.
- The generator should preview sanitized text and bounded dimensions live instead of waiting for a submit round-trip.

### Output and metadata
- Generation stays entirely in-browser.
- The downloadable artifact is a real `.3mf` package, not a placeholder file name.
- Generated metadata should include the configured text, dimensions, output format, and basic mesh statistics.

### Authoring path
- Generator behavior remains repo-backed and schema-validated.
- The first reusable authoring path is a schema-driven `sign-v1` definition that lives in `content/generators/...`.
- The route should depend on generator definition data from content rather than hardcoding behavior by slug only.

### Claude's Discretion
- Exact copy, layout proportions, and preview styling as long as the generator remains calm and usable.
- Exact internal mesh strategy as long as the output reflects the configured parameters and stays fully client-side.

</decisions>

<specifics>
## Specific Ideas

- Keep the sign geometry simple and robust rather than chasing a heavy CAD stack.
- A block-style text system is acceptable for the first generator as long as the artifact and preview both reflect the entered text and dimensions.
- The page should make the output artifact feel real and trustworthy, not like a fake download button.

</specifics>

<deferred>
## Deferred Ideas

- Saved presets, user-owned generated artifacts, and reusable library integrations are later phases.
- Multi-generator authoring breadth beyond the first reusable sign path is deferred.
- Geometry preview depth beyond the lightweight live preview is out of scope for this MVP.

</deferred>

---

*Phase: 05-generator-platform-mvp*
*Context gathered: 2026-04-08*
