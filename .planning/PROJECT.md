# Bright Prints

## What This Is

Bright Prints is an open-source hybrid 3D print portfolio and shopping website for showcasing, downloading, generating, and eventually selling 3D-printable creations. It is primarily for people who want a polished, fast, accessible experience for discovering prints and generating customizable models, while still supporting a strong native-feeling storefront for physical prints and future creator expansion.

## Core Value

Users can quickly discover beautiful 3D prints and generate or download the right printable files with a sleek, trustworthy, accessible experience.

## Requirements

### Validated

<!-- Shipped and confirmed valuable. -->

(None yet — ship to validate)

### Active

<!-- Current scope. Building toward these. -->

- [ ] Users can browse a curated, visually strong gallery of 3D prints from a featured home page into a full catalog and rich print detail pages.
- [ ] Users can view abundant, useful detail for each print, including model information, print settings, special printing steps, and download or print-launch actions when available.
- [ ] Users can generate parameterized 3D models such as custom signs by supplying constrained dimensions and content, then receive generated `3mf` outputs and related metadata.
- [ ] Users can create accounts, bookmark prints, and organize favorites into custom lists.
- [ ] The product can support mixed monetization over time, with most first-party prints free and open source, while laying groundwork for physical-print purchasing and native-feeling checkout flows.
- [ ] Site content and generator definitions can live in-repo first, with schemas and structure designed to stay diff-friendly and migrate cleanly toward future CMS-backed and multi-creator workflows.
- [ ] Deployments run automatically on Railway for every push to `main`.

### Out of Scope

<!-- Explicit boundaries. Includes reasoning to prevent re-adding. -->

- Full multi-creator marketplace launch in v1 — the system should be architected for it, but first release focuses on Peter's own prints and generators.
- Full CMS migration in v1 — repo-backed content is acceptable initially as long as the schema and storage model remain migration-friendly.
- Provider-perfect native checkout coverage across every requested payment method in v1 — first release can ship request/interest and integration groundwork where true on-site checkout is not practical.

## Context

- Existing 3D print catalog sites do not provide the exact feature set, polish, responsiveness, accessibility, and control desired for this project.
- The generator and downloadable-model experience is the top priority when tradeoffs appear between generator flows, storefront depth, and social/library features.
- The home page should showcase a curated or rotating curated set of featured prints and clearly explain both the gallery/storefront side and the parameterized generator side of the product.
- Example early generator: a sign generator where the user supplies text, width, height, thickness, rounded-corner radius, and similar simple dimensional inputs.
- Most first-party prints are expected to be free and open source, and source model files may live directly in the public repository.
- Peter Ryszkiewicz may be named publicly in the product and repository, but home address and comparable personal location data must not appear publicly.
- Customer data, payment metadata, API keys, secrets, and other leak-sensitive operational data must remain private and never be committed to the public repository.
- Some print ecosystems expose "Print Now" style launcher URLs that can hand off into slicer software such as PrusaSlicer or BambuStudio; these should be supported where technically feasible.
- Shopify is already available and should be evaluated as a leverage point for catalog, commerce, or checkout-adjacent capabilities instead of blindly rebuilding everything from scratch.
- The site is expected to be full stack and likely include a database-backed user system from the start.

## Constraints

- **Privacy**: Keep customer data, payment metadata, credentials, and sensitive operational information private — the repository is open source and must not leak critical information.
- **Architecture**: Start repo-backed and schema-driven, but preserve a clean migration path to CMS-backed content and future multi-creator publishing.
- **Commerce**: Prefer native-feeling on-site commerce and payment experiences, but avoid forcing brittle integrations where providers require redirects or hosted checkout.
- **Deployment**: First-class Railway support is required, including automated deployments on every push to `main`.
- **Performance**: Optimize for speed, responsiveness, and accessibility as product-level priorities rather than post-launch cleanup items.
- **Open Source**: Source model files can be public, but operational secrets and private user/business data cannot be.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Prioritize generator/download experience over storefront depth when scope conflicts emerge | The user identified customizable generators and downloadable prints as the strongest differentiator and the preferred v1 focus | — Pending |
| Start with Peter-owned content but design for future multi-creator support | v1 should stay focused, but the data model and authoring workflow should not trap the product in a single-creator architecture | — Pending |
| Use repo-backed content and model files initially | Open-source-first workflow and diff-friendly content are acceptable now, with CMS migration deferred until it becomes necessary | — Pending |
| Treat physical-print commerce as incremental in v1 | Native-feeling checkout groundwork matters, but the first shipped version can stop short of complete physical-print purchasing coverage | — Pending |
| Evaluate Shopify as a leverage layer rather than assuming a fully custom commerce stack | An existing Shopify account may reduce implementation cost for catalog and commerce capabilities if the integration model fits the product | — Pending |

---
*Last updated: 2026-04-04 after initialization*
