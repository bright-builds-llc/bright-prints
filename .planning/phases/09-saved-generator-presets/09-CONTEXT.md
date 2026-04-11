---
phase: 09-saved-generator-presets
generated_by: gsd-discuss-phase
lifecycle_mode: yolo
phase_lifecycle_id: 09-2026-04-11T18-38-57
generated_at: 2026-04-11T18:41:21.084Z
---

# Phase 9 Context: Saved Generator Presets

**Gathered:** 2026-04-11
**Status:** Ready for planning

<domain>
## Phase Boundary

Let signed-in users save the current generator configuration as a named preset, review and manage presets for the current generator, and understand whether the current generator values are unsaved, saved, or edited from a saved preset. This phase stays inside the generator workflow itself; reopening presets into the editor, library integration, generated artifact history, and multi-generator expansion remain out of scope for now.

</domain>

<decisions>
## Implementation Decisions

### Preset surface and scope
- Presets should live directly on the generator route as a practical working surface, not on a separate account or library page.
- The preset UI should stay scoped to the active generator slug so the current phase feels generator-specific rather than like a global saved-items system.
- The preset area should feel like lightweight workflow support beside the form and output, not a dashboard or admin console.
- The phase should not introduce preset reopening behavior yet; the list is for recognition and management in this phase, with reuse deferred to Phase 10.

### Save and auth behavior
- Saving a preset should capture the current validated generator values, not require a fresh generate/download action first.
- Signed-out visitors should see that preset saving requires an account, while the generator itself remains browsable and usable without auth.
- If a signed-out visitor tries to save a preset, the app should reuse the existing auth-and-replay pattern so the save completes after sign-in.
- Rename and delete actions should stay inline inside the generator workflow for signed-in users and should not navigate away from the current route.

### Preset naming and recognition
- Saving should use a lightweight named-preset flow rather than a generic untitled autosave model.
- The preset list should make entries recognizable with the preset name plus compact generator-specific context, especially the configured sign text and recent update timing.
- The current session should clearly indicate when the form matches a saved preset versus when the user has edited away from it.
- Recognition should prioritize clarity over density; a short readable list beats a compact-but-cryptic table.

### Current-state feedback
- The generator should expose explicit saved-state language, not icon-only hints.
- The three required states are: unsaved current values, currently matches a saved preset, and edited since the last saved preset snapshot.
- The state indicator should stay near the preset actions so the user can understand status before deciding whether to save, rename, or delete.
- Saving a new preset should immediately move the current values into the saved state, and later edits should switch to an edited-from-saved state until the user saves again.

### the agent's Discretion
- Exact control layout between the form column and side rail as long as the generator remains calm and task-focused.
- Exact phrasing for save success, rename success, delete confirmation, and signed-out preset CTA copy.
- Exact metadata formatting for timestamps and compact preset summaries as long as recognition remains immediate.

</decisions>

<specifics>
## Specific Ideas

- Follow the existing Bright Prints product pattern where identity appears only when it unlocks saving behavior.
- Keep the preset interactions lightweight and inline, similar to the current list-management and save-action patterns used elsewhere in the product.
- Treat the currently edited generator configuration as the primary object; saved presets support that workflow instead of replacing it with a separate management screen.
- Phase 9 should set up Phase 10 cleanly by persisting enough preset data to reopen later, but it should not spend this phase on the reopen interaction itself.

</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase scope
- `.planning/ROADMAP.md` — Phase 9 goal, success criteria, and the explicit handoff to Phase 10 for preset reopening.
- `.planning/REQUIREMENTS.md` — `PSET-01`, `PSET-02`, `PSET-03`, and `GENW-01`.

### Prior product decisions
- `.planning/milestones/v1.0-phases/04-accounts-and-personal-library/04-CONTEXT.md` — Auth gating and save-intent principles that Phase 9 should reuse.
- `.planning/milestones/v1.0-phases/05-generator-platform-mvp/05-CONTEXT.md` — Generator-route behavior and workflow priorities that Phase 9 extends.
- `.planning/phases/08-magic-ui-adaptation-baseline/08-CONTEXT.md` — Shared UI direction and phase-8 guardrails for generator-adjacent surfaces.

### Current implementation anchors
- `app/routes/generator-detail.tsx` — The current generator workflow surface and local state model.
- `app/lib/generators/sign.ts` — The canonical sign-generator value shape and validation rules.
- `app/lib/auth/session.server.ts` — Existing auth session, pending-intent, and replay behavior.
- `app/routes/save-print.ts` — Existing signed-out save redirect pattern for lightweight save actions.
- `app/routes/list-membership.ts` — Existing inline CRUD action-route pattern for signed-in user-owned data.
- `prisma/schema.prisma` — Current account/session/library persistence models to extend instead of bypassing.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `app/routes/generator-detail.tsx`: Already owns the generator form state, validation flow, and output panel, so preset state should layer onto this route instead of introducing a second editor surface.
- `app/lib/generators/sign.ts`: Provides the stable generator value shape and validation logic that saved presets should serialize and compare against.
- `app/lib/auth/session.server.ts`: Already supports pending intents and post-auth replay for save-related flows.
- `app/routes/save-print.ts` and `app/routes/list-membership.ts`: Show the repo's preferred action-route contracts for auth-gated mutations and lightweight JSON/redirect outcomes.

### Established Patterns
- Browsing remains open; auth appears only when a save or organization action needs identity.
- Server-backed user data mutations happen through narrow action routes plus Prisma helpers, with stable return payloads and focused tests.
- Saved-state messaging stays explicit in Bright Prints rather than relying on subtle icon-only changes.

### Integration Points
- Generator preset persistence should attach to the existing `User` ownership model in Prisma.
- The generator route needs both server-loaded preset data for signed-in users and client-side comparison against the in-progress form values.
- Rename/delete actions should share the same route-and-mutation pattern already used for lists and bookmarks so tests and session replay stay consistent.

</code_context>

<deferred>
## Deferred Ideas

- Reopening a saved preset into the generator editor is Phase 10.
- Library entry points and deep links for saved presets are Phase 10.
- Generated artifact history per preset remains deferred beyond this phase.
- Preset duplication, branching, and multi-generator preset breadth stay out of scope for Phase 9.

</deferred>

---

*Phase: 09-saved-generator-presets*
*Context gathered: 2026-04-11*
