# Roadmap: Bright Prints

**Created:** 2026-04-04
**Project:** [PROJECT.md](./PROJECT.md)
**Requirements:** [REQUIREMENTS.md](./REQUIREMENTS.md)

## Milestones

- ✅ **v1.0 MVP** — [roadmap archive](./milestones/v1.0-ROADMAP.md), [requirements archive](./milestones/v1.0-REQUIREMENTS.md), and [audit](./milestones/v1.0-MILESTONE-AUDIT.md) (`tech_debt`, shipped 2026-04-09)
- 🚧 **v1.1 Saved Generators and Magic UI Upgrade** — Phases 8-11 (in progress)

## Summary

**4 phases** | **12 v1.1 requirements mapped** | **All v1.1 requirements covered ✓**

| #   | Phase                                | Goal                                                                                            | Requirements                                | Success Criteria |
| --- | ------------------------------------ | ----------------------------------------------------------------------------------------------- | ------------------------------------------- | ---------------- |
| 8   | Magic UI Adaptation Baseline         | Establish shared React/Tailwind 4 UI primitives adapted from selected Magic UI patterns.        | UIG-01, UIG-02                              | 3                |
| 9   | Saved Generator Presets              | Let signed-in users save, list, rename, delete, and recognize generator presets.                | PSET-01, PSET-02, PSET-03, GENW-01          | 3                |
| 10  | Preset Reuse and Library Integration | Connect saved presets back into the generator workflow and the user library.                    | PSET-04, GENW-02, GENW-03, GLIB-01, GLIB-02 | 3                |
| 11  | Cross-Surface UX Upgrade             | Apply the new shared UI layer to the highest-leverage surfaces and finish the milestone polish. | UIG-03                                      | 3                |

## Phase Details

### Phase 8: Magic UI Adaptation Baseline

**Goal:** Establish shared React/Tailwind 4 UI primitives adapted from selected Magic UI patterns.

**Requirements:** UIG-01, UIG-02

**Status:** Complete (verified 2026-04-09)

**Success criteria:**

1. The app exposes repo-owned shared UI primitives adapted from selected Magic UI patterns rather than route-local one-off copies.
2. Adapted motion and visual effects preserve accessibility and do not obscure generator, file, trust, or library tasks.
3. The primitive layer is ready to support generator and library feature work without requiring a broad site rewrite first.

### Phase 9: Saved Generator Presets

**Goal:** Let signed-in users save, list, rename, delete, and recognize generator presets.

**Requirements:** PSET-01, PSET-02, PSET-03, GENW-01

**Status:** Complete (verified 2026-04-11)

**Success criteria:**

1. Signed-in users can save the current generator configuration as a named preset and see it in a preset list.
2. Signed-in users can rename or delete saved presets without leaving the generator workflow behind.
3. The generator clearly communicates whether the current values are unsaved, saved, or edited from a saved preset.

### Phase 10: Preset Reuse and Library Integration

**Goal:** Connect saved presets back into the generator workflow and the user library.

**Requirements:** PSET-04, GENW-02, GENW-03, GLIB-01, GLIB-02

**Status:** Not started

**Success criteria:**

1. Saved presets can be opened from the generator route and repopulate the editor state correctly.
2. Users can regenerate and redownload from a reopened preset without re-entering the saved parameters manually.
3. The library exposes saved generator work with enough metadata to recognize and reopen the right preset directly.

### Phase 11: Cross-Surface UX Upgrade

**Goal:** Apply the new shared UI layer to the highest-leverage surfaces and finish the milestone polish.

**Requirements:** UIG-03

**Status:** Not started

**Success criteria:**

1. The generator and library surfaces use the new shared primitive layer where it measurably improves UX.
2. At least one discovery or print-detail surface adopts the same primitive layer to prove reuse beyond the generator loop.
3. The upgraded surfaces preserve performance, accessibility, and product clarity after the visual and interaction refresh.

## Coverage Check

- Total v1.1 requirements: 12
- Mapped requirements: 12
- Unmapped requirements: 0
- Coverage status: Complete

## Phase Order Rationale

1. **Magic UI baseline first** so the milestone gets a reusable primitive layer instead of page-local component churn.
2. **Preset persistence second** because saved-state primitives need a clean UI and data foundation before reopen flows make sense.
3. **Reuse and library integration third** because reopened presets depend on both persistence and a stable generator state model.
4. **Cross-surface polish last** so visual improvements are applied to proven flows instead of speculative UI work.

## Archived Milestones

- v1.0 planning artifacts and audit remain under `.planning/milestones/`.

---

_Last updated: 2026-04-11 after Phase 9 verification_
