# Phase 12: Motion Accessibility Closure - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-11
**Phase:** 12-motion-accessibility-closure
**Areas discussed:** motion fallback ownership, reduced-motion behavior, verification scope

---

## Motion fallback ownership

| Option                                | Description                                                               | Selected |
| ------------------------------------- | ------------------------------------------------------------------------- | -------- |
| Route-by-route reduced-motion patches | Add overrides separately on generator, library, and print-detail surfaces |          |
| Shared primitive-layer fix            | ✓                                                                         | ✓        |
| Broad animation-system redesign       | Rebuild the milestone visuals around a new motion abstraction             |          |

**User's choice:** Yolo recommendation selected a shared primitive-layer fix.
**Notes:** Phase 12 is a gap-closure phase. The right leverage is in the shared primitives already powering the milestone-critical surfaces.

---

## Reduced-motion behavior

| Option                              | Description                                                              | Selected |
| ----------------------------------- | ------------------------------------------------------------------------ | -------- |
| Remove all visual emphasis          | Strip the shared layer back to flat static shells                        |          |
| Keep calm static emphasis           | Replace continuous or pointer-reactive motion with static hierarchy cues | ✓        |
| Keep the existing animated behavior | Leave shimmer and hover motion unchanged                                 |          |

**User's choice:** Yolo recommendation selected calm static emphasis.
**Notes:** Reduced motion should lower movement without removing the visual hierarchy users already learned in Phase 11.

---

## Verification scope

| Option                                     | Description                                                                | Selected |
| ------------------------------------------ | -------------------------------------------------------------------------- | -------- |
| Primitive-only verification                | Prove the fix only in isolated component tests                             |          |
| Primitive plus milestone-critical surfaces | Cover the primitives and the generator, library, and print-detail surfaces | ✓        |
| Broad milestone tech-debt sweep            | Expand the phase into unrelated library-route or payload cleanup           |          |

**User's choice:** Yolo recommendation selected primitive plus milestone-critical surface verification.
**Notes:** The gap came from widened primitive reuse, so the proof has to show the surfaced routes still read correctly under reduced motion.

---

## the agent's Discretion

- Exact reduced-motion class and CSS token strategy as long as the shared primitives own the fallback.
- Exact static fallback presentation for the shared panel highlight as long as pointer tracking stops for reduced-motion users.
- Exact SSR regression-test split between primitive coverage and generator-surface coverage.

## Deferred Ideas

- Additional payload optimization for `luminous-panel` and `generator-detail`.
- Broader animation-system cleanup beyond the reopened `UIG-02` gap.
- Unrelated milestone tech-debt coverage from the audit.

---

_Phase: 12-motion-accessibility-closure_
_Discussion log generated: 2026-04-11_
