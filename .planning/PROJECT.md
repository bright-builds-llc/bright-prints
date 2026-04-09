# Bright Prints

## What This Is

Bright Prints is a shipped v1.0 open-source hybrid 3D print portfolio and storefront. It currently delivers curated discovery, rich print detail and download flows, account-backed personal libraries, a browser-side sign generator, and lightweight physical-print interest capture.

## Core Value

Users can quickly discover beautiful 3D prints and generate or download the right printable files with a sleek, trustworthy, accessible experience.

## Current State

- **Version:** `v1.0` shipped on 2026-04-09
- **Audit status:** `tech_debt`
- **Stack:** React Router 7, Prisma/Postgres runtime data, repo-backed YAML content, Bun package-management/build workflow, Node production runtime
- **Operational posture:** public routes remain resilient when auth or database env is absent, while runtime-backed flows fail gracefully instead of crashing

## Validated Outcomes

- Users can browse an editorial home page and searchable catalog of prints and generators.
- Users can open print detail pages with real downloads, file provenance, trust metadata, and physical-print state clarity.
- Users can create accounts, sign in, bookmark prints, create custom lists, and manage a personal library.
- Users can configure a sign generator in-browser and download a real `.3mf` artifact with generated-model metadata.
- The product records provider-agnostic physical-print interest, shows visible build provenance, and preserves open-source privacy boundaries.

## Next Milestone Goals

- Define fresh requirements and roadmap scope for `v1.1`.
- Decide whether the next milestone should prioritize deeper commerce, more generator and library capability, or multi-creator and CMS groundwork.
- Close the v1.0 process debt called out by the audit: stale requirement checkbox state, incomplete `requirements-completed` provenance in phase summaries, and missing Nyquist validation artifacts.

## Constraints

- **Privacy:** Customer data, payment metadata, credentials, and sensitive operational information must stay private.
- **Architecture:** Public content stays repo-backed and schema-driven until a later milestone deliberately changes that.
- **Commerce:** Keep checkout ambitions incremental and native-feeling rather than forcing brittle provider integrations too early.
- **Deployment:** Railway remains the primary deployment target and `main` remains the release path.
- **Performance:** Discovery, generation, and detail pages should stay fast and accessible as product-level requirements.

## Key Decisions

| Decision                                                                                   | Rationale                                                                                          | Outcome                     |
| ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- | --------------------------- |
| Prioritize generator/download experience over storefront depth when scope conflicts emerge | The strongest differentiator is customizable generation plus trustworthy downloadable prints       | ✓ Validated in v1.0         |
| Start with Peter-owned content but design for future multi-creator support                 | v1 should stay focused, but the model should not trap the product in a single-creator architecture | ✓ Validated in v1.0         |
| Use repo-backed content and model files initially                                          | Open-source-first workflow and diff-friendly content are valuable early                            | ✓ Good                      |
| Treat physical-print commerce as incremental in v1                                         | Interest capture and metadata groundwork were enough for first release                             | ✓ Good                      |
| Evaluate Shopify as a leverage layer rather than assuming a fully custom commerce stack    | Existing commerce tooling may still reduce future delivery cost                                    | — Revisit in next milestone |
| Use React Router 7 as the primary web framework                                            | It fit the product and deployment model without adding platform-specific gravity                   | ✓ Good                      |
| Keep `3mf` generation entirely client-side                                                 | Browser-side generation matched the desired UX and avoided backend CAD infrastructure              | ✓ Good                      |
| Use Bun for package management/build while keeping Node for production runtime             | Bun improved workflow consistency without forcing a production-runtime rewrite                     | ✓ Good                      |

## Archived Planning Context

<details>
<summary>v1.0 archival context</summary>

- Full milestone scope is archived in [milestones/v1.0-ROADMAP.md](./milestones/v1.0-ROADMAP.md).
- Archived milestone requirements live in [milestones/v1.0-REQUIREMENTS.md](./milestones/v1.0-REQUIREMENTS.md).
- The shipped milestone audit lives in [milestones/v1.0-MILESTONE-AUDIT.md](./milestones/v1.0-MILESTONE-AUDIT.md).

</details>

---

_Last updated: 2026-04-09 after v1.0 milestone archival_
