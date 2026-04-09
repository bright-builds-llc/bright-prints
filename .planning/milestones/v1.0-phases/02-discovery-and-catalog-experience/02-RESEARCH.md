# Phase 2 Research: Discovery and Catalog Experience

**Phase:** 2  
**Date:** 2026-04-05  
**Goal:** Ship the first polished journey from home page to searchable catalog to print entry.

## What matters for planning this phase well

### 1. Phase 2 stops at discovery and entry, not rich detail depth

The roadmap requirement set for this phase is:

- `DISC-01`
- `DISC-02`
- `DISC-03`
- `PRNT-01`

That means Phase 2 must:

- make the home page compelling
- give visitors a searchable/filterable catalog
- let every card open a dedicated detail page

It does **not** need to implement the rich model/process detail that Phase 3 owns.

Planning implication:

- detail pages in Phase 2 should establish identity, framing, and navigation
- rich print settings, file distinctions, and special-step detail stay out of this phase

### 2. The current foundation content model is usable, but too thin for discovery

Phase 1 established:

- creator records
- print records
- generator records
- a server-side content loader
- one seeded print and one seeded generator

That is enough to prove the pipeline, but not enough to create a believable featured home page or catalog behavior.

Planning implication:

- discovery needs a richer seeded content set
- the public content schema likely needs a few discovery-facing fields such as ordering, cover/visual treatment hints, and possibly simple availability metadata
- discovery should get its own read model instead of overloading the Phase 1 foundation snapshot

### 3. Search and filtering should be URL-driven, not purely local widget state

The user wants a lightweight top-toolbar search/filter model, not an enterprise search experience. For React Router, the cleanest product shape is still to keep search and filters reflected in the URL:

- shareable catalog URLs
- server-friendly route loading
- easy refresh/back-button behavior
- fewer hidden state bugs

Planning implication:

- use search params for `q`, `type`, availability, and maybe category
- keep the filtering logic in pure helper functions so it can be tested without route setup

### 4. One unified catalog means the app needs a normalized discovery item shape

The catalog is not separate “prints page” and “generators page” in Phase 2. That means route code needs a common item shape for cards and filtering.

Planning implication:

- derive a unified discovery-item model from print and generator records
- keep enough type information to badge items correctly (`Print`, `Generator`, `Open Source`, `Physical Print`)
- avoid collapsing the underlying content model; normalize only at the discovery layer

### 5. Home page and catalog should share visual primitives

The user’s design decisions point toward a coherent editorial system:

- spacious grid
- calm cards
- one dominant click target
- concise badges
- subtle transitions

Planning implication:

- create shared discovery UI primitives before or alongside the routes
- avoid implementing completely separate “home cards” and “catalog cards” that drift immediately

### 6. The home page should feel selective, not exhaustive

The Phase 2 context is explicit:

- editorial asymmetric hero
- two top-level CTAs
- restrained landing-page composition

Planning implication:

- home page data needs explicit featured and spotlight slices
- catalog is where breadth lives; home should not try to expose every dimension of the content model

### 7. This phase is visually important enough to justify a final integration pass

There are multiple moving pieces:

- home page
- catalog state
- routing into detail pages
- shared visual language

Planning implication:

- it is worth reserving a final integration/polish plan or at least a final verification-heavy plan instead of assuming the last route built will naturally satisfy the full journey

## Recommended plan split

### Wave 1

- **02-01**: discovery data model and shared presentation primitives

### Wave 2

- **02-02**: editorial home page
- **02-03**: unified catalog and detail-entry routes

### Wave 3

- **02-04**: integrated discovery polish, empty states, and final route cohesion

This split keeps the work coherent:

- Plan `02-01` establishes the shared foundation both major route surfaces need
- Plan `02-02` and `02-03` can then work in parallel on home versus catalog/detail
- Plan `02-04` closes the loop so the full Phase 2 journey feels intentional rather than stitched together

## Sources

- `.planning/phases/02-discovery-and-catalog-experience/02-CONTEXT.md`
- `.planning/ROADMAP.md`
- `.planning/REQUIREMENTS.md`
- `app/routes/home.tsx`
- `app/lib/content/schema.ts`
- `app/lib/content/load.server.ts`
- `content/`
