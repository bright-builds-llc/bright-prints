---
phase: 02-discovery-and-catalog-experience
plan: 01
subsystem: ui
tags: [discovery, content, react, routing, search]
requires: []
provides:
  - "Expanded seeded discovery content"
  - "Normalized discovery item model and filter helpers"
  - "Shared discovery UI primitives"
affects: [home, catalog, detail-entry, phase-2-polish]
tech-stack:
  added: [none]
  patterns:
    [
      "Unified discovery-item read model",
      "Pure query-driven filter helpers",
      "Shared editorial discovery cards"
    ]
key-files:
  created:
    [
      "app/lib/discovery/model.ts",
      "app/lib/discovery/filter.ts",
      "app/components/discovery/DiscoveryBadge.tsx",
      "app/components/discovery/DiscoveryCard.tsx",
      "app/components/discovery/SectionHeading.tsx",
      "tests/discovery/discovery-model.test.ts",
      "content/prints/modular-cable-clip/print.yaml",
      "content/prints/stackable-desk-sign/print.yaml"
    ]
  modified:
    [
      "app/lib/content/schema.ts",
      "app/lib/content/public.ts",
      "app/lib/content/load.server.ts",
      "content/prints/sample-featured-print/print.yaml",
      "content/generators/sign/generator.yaml",
      "tests/content/content-schema.test.ts"
    ]
key-decisions:
  - "Extended the public content schema with discovery metadata instead of creating a separate ad hoc catalog config file."
  - "Kept search and filtering logic pure and URL-driven so route loaders can stay thin."
  - "Used a strong poster-like visual card primitive instead of dense marketplace tiles."
patterns-established:
  - "Discovery routes consume normalized items, not raw content records."
  - "Discovery filters are pure helpers tested independently of route modules."
requirements-completed: [DISC-01, DISC-02, DISC-03, PRNT-01]
duration: 35min
completed: 2026-04-05
---

# Phase 2: Plan 01 Summary

**Expanded the content model into a real discovery layer with seeded catalog data, normalized search/filter helpers, and reusable editorial card primitives**

## Performance

- **Duration:** 35 min
- **Started:** 2026-04-05T01:08:00Z
- **Completed:** 2026-04-05T01:43:10Z
- **Tasks:** 3
- **Files modified:** 13

## Accomplishments

- Enriched the public content model so discovery can support real editorial home and catalog surfaces.
- Built a normalized discovery-item layer and pure search/filter/sort helpers for later route loaders.
- Added shared card, badge, and section-heading primitives tuned to the Phase 2 art direction.

## Task Commits

Each task was committed atomically:

1. **Task 1: Expand the seeded discovery content and discovery-facing schema** - `4d57752` (feat)
2. **Task 2: Build a normalized discovery read model and filter helpers** - `21a27ac` (feat)
3. **Task 3: Create shared discovery presentation primitives** - `4adbe3c` (feat)

**Plan metadata:** pending

## Files Created/Modified

- `app/lib/content/schema.ts` - Discovery metadata, availability, and publish-date support
- `content/prints/modular-cable-clip/print.yaml` - New utility print seed
- `content/prints/stackable-desk-sign/print.yaml` - New editorial/signage print seed
- `app/lib/discovery/model.ts` - Unified discovery-item normalization and home slices
- `app/lib/discovery/filter.ts` - URL-driven search/filter/sort helpers
- `app/components/discovery/DiscoveryCard.tsx` - Shared editorial card primitive
- `app/components/discovery/DiscoveryBadge.tsx` - Shared badge treatment
- `app/components/discovery/SectionHeading.tsx` - Shared section heading primitive
- `tests/discovery/discovery-model.test.ts` - Discovery model/filter coverage

## Decisions Made

- Discovery metadata lives alongside the public content records so the catalog/home experience remains repo-backed and diff-friendly.
- The normalized discovery layer is the seam between raw content and route presentation, preventing route-local parsing drift.
- The shared card system is intentionally poster-like and calm to honor the locked editorial density decisions.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Restored Phase 1 compatibility exports during discovery-layer work**
- **Found during:** Task 2 (Build a normalized discovery read model and filter helpers)
- **Issue:** The existing home route and older content tests still referenced `loadFoundationContent` and `buildFoundationContent`.
- **Fix:** Reintroduced those compatibility helpers while keeping the new discovery layer separate.
- **Files modified:** `app/lib/content/public.ts`, `app/lib/content/load.server.ts`
- **Verification:** `pnpm typecheck`, `pnpm test`, and `pnpm build` passed afterward.
- **Committed in:** `21a27ac` (Task 2 commit)

**2. [Rule 3 - Blocking] Updated old test fixtures to satisfy the new discovery schema**
- **Found during:** Task 1 (Expand the seeded discovery content and discovery-facing schema)
- **Issue:** Existing content-schema tests failed because generator and print fixtures lacked discovery metadata and publish dates.
- **Fix:** Updated the fixtures to match the new schema instead of weakening the schema requirements.
- **Files modified:** `tests/content/content-schema.test.ts`
- **Verification:** `pnpm test` passed.
- **Committed in:** `4d57752` (Task 1 commit)

---

**Total deviations:** 2 auto-fixed (2 blocking)  
**Impact on plan:** Both fixes were compatibility repairs that kept the new discovery foundation clean without broadening scope.

## Issues Encountered

- None beyond the compatibility updates captured above.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- The home route can now be rebuilt on top of a richer, structured discovery model.
- The catalog route can rely on pure query/filter helpers instead of inventing route-local filtering logic.
- Shared discovery primitives are ready for both the editorial home page and the unified catalog.

---
*Phase: 02-discovery-and-catalog-experience*
*Completed: 2026-04-05*
