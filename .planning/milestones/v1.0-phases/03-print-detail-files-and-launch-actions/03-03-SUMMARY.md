---
phase: 03-print-detail-files-and-launch-actions
plan: 03
subsystem: print-detail
tags: [downloads, launch, contact, server-route, verification]
requires:
  - phase: 03-01
    provides: "Fixture-backed repo file paths and print-detail data model"
  - phase: 03-02
    provides: "Phase 3 route hierarchy ready for real actions"
provides:
  - "Server-backed print download route"
  - "Allowlisted launch/request contract"
  - "Real file and contact links on the print page"
affects: [03-04, phase-verification, runtime-verification]
tech-stack:
  added: [none]
  patterns:
    [
      "Internal file downloads served by attachment responses",
      "Explicit launch support assessment with honest fallback messaging",
      "Stateless request/contact actions via prefilled repo issue links"
    ]
key-files:
  created:
    [
      "app/routes/print-download.ts",
      "app/lib/prints/download.server.ts",
      "app/lib/prints/launch.ts",
      "tests/prints/print-download.test.ts",
      "tests/prints/print-launch.test.ts"
    ]
  modified:
    [
      "app/routes.ts",
      "app/lib/content/load.server.ts",
      "app/lib/prints/detail.ts",
      "app/components/print-detail/PrintHeroActions.tsx",
      "app/components/print-detail/PrintFileSections.tsx",
      "app/routes/print-detail.tsx"
    ]
key-decisions:
  - "Used a server attachment route for repo-backed files instead of client-side fetch or `download`-attribute-only behavior."
  - "Modeled launch support as an allowlist assessment and kept the local Bright Prints host in fallback mode rather than inventing a universal slicer handoff."
  - "Used a prefilled GitHub issue URL for the temporary stateless physical-print request path because the repo has a public origin but no explicit email contact in content."
patterns-established:
  - "Print detail route resolves file links and hero actions after building the pure read model, preserving business logic separation."
  - "Runtime CTA verification can be done against SSR HTML with curl when the page renders its primary text and links server-side."
requirements-completed: []
duration: 4min
completed: 2026-04-06
---

# Phase 3: Plan 03 Summary

**Added real internal download routes, explicit external-file behavior, launch fallback messaging, and a stateless physical-print request path**

## Performance

- **Duration:** 4 min
- **Started:** 2026-04-06T09:58:41Z
- **Completed:** 2026-04-06T10:01:55Z
- **Tasks:** 3
- **Files modified:** 11

## Accomplishments

- Added a dedicated attachment route for repo-backed print files and verified it against the checked-in fixture bytes.
- Added a launch/contact contract that only surfaces slicer launch on allowlisted hosts and otherwise explains the download fallback honestly.
- Wired the print detail page so internal files, external files, and physical-print request actions now point to real destinations.

## Task Commits

Each task was committed atomically:

1. **Task 1: Add a server-backed download path for repo files** - `ac0c6f3` (feat)
2. **Task 2: Add the launch-capability registry and availability-aware CTA rules** - `9849a01` (feat)
3. **Task 3: Wire download, external, request/contact, and launch actions into the print page honestly** - `e7df450` (feat)

**Plan metadata:** pending

## Files Created/Modified

- `app/routes.ts` - Added the repo-backed print download route
- `app/routes/print-download.ts` - Added the attachment-response route module
- `app/lib/content/load.server.ts` - Exported a print content directory helper for safe file resolution
- `app/lib/prints/download.server.ts` - Added safe repo-file resolution and attachment response creation
- `app/lib/prints/launch.ts` - Added launch support assessment and stateless request/contact URL generation
- `app/lib/prints/detail.ts` - Extended file items so route wiring can resolve concrete destinations
- `app/components/print-detail/PrintHeroActions.tsx` - Switched hero CTAs from section anchors to resolved action links and fallback notes
- `app/components/print-detail/PrintFileSections.tsx` - Made file rows clickable with safe internal/external behavior
- `app/routes/print-detail.tsx` - Wired resolved file links and hero actions into the Phase 3 page
- `tests/prints/print-download.test.ts` - Added coverage for real fixture-byte downloads and invalid file access
- `tests/prints/print-launch.test.ts` - Added coverage for allowlisted launch support and request/contact link generation

## Decisions Made

- Kept launch support in fallback mode on the local Bright Prints host instead of pretending direct slicer launch exists there.
- Used GitHub issue creation as the lightweight request/contact action because it is stateless, public, and repo-backed.
- Differentiated internal downloads and external file destinations directly in the rendered links and metadata.

## Deviations from Plan

None - plan executed as written.

## Issues Encountered

None.

## User Setup Required

None - all verification used local routes and fixture files only.

## Next Phase Readiness

- Wave 4 can focus on semantics, focus order, and final polish because the real link and request behaviors are already in place.
- Phase verification now has a concrete internal download route and request/contact path to check against the must-haves.

## Verification

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`
- `curl -s http://127.0.0.1:4184/prints/modular-cable-clip`
- `curl -s http://127.0.0.1:4184/prints/stackable-desk-sign`
- `curl -s http://127.0.0.1:4184/prints/sample-featured-print`
- `curl -I -s http://127.0.0.1:4184/prints/modular-cable-clip/files/0/download`

---
*Phase: 03-print-detail-files-and-launch-actions*
*Completed: 2026-04-06*
