# Phase 9: Saved Generator Presets - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-11
**Phase:** 09-saved-generator-presets
**Areas discussed:** preset surface, auth and save behavior, preset recognition, current-state messaging

---

## Preset surface

| Option | Description | Selected |
|--------|-------------|----------|
| Separate library/account management screen | Move preset management off the generator route into a dedicated saved-items surface | |
| Inline generator workflow panel | Keep presets directly on the generator route alongside form/output work | ✓ |
| Modal-only preset manager | Open save/list/manage flows in modal overlays without a persistent preset area | |

**User's choice:** Yolo recommendation selected the inline generator workflow panel.
**Notes:** Phase 9 is about workflow support for the current generator, not a broader saved-items product surface. Reopen and library integration are intentionally deferred.

---

## Auth and save behavior

| Option | Description | Selected |
|--------|-------------|----------|
| Require auth before using the generator | Gate the whole generator behind sign-in | |
| Keep browsing/generation open, gate save only | Match the existing save-intent pattern and replay after sign-in | ✓ |
| Hide preset UI entirely when signed out | Do not show preset capability until after login | |

**User's choice:** Yolo recommendation kept generator usage open and gated only save actions.
**Notes:** This matches Phase 4's discovery-first posture and the existing pending-intent replay mechanics.

---

## Preset recognition

| Option | Description | Selected |
|--------|-------------|----------|
| Name only | Show just the preset title in the list | |
| Name plus compact generator context | Show the preset name with sign-text context and recent update timing | ✓ |
| Dense technical table | Show every saved parameter inline for each preset row | |

**User's choice:** Yolo recommendation selected name plus compact generator context.
**Notes:** Recognition needs to be immediate without turning the side rail into a dense data table.

---

## Current-state messaging

| Option | Description | Selected |
|--------|-------------|----------|
| Icon-only state | Use subtle visual changes without explicit labels | |
| Explicit text labels near preset actions | Show unsaved, saved, and edited-from-saved states in words | ✓ |
| Global banner | Show state changes only through top-level page notices | |

**User's choice:** Yolo recommendation selected explicit text labels near preset actions.
**Notes:** `GENW-01` is about clarity; the user should understand state before taking preset actions.

---

## the agent's Discretion

- Final layout details between the main column and side rail.
- Exact status and confirmation copy.
- Exact relative-time formatting and compact metadata presentation.

## Deferred Ideas

- Reopen preset into the editor.
- Library integration and deep-link entry points.
- Artifact history and preset branching.

---

*Phase: 09-saved-generator-presets*
*Discussion log generated: 2026-04-11*
