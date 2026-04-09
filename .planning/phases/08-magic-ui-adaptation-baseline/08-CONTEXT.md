---
phase: 08-magic-ui-adaptation-baseline
generated_by: gsd-discuss-phase
lifecycle_mode: yolo
phase_lifecycle_id: 08-2026-04-09T07-51-19
generated_at: 2026-04-09T07:51:19Z
---

# Phase 8 Context: Magic UI Adaptation Baseline

## Goal

Establish shared React/Tailwind 4 UI primitives adapted from selected Magic UI patterns without turning the phase into a broad site rewrite.

## Locked Decisions

- Magic UI should be installed through its official shadcn-style source workflow, not treated as a package-only dependency.
- Bright Prints may keep thin usage-site adaptations, but it should avoid bespoke reimplementation of the same Magic UI effects.
- This phase should prove the primitive layer on low-risk shared surfaces and at least one generator-adjacent surface.
- This phase should not fully consume the later cross-surface polish scope that belongs to Phase 11.

## Selected Pattern Direction

- **Animated Shiny Text** for small editorial emphasis
- **Shimmer Button** for real button actions where the official component fits naturally
- **Magic Card** installed and available for later surface expansion once it is needed on stable SSR-safe surfaces

## Safe Adoption Surfaces

- shared section headings
- home and discovery CTA buttons
- build provenance footer
- generator artifact output panel

## Deferred to Later Phases

- broad library adoption
- print-detail-wide adoption
- full-site visual rewrite
- new generator persistence behavior

## Verification Expectations

- installed Magic UI components exist in the repo through the official source-install path
- adapted motion respects reduced-motion and does not block keyboard use
- generator and discovery surfaces remain readable and task-focused after the baseline refresh
