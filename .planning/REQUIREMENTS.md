# Requirements: Bright Prints

**Defined:** 2026-04-09
**Core Value:** Users can quickly discover beautiful 3D prints and generate or download the right printable files with a sleek, trustworthy, accessible experience.

## v1.1 Requirements

### Saved Generator Presets

- [x] **PSET-01**: Signed-in user can save the current generator configuration as a named preset.
- [x] **PSET-02**: Signed-in user can view a list of saved presets for a generator.
- [x] **PSET-03**: Signed-in user can rename or delete a saved preset.
- [x] **PSET-04**: Signed-in user can reopen a saved preset and repopulate the generator inputs from it.

### Generator Workflow

- [x] **GENW-01**: Signed-in user can tell whether the current generator values are unsaved, saved, or edited from a saved preset.
- [x] **GENW-02**: User can regenerate and redownload output from a reopened preset without manually re-entering the saved parameters.
- [x] **GENW-03**: Saved preset entries show enough metadata for the user to recognize what they are opening before entering the generator route.

### Library Integration

- [x] **GLIB-01**: Signed-in user can access saved generator presets from their library.
- [x] **GLIB-02**: Library links can open the generator editor directly in preset context.

### UI System Upgrade

- [x] **UIG-01**: The app exposes shared React/Tailwind 4 UI primitives adapted from selected Magic UI patterns rather than route-local one-off copies.
- [ ] **UIG-02**: Adapted Magic UI motion and visual effects preserve accessibility and do not obscure core generator, file, trust, or library tasks.
- [x] **UIG-03**: At least the generator, library, and one discovery or print-detail surface use the new shared primitive layer where it measurably improves UX.

## Future Requirements

### Generator Platform

- **GENW-04**: Signed-in user can browse full artifact history for each saved preset.
- **GENW-05**: User can save multiple generator types through the same preset system.
- **GENW-06**: User can duplicate a preset into a new branch without overwriting the original.

### Commerce and Publishing

- **COMM-05**: Visitor can complete live checkout for eligible physical prints using provider-supported on-site payment flows.
- **PUBL-01**: Additional creators can sign up and publish their own prints and generators.
- **PUBL-02**: Content authoring can move to a CMS without changing the core domain model.

## Out of Scope

| Feature                                         | Reason                                                                                                             |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Server-stored generated `.3mf` binaries in v1.1 | Saved presets are the priority; binary storage adds cost and complexity before the reuse loop is proven            |
| A broad full-site Magic UI rewrite              | This milestone should adopt only the patterns that materially improve product flows                                |
| Full live checkout in v1.1                      | Commerce groundwork is already in place, but checkout breadth would distract from the generator-first product loop |
| Multi-creator publishing in v1.1                | The architecture supports it later, but this milestone should deepen first-party retention first                   |

## Traceability

| Requirement | Phase    | Status   |
| ----------- | -------- | -------- |
| PSET-01     | Phase 9  | Complete |
| PSET-02     | Phase 9  | Complete |
| PSET-03     | Phase 9  | Complete |
| PSET-04     | Phase 10 | Complete |
| GENW-01     | Phase 9  | Complete |
| GENW-02     | Phase 10 | Complete |
| GENW-03     | Phase 10 | Complete |
| GLIB-01     | Phase 10 | Complete |
| GLIB-02     | Phase 10 | Complete |
| UIG-01      | Phase 8  | Complete |
| UIG-02      | Phase 12 | Pending  |
| UIG-03      | Phase 11 | Complete |

**Coverage:**

- v1.1 requirements: 12 total
- Mapped to phases: 12
- Currently satisfied: 11
- Unmapped: 0 ✓

---

_Requirements defined: 2026-04-09_
_Last updated: 2026-04-11 after milestone gap planning_
