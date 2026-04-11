---
phase: 11-cross-surface-ux-upgrade
generated_by: gsd-discuss-phase
lifecycle_mode: yolo
phase_lifecycle_id: 11-2026-04-11T21-31-04
generated_at: 2026-04-11T21:31:04.590Z
---

# Phase 11 Context: Cross-Surface UX Upgrade

**Gathered:** 2026-04-11
**Status:** Ready for planning

<domain>
## Phase Boundary

Apply the shared UI layer to the highest-leverage product surfaces that already matter in v1.1: the generator workflow, the signed-in library, and one additional user-facing surface that proves the layer is reusable beyond the generator loop. This phase is polish and consistency work, not a broad site rewrite, new generator behavior, new library capabilities, or a redefinition of discovery information architecture.

</domain>

<decisions>
## Implementation Decisions

### Shared primitive strategy

- Phase 11 should reduce duplicated route-local glass-panel styling by introducing a repo-owned shared surface wrapper rather than copying another round of per-route CSS shells.
- The shared surface wrapper should build on the existing Magic UI adaptation work from Phase 8, but it must stay compatible with the app's current React Router and light-theme product shell.
- Motion should remain supportive and low-risk: subtle pointer-reactive emphasis on section shells is acceptable, but forms, trust copy, and file actions must stay readable and calm.
- The shared primitive layer should stay utility-first and product-focused, not turn the app into a decorative marketing rewrite.

### Target surfaces

- The generator route remains a primary target because it is the most interaction-dense workflow in the product and still carries repeated panel styling across form, preview, preset, and artifact sections.
- The library route remains a primary target because it is now part of the saved-generator loop and should visually feel like the same system as the generator route.
- Print detail should be the third adopted surface for this phase because it already has high-leverage decision clusters around availability, files, trust, and save actions without requiring a catalog-wide redesign.
- Catalog-wide or home-page-wide restyling stays out of scope unless a change is strictly necessary to keep the shared primitive layer coherent.

### Experience direction

- The upgraded surfaces should feel more unified through shared panel depth, calmer hierarchy, and clearer emphasis around action-heavy sections.
- Generator and library should feel like the same retained-workflow family rather than separate visual systems.
- Print detail should adopt the same shared layer where it sharpens decision-making around file paths, trust, and physical-print interest rather than adding ornamental chrome.
- Buttons, badges, and section copy should remain explicit and utility-oriented; the visual lift comes from shared shells and hierarchy, not from replacing everything with animated controls.

### the agent's Discretion

- Exact tone variants and gradients for shared panels as long as they stay aligned with Bright Prints' existing paper/ink/accent palette.
- Exact panel rollout order inside each route as long as the generator, library, and print-detail surfaces clearly adopt the shared layer.
- Exact markup structure for the new shared wrapper as long as it preserves semantics and remains testable in SSR-friendly route/component tests.

</decisions>

<specifics>
## Specific Ideas

- Treat the generator and library pages like matching workspace surfaces: the same panel language, different tasks.
- Use print detail as the proof that the shared layer works for decision-oriented content, not just editor-style flows.
- Prefer one reusable surface primitive plus route-specific layout CSS over many bespoke panel variants.
- If the current Magic UI card primitive is not yet safe to use in this stack, make it self-contained first instead of bypassing it again.

</specifics>

<canonical_refs>

## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase scope

- `.planning/ROADMAP.md` — Phase 11 goal and success criteria.
- `.planning/REQUIREMENTS.md` — `UIG-03` and the explicit no-broad-rewrite constraint implied by v1.1 scope.

### Prior phase decisions

- `.planning/phases/08-magic-ui-adaptation-baseline/08-CONTEXT.md` — the original guardrails and selected Magic UI pattern direction.
- `.planning/phases/09-saved-generator-presets/09-CONTEXT.md` — generator workflow posture and save-state clarity requirements.
- `.planning/phases/10-preset-reuse-and-library-integration/10-CONTEXT.md` — library/generator reuse loop and recognition boundaries.

### Current implementation anchors

- `app/components/ui/magic-card.tsx` — existing adapted Magic UI card primitive that has not yet been rolled out.
- `app/routes/generator-detail.tsx` and `app/routes/generator-detail.css` — repeated generator panel shells and the most interaction-dense surface.
- `app/routes/library.tsx`, `app/routes/library.css`, and `app/components/library/*` — saved-workflow surfaces that should feel visually unified with the generator route.
- `app/routes/print-detail.tsx`, `app/routes/print-detail.css`, and `app/components/print-detail/*` — high-leverage print decision surface for the third required adoption target.
- `tests/ui/magic-primitives.test.tsx` and existing route/component tests — verification anchors for shared-surface rollout.

</canonical_refs>

<code_context>

## Existing Code Insights

### Reusable Assets

- `MagicCard` exists in the repo already, but it has not been adopted on product surfaces yet, which means Phase 11 can focus on making the shared panel layer real instead of introducing another new primitive.
- `ShimmerButton` and `AnimatedShinyText` already prove that Phase 8 primitives can be adapted safely in this stack.
- Generator, library, and print-detail routes all duplicate the same border, blur, and background styling patterns in route-local CSS.
- The current product surfaces already have clear semantic section boundaries, so Phase 11 can wrap those boundaries with a shared primitive rather than redesigning the underlying information architecture.

### Established Patterns

- Bright Prints prefers explicit utility copy and clear next-step language over icon-only or mood-first UI.
- Route modules own layout and loader data while reusable components handle presentational sections.
- Discovery cards already provide the product's visual anchor language; Phase 11 should complement that system, not replace it.

### Integration Points

- A shared surface wrapper should work inside existing route modules and reusable section components without forcing a new provider or runtime boundary.
- Route CSS should keep layout responsibilities while the shared primitive absorbs repeated shell treatment.
- SSR-friendly component tests are the right regression guard for a rollout whose main risk is accidental visual drift or a broken primitive wrapper contract.

</code_context>

<deferred>
## Deferred Ideas

- Full catalog restyling or a new discovery information architecture.
- Additional generators, preset history, or broader saved-workflow capabilities.
- A site-wide dark mode or theme-system overhaul.
- New product capabilities disguised as polish work.

</deferred>

---

_Phase: 11-cross-surface-ux-upgrade_
_Context gathered: 2026-04-11_
