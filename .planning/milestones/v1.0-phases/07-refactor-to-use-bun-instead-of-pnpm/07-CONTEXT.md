# Phase 7: Refactor to Use Bun Instead of Pnpm - Context

**Gathered:** 2026-04-08
**Status:** Ready for planning

<domain>
## Phase Boundary

Replace the repository's `pnpm`-specific package-manager assumptions with Bun across local development, lockfile state, documentation, and containerized delivery while preserving application behavior. This phase is about operational tooling, not user-facing product features.

</domain>

<decisions>
## Implementation Decisions

### Migration scope
- Replace the repo lockfile and package-manager declaration with Bun equivalents.
- Update developer docs and Docker build/install steps to use Bun instead of `pnpm`.
- Keep existing script names and task surfaces (`lint`, `test`, `build`, `typecheck`) so the rest of the repo workflow does not need a second operational rewrite.

### Runtime behavior
- Use Bun as the package manager and build tool entrypoint.
- Preserve Node runtime compatibility for the production server where Bun runtime behavior diverges from the current React Router server output.
- Keep public routes reachable even when auth env is missing; package-manager migration must not regress that behavior.

### Verification expectations
- Verify the repo with Bun-native commands, not just the legacy package-manager path.
- Verify the Docker image builds and serves a public route successfully after the migration.

### Claude's Discretion
- Exact Bun image and lockfile wiring as long as the repo is Bun-first afterward.
- Exact placement of Bun-related docs updates if the repo only mentions `pnpm` in a small number of files.

</decisions>

<specifics>
## Specific Ideas

- The migration should minimize behavioral drift: change package-manager plumbing first, not unrelated app code.
- A Node runtime in the final container is acceptable if that is what keeps the React Router server stable while still making Bun the package manager.

</specifics>

<deferred>
## Deferred Ideas

- Broader runtime experimentation with Bun beyond package-manager and build/install flows.
- Any nonessential script renaming or workflow reshaping outside the direct `pnpm` → Bun migration.

</deferred>

---

*Phase: 07-refactor-to-use-bun-instead-of-pnpm*
*Context gathered: 2026-04-08*
