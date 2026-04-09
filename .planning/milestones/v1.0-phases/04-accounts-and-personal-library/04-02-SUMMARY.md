---
phase: 04-accounts-and-personal-library
plan: 02
subsystem: library-writes
tags: [bookmarks, lists, mutations, fetchers, auth-resume]
requires:
  - phase: 04-01
    provides: "Account route, DB-backed sessions, and generic pending-intent contract"
provides:
  - "Bookmarks invariant and list mutation services"
  - "Explicit save/list action route contracts"
  - "Fetcher-driven save controls on discovery and print detail"
affects: [04-03, 04-04, phase-verification]
tech-stack:
  added: [none]
  patterns:
    [
      "Auth-gated action routes with stable intent contracts",
      "Transaction-backed bookmark/list mutations keyed by printSlug",
      "Root-loader bookmark state feeding explicit save controls"
    ]
key-files:
  created:
    [
      "app/lib/library/lists.server.ts",
      "app/lib/library/mutations.server.ts",
      "app/routes/save-print.ts",
      "app/routes/list-membership.ts",
      "app/components/library/SavePrintButton.tsx",
      "app/components/print-detail/PrintSaveActions.tsx",
      "tests/accounts/library-mutations.test.ts",
      "tests/accounts/save-actions.test.ts",
      "prisma/migrations/20260407_add_saved_list_name_invariant/migration.sql"
    ]
  modified:
    [
      "prisma/schema.prisma",
      "app/root.tsx",
      "app/routes.ts",
      "app/lib/auth/session.server.ts",
      "app/routes/account.tsx",
      "app/components/discovery/DiscoveryCard.tsx",
      "app/routes/print-detail.tsx",
      "app/routes/print-detail.css",
      "app/app.css"
    ]
key-decisions:
  - "Used a unique `(userId, name)` constraint plus fixed `Bookmarks` service rules to enforce one bookmarks list per user without requiring a partial unique index."
  - "Locked the mutation API shape around explicit `intent` values for `/actions/save-print` and `/actions/list-membership` so later library UI can post predictable payloads."
  - "Fed bookmarked slug state through the root loader so save controls can render explicit text state before any mutation runs."
patterns-established:
  - "Signed-out bookmark and list writes now all funnel through the same pending-intent auth handoff instead of route-specific resume hacks."
  - "Discovery-card save UI stays separate from the card link instead of nesting interactive elements."
requirements-completed: []
duration: 5min
completed: 2026-04-07
---

# Phase 4: Plan 02 Summary

**Added the real bookmark and custom-list write layer, then wired explicit save controls into discovery and print detail**

## Performance

- **Duration:** 5 min
- **Started:** 2026-04-07T23:01:11Z
- **Completed:** 2026-04-07T23:09:16Z
- **Tasks:** 3
- **Files modified:** 18

## Accomplishments

- Enforced the fixed `Bookmarks` list rules and transactional bookmark/list mutation helpers.
- Added the two auth-gated action routes with explicit `intent` contracts for bookmark, list CRUD, and list membership writes.
- Wired fetcher-based save controls into discovery cards and print detail, backed by root-loader bookmark state and the new action routes.

## Task Commits

Each task was committed atomically:

1. **Task 1: Enforce the fixed `Bookmarks` list invariant and list-write services** - `5f44abb` (feat)
2. **Task 2: Add auth-gated save and list-mutation route modules** - `fa5cd71` (feat)
3. **Task 3: Wire fetcher save controls into discovery and print-detail surfaces** - `dcb21ba` (feat)

**Plan metadata:** pending

## Files Created/Modified

- `prisma/schema.prisma` - Added the per-user saved-list name uniqueness invariant
- `prisma/migrations/20260407_add_saved_list_name_invariant/migration.sql` - Added the Phase 4 saved-list invariant migration scaffold
- `app/lib/library/lists.server.ts` - Added bookmarks and custom-list query helpers
- `app/lib/library/mutations.server.ts` - Added transactional bookmark, list CRUD, list membership, and pending-intent replay helpers
- `app/routes/save-print.ts` - Added the bookmark save/remove action route with auth-resume behavior
- `app/routes/list-membership.ts` - Added the list CRUD/membership action route with auth-resume behavior
- `app/root.tsx` - Added bookmarked-print slug data to the root loader for explicit save-state rendering
- `app/routes.ts` - Registered the Wave 2 action routes
- `app/routes/account.tsx` - Wired post-auth replay into the real bookmark/list mutation helpers
- `app/components/library/SavePrintButton.tsx` - Added the reusable fetcher save control
- `app/components/print-detail/PrintSaveActions.tsx` - Added the detail-page save and nearby list-organization controls
- `app/components/discovery/DiscoveryCard.tsx` - Split the catalog save control away from the card link
- `app/routes/print-detail.tsx` - Added custom-list context and detail-page save controls
- `app/routes/print-detail.css` - Added save/list section styling for print detail
- `app/app.css` - Added base save-button styling
- `tests/accounts/library-mutations.test.ts` - Added coverage for bookmarks invariants and mutation replay
- `tests/accounts/save-actions.test.ts` - Added coverage for save/list action contracts and signed-out auth redirects

## Decisions Made

- Chose fixed `Bookmarks` naming plus `(userId, name)` uniqueness over a more brittle database-only partial uniqueness strategy.
- Let signed-out save and list writes redirect into auth with the exact mutation payload preserved in session state.
- Used root-loader bookmark state as the shared initial source of truth for explicit save labels instead of inventing per-page client caches.

## Deviations from Plan

- The action-route implementation required a small update to `app/routes/account.tsx` so successful sign-in or account creation could replay the real pending mutation instead of the Wave 1 no-op handoff.

## Issues Encountered

- A full verification run initially failed because the action routes still imported server-only helpers at module scope; moving those imports into the route `action()` functions resolved the build issue.

## User Setup Required

- Provide `DATABASE_URL` and `SESSION_SECRET` before trying real bookmark or list writes against a running app.

## Next Phase Readiness

- Wave 3 can build `/library` directly on top of the locked action-route contracts instead of inventing new write APIs.
- The app now has enough runtime state and mutation wiring to support a real library read model and inline management surface.

## Verification

- `pnpm prisma generate`
- `pnpm prisma validate`
- `pnpm test -- tests/accounts/library-mutations.test.ts tests/accounts/save-actions.test.ts`
- `pnpm lint` (warning only: existing Fast Refresh rule on `app/routes/account.tsx`)
- `pnpm typecheck`
- `pnpm build`

---
*Phase: 04-accounts-and-personal-library*
*Completed: 2026-04-07*
