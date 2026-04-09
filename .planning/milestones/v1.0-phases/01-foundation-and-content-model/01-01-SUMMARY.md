---
phase: 01-foundation-and-content-model
plan: 01
subsystem: infra
tags: [react-router, railway, docker, pnpm, typescript]
requires: []
provides:
  - "React Router 7 framework-mode application scaffold"
  - "pnpm-based project scripts and dependency baseline"
  - "Railway-compatible Docker deployment path"
  - "Minimal Bright Prints foundation route"
affects: [content, database, auth, generators, deployment]
tech-stack:
  added: [react-router, pnpm, vite, tailwindcss, eslint, vitest, prisma, zod]
  patterns:
    [
      "React Router framework-mode app structure",
      "Dockerized Railway deployment",
      "Tooling-first phase bootstrap"
    ]
key-files:
  created:
    [
      "package.json",
      "pnpm-lock.yaml",
      "Dockerfile",
      ".dockerignore",
      "app/root.tsx",
      "app/routes.ts",
      "app/routes/home.tsx",
      "app/app.css"
    ]
  modified: [".gitignore", "README.md"]
key-decisions:
  - "Normalized the official React Router scaffold to pnpm so the repo follows its TS/JS package-manager rule."
  - "Used a Docker-based Railway deployment path instead of platform-specific hosting assumptions."
  - "Installed Phase 1 shared dependencies early to avoid package manifest conflicts in Wave 2."
patterns-established:
  - "Foundation routes stay intentionally minimal until the discovery phase owns presentation scope."
  - "Build, lint, typecheck, and Docker verification are part of the bootstrap definition of done."
requirements-completed: [PLAT-01]
duration: 45min
completed: 2026-04-04
---

# Phase 1: Plan 01 Summary

**React Router 7 scaffold with pnpm tooling, Railway-ready Docker deployment, and a minimal Bright Prints foundation route**

## Performance

- **Duration:** 45 min
- **Started:** 2026-04-04T23:14:00Z
- **Completed:** 2026-04-04T23:59:47Z
- **Tasks:** 3
- **Files modified:** 13

## Accomplishments

- Bootstrapped a real React Router 7 framework-mode app in the repository using `pnpm`.
- Added a working Docker-based deployment path suitable for Railway.
- Replaced the stock welcome route with a minimal Bright Prints foundation screen.

## Task Commits

Each task was committed atomically:

1. **Task 1: Scaffold and normalize the React Router 7 app** - `f0d6ca8` (chore)
2. **Task 2: Add Dockerized Railway deployment support** - `6ba0ebc` (chore)
3. **Task 3: Ship a minimal foundation route** - `bf5bdbf` (feat)

**Plan metadata:** pending

## Files Created/Modified

- `package.json` - Project scripts and shared Phase 1 dependencies
- `pnpm-lock.yaml` - Locked dependency graph for local and Docker installs
- `eslint.config.js` - Flat ESLint configuration for TS/React Router files
- `Dockerfile` - Multi-stage `pnpm`-based container build for Railway
- `.dockerignore` - Reduced Docker build context
- `app/root.tsx` - Document shell and error boundary
- `app/routes.ts` - Root route mapping
- `app/routes/home.tsx` - Minimal Bright Prints foundation route
- `app/app.css` - Foundation-level styling for the app shell
- `README.md` - Local development and Railway deployment notes

## Decisions Made

- Used the official React Router 7 scaffold shape instead of inventing a custom bootstrap layout.
- Kept the initial UI intentionally minimal so Phase 2 can own the discovery experience properly.
- Added `prisma`, `zod`, `yaml`, `tsx`, and test/lint tooling now to keep Wave 2 plans from conflicting over shared infrastructure.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Downgraded unsupported toolchain majors**
- **Found during:** Task 1 (Scaffold and normalize the React Router 7 app)
- **Issue:** `prettier@4`, `@types/react-dom@19.2.7`, `typescript@6`, and `eslint@10` caused install failures or peer-range conflicts with the current React Router stack.
- **Fix:** Pinned `prettier` to `3.8.1`, `@types/react-dom` to `19.2.3`, `typescript` to `5.9.3`, and `eslint/@eslint/js` to the `9.x` line.
- **Files modified:** `package.json`, `pnpm-lock.yaml`
- **Verification:** `pnpm install`, `pnpm lint`, `pnpm typecheck`, and `pnpm build` all passed after the adjustments.
- **Committed in:** `f0d6ca8` (Task 1 commit)

**2. [Rule 3 - Blocking] Adjusted ESLint for React Router route exports**
- **Found during:** Task 3 (Ship a minimal foundation route)
- **Issue:** The default fast-refresh lint rule flagged framework exports like `meta` and `links`, and the route file had one empty-parameter lint error.
- **Fix:** Allowed React Router export names in ESLint config and simplified the `home` route metadata function.
- **Files modified:** `eslint.config.js`, `app/routes/home.tsx`
- **Verification:** `pnpm lint` passed cleanly afterward.
- **Committed in:** `bf5bdbf` (Task 3 commit)

---

**Total deviations:** 2 auto-fixed (2 blocking)
**Impact on plan:** Both fixes were toolchain corrections required to make the official scaffold viable in this repo. No scope creep.

## Issues Encountered

- The first Docker build spent significant time downloading the base image layers before making visible progress, but the final image build completed successfully.

## User Setup Required

**External services require manual configuration.** Railway still needs to be linked and configured by a human:
- Link the GitHub repository to a Railway project
- Enable production autodeploy from `main`
- Add runtime variables such as `DATABASE_URL` when the database exists

## Next Phase Readiness

- The repo now has a working app shell, verification scripts, and a deployable Docker path.
- Wave 2 can proceed without reopening the framework decision or package-manager/tooling baseline.
- Content-model and private-runtime work can now happen in parallel on top of a stable scaffold.

---
*Phase: 01-foundation-and-content-model*
*Completed: 2026-04-04*
