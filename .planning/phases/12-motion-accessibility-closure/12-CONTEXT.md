---
phase: 12-motion-accessibility-closure
generated_by: gsd-plan-phase
lifecycle_mode: direct-fallback
phase_lifecycle_id: 12-2026-04-11T22-02-46
generated_at: 2026-04-11T22:02:46.374Z
---

# Phase 12 Context: Motion Accessibility Closure

**Gathered:** 2026-04-11
**Status:** Ready for planning
**Source:** Milestone audit gap closure

<domain>
## Phase Boundary

Close the reopened reduced-motion accessibility gap in the shared Magic UI layer without undoing the product polish work from Phase 11. This phase is about making the existing shared primitives and their milestone-critical surfaces respect reduced-motion preferences; it is not a new UI direction, a new feature phase, or a broader visual refresh.

</domain>

<decisions>
## Implementation Decisions

### Accessibility scope

- The phase must close `UIG-02`, specifically the missing reduced-motion path identified in `.planning/v1.1-MILESTONE-AUDIT.md`.
- The fix should happen at the shared primitive layer first so generator, library, and print-detail inherit the accessibility improvement consistently.
- Reduced-motion support should disable or tone down non-essential continuous animation and pointer-reactive motion while keeping hierarchy, emphasis, and affordance clear.
- The phase should not remove the non-reduced-motion experience for users who have not requested motion reduction.

### Target primitives and surfaces

- `AnimatedShinyText` must stop using continuous shimmer when reduced motion is preferred.
- `ShimmerButton` must stop or neutralize its looping shimmer and spin effects under reduced motion.
- `MagicCard` must stop pointer-reactive glow or gradient motion under reduced motion while preserving the shared surface wrapper used across milestone-critical sections.
- Generator, library, and print-detail are the milestone-critical surfaces that must remain visually coherent after the primitive changes.

### Verification direction

- The phase must add regression coverage that proves reduced-motion behavior exists at the primitive layer and still preserves milestone-critical surfaces.
- Tests should stay SSR-friendly where possible and only use hook mocking when that is the clearest way to prove reduced-motion behavior.
- The phase should leave the milestone ready for a clean re-run of `/gsd-audit-milestone`.

### the agent's Discretion

- Exact reduced-motion fallback presentation for shimmer/glow effects as long as the result is clearly lower-motion and still readable.
- Whether reduced-motion behavior is driven through CSS variables, media queries, hook checks, or a combination, as long as it remains maintainable in the current stack.
- Exact test split between existing UI tests and any new focused accessibility regression test file.

</decisions>

<specifics>
## Specific Ideas

- Prefer primitive-level fixes over route-by-route overrides.
- Treat this as an accessibility closure on proven UI, not a reason to redesign the shared panel layer.
- Build provenance and section-heading surfaces may benefit automatically once the primitives are fixed, but the milestone-critical proof remains generator, library, and print detail.

</specifics>

<canonical_refs>

## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Gap source

- `.planning/v1.1-MILESTONE-AUDIT.md` — exact `UIG-02` failure evidence and the reduced-motion gap that Phase 12 closes.

### Prior phase decisions

- `.planning/phases/08-magic-ui-adaptation-baseline/08-CONTEXT.md` — original Magic UI adoption goals and accessibility guardrails.
- `.planning/phases/11-cross-surface-ux-upgrade/11-CONTEXT.md` — the shared-surface rollout decisions that Phase 12 must preserve.

### Current implementation anchors

- `app/app.css` — current animation variable definitions and existing reduced-motion media-query handling.
- `app/components/ui/animated-shiny-text.tsx`
- `app/components/ui/shimmer-button.tsx`
- `app/components/ui/magic-card.tsx`
- `app/components/ui/luminous-panel.tsx`
- `app/routes/generator-detail.tsx`
- `app/routes/library.tsx`
- `app/routes/print-detail.tsx`
- `tests/ui/magic-primitives.test.tsx`
- `tests/generators/generator-detail-route.test.tsx`

</canonical_refs>

<code_context>

## Existing Code Insights

### Reusable Assets

- `AnimatedShinyText` and `ShimmerButton` currently rely on shared animation utilities defined in `app/app.css`.
- `MagicCard` already centralizes the shared panel motion behavior, so it is the right place to neutralize pointer-reactive movement for reduced-motion users.
- `LuminousPanel` is only a wrapper around `MagicCard`, so primitive-level fixes should propagate across the upgraded surfaces with minimal route churn.

### Established Patterns

- Bright Prints uses explicit utility copy and does not need motion to carry core meaning.
- The repo already uses SSR/component tests for UI primitives and route-level rendering checks.
- Existing reduced-motion handling in `app/app.css` is limited, so extending that layer is consistent with current styling patterns.

### Integration Points

- Build provenance and section headings consume the same primitives, so reduced-motion changes may affect more than the milestone-critical surfaces.
- Generator, library, and print-detail should be regression-checked after primitive updates because they are the audit’s evidence surfaces.

</code_context>

<deferred>
## Deferred Ideas

- Additional coverage cleanup for non-blocking tech debt from the milestone audit.
- Chunk-size optimization work for `luminous-panel` and `generator-detail`.
- Broader animation-system refactors beyond closing `UIG-02`.

</deferred>

---

_Phase: 12-motion-accessibility-closure_
_Context gathered: 2026-04-11 via milestone audit_
