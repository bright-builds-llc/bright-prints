# Project Retrospective

_A living document updated after each milestone. Lessons feed forward into future planning._

## Milestone: v1.0 — MVP

**Shipped:** 2026-04-09
**Phases:** 7 | **Plans:** 24 | **Sessions:** not tracked

### What Was Built

- A Railway-ready React Router 7 app with repo-backed content, privacy-safe runtime boundaries, and a durable deployment foundation.
- An editorial discovery experience, rich print detail flows, real downloads, trust metadata, and account-backed save and library features.
- A browser-side sign generator, physical-print interest capture, visible build provenance, and a Bun-based workflow with Node production runtime.

### What Worked

- Phase-based execution kept the work incremental and made runtime verification more targeted.
- Disposable live databases and production-route probes caught cross-phase regressions before they escaped the milestone.

### What Was Inefficient

- Requirements checkbox state and summary frontmatter drifted behind the actual verification record.
- Validation-process artifacts were deferred until audit time, which turned process debt into milestone-close work.

### Patterns Established

- Public content stays repo-backed and schema-validated while runtime state stays private in Prisma/Postgres.
- Public routes must remain resilient when auth or database env is absent.
- Each phase should finish with runnable verification evidence, not just code changes and green unit tests.

### Key Lessons

1. Milestone provenance needs continuous maintenance or audit-time cleanup becomes the main source of debt.
2. Operational refactors are safest when isolated after the product scope is already functionally complete.
3. Runtime probes with real dependencies are worth the setup cost for auth and commerce flows.

### Cost Observations

- Model mix: not tracked
- Sessions: not tracked
- Notable: the highest-signal failures surfaced at phase boundaries and in runtime integration, not inside isolated pure logic.

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Sessions    | Phases | Key Change                                                                  |
| --------- | ----------- | ------ | --------------------------------------------------------------------------- |
| v1.0      | not tracked | 7      | Established the repo-backed, phase-verified Bright Prints delivery workflow |

### Cumulative Quality

| Milestone | Tests | Coverage    | Zero-Dep Additions                                                                     |
| --------- | ----- | ----------- | -------------------------------------------------------------------------------------- |
| v1.0      | 50    | not tracked | Multiple repo-backed domain modules added without introducing external hosted services |

### Top Lessons (Verified Across Milestones)

1. Runtime probes with real data stores catch cross-phase breakage that unit tests miss.
2. Planning artifacts need continuous maintenance or they become the largest source of audit debt.
