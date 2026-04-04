# Research: Features

**Date:** 2026-04-04  
**Scope:** Table stakes, differentiators, and deliberate exclusions for a 3D print gallery + generator + storefront-ready product.

## Discovery and storytelling

### Table stakes

- Featured home page with curated hero prints.
  Complexity: Low
  Dependencies: Content schema, media pipeline
- Browsable gallery/catalog with strong visual hierarchy.
  Complexity: Medium
  Dependencies: Content model, image optimization
- Rich print detail pages with download actions.
  Complexity: Medium
  Dependencies: Content model, file metadata, route structure

### Differentiators

- Rotating curated selections that feel editorial rather than generic.
  Complexity: Low
  Dependencies: Content authoring model
- Explicit explanation of the parameterized-generator capability on the home page and throughout the product.
  Complexity: Low
  Dependencies: Content blocks, design system
- Strong accessibility and perceived-speed polish as product features, not cleanup tasks.
  Complexity: Medium
  Dependencies: Design system, performance budgets

### Anti-features

- Infinite generic card walls with no editorial guidance.
- Forcing users into a storefront-only framing that hides the open-source/download value.

## Print detail and download experience

### Table stakes

- Model details, print settings, materials, and special instructions.
  Complexity: Medium
  Dependencies: Print schema
- Downloadable assets with clear file types and versioning.
  Complexity: Medium
  Dependencies: File storage strategy
- Clear attribution and licensing for open-source prints.
  Complexity: Medium
  Dependencies: Metadata schema

### Differentiators

- “Print now” handoff options when a slicer ecosystem supports them.
  Complexity: Medium
  Dependencies: Provider-specific launcher research
- Detail pages that teach the user how a print was produced, not just what it looks like.
  Complexity: Medium
  Dependencies: Rich metadata schema, content authoring

### Anti-features

- Treating detail pages as thin product cards with missing print/process context.
- Hiding source model availability or license state.

## Parameterized generators

### Table stakes

- Generator landing pages and detail pages.
  Complexity: Medium
  Dependencies: Generator schema
- Input validation with clear dimensional constraints in user-friendly units.
  Complexity: Medium
  Dependencies: Shared validation contracts
- Job lifecycle with pending, success, and failure states.
  Complexity: Medium
  Dependencies: Queue/job model, artifact storage
- Download of generated `3mf` output plus generated metadata.
  Complexity: High
  Dependencies: Generator worker, artifact storage

### Differentiators

- A sign generator with text, width, height, thickness, corner radius, and other controlled parameters.
  Complexity: High
  Dependencies: Generator engine, preview strategy
- Generator definitions stored in a diff-friendly schema so future creators can add their own.
  Complexity: High
  Dependencies: Versioned generator DSL/schema
- Reuse/caching of common parameter combinations.
  Complexity: Medium
  Dependencies: Normalized parameter hashing

### Anti-features

- Free-form arbitrary CAD scripting in the web UI.
- Shipping generator definitions that are hard to diff, validate, or migrate.

## Accounts, library, and personalization

### Table stakes

- User accounts.
  Complexity: Medium
  Dependencies: Auth, user model
- Bookmarking / favoriting.
  Complexity: Low
  Dependencies: User model, print identity
- Custom lists.
  Complexity: Medium
  Dependencies: Library model

### Differentiators

- Treat bookmarks and lists as the seed of a future creator/library ecosystem.
  Complexity: Medium
  Dependencies: User model, permission model
- Ability to save generator presets later using the same account foundation.
  Complexity: Medium
  Dependencies: Generator model, user model

### Anti-features

- Outsourcing all identity and library state to a commerce provider.

## Commerce and monetization

### Table stakes

- Clear “free/open source” versus “physical print available” states.
  Complexity: Medium
  Dependencies: Product state model
- Request/interest flow for physical prints.
  Complexity: Low
  Dependencies: Contact/order-intent model
- Commerce adapter boundary for later real checkout.
  Complexity: Medium
  Dependencies: Domain model, provider abstraction

### Differentiators

- Native-feeling on-site checkout where provider capability allows it.
  Complexity: High
  Dependencies: Provider integration, compliance, UI states
- Leveraging Shopify where it saves time without forcing the product into a Shopify-shaped content model.
  Complexity: Medium
  Dependencies: Commerce sync strategy

### Anti-features

- Launching v1 only after full support for every requested payment provider.
- Hard-coupling physical print sales to a single commerce vendor’s data model.

## Creator and admin tooling

### Table stakes

- Admin workflow to add/edit prints.
  Complexity: Medium
  Dependencies: Content schema, authoring path
- Admin workflow to add/edit generator definitions.
  Complexity: High
  Dependencies: Generator schema

### Differentiators

- Content storage that begins repo-first but grows naturally into CMS-backed tooling later.
  Complexity: Medium
  Dependencies: Schema discipline, ingestion layer
- Multi-creator-ready ownership fields from day one.
  Complexity: Medium
  Dependencies: Relational schema

### Anti-features

- Designing the authoring model only for one owner, then rewriting later.
- Storing generator definitions in opaque blobs that resist code review.

## Recommended v1 emphasis

### Table stakes for v1

- featured home page
- full gallery/catalog
- rich print detail pages
- open-source downloads
- sign-generator foundation
- user accounts
- bookmarks and custom lists
- request/interest workflow for physical prints
- Railway deploy pipeline

### Strong differentiators worth preserving in v1

- polished, editorial gallery experience
- generator-first product positioning
- repo-backed, diff-friendly content and generator definitions
- architecture that already understands future creators

### Defer if needed

- full multi-provider checkout implementation
- public multi-creator publishing
- CMS migration

