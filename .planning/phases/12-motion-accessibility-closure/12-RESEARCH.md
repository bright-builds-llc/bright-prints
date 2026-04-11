# Phase 12 Research: Motion Accessibility Closure

**Phase:** 12  
**Date:** 2026-04-11  
**Goal:** Close the reopened reduced-motion accessibility gap in the shared UI layer and re-verify the milestone-critical surfaces.

## What matters for planning this phase well

1. The milestone audit re-opened `UIG-02` because the shared primitives now used on generator, library, and print-detail still animate continuously or on pointer movement without a reduced-motion path.
2. The best leverage is at the primitive layer: `AnimatedShinyText`, `ShimmerButton`, and `MagicCard`.
3. `app/app.css` already owns the shared animation variables and has one limited `prefers-reduced-motion` rule, so the codebase already has a natural place to centralize lower-motion fallbacks.
4. `MagicCard` now uses `motion/react`, which provides a direct way to disable interactive motion behavior when reduced motion is preferred.
5. The phase should prove the accessibility fix without turning into a broader UI redesign or unrelated milestone-debt cleanup.

## Standard Stack

- React Router 7 route modules
- Shared UI primitives under `app/components/ui/`
- Shared animation tokens and media queries in `app/app.css`
- Vitest SSR/component tests

## Architecture Patterns

- Fix the motion contract in shared primitives first, then verify the milestone-critical routes still render the intended hierarchy.
- Use CSS or hook-level reduced-motion checks rather than route-specific conditional rendering unless a surface truly needs an override.
- Prefer regression tests that verify reduced-motion-specific output or behavior at the primitive layer and then spot-check the milestone-critical surface composition.

## Don’t Hand-Roll

- Do not patch reduced-motion separately on generator, library, and print detail if the primitive can own the fix.
- Do not remove all visual emphasis from the shared layer; the requirement is reduced motion, not no styling.
- Do not widen the phase into the audit’s non-blocking test-coverage or payload debt.

## Common Pitfalls

- Leaving animation class names untouched and assuming `prefers-reduced-motion` is handled elsewhere.
- Disabling pointer-reactive motion in `MagicCard` only visually while still running springs and pointer tracking.
- Adding brittle route-level tests that don’t actually prove reduced-motion behavior.

## Code Examples

- `app/components/ui/animated-shiny-text.tsx`
- `app/components/ui/shimmer-button.tsx`
- `app/components/ui/magic-card.tsx`
- `app/components/ui/luminous-panel.tsx`
- `app/app.css`
- `tests/ui/magic-primitives.test.tsx`
- `app/components/chrome/BuildProvenance.tsx`
- `app/components/discovery/SectionHeading.tsx`

## Recommended Plan Split

### Wave 1

- Add reduced-motion behavior to the shared animation primitives and the shared animation token layer.
- Ensure the card primitive disables interactive motion when reduced motion is preferred.

### Wave 2

- Add focused regression tests for reduced-motion behavior and confirm the milestone-critical surfaces still render correctly through the shared layer.

### Wave 3

- Update phase verification artifacts and planning state so `UIG-02` can return to complete and the milestone can be re-audited cleanly.

## Sources

### Local

- `.planning/v1.1-MILESTONE-AUDIT.md`
- `.planning/phases/08-magic-ui-adaptation-baseline/08-CONTEXT.md`
- `.planning/phases/11-cross-surface-ux-upgrade/11-CONTEXT.md`
- `app/app.css`
- `app/components/ui/animated-shiny-text.tsx`
- `app/components/ui/shimmer-button.tsx`
- `app/components/ui/magic-card.tsx`
- `tests/ui/magic-primitives.test.tsx`

### External

- None required beyond the current React/motion stack already in the repo.

## Prescriptive conclusion

Close `UIG-02` by making the shared animation primitives explicitly honor reduced-motion preferences, then prove the fix with focused primitive regressions and milestone-surface checks rather than route-by-route styling patches.
