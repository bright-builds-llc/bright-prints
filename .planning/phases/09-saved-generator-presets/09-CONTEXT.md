---
phase: 09-saved-generator-presets
generated_by: gsd-discuss-phase
lifecycle_mode: yolo
phase_lifecycle_id: 09-2026-04-09T11-00-35
generated_at: 2026-04-09T11:00:35.815Z
---

# Phase 9 Context: Saved Generator Presets

## Goal

Let signed-in users save, list, rename, delete, and recognize generator presets without turning this phase into preset reopening or library integration work.

## Locked Decisions

- Presets should be stored as account-owned database records keyed by `userId` and `generatorSlug`, with the generator input values persisted as structured JSON.
- The generator route should stay primarily client-side for live preview and artifact generation; preset persistence should use thin server actions and loader revalidation around that client state.
- Signed-out or expired-session preset mutations should follow the existing pending-intent auth pattern so the save can resume after sign-in.
- The generator should communicate exact preset state from current values: unsaved, saved as a matching preset, or edited from the last active saved preset.
- Phase 9 should keep preset management on the generator surface itself; reopening presets from the library belongs to Phase 10.

## Selected Product Direction

- Save the current sign configuration under a user-provided preset name.
- Show a generator-scoped preset list on the generator page with rename and delete controls.
- Surface preset state near the form so users can tell whether their current values are already saved.
- Keep the saved values generic enough that later phases can reopen them without a schema rewrite.

## Safe Adoption Surfaces

- Prisma persistence for account-owned generator presets
- generator preset action endpoint with pending-intent replay
- generator route loader and UI panel
- pure preset-status model and focused route/mutation tests

## Deferred To Later Phases

- reopening a saved preset into the editor
- library exposure for saved presets
- regenerated artifact history per preset
- multi-generator preset support beyond the sign generator UX

## Verification Expectations

- signed-in users can save, list, rename, and delete sign presets
- saved preset names are scoped safely per user and generator
- the generator shows unsaved, saved, and edited-from-saved states based on exact value matching
- signed-out preset saves preserve intent through the account flow
