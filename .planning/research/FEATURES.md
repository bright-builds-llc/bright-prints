# Research: Features

**Date:** 2026-04-09
**Scope:** Milestone v1.1 Saved Generators and Magic UI Upgrade

## Saved generator presets

### Table stakes

- Signed-in user can save the current generator settings as a named preset.
- Signed-in user can see a list of saved presets.
- Signed-in user can reopen a preset and repopulate the generator form.
- Signed-in user can rename or delete a saved preset.
- Signed-in user can redownload from a reopened preset without re-entering values manually.

### Differentiators

- Presets feel like part of the user’s library, not a separate hidden tool state.
- Each preset shows enough metadata to be recognizable at a glance.
- Revisit flow is direct and confidence-building: open, preview, tweak, generate.

### Anti-features

- Saving opaque blobs that users cannot recognize later.
- Treating presets as generic CRUD rows with no connection to the generator experience.

## Generator workflow confidence

### Table stakes

- Better saved-state feedback after a preset is created or updated.
- Clear distinction between current unsaved values and a named saved preset.
- Reopen flow that makes it obvious what will happen before generation runs again.

### Differentiators

- Preview, preset identity, and output metadata feel like one continuous workflow.
- Users can tell whether they are editing an existing preset or starting fresh.

### Anti-features

- Forcing users to guess whether they are overwriting a preset.
- Overbuilding version history or artifact history before basic revisit/edit loops are solid.

## Magic UI-inspired UX upgrade

### Table stakes

- Shared primitives for animated emphasis, callouts, surface hierarchy, and richer empty states.
- Selective upgrades on the surfaces where Bright Prints is most product-defining:
  - discovery/home
  - generator detail
  - print detail
  - library

### Differentiators

- Motion feels intentional and product-aligned rather than ornamental.
- Adapted components make the product feel more editorial and alive without compromising clarity.
- The adopted patterns become reusable infrastructure for later milestones.

### Anti-features

- A broad visual rewrite with no product-purpose prioritization.
- Dropping in flashy components that obscure print trust, file clarity, or generator usability.

## Recommended milestone boundary

Include in v1.1:

- saved generator presets
- revisit/edit/redownload loop
- selective Magic UI adoption where it improves the return-visit experience

Defer beyond v1.1:

- server-stored generated file archives
- many new generator types
- full live commerce checkout
- multi-creator publishing
- CMS migration
