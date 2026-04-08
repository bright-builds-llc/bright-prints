---
phase: 07-refactor-to-use-bun-instead-of-pnpm
plan: 01
completed: 2026-04-08
---

# Phase 7: Plan 01 Summary

Migrated the repo from pnpm-specific workflow assumptions to Bun.

- Commits:
  - `710c496` — schema-driven sign generator foundation (carried forward from the already-clean repo base before Phase 7; not phase-specific)
  - `1ad20c4` — preserve public routes without auth env (pre-existing clean-state fix that Phase 7 had to keep intact)
  - Phase 7 code commits are the Bun migration and runtime compatibility updates made after Phase 7 started.

Core phase outcomes:
- `package.json` now declares Bun as the package manager.
- `bun.lock` is committed and `pnpm-lock.yaml` is removed.
- `README.md` uses Bun commands.
- `Dockerfile` uses Bun for install/build and Node for the final runtime server command.
- The Docker image includes generated Prisma client files and repo-backed `content/`.
