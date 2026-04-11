# Phase 11 Research: Cross-Surface UX Upgrade

**Phase:** 11  
**Date:** 2026-04-11  
**Goal:** Apply the shared UI layer to the generator, library, and one additional high-leverage surface without widening v1.1 into a broad site rewrite.

## What matters for planning this phase well

1. Phase 8 introduced adapted Magic UI primitives, but the shared card layer is not yet the product's default section shell on core routes.
2. Generator, library, and print-detail routes currently duplicate similar glass-panel styling in route-local CSS, so Phase 11 should remove duplication instead of adding more.
3. The third required surface should be decision-heavy and already stable; print detail fits better than a broader catalog overhaul.
4. The shared layer must stay safe in this React Router stack without assuming providers or runtime infrastructure that the app does not currently mount.
5. The milestone ends at polished, reusable surfaces. It should not drift into new workflow capabilities or a full visual rewrite.

## Standard Stack

- React Router 7 route modules with loader-driven server data
- Tailwind 4 plus route-local CSS modules
- Repo-owned adapted Magic UI primitives under `app/components/ui/`
- Vitest SSR/model/route tests

## Architecture Patterns

- Keep layout ownership in route CSS and route components, but move repeated shell treatment into a repo-owned shared wrapper.
- Prefer a single shared surface component over several near-duplicate panel abstractions.
- Apply the wrapper at semantic section boundaries already present in the route/component structure.
- Keep buttons and explicit utility copy intact; the shared layer should improve hierarchy, not replace clear task labels.

## Don’t Hand-Roll

- Do not build a second design system beside the Phase 8 primitives.
- Do not widen the phase into catalog-wide or home-page-wide redesign work unless a small consistency fix is unavoidable.
- Do not hide action-heavy surfaces behind decorative motion or card stacks that reduce scanability.
- Do not bypass the existing shared primitives with another round of route-local border/background duplication.

## Common Pitfalls

- Treating polish work as permission to introduce new product capabilities.
- Using the existing `MagicCard` primitive without making sure it is safe in the current app shell.
- Applying a shared wrapper only cosmetically while leaving the generator and library routes structurally inconsistent.
- Spending the phase on discovery/home refresh instead of the saved-workflow loop and the required third proof surface.

## Code Examples

- `app/components/ui/magic-card.tsx`
- `app/routes/generator-detail.tsx`
- `app/components/generator/GeneratorPreview.tsx`
- `app/components/generator/GeneratedArtifactPanel.tsx`
- `app/components/generator/GeneratorPresetPanel.tsx`
- `app/routes/library.tsx`
- `app/components/library/LibraryPresetSection.tsx`
- `app/components/library/LibraryPrintGrid.tsx`
- `app/routes/print-detail.tsx`
- `app/components/print-detail/PrintFileSections.tsx`
- `app/components/print-detail/PrintTrustSection.tsx`

## Recommended Plan Split

### Wave 1

- Make the shared card primitive stack-safe and create a repo-owned surface wrapper.
- Add focused SSR tests for the new wrapper contract.

### Wave 2

- Roll the shared layer across generator and library surfaces.
- Keep route responsibilities intact while deleting duplicated shell styling.

### Wave 3

- Apply the same layer to print detail as the third required surface.
- Update lifecycle artifacts, roadmap/requirements/state, and verify the milestone phase cleanly.

## Sources

### Local

- `.planning/ROADMAP.md`
- `.planning/REQUIREMENTS.md`
- `.planning/phases/08-magic-ui-adaptation-baseline/08-CONTEXT.md`
- `.planning/phases/09-saved-generator-presets/09-CONTEXT.md`
- `.planning/phases/10-preset-reuse-and-library-integration/10-CONTEXT.md`
- `app/components/ui/magic-card.tsx`
- `app/routes/generator-detail.tsx`
- `app/routes/library.tsx`
- `app/routes/print-detail.tsx`
- `tests/ui/magic-primitives.test.tsx`

### External

- None required beyond the repo's current frontend stack and installed UI primitives.

## Prescriptive conclusion

Make the shared surface layer real by introducing one repo-owned wrapper around the adapted Magic UI card treatment, then apply it to generator, library, and print detail sections while preserving Bright Prints' explicit product copy and calm workflow hierarchy.
