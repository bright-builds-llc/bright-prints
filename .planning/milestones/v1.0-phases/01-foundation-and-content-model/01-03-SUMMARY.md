---
phase: 01-foundation-and-content-model
plan: 03
subsystem: database
tags: [prisma, env, privacy, database, server]
requires:
  - phase: 01-01
    provides: "React Router app scaffold and shared tooling"
provides:
  - "Server-only environment parsing"
  - "Prisma runtime schema baseline"
  - "Written public-versus-private data boundary guidance"
affects: [auth, accounts, commerce, operations]
tech-stack:
  added: [prisma]
  patterns:
    [
      "Server-only env modules",
      "Prisma runtime models for private state",
      "Public content versus private runtime documentation"
    ]
key-files:
  created:
    [
      "app/lib/env.server.ts",
      "app/lib/db.server.ts",
      ".env.example",
      "prisma/schema.prisma",
      "prisma.config.ts",
      "docs/architecture/private-data-boundaries.md",
      "tests/server/env.server.test.ts"
    ]
  modified: []
key-decisions:
  - "Kept `DATABASE_URL` optional in early parsing so the app can bootstrap before a database exists."
  - "Modeled private runtime state with string references to repo-backed print slugs instead of duplicating public content into Prisma."
  - "Used Prisma 7's config-based datasource pattern instead of older schema-url conventions."
patterns-established:
  - "Secrets are parsed only from `*.server.ts` modules."
  - "Private runtime entities live in Prisma; public creator/print/generator metadata stays repo-backed."
requirements-completed: [PLAT-03]
duration: 25min
completed: 2026-04-05
---

# Phase 1: Plan 03 Summary

**Server-only environment parsing, Prisma runtime models, and an explicit public-versus-private data boundary for the open-source repo**

## Performance

- **Duration:** 25 min
- **Started:** 2026-04-04T23:40:00Z
- **Completed:** 2026-04-05T00:05:27Z
- **Tasks:** 3
- **Files modified:** 7

## Accomplishments

- Added a validated server-only environment module and example env file.
- Introduced a Prisma runtime schema for users, sessions, saved lists, and commerce intent.
- Documented the privacy boundary between repo-backed public content, private runtime data, and secrets.

## Task Commits

Each task was committed atomically:

1. **Task 1: Create server-only environment parsing** - `94b40f9` (chore)
2. **Task 2: Add a private runtime database baseline** - `7b1c84f` (feat)
3. **Task 3: Document and enforce the public/private boundary** - `b225f59` (chore)

**Plan metadata:** pending

## Files Created/Modified

- `app/lib/env.server.ts` - Server-only env parsing and caching
- `tests/server/env.server.test.ts` - Focused env parsing tests
- `.env.example` - Documented environment variable contract
- `prisma/schema.prisma` - Runtime-private data model baseline
- `prisma.config.ts` - Prisma 7 datasource configuration
- `app/lib/db.server.ts` - Deferred Prisma client access through a server-only module
- `docs/architecture/private-data-boundaries.md` - Written policy for public/private data placement

## Decisions Made

- Allowed the app to bootstrap without `DATABASE_URL`, but made the DB entrypoint fail fast if runtime database access is attempted without it.
- Used string `printSlug` references in runtime models so private state can point at repo-backed public content without duplicating it.
- Captured the privacy model in docs during Phase 1 instead of relying on conventions to emerge later.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added `prisma.config.ts` for Prisma 7**
- **Found during:** Task 2 (Add a private runtime database baseline)
- **Issue:** Prisma 7 no longer accepts datasource URLs in `schema.prisma`, so the initial schema shape failed `prisma generate`.
- **Fix:** Moved datasource URL configuration into a root `prisma.config.ts` file and removed the old schema-level `url`.
- **Files modified:** `prisma/schema.prisma`, `prisma.config.ts`
- **Verification:** `pnpm prisma generate` and `pnpm prisma:validate` both passed afterward.
- **Committed in:** `7b1c84f` (Task 2 commit)

**2. [Rule 3 - Blocking] Removed the unsupported PrismaClient datasource override**
- **Found during:** Task 2 (Add a private runtime database baseline)
- **Issue:** The older `datasources` constructor override shape no longer typechecked cleanly under Prisma 7.
- **Fix:** Switched `app/lib/db.server.ts` to use the generated client with config-driven datasource resolution, while still guarding access behind a `DATABASE_URL` check.
- **Files modified:** `app/lib/db.server.ts`
- **Verification:** `pnpm typecheck` passed.
- **Committed in:** `7b1c84f` (Task 2 commit)

---

**Total deviations:** 2 auto-fixed (2 blocking)
**Impact on plan:** Both fixes were required to align the runtime baseline with current Prisma behavior. The privacy-boundary goal stayed unchanged.

## Issues Encountered

- `pnpm` skipped Prisma build scripts during install, so `pnpm prisma generate` had to be run explicitly once the schema existed.

## User Setup Required

**External services require manual configuration.** Before database-backed features can run outside local scaffolding:
- Add a real `DATABASE_URL`
- Provision the backing PostgreSQL service

## Next Phase Readiness

- Account and commerce phases now have a private runtime schema to extend rather than inventing one later.
- The repo has an explicit rule set for what may and may not be public.
- The DB access path is server-only and ready for later auth/session work.

---
*Phase: 01-foundation-and-content-model*
*Completed: 2026-04-05*
