# Research: Stack

**Date:** 2026-04-04  
**Scope:** Greenfield stack recommendation for an open-source 3D print gallery, generator, and storefront-ready web app.

## Recommended stack

| Layer | Recommendation | Verified version / source | Confidence | Why |
|---|---|---:|---|---|
| Web app | Next.js + React + TypeScript | `next@16.2.2`, `react@19.2.4`, `typescript@6.0.2` | High | Strong fit for a content-heavy, full-stack web app with server rendering, route handlers, server actions, and a single codebase for catalog, account, and generator orchestration. |
| Styling / UI system | Tailwind CSS + repo-owned component system | `tailwindcss@4.2.2` | High | Fast iteration for a highly visual gallery while keeping the design system fully app-owned instead of trapped in a storefront theme. |
| Primary database | Railway PostgreSQL | Railway Postgres docs | High | Natural fit for users, bookmarks, custom lists, generator jobs, and future creator-owned content while staying easy to deploy and operate on Railway. |
| ORM / migrations | Prisma ORM | `prisma@7.6.0`, `@prisma/client@7.6.0` | High | Type-safe schema, migrations, and application-facing data layer for a growing relational model. |
| Auth | Better Auth-style app-owned auth with DB-backed sessions | `better-auth@1.5.6`; Auth.js docs now point to Better Auth | Medium | Fits the privacy-sensitive, app-owned user model better than delegating identity to a commerce platform. |
| Validation / content contracts | Zod | `zod@4.3.6` | High | Good fit for versioned content schemas, generator parameter validation, and repo-backed config validation. |
| Generator runtime | Dedicated Python generator service using CadQuery + lib3mf | `cadquery@2.7.0`, `lib3mf@2.5.0` | Medium | Cleanest path to parametric geometry plus true `3mf` artifact generation without stuffing CAD logic into frontend code. |
| Commerce integration | App-owned storefront with adapter boundaries for Shopify, PayPal/Venmo, Amazon Pay, and future Stripe-backed wallets | Shopify headless docs, PayPal docs, Amazon Pay docs, Stripe docs | Medium | Commerce providers are fragmented; the app should own catalog presentation and customer UX while adapters isolate provider-specific checkout and catalog sync behavior. |
| Deployment | Railway GitHub deploys + Railway Postgres + Railway-managed env vars | Railway Next.js and GitHub autodeploy docs | High | Direct support for deploy-from-GitHub, `output: "standalone"` Next.js deployments, autodeploy-on-push, and database reference variables. |

## Prescriptive recommendation

### 1. Build a single primary web app

Use a Next.js app as the product shell for:

- featured home page
- catalog browsing
- print detail pages
- account area
- bookmarks and custom lists
- generator configuration UI
- admin/creator tooling
- commerce entrypoints

This keeps the core UX cohesive and lets the project optimize for speed, accessibility, and visual polish instead of stitching together multiple frontends.

### 2. Keep mutable runtime data in Postgres, but keep public print content repo-backed

Split data ownership deliberately:

- **Repo-backed, public, diff-friendly content**
  - print metadata
  - public descriptions
  - source model file references
  - generator definitions
  - static content blocks
- **Database-backed runtime data**
  - users
  - sessions
  - bookmarks
  - custom lists
  - generator job records
  - commerce interest / order-intent records
  - future creator ownership and permissions

This matches the current open-source-first workflow while preserving a future migration path toward CMS-backed publishing.

### 3. Use a dedicated generator service instead of in-process CAD logic

Do not bury 3D generation logic inside the web app runtime.

Recommended flow:

1. Web app validates generator inputs with shared schemas.
2. Web app creates a generator job keyed by a normalized parameter hash.
3. Generator worker produces geometry with CadQuery.
4. Worker packages the result as `3mf` with lib3mf and emits metadata.
5. Web app serves the generated artifact and associated job status.

This keeps the app responsive, isolates heavier geometry work, and leaves room for caching repeated configurations.

