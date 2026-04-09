# Bright Prints

## What This Is

Bright Prints is an open-source hybrid 3D print portfolio and storefront. It delivers curated discovery, rich print detail and download flows, account-backed personal libraries, browser-side generator tools, and lightweight physical-print interest capture for people who care about both beautiful presentation and trustworthy printable output.

## Core Value

Users can quickly discover beautiful 3D prints and generate or download the right printable files with a sleek, trustworthy, accessible experience.

## Current State

- **Latest shipped version:** `v1.0` on 2026-04-09
- **Current milestone:** `v1.1`
- **Audit carry-forward:** `tech_debt` from v1.0 archival, but no product-blocking milestone gaps
- **Stack:** React Router 7, Prisma/Postgres runtime data, repo-backed YAML content, Bun package-management/build workflow, Node production runtime

## Current Milestone: v1.1 Saved Generators and Magic UI Upgrade

**Goal:** turn Bright Prints from a strong first-use product into a return-visit product by making generated work reusable and by upgrading key surfaces with selectively adopted Magic UI patterns.

**Target features:**

- Saved and named generator presets tied to user accounts
- Revisit, edit, and redownload flows for prior generator work from the library
- Better generator confidence surfaces: preview, output, and history that feel like one workflow
- Selective adoption or adaptation of Magic UI components and interaction patterns where they materially improve discovery, print detail, generator, and library UX
- Reusable React/Tailwind 4 UI primitives rather than one-off visual polish

## Requirements

### Validated

- ✓ Users can browse an editorial home page and searchable catalog of prints and generators. — v1.0
- ✓ Users can open print detail pages with real downloads, file provenance, trust metadata, and physical-print state clarity. — v1.0
- ✓ Users can create accounts, sign in, bookmark prints, create custom lists, and manage a personal library. — v1.0
- ✓ Users can configure a sign generator in-browser and download a real `.3mf` artifact with generated-model metadata. — v1.0
- ✓ The product records provider-agnostic physical-print interest, shows visible build provenance, and preserves open-source privacy boundaries. — v1.0

### Active

- [ ] Signed-in users can save, name, revisit, and redownload generator presets from their account.
- [ ] Generator outputs feel persistent and reusable rather than like one-off downloads.
- [ ] Bright Prints adopts selected Magic UI patterns where they improve UX while staying native to React Router and Tailwind 4.
- [ ] Shared UI primitives become strong enough that future discovery, detail, generator, and library work can build on them consistently.

### Out of Scope

- Full live checkout in v1.1 — commerce groundwork shipped, but checkout breadth would distract from the generator-first product spine.
- Public multi-creator publishing in v1.1 — the architecture is prepared for it, but the next milestone should deepen the first-party product loop first.
- CMS migration in v1.1 — repo-backed content remains acceptable until scale or authoring pressure makes migration worth it.
- Blanket Magic UI dependency replacement — the goal is selective React/Tailwind adaptation, not a wholesale library rewrite.

## Context

- The strongest validated differentiator is still the generator/download experience, not storefront depth alone.
- Accounts and personal library now exist, which makes saved generator state much more valuable than it would have been in v1.0.
- Magic UI is a better fit than Mystic UI for the current stack because Bright Prints is React-based, but its patterns still need selective adaptation for React Router and Tailwind 4 instead of naive drop-in replacement.
- Public routes must continue to degrade gracefully when auth or database env is absent.
- The v1.0 audit found process debt around stale requirement checkboxes, incomplete `requirements-completed` frontmatter, and missing Nyquist validation artifacts.

## Constraints

- **Privacy:** Customer data, payment metadata, credentials, and sensitive operational information must stay private.
- **Architecture:** Public content stays repo-backed and schema-driven until a later milestone deliberately changes that.
- **Commerce:** Keep checkout ambitions incremental and native-feeling rather than forcing brittle provider integrations too early.
- **Deployment:** Railway remains the primary deployment target and `main` remains the release path.
- **Performance:** Discovery, generation, detail, and library pages should stay fast and accessible as product-level requirements.
- **UI adoption:** Magic UI should be adopted selectively and translated into Bright Prints’ existing React/Tailwind conventions where needed.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Prioritize generator/download experience over storefront depth when scope conflicts emerge | The strongest differentiator is customizable generation plus trustworthy downloadable prints | ✓ Validated in v1.0 |
| Start with Peter-owned content but design for future multi-creator support | v1 should stay focused, but the model should not trap the product in a single-creator architecture | ✓ Validated in v1.0 |
| Use repo-backed content and model files initially | Open-source-first workflow and diff-friendly content are valuable early | ✓ Good |
| Treat physical-print commerce as incremental in v1 | Interest capture and metadata groundwork were enough for first release | ✓ Good |
| Evaluate Shopify as a leverage layer rather than assuming a fully custom commerce stack | Existing commerce tooling may still reduce future delivery cost | — Revisit in a future commerce milestone |
| Use React Router 7 as the primary web framework | It fit the product and deployment model without adding platform-specific gravity | ✓ Good |
| Keep `3mf` generation entirely client-side | Browser-side generation matched the desired UX and avoided backend CAD infrastructure | ✓ Good |
| Use Bun for package management/build while keeping Node for production runtime | Bun improved workflow consistency without forcing a production-runtime rewrite | ✓ Good |
| Adopt Magic UI selectively rather than as a blanket dependency rewrite | Bright Prints needs React/Tailwind-native UX improvements without surrendering control of the product surface | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition:**
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone:**
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

## Archived Planning Context

<details>
<summary>v1.0 archival context</summary>

- Full milestone scope is archived in [milestones/v1.0-ROADMAP.md](./milestones/v1.0-ROADMAP.md).
- Archived milestone requirements live in [milestones/v1.0-REQUIREMENTS.md](./milestones/v1.0-REQUIREMENTS.md).
- The shipped milestone audit lives in [milestones/v1.0-MILESTONE-AUDIT.md](./milestones/v1.0-MILESTONE-AUDIT.md).

</details>

---
_Last updated: 2026-04-09 after starting milestone v1.1_
