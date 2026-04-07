---
phase: 04-accounts-and-personal-library
plan: 01
subsystem: accounts
tags: [auth, sessions, account-route, prisma, runtime]
requires: []
provides:
  - "App-owned email/password auth primitives"
  - "DB-backed session token and pending-intent cookie contract"
  - "Dedicated account route and root session loader"
affects: [04-02, 04-03, phase-verification]
tech-stack:
  added: [none]
  patterns:
    [
      "Database-backed auth sessions with signed cookie payload",
      "Generic pending-intent replay contract for post-auth resume",
      "Server-only auth helpers isolated from client route rendering"
    ]
key-files:
  created:
    [
      "app/lib/auth/password.server.ts",
      "app/lib/auth/session.server.ts",
      "app/lib/auth/user.server.ts",
      "app/routes/account.tsx",
      "app/routes/account.css",
      "prisma/migrations/20260407_add_auth_primitives/migration.sql",
      "tests/accounts/auth-session.test.ts",
      "tests/accounts/auth-route.test.ts"
    ]
  modified:
    [
      ".env.example",
      "app/lib/env.server.ts",
      "app/root.tsx",
      "app/routes.ts",
      "prisma/schema.prisma",
      "tests/server/env.server.test.ts"
    ]
key-decisions:
  - "Used app-owned password hashing with Node crypto instead of adding a dedicated password dependency."
  - "Kept auth DB-backed by storing opaque session tokens in Prisma while the signed cookie carries token plus pending intent and flash state."
  - "Made current-user lookup safe for public browsing by returning null when auth runtime env is absent instead of crashing every route."
patterns-established:
  - "Account route imports server-only auth modules dynamically so the client bundle stays clean under React Router's server-code stripping."
  - "Pending intent is generic from the start, covering bookmark and future list mutations through one replay path."
requirements-completed: []
duration: 4min
completed: 2026-04-07
---

# Phase 4: Plan 01 Summary

**Added the auth/runtime foundation for Phase 4 with app-owned password auth, signed cookie session state, and a dedicated account route**

## Performance

- **Duration:** 4 min
- **Started:** 2026-04-07T22:49:10Z
- **Completed:** 2026-04-07T22:53:37Z
- **Tasks:** 3
- **Files modified:** 14

## Accomplishments

- Extended the runtime contract for auth with `SESSION_SECRET`, a password hash on `User`, and an auth migration scaffold.
- Added server-only password, session, and user helpers with a generic pending-intent contract that can survive auth redirects.
- Added a dedicated `/account` route and root loader plumbing for current-user plus flash state without turning the app shell into an account dashboard.

## Task Commits

Each task was committed atomically:

1. **Task 1: Extend the runtime auth contract for app-owned accounts** - `687026b` (feat)
2. **Task 2: Implement password, session, and pending-intent server helpers** - `a6d4223` (feat)
3. **Task 3: Add the dedicated account route and root session loader** - `a502b5f` (feat)

**Plan metadata:** pending

## Files Created/Modified

- `.env.example` - Added the session secret placeholder
- `app/lib/env.server.ts` - Added `SESSION_SECRET` parsing and a test reset helper
- `prisma/schema.prisma` - Added `passwordHash` to `User` and an expiry index on `Session`
- `prisma/migrations/20260407_add_auth_primitives/migration.sql` - Added the Phase 4 auth migration scaffold
- `app/lib/auth/password.server.ts` - Added password hashing and verification helpers
- `app/lib/auth/session.server.ts` - Added signed cookie session storage, DB-backed session tokens, flash handling, and generic pending-intent helpers
- `app/lib/auth/user.server.ts` - Added account creation and email/password sign-in helpers
- `app/root.tsx` - Added the root loader for current-user and flash data
- `app/routes.ts` - Registered the `/account` route
- `app/routes/account.tsx` - Added the dedicated sign-in/create-account route and action
- `app/routes/account.css` - Added route-local account styling
- `tests/server/env.server.test.ts` - Added session-secret env coverage
- `tests/accounts/auth-session.test.ts` - Added focused auth/session helper coverage
- `tests/accounts/auth-route.test.ts` - Added focused account-route coverage

## Decisions Made

- Chose Node crypto scrypt-based password hashing over a new dependency.
- Used a signed cookie to carry the opaque auth token plus pending-intent metadata while keeping session records in Prisma.
- Kept the root loader resilient when auth env is missing so public browsing stays available during early development.

## Deviations from Plan

- Ran `pnpm prisma generate` locally after the schema change so `tsc` and route typegen could see the updated Prisma client types.

## Issues Encountered

- The first focused test run failed because `test`, `typecheck`, and `build` were touching React Router’s generated `.react-router` types in parallel. Rerunning the tests sequentially resolved the tooling race.

## User Setup Required

- Provide `DATABASE_URL` and `SESSION_SECRET` before trying real auth flows against a running app.

## Next Phase Readiness

- Wave 2 can build bookmark and custom-list writes on top of a real current-user/session surface instead of inventing auth checks in route actions.
- The generic pending-intent contract is ready for signed-out bookmark and list writes to resume after auth.

## Verification

- `pnpm prisma generate`
- `pnpm prisma validate`
- `pnpm test -- tests/server/env.server.test.ts tests/accounts/auth-session.test.ts tests/accounts/auth-route.test.ts`
- `pnpm typecheck`
- `pnpm build`

---
*Phase: 04-accounts-and-personal-library*
*Completed: 2026-04-07*
