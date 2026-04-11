---
phase: 10-preset-reuse-and-library-integration
generated_by: gsd-discuss-phase
lifecycle_mode: yolo
phase_lifecycle_id: 10-2026-04-11T19-52-10
generated_at: 2026-04-11T19:52:10.325Z
---

# Phase 10 Context: Preset Reuse and Library Integration

**Gathered:** 2026-04-11
**Status:** Ready for planning

<domain>
## Phase Boundary

Let signed-in users reopen a saved preset into the generator editor, immediately work from the restored values, and access saved generator presets from the library through recognizable deep links back into generator context. This phase is about preset reuse and library entry points, not artifact history, preset branching, multi-generator expansion, or broader library redesign.

</domain>

<decisions>
## Implementation Decisions

### Reopen flow on the generator route
- Preset reopening should happen on the existing generator route, not on a duplicate edit surface.
- Reopened presets should use a deep-linkable URL state so library entries and preset rows can open the exact preset directly.
- The route should restore the saved generator values into the editor on load, mark that preset as the current baseline, and leave generation as an explicit user action.
- Reopening should not silently generate a new artifact; the user should click Generate when ready so the output stays trustworthy and current.

### Generator preset actions
- Saved preset rows on the generator route should gain an explicit `Open preset` action in addition to the existing rename and delete controls.
- Opening a preset should keep the rest of the generator experience intact: validation, preview, saved-state messaging, and artifact generation continue to run through the same route-local state.
- When a preset is reopened, the generator should make it obvious that the current values came from that saved preset before any edits happen.

### Library integration shape
- Generator presets should appear in the library as a dedicated preset section rather than being folded into print lists or custom-list membership.
- The library should keep saved prints and generator presets as adjacent but distinct tools: print lists remain for print organization, while preset entries act as reusable generator launch points.
- Library preset entries should sort by recency and stay lightweight, not become a full history browser or admin table.
- Opening a library preset entry should deep-link into the generator route with that preset already loaded.

### Recognition metadata
- Library preset entries should show enough context to recognize what will open before the user clicks through: preset name, generator title, saved text or key configuration summary, and a recent update timestamp.
- Generator-route preset entries should also preserve this compact recognition metadata while adding the direct reopen action.
- Recognition should prioritize scanability over dense technical detail; the user should understand the preset at a glance.

### the agent's Discretion
- Exact query-parameter name and route-state plumbing for deep-linked preset reopening.
- Exact layout and styling for library preset cards or rows as long as the library remains calm and readable.
- Exact copy for reopen affordances, loaded-preset messaging, and empty-state guidance.

</decisions>

<specifics>
## Specific Ideas

- Reusing a preset should feel like reopening a working draft rather than browsing an archive.
- The library should expose presets as quick-launch utility, not as a second management console competing with the generator page.
- Deep linking matters because the library and generator route need to point at the same saved preset contract.
- Phase 10 should stop after reopening and library entry points; artifact history and preset branching remain later work.

</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase scope
- `.planning/ROADMAP.md` — Phase 10 goal, requirements, and success criteria.
- `.planning/REQUIREMENTS.md` — `PSET-04`, `GENW-02`, `GENW-03`, `GLIB-01`, and `GLIB-02`.

### Prior phase decisions
- `.planning/phases/09-saved-generator-presets/09-CONTEXT.md` — Phase 9 decisions that established persistence and recognition boundaries.
- `.planning/phases/09-saved-generator-presets/09-RESEARCH.md` — Phase 9 architecture notes and pitfalls that Phase 10 builds on.
- `.planning/milestones/v1.0-phases/04-accounts-and-personal-library/04-CONTEXT.md` — Library and auth experience direction.
- `.planning/milestones/v1.0-phases/05-generator-platform-mvp/05-CONTEXT.md` — Generator route and artifact generation boundaries.

### Current implementation anchors
- `app/routes/generator-detail.tsx` — Current generator loader, editor state, and artifact generation flow.
- `app/components/generator/GeneratorPresetPanel.tsx` — Existing preset management UI to extend with reopen actions.
- `app/routes/library.tsx` — Current library route and loader.
- `app/lib/library/model.ts` — Current library view-model shaping.
- `app/lib/generator-presets/model.ts` — Preset snapshot and saved-state comparison utilities.
- `app/lib/generator-presets/query.server.ts` — Preset query layer to extend for direct reopen and library listing.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `app/routes/generator-detail.tsx`: Already owns the generator form state, preview, and generation action, so reopened presets should hydrate this route instead of spawning a second surface.
- `app/components/generator/GeneratorPresetPanel.tsx`: Already renders recognizable preset metadata and inline management controls, making it the natural place to add `Open preset`.
- `app/routes/library.tsx` plus `app/lib/library/model.ts`: Already define the library shell and can absorb a neighboring preset section without changing print-list semantics.
- `app/lib/generator-presets/query.server.ts`: Already returns runtime-safe preset records and can grow direct-fetch plus library-list helpers.

### Established Patterns
- Auth remains utility-driven: signed-in state unlocks saved data, but browsing/generation remain public.
- Deeply user-owned data is loaded on the server and turned into small view models before it reaches the route component.
- The app favors explicit text labels and calm inline controls over hidden state or dashboard-heavy chrome.

### Integration Points
- The generator route needs loader support for an optional preset identifier and a deterministic way to derive initial values from it.
- The library route needs a second data surface for presets that sits alongside, not inside, the print-list model.
- Preset deep links must target the existing generator slug plus preset identity so generator and library surfaces share one canonical reopen contract.

</code_context>

<deferred>
## Deferred Ideas

- Preset artifact history and prior downloads.
- Preset duplication or branching.
- Multi-generator preset abstraction beyond the current sign generator path.
- A full library redesign or blended print-plus-preset list taxonomy.

</deferred>

---

*Phase: 10-preset-reuse-and-library-integration*
*Context gathered: 2026-04-11*
