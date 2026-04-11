# Phase 10: Preset Reuse and Library Integration - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-11
**Phase:** 10-preset-reuse-and-library-integration
**Areas discussed:** reopen flow, library shape, preset recognition metadata

---

## Reopen flow

| Option | Description | Selected |
|--------|-------------|----------|
| New preset editor route | Open presets on a dedicated edit route separate from the generator page | |
| Existing generator route with deep-linkable preset state | Reopen presets directly on `/generators/:slug` with URL-based preset context | ✓ |
| Client-only transient reopen state | Reopen presets only from in-memory state without a shareable URL | |

**User's choice:** Yolo recommendation selected the existing generator route with deep-linkable preset state.
**Notes:** This keeps reuse and generation in one trustworthy surface and lets library entries link to exact preset context.

---

## Library shape

| Option | Description | Selected |
|--------|-------------|----------|
| Merge presets into print lists | Treat presets like another kind of list membership item | |
| Dedicated library preset section | Keep presets adjacent to the library but separate from print lists | ✓ |
| Separate preset-only library page | Move presets behind a second library route or tab | |

**User's choice:** Yolo recommendation selected a dedicated preset section in the library.
**Notes:** Print lists remain print-focused, while presets become reusable generator launch points.

---

## Reopen and regeneration behavior

| Option | Description | Selected |
|--------|-------------|----------|
| Auto-generate on reopen | Immediately build a new artifact when a preset loads | |
| Load saved values and let the user generate on demand | Reopen into the editor, then let Generate remain explicit | ✓ |
| Store downloadable artifacts with presets | Reuse the prior generated file instead of regenerating | |

**User's choice:** Yolo recommendation selected load-then-generate-on-demand.
**Notes:** Artifact generation stays trustworthy and in-scope without adding file history or stored binaries.

---

## Recognition metadata

| Option | Description | Selected |
|--------|-------------|----------|
| Minimal labels only | Show only preset name and generator slug | |
| Compact recognition summary | Show preset name, generator title, saved text/size, and recent update timing | ✓ |
| Full technical parameter dump | Show all saved input fields before reopening | |

**User's choice:** Yolo recommendation selected compact recognition summary.
**Notes:** The user should know what they are opening without turning the library into a dense table.

---

## the agent's Discretion

- Exact query param naming for preset deep links.
- Exact library card layout and supporting copy.
- Exact loaded-state messaging on the generator route after a preset opens.

## Deferred Ideas

- Artifact history.
- Preset branching or duplication.
- Multi-generator preset breadth beyond the current generator.

---

*Phase: 10-preset-reuse-and-library-integration*
*Discussion log generated: 2026-04-11*
