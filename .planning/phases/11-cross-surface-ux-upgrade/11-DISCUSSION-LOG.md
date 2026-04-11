# Phase 11: Cross-Surface UX Upgrade - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-11
**Phase:** 11-cross-surface-ux-upgrade
**Areas discussed:** shared primitive strategy, target surfaces, motion posture, third-surface selection

---

## Shared primitive strategy

| Option                                                                                 | Description                                                           | Selected |
| -------------------------------------------------------------------------------------- | --------------------------------------------------------------------- | -------- |
| Keep route-local shell CSS and only tweak colors                                       | Continue duplicating panel styling per route with a light polish pass |          |
| Add one repo-owned shared surface wrapper and roll it out where the milestone needs it | ✓                                                                     | ✓        |
| Launch a broader design-system rewrite with multiple new primitives                    | Expand the milestone into a broader component rewrite                 |          |

**User's choice:** Yolo recommendation selected a single repo-owned shared surface wrapper.
**Notes:** Phase 11 is about proving reuse and reducing duplicated panel code, not inventing another route-specific shell layer.

---

## Primary rollout targets

| Option                                           | Description                                                                      | Selected |
| ------------------------------------------------ | -------------------------------------------------------------------------------- | -------- |
| Generator only                                   | Polish the generator route and leave library/print surfaces as-is                |          |
| Generator and library only                       | Upgrade the saved-workflow loop but leave other user-facing surfaces untouched   |          |
| Generator, library, and one print-detail surface | Use the generator loop plus one decision-heavy print surface to satisfy `UIG-03` | ✓        |

**User's choice:** Yolo recommendation selected generator, library, and print detail.
**Notes:** This hits the requirement directly while avoiding a broad catalog rewrite.

---

## Motion posture

| Option                                         | Description                                                                          | Selected |
| ---------------------------------------------- | ------------------------------------------------------------------------------------ | -------- |
| No motion beyond existing buttons              | Keep panels fully static                                                             |          |
| Subtle shared-panel motion with calm hierarchy | Use restrained interactive emphasis on section shells without distracting from tasks | ✓        |
| Aggressive animated chrome across all surfaces | Treat Phase 11 like a dramatic visual rewrite                                        |          |

**User's choice:** Yolo recommendation selected restrained shared-panel motion.
**Notes:** Bright Prints still needs explicit utility copy and trustworthy workflows more than spectacle.

---

## Third-surface scope

| Option              | Description                                                                                | Selected |
| ------------------- | ------------------------------------------------------------------------------------------ | -------- |
| Catalog overhaul    | Redesign the discovery catalog as the third surface                                        |          |
| Print detail polish | Apply the shared layer to print detail's availability, files, trust, and guidance sections | ✓        |
| Home page refresh   | Use the landing surface as the third adoption target                                       |          |

**User's choice:** Yolo recommendation selected print detail.
**Notes:** Print detail has clearer decision-heavy sections and less scope risk than a broader catalog or home-page restyle.

---

## the agent's Discretion

- Exact panel tones and gradient balances within the current paper/ink/accent palette.
- Whether the shared panel wrapper lives in route modules or leaf section components, as long as the semantic section boundaries remain intact.
- Exact SSR test coverage for the new wrapper and adopted surfaces.

## Deferred Ideas

- Full-site discovery restyling.
- Additional animated primitives beyond what the current milestone needs.
- New saved-workflow capabilities or print-detail behaviors.

---

_Phase: 11-cross-surface-ux-upgrade_
_Discussion log generated: 2026-04-11_
