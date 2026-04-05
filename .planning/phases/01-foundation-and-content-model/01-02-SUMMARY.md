---
phase: 01-foundation-and-content-model
plan: 02
subsystem: content
tags: [content, zod, yaml, react-router, validation]
requires:
  - phase: 01-01
    provides: "React Router app scaffold and verification tooling"
provides:
  - "Repo-backed creator, print, and generator schemas"
  - "Server-side content loader with creator-reference validation"
  - "Seeded public content rendered through the foundation route"
affects: [discovery, print-details, generators, admin]
tech-stack:
  added: [yaml, zod]
  patterns:
    [
      "Schema-first public content authoring",
      "Server-side loader plus pure validation helpers",
      "Foundation route consumes real content data"
    ]
key-files:
  created:
    [
      "app/lib/content/schema.ts",
      "app/lib/content/public.ts",
      "app/lib/content/load.server.ts",
      "content/creators/peter.yaml",
      "content/prints/sample-featured-print/print.yaml",
      "content/generators/sign/generator.yaml",
      "scripts/validate-content.ts",
      "tests/content/content-schema.test.ts"
    ]
  modified: ["app/routes/home.tsx", "app/app.css"]
key-decisions:
  - "Separated pure public-content helpers from server-only filesystem loading."
  - "Required creator ownership references for both print and generator seed content."
  - "Used the foundation route as the first real consumer of the content loader."
patterns-established:
  - "Public content lives in repo files under content/ and is validated with zod."
  - "Route code reads typed public content instead of ad hoc YAML parsing."
requirements-completed: [ADMN-01, ADMN-03]
duration: 25min
completed: 2026-04-05
---

# Phase 1: Plan 02 Summary

**Schema-validated creator, print, and generator content rendered through the live React Router foundation route**

## Performance

- **Duration:** 25 min
- **Started:** 2026-04-04T23:40:00Z
- **Completed:** 2026-04-05T00:05:27Z
- **Tasks:** 3
- **Files modified:** 10

## Accomplishments

- Defined a typed, creator-aware public content model for creators, prints, and generators.
- Added a server-side content loader plus a CLI validation command and focused tests.
- Updated the foundation route so it renders real seeded content from the loader.

## Task Commits

Each task was committed atomically:

1. **Task 1: Define the public content schema and directory structure** - `8a5149e` (feat)
2. **Task 2: Implement the server-side content loader and validation command** - `e52ad71` (feat)
3. **Task 3: Prove the content pipeline in the foundation route** - `dc91a0f` (feat)

**Plan metadata:** pending

## Files Created/Modified

- `app/lib/content/schema.ts` - Zod schemas and inferred public content types
- `app/lib/content/public.ts` - Pure validation helpers and foundation snapshot shaping
- `app/lib/content/load.server.ts` - Filesystem-backed content loader and schema validation path
- `content/creators/peter.yaml` - Seed creator record
- `content/prints/sample-featured-print/print.yaml` - Seed print record
- `content/generators/sign/generator.yaml` - Seed generator definition
- `scripts/validate-content.ts` - CLI validation entrypoint
- `tests/content/content-schema.test.ts` - Focused tests for invalid-content failure behavior
- `app/routes/home.tsx` - Foundation route wired to the real content loader
- `app/app.css` - Small layout update to present the loaded content clearly

## Decisions Made

- Kept the content validation logic pure in `public.ts` so tests can exercise it without filesystem setup.
- Used repo-backed YAML files for seed data to prove the intended authoring path immediately.
- Allowed the route metadata description to depend on loader data so the route proves typed loader integration end-to-end.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Replaced `toSorted()` with ES2022-compatible sorting**
- **Found during:** Task 2 (Implement the server-side content loader and validation command)
- **Issue:** `toSorted()` is not available under the current `ES2022` TypeScript lib target.
- **Fix:** Switched to explicit array copies plus `.sort()` for stable compatibility.
- **Files modified:** `app/lib/content/load.server.ts`
- **Verification:** `pnpm typecheck` passed after the change.
- **Committed in:** `e52ad71` (Task 2 commit)

**2. [Rule 3 - Blocking] Simplified the validation script import path**
- **Found during:** Task 2 (Implement the server-side content loader and validation command)
- **Issue:** The standalone `tsx` script path was safer with a direct relative import than with relying on path-alias resolution.
- **Fix:** Switched `scripts/validate-content.ts` to import the loader through a relative path.
- **Files modified:** `scripts/validate-content.ts`
- **Verification:** `pnpm validate:content` passed.
- **Committed in:** `e52ad71` (Task 2 commit)

---

**Total deviations:** 2 auto-fixed (2 blocking)
**Impact on plan:** Both fixes were compatibility corrections. The content-model scope stayed intact.

## Issues Encountered

- None beyond the compatibility fixes documented above.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Phase 2 discovery work now has a typed public content source instead of placeholder data.
- Generator work already has a public definition shape to extend in Phase 5.
- Future creator support has a concrete ownership reference pattern to follow.

---
*Phase: 01-foundation-and-content-model*
*Completed: 2026-04-05*
