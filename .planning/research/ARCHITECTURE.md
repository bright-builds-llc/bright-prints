# Research: Architecture

**Date:** 2026-04-04  
**Scope:** Suggested architecture for Bright Prints as a greenfield product.

## Recommended component boundaries

### 1. Public web app

Responsibilities:

- marketing / home page
- catalog/gallery pages
- print detail pages
- generator configuration UI
- account pages
- bookmarks and custom lists
- commerce request / checkout entrypoints

Notes:

- Keep the public web app as the primary product shell.
- Optimize for server-rendered first paint, image performance, and accessible navigation.

### 2. Content and schema layer

Responsibilities:

- print metadata schemas
- generator-definition schemas
- content ingestion from repo-backed files
- static asset references
- validation of public content before publish

Notes:

- This layer is the seam between repo-backed content today and CMS-backed content later.
- Treat content as structured data, not ad hoc markdown blobs.

### 3. Relational application data layer

Responsibilities:

- users
- sessions
- bookmarks
- custom lists
- order-intent / checkout-intent records
- future creator ownership and permissions

Notes:

- Keep mutable and private runtime data in Postgres from day one.
- Do not leak customer/payment metadata into repo-backed content.

### 4. Client-side generator engine

Responsibilities:

- validate input parameters
- derive client-side preview geometry
- package local `3mf` downloads
- expose generation/export state to the UI
- optionally persist lightweight presets later

Notes:

- This is an application boundary inside the browser, not a backend service.

### 5. Commerce adapter layer

Responsibilities:

- Shopify catalog/order sync where used
- PayPal/Venmo integration
- Amazon Pay integration
- future Stripe-backed wallet aggregation
- provider capability flags

Notes:

- The app should speak to a local commerce abstraction, not directly to provider SDKs from every feature surface.

### 6. Deployment and ops layer

Responsibilities:

- Railway web deployment
- Railway Postgres
- environment references
- GitHub-to-Railway deployment automation

## Data flow

### Public catalog flow

1. Repo-backed print content is validated against schemas.
2. App ingests validated content into a queryable read model.
3. Catalog and detail pages render from that model.
4. Downloads resolve to public artifacts or generated assets.

### Generator flow

1. User opens generator page.
2. UI fetches generator definition and constraints.
3. Browser validates the submitted parameters.
4. Client-side generator modules derive preview and export geometry.
5. Browser packages the local `3mf` payload.
6. User downloads the artifact directly, and the app may optionally save lightweight preset metadata.

### Library flow

1. User authenticates.
2. User bookmarks prints or adds them to custom lists.
3. App persists this state in Postgres.
4. Future creator and preset features build on the same ownership model.

### Commerce flow

1. User expresses interest or initiates checkout from a print detail page.
2. App creates a checkout-intent or order-intent record.
3. Commerce adapter chooses the supported provider path.
4. Provider-specific flow completes or redirects as required.
5. App stores only the minimum private operational metadata needed.

## Suggested build order

### Phase 1: Foundations

- React Router 7 app shell
- Railway deployment path
- Postgres and ORM
- repo-backed content schema
- basic admin/content ingestion path

Why first:

- Every later capability depends on stable content, deployment, and runtime data boundaries.

### Phase 2: Catalog and detail experience

- home page
- gallery/catalog
- print detail pages
- downloads

Why second:

- This delivers the first real product value and validates the presentation model.

### Phase 3: Accounts and library

- auth
- bookmarks
- custom lists

Why third:

- Establishes the user model before commerce and creator workflows deepen.

### Phase 4: Generator platform

- generator schemas
- sign-generator MVP
- client-side generation/export modules
- generated artifact delivery

Why fourth:

- This is the core differentiator and deserves dedicated architecture after the catalog foundation is stable.

### Phase 5: Commerce groundwork

- request/interest flow
- commerce abstraction
- first provider integration spike

Why fifth:

- Provider tradeoffs should be made after the app’s own content and user model are working.

### Phase 6: Creator/admin extensibility

- richer admin tooling
- multi-creator-ready ownership surfaces
- CMS migration seams

Why sixth:

- Extensibility should be designed in from the start, but public multi-creator functionality does not need to block first product value.

## Build-order implications

- Do not start with checkout.
  The product’s strongest value is generator/download UX, not commerce plumbing.
- Do not start with CMS migration.
  The correct abstraction boundary matters more than the first authoring surface.
- Do not tangle route/UI code with low-level geometry and export code.
  Keep the browser-side generator pipeline modular so it can move into a browser Web Worker later if performance demands it.