### 4. Treat Shopify as a leverage point, not the product core

Shopify is useful here, but only if the app keeps ownership of the experience.

Strong fits:

- optional product sync for purchasable physical prints
- using Shopify headless APIs for commerce primitives
- customer-account interoperability when it truly helps

Weak fits:

- forcing all product content to live in Shopify immediately
- assuming Shopify will cleanly satisfy every embedded checkout requirement
- coupling free/open-source downloadable content to Shopify’s catalog model

Current Shopify docs support custom storefronts via the Storefront API, Customer Account API, and Storefront Web Components, and they now expose an early-access Checkout Kit for Web. That is useful signal, but not a stable enough reason to let Shopify dictate the entire architecture yet.

### 5. Abstract checkout providers behind your own domain layer

The requested payment set does not cleanly collapse into one provider:

- **PayPal** supports PayPal and Venmo buttons in its JavaScript checkout stack, and documents Apple Pay via its Apple Pay integration.
- **Amazon Pay** supports web checkout, but has its own buyer/session model.
- **Shopify** is strong for headless commerce primitives, but its embedded web checkout story is still constrained or evolving.
- **Stripe** is worth keeping as a future wallet aggregator because its payment UI supports Apple Pay, PayPal, and Amazon Pay in one checkout surface, but it does not remove every provider-specific edge.

Result: the app should define its own checkout abstraction now even if v1 only implements request/interest flows plus one or two real payment paths later.

## What not to use as the default

- **Do not make Shopify the source of truth for all public print content.** It is the wrong authoring shape for open-source model metadata and generator definitions.
- **Do not implement generator geometry directly in React or server actions.** It will entangle UI and model-generation concerns.
- **Do not promise full embedded multi-provider checkout in v1.** Provider behavior and capability boundaries are too fragmented.
- **Do not make the first auth design depend on a commerce vendor.** Bookmarks, lists, creator ownership, and future community features need app-owned identity.

## Notes on current provider capability

- Shopify currently supports headless storefronts, customer-account APIs, Storefront Web Components, and has announced Checkout Kit for Web in early access.
- PayPal’s docs explicitly cover Apple Pay eligibility/config, Apple Pay session validation, and order confirmation through the PayPal JS SDK flow.
- Amazon Pay’s docs focus on its own checkout session and buyer preference flow.
- Railway documents direct GitHub deploys and separate guidance for controlling GitHub autodeploy behavior, including waiting for CI.

## Sources

- [Shopify headless stack docs](https://shopify.dev/docs/storefronts/headless/bring-your-own-stack/index)
- [Shopify account web component changelog](https://shopify.dev/changelog/shopify-account-web-component-for-storefronts)
- [Shopify Checkout Kit for Web changelog](https://shopify.dev/changelog/checkout-kit-for-web-is-now-available-in-early-access)
- [PayPal Apple Pay integration docs](https://developer.paypal.com/docs/multiparty/checkout/apm/apple-pay/)
- [Amazon Pay buyer experience docs](https://developer.amazon.com/docs/amazon-pay-checkout/buyer-experience.html)
- [Apple Pay on the web configuration docs](https://developer.apple.com/help/account/capabilities/configure-apple-pay-on-the-web/)
- [Stripe Amazon Pay via Elements docs](https://docs.stripe.com/payments/amazon-pay/accept-a-payment?payment-ui=elements)
- [Railway Next.js guide](https://docs.railway.com/guides/nextjs)
- [Railway GitHub autodeploy docs](https://docs.railway.com/guides/github-autodeploys)
- [Railway PostgreSQL docs](https://docs.railway.com/databases/postgresql)
- [Auth.js getting started](https://authjs.dev/getting-started)
- [Better Auth session management docs](https://beta.better-auth.com/docs/concepts/session-management)
- [Prisma getting started](https://docs.prisma.io/docs/v6/orm/getting-started)
- [CadQuery project site](https://cadquery.readthedocs.io/)
- [lib3mf docs](https://lib3mf.readthedocs.io/)

