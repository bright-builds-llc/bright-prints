# Research Summary

**Date:** 2026-04-09
**Milestone:** v1.1 Saved Generators and Magic UI Upgrade

## Key findings

**Stack additions:** keep React Router 7, React 19, Tailwind 4, Prisma, Bun, and Node as-is; add only selective UI or motion helpers that the adapted Magic UI patterns truly need. The biggest architectural addition is a runtime preset model, not a new platform.

**Feature table stakes:** users need to save, name, reopen, edit, and redownload generator presets from their account, with the library acting as the natural home for saved generator work.

**Design-system stance:** Magic UI is a source-pattern library for this milestone, not a governing framework. Adapt selected patterns into repo-owned React/Tailwind 4 primitives and use them where they improve discovery, generator, print detail, and library UX.

**Watch out for:** do not let Magic UI drive the roadmap, do not store generated binaries server-side, do not hardcode presets to the sign generator, and do not fragment saved presets away from the existing library mental model.

## Recommended milestone shape

1. shared Magic UI-adapted primitive layer
2. preset persistence model and mutations
3. generator revisit/edit/redownload workflow
4. library integration for saved generator work
5. selective UI polish using the new primitives

## Scope pressure guidance

Protect these first:

1. saved generator presets
2. reopen/edit/redownload workflow
3. library integration for saved generator work
4. shared UI primitives that directly improve those flows

Cut these before cutting the core:

- server-side artifact storage
- many new generator types
- full live checkout
- broad sitewide visual rewrite without product justification
