# Phase 9 Research: Saved Generator Presets

**Phase:** 9  
**Date:** 2026-04-11  
**Goal:** Let signed-in users save, list, rename, delete, and recognize generator presets without leaving the generator workflow.

## What matters for planning this phase well

1. The generator route already owns the editable value state, validation, and output flow, so presets should layer onto that route instead of creating a second editor surface.
2. The persistence model should reuse the existing Prisma-backed user data approach rather than inventing client-only storage or a detached service.
3. Saved-state recognition is a first-class requirement in this phase. The planner needs a clean comparison path between the in-progress generator values and the last saved preset snapshot.
4. Auth gating should follow the established Bright Prints pattern: keep browsing/generation open, gate only the save mutation, and replay the pending intent after sign-in.
5. Phase 9 must stop short of preset reopening and library integration so Phase 10 still owns reuse and cross-surface entry points.

## Standard Stack

- React Router 7 route modules
- Prisma/Postgres persistence for user-owned records
- Server loader data plus client-side generator form state
- Narrow action routes for auth-gated mutations
- Vitest unit and route-action tests

## Architecture Patterns

- Extend the existing `User`-owned persistence model in `prisma/schema.prisma` with a generator-preset record and a serialized snapshot of generator values.
- Keep the saved-preset mutation logic in server-side helpers, following the same pattern as `app/lib/library/mutations.server.ts`.
- Load the current user's presets in the generator route loader and expose only the active generator's presets to the client.
- Compare current form values to a normalized saved snapshot on the generator route so unsaved/saved/edited status remains deterministic and testable.
- Reuse the pending-intent session flow from `app/lib/auth/session.server.ts` and `app/routes/save-print.ts` for signed-out save attempts.

## Don’t Hand-Roll

- Do not gate the entire generator behind auth.
- Do not add preset reopening, library links, or generated artifact history in this phase.
- Do not couple preset persistence to generated `.3mf` artifacts; presets are about generator inputs, not stored binaries.
- Do not hide saved-state changes behind icon-only affordances.

## Common Pitfalls

- Saving raw form values without a normalized comparison path, which makes edited-versus-saved state flaky.
- Building preset CRUD as one-off route logic instead of reusing the repo’s action-route and mutation-helper pattern.
- Letting the preset UI displace the generator’s core form/preview workflow.
- Accidentally implementing Phase 10 by wiring preset list clicks into editor repopulation too early.

## Code Examples

- `app/routes/generator-detail.tsx` for the generator route’s loader/client-state split.
- `app/lib/generators/sign.ts` for the canonical sign-generator value shape and validation rules.
- `app/lib/auth/session.server.ts` for pending-intent and post-auth replay behavior.
- `app/routes/save-print.ts` and `app/routes/list-membership.ts` for stable auth-gated mutation contracts.
- `app/lib/library/mutations.server.ts` and `app/lib/library/query.server.ts` for Prisma-backed user-owned data patterns.

## Recommended Plan Split

### Wave 1
- Prisma schema and server-side preset data model
- Query/mutation helpers for create, list, rename, and delete
- Focused tests for persistence, auth replay, and normalized preset comparison

### Wave 2
- Generator route loader/action wiring for preset data and save/delete/rename mutations
- Signed-in versus signed-out preset behavior
- Explicit saved/edited/unsaved state model on the generator surface

### Wave 3
- Generator preset panel polish and recognition metadata
- End-to-end route-level verification and regression coverage
- Phase verification artifacts and residual-risk documentation

## Sources

### Local
- `.planning/ROADMAP.md`
- `.planning/REQUIREMENTS.md`
- `.planning/phases/09-saved-generator-presets/09-CONTEXT.md`
- `.planning/milestones/v1.0-phases/04-accounts-and-personal-library/04-CONTEXT.md`
- `.planning/milestones/v1.0-phases/05-generator-platform-mvp/05-CONTEXT.md`
- `prisma/schema.prisma`
- `app/routes/generator-detail.tsx`
- `app/lib/generators/sign.ts`
- `app/lib/auth/session.server.ts`
- `app/routes/save-print.ts`
- `app/routes/list-membership.ts`
- `app/lib/library/mutations.server.ts`
- `app/lib/library/query.server.ts`
- `tests/accounts/save-actions.test.ts`
- `tests/accounts/library-route.test.ts`
- `tests/accounts/library-mutations.test.ts`
- `tests/generators/sign-generator.test.ts`

### External
- None required beyond the repo’s current runtime and persistence choices.

## Prescriptive conclusion

Persist generator-scoped presets as Prisma-backed user records, load them through the existing generator route, reuse the current auth-replay mutation pattern for saves, and treat saved-state recognition as a normalized comparison problem between current generator values and the most recent saved snapshot. Keep all reuse/open-library behavior deferred to Phase 10.
