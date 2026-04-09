# Research: Architecture

**Date:** 2026-04-09
**Scope:** Milestone v1.1 Saved Generators and Magic UI Upgrade

## Recommended integration model

### 1. Add a runtime preset model

Introduce a runtime entity for saved generator presets.

Recommended fields:

- `id`
- `userId`
- `generatorSlug`
- `name`
- `parameters` as JSON
- `createdAt`
- `updatedAt`
- optional lightweight display metadata such as preview summary or last-generated timestamp

This should remain provider-agnostic and generator-type-aware so future generators can reuse the same persistence model.

### 2. Keep generated artifacts client-side

Do not move `.3mf` generation off the client.

Persist:

- the preset inputs
- lightweight summary metadata

Do not persist:

- full generated binary artifacts
- server-owned generation jobs

## Route and flow shape

### Existing generator route remains the primary editor

Keep `/generators/:slug` as the main generation surface.

Add:

- loader support for reading a preset into that route
- action routes for create, update, rename, delete preset operations
- library views or sections that link directly back into the generator route with preset context

### Library should absorb generator presets naturally

Do not create a disconnected “preset admin” product.

Better options:

- a generator section inside `/library`
- or a dedicated library subsection such as `/library/generators`

The user mental model should be:

“my saved work lives in my library”

not

“the generator has a hidden separate database UI”

## Magic UI adoption layer

### Build repo-owned shared primitives

Adapt selected Magic UI patterns into Bright Prints-owned components under a shared UI layer, for example:

- `app/components/ui/*`
- shared motion utilities
- shared surface/spotlight/callout patterns

Do not wire route pages directly to copied registry files without normalizing them first.

### Good adoption targets

- generator hero and result panels
- editorial discovery moments
- library empty states and saved-state affordances
- trust-adjacent motion or spotlight effects that improve comprehension

### Bad adoption targets

- core file tables where novelty would hurt clarity
- interaction-critical controls if the adapted component harms accessibility or SSR resilience

## Suggested build order

1. shared Magic UI-adapted primitive layer
2. preset persistence schema and server mutations
3. generator route save/reopen/edit loop
4. library integration for generator presets
5. selective cross-surface polish using the new primitive layer
