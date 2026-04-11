# Phase 10 Research: Preset Reuse and Library Integration

**Phase:** 10  
**Date:** 2026-04-11  
**Goal:** Reopen saved presets into the generator workflow and expose them from the library with direct deep links back into generator context.

## What matters for planning this phase well

1. Phase 9 already established persistence and recognizable preset metadata, so Phase 10 should reuse those records rather than reshaping the storage model.
2. Reopen behavior needs a canonical deep-link contract shared by the generator route and library entries; otherwise preset reuse will fragment into generator-only and library-only flows.
3. The generator route still owns validation, preview, and `.3mf` generation, so reopening should feed that state machine instead of bypassing it.
4. Library integration needs to sit beside the existing print-list model rather than overload list semantics that were designed for saved prints.
5. The phase must stop at reuse and launch points. Artifact history, preset branching, and multi-generator generalization remain later work.

## Standard Stack

- React Router 7 route modules with loader-driven server data
- Prisma/Postgres for user-owned preset records
- Route-local client state on the generator page for editable values and output generation
- Lightweight library view-model shaping before rendering
- Vitest unit, route, and model tests

## Architecture Patterns

- Use a query parameter on `/generators/:slug` to identify the preset to reopen so links stay shareable inside the signed-in experience.
- Extend the preset query layer with direct lookup by preset id plus a library-oriented preset list view model.
- Keep the generator route authoritative: it loads the preset snapshot, hydrates form state from it, and keeps generate/download behavior unchanged.
- Add a dedicated preset section to the library view model instead of squeezing presets into print-list membership.
- Reuse the preset summary metadata already computed by the model layer and enrich it with generator titles from public content.

## Don’t Hand-Roll

- Do not build a second preset editor route.
- Do not auto-generate artifacts when a preset opens.
- Do not store generated files with presets to satisfy the reuse requirement.
- Do not merge presets into print lists or custom-list CRUD semantics.

## Common Pitfalls

- Treating reopened presets as a one-off client effect instead of a stable route state that library links can target.
- Losing the saved preset baseline after loading a preset, which breaks edited-versus-saved messaging.
- Reworking the library around presets instead of adding a focused entry surface.
- Accidentally implementing artifact history or broader preset taxonomy while trying to make library entries richer.

## Code Examples

- `app/routes/generator-detail.tsx` for current generator loader and editor state.
- `app/components/generator/GeneratorPresetPanel.tsx` for current preset row rendering and inline actions.
- `app/routes/library.tsx` and `app/lib/library/model.ts` for current library view model and layout.
- `app/lib/generator-presets/query.server.ts` and `app/lib/generator-presets/model.ts` for preset retrieval and recognition helpers.

## Recommended Plan Split

### Wave 1
- Extend preset query/model helpers for direct reopen and library entry shaping
- Add focused tests for preset deep-link lookup and library-facing preset summaries

### Wave 2
- Wire generator route reopening from preset context
- Keep preview, saved-state tracking, and generate/download continuity intact after reopen

### Wave 3
- Add library preset section and deep links back to generator context
- Verify the route flow and update lifecycle artifacts

## Sources

### Local
- `.planning/ROADMAP.md`
- `.planning/REQUIREMENTS.md`
- `.planning/phases/09-saved-generator-presets/09-CONTEXT.md`
- `.planning/phases/09-saved-generator-presets/09-RESEARCH.md`
- `.planning/milestones/v1.0-phases/04-accounts-and-personal-library/04-CONTEXT.md`
- `.planning/milestones/v1.0-phases/05-generator-platform-mvp/05-CONTEXT.md`
- `app/routes/generator-detail.tsx`
- `app/components/generator/GeneratorPresetPanel.tsx`
- `app/routes/library.tsx`
- `app/lib/library/model.ts`
- `app/lib/library/query.server.ts`
- `app/lib/generator-presets/model.ts`
- `app/lib/generator-presets/query.server.ts`
- `tests/accounts/library-model.test.ts`
- `tests/accounts/library-route.test.ts`
- `tests/generators/generator-detail-route.test.tsx`
- `tests/generators/generator-presets-model.test.ts`

### External
- None required beyond the repo’s current runtime and route architecture.

## Prescriptive conclusion

Use one deep-linkable preset contract on the existing generator route, load reopened presets into the current editor state without auto-generating artifacts, and add a dedicated recent-presets section to the library that links back into generator context with enough metadata to recognize each preset before opening it.
