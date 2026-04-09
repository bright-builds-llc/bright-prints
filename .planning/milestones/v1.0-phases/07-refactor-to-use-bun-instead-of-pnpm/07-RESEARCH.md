# Phase 7 Research: Refactor to Use Bun Instead of Pnpm

**Phase:** 7  
**Date:** 2026-04-08  
**Goal:** Replace pnpm-based package management, lockfile, docs, and container assumptions with Bun while preserving app behavior.

## What matters for planning this phase well

1. The repo only has a small explicit `pnpm` surface: `package.json`, `pnpm-lock.yaml`, `README.md`, and `Dockerfile`.
2. Bun can replace the package-manager workflow without forcing a full application runtime migration.
3. The React Router server output currently behaves better under Node runtime than under direct Bun runtime, so runtime stability matters more than ideological purity.
4. Docker must still include repo-backed public `content/` and the generated Prisma client after the migration.

## Standard Stack

- Bun for install, lockfile, and script invocation
- `bun.lock` as the committed lockfile
- Bun for build steps
- Node runtime for the final production server process

## Architecture Patterns

- Keep the existing npm-style script names and run them through Bun.
- Preserve the production server runtime through the React Router serve CLI under Node.
- Keep the migration narrow: package-manager and delivery-surface changes only.

## Don’t Hand-Roll

- Do not change unrelated app behavior just because the package manager is changing.
- Do not force Bun runtime where it demonstrably breaks the current server output.
- Do not leave Docker on a mixed or half-migrated lockfile/install path.

## Common Pitfalls

- Migrating to Bun install/build but forgetting the runtime server command.
- Forgetting to carry `content/` or generated Prisma client files into the final image.
- Claiming the migration is complete while still shipping `pnpm-lock.yaml`.

## Recommended Plan Split

### Wave 1
- Bun lockfile, package metadata, and schema/tooling verification

### Wave 2
- Docker/runtime and docs migration

### Wave 3
- End-to-end Bun verification and final cleanup

## Sources

### Local
- `package.json`
- `README.md`
- `Dockerfile`
- `pnpm-lock.yaml`
- `app/lib/db.server.ts`

### External
- Official Bun docs were consulted for lockfile migration, `bun install --frozen-lockfile`, and Docker guidance.

## Prescriptive conclusion

Make the repo Bun-first for install/build/docs, keep the production server on Node, and treat Docker runtime behavior as part of the migration’s definition of done.
