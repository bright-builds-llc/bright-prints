# Phase 5 Research: Generator Platform MVP

**Phase:** 5  
**Date:** 2026-04-08  
**Goal:** Ship the sign-generator foundation and the first reusable generator authoring path.

## What matters for planning this phase well

1. The app already has the right route-module shape, so the generator should stay in the existing React Router flow rather than introducing a backend generation service.
2. The generator authoring path needs to be repo-backed and schema-validated, which means the content schema should own the generator definition and parameter bounds.
3. The first generator does not need a heavyweight geometry stack. A deterministic in-browser mesh builder plus `.3mf` packaging is sufficient for the MVP.
4. Validation must stay ahead of generation so invalid text and dimensions do not produce fake downloads or broken artifacts.

## Standard Stack

- React Router 7 route modules
- Client-side generator state and validation inside the generator route
- Repo-backed generator definitions in `content/generators/...`
- Pure generator helpers in `app/lib/generators/...`
- `jszip` for `.3mf` packaging

## Architecture Patterns

- Use a schema-driven `sign-v1` definition in content, not hardcoded route-only behavior.
- Keep mesh generation pure and testable in `app/lib/generators/sign.ts`.
- Keep `.3mf` packaging isolated in `app/lib/generators/three-mf.ts`.
- Keep route rendering declarative and loader-driven while using client state for the interactive generator flow.

## Don’t Hand-Roll

- Do not introduce a backend generation worker for the first sign generator.
- Do not fake the `.3mf` output with a mislabeled plain-text download.
- Do not let invalid inputs fall through to generation.

## Common Pitfalls

- Treating the generator like a detached tool instead of a first-class product surface.
- Hardcoding generator behavior by slug instead of reading a schema-driven definition.
- Generating files without enough metadata to explain what was produced.

## Code Examples

- `app/lib/generators/sign.ts` for validation, preview layout, mesh generation, and artifact creation.
- `app/lib/generators/three-mf.ts` for ZIP packaging.
- `app/routes/generator-detail.tsx` for the route/UI integration.

## Recommended Plan Split

### Wave 1
- Generator schema and sign definition
- Pure generator helpers and tests

### Wave 2
- Generator route, preview, inline validation, and artifact download panel

### Wave 3
- Runtime hardening and public-route fallback checks

## Sources

### Local
- `content/generators/sign/generator.yaml`
- `app/lib/content/schema.ts`
- `app/lib/generators/sign.ts`
- `app/lib/generators/sign-font.ts`
- `app/lib/generators/three-mf.ts`
- `app/routes/generator-detail.tsx`

### External
- None required beyond package documentation already embodied in the installed toolchain and the repo’s current runtime choices.

## Prescriptive conclusion

Use a schema-driven `sign-v1` generator definition, keep generation fully client-side, package real `.3mf` output in-browser, and prove the output path with focused tests on both geometry and archive contents.
