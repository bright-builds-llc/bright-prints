# Research: Stack

**Date:** 2026-04-04  
**Scope:** Greenfield stack recommendation for an open-source 3D print gallery, generator, and storefront-ready web app.

## Recommended stack

| Layer | Recommendation | Verified version / source | Confidence | Why |
|---|---|---:|---|---|
| Web app | React Router 7 + React + TypeScript | `react-router@7.14.0`, `react@19.2.4`, `typescript@6.0.2` | High | Strong fit for a content-heavy, full-stack web app with loaders, actions, route modules, and official deployment templates that target plain Node/Docker hosting instead of a Vercel-centered workflow. |
| Styling / UI system | Tailwind CSS + repo-owned component system | `tailwindcss@4.2.2` | High | Fast iteration for a highly visual gallery while keeping the design system fully app-owned instead of trapped in a storefront theme. |
| 3D preview and geometry | Three.js + React Three Fiber + Drei | `three@0.183.2`, `@react-three/fiber@9.5.0`, `@react-three/drei@10.7.7` | High | Fits the chosen in-browser generator direction and matches the proven preview pattern in `3D-Sign-Maker`. |
| Client-side export pipeline | JSZip + browser-side geometry/export modules | `jszip@3.10.1` | Medium | Supports local construction of valid `3mf` packages in the browser without a server-side generation worker. |
| Primary database | Railway PostgreSQL | Railway Postgres docs | High | Natural fit for users, bookmarks, custom lists, future saved presets, commerce intent records, and future creator-owned content while staying easy to deploy and operate on Railway. |
| ORM / migrations | Prisma ORM | `prisma@7.6.0`, `@prisma/client@7.6.0` | High | Type-safe schema, migrations, and application-facing data layer for a growing relational model. |
| Auth | Better Auth-style app-owned auth with DB-backed sessions | `better-auth@1.5.6`; Auth.js docs now point to Better Auth | Medium | Fits the privacy-sensitive, app-owned user model better than delegating identity to a commerce platform. |
| Validation / content contracts | Zod | `zod@4.3.6` | High | Good fit for versioned content schemas, generator parameter validation, and repo-backed config validation. |
| Commerce integration | App-owned storefront with adapter boundaries for Shopify, PayPal/Venmo, Amazon Pay, and future Stripe-backed wallets | Shopify headless docs, PayPal docs, Amazon Pay docs, Stripe docs | Medium | Commerce providers are fragmented; the app should own catalog presentation and customer UX while adapters isolate provider-specific checkout and catalog sync behavior. |
| Deployment | Railway GitHub deploys + Railway Postgres + Docker-based app service | React Router deploy docs, Railway Dockerfile docs, Railway GitHub autodeploy docs | High | React Router officially supports Node.js with Docker templates and explicitly lists Railway as a deployment target; Railway will build from a root `Dockerfile` automatically. |

## Prescriptive recommendation

### 1. Build a single primary web app

Use a React Router 7 framework-mode app as the product shell for:

- featured home page
- catalog browsing
- print detail pages
- account area
- bookmarks and custom lists
- generator configuration UI
- admin/creator tooling
- commerce entrypoints

This keeps the core UX cohesive and lets the project optimize for speed, accessibility, and visual polish instead of stitching together multiple frontends. React Router 7 is also a better philosophical fit for the current goal of staying in React while avoiding unnecessary Vercel workflow gravity.

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
  - commerce interest / order-intent records
  - optional saved generator presets or history later
  - future creator ownership and permissions

This matches the current open-source-first workflow while preserving a future migration path toward CMS-backed publishing.

### 3. Use a client-side generation pipeline instead of a backend generator service

The browser should own generation for the current sign-style generator class.

Recommended flow:

1. React Router routes load the generator definition and validation constraints.
2. Browser-side generator modules validate user input with shared schemas.
3. Client-side geometry utilities derive meshes and preview geometry.
4. Browser-side export utilities package a valid `3mf` archive locally.
5. The app downloads the file directly and optionally stores only lightweight preset metadata if the user is signed in.

The reference `3D-Sign-Maker` repo already demonstrates the viability of this model with Three.js-based geometry generation, local preview, and `3mf` export assembled in the browser with `JSZip`.

This does not mean generator logic should live inline inside route components. Keep it in isolated client-side modules and, if heavy models become a UX problem later, move the expensive computation into a browser Web Worker before introducing backend infrastructure.

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
- **Do not bury generator geometry/export logic inline inside route components.** Keep it in dedicated client-side modules so the browser-side pipeline stays testable and replaceable.
- **Do not promise full embedded multi-provider checkout in v1.** Provider behavior and capability boundaries are too fragmented.
- **Do not make the first auth design depend on a commerce vendor.** Bookmarks, lists, creator ownership, and future community features need app-owned identity.
- **Do not switch frameworks again without a concrete delivery benefit.** React Router 7 is now the selected baseline, so churn should buy something material.

## Notes on current provider capability

- Shopify currently supports headless storefronts, customer-account APIs, Storefront Web Components, and has announced Checkout Kit for Web in early access.
- PayPal’s docs explicitly cover Apple Pay eligibility/config, Apple Pay session validation, and order confirmation through the PayPal JS SDK flow.
- Amazon Pay’s docs focus on its own checkout session and buyer preference flow.
- The `3D-Sign-Maker` repo shows a practical browser-only generator pipeline: text and LaTeX become Three.js geometries, preview runs in React Three Fiber, and `3mf` output is zipped locally in the browser.
- React Router’s official framework docs describe it as a React framework that can be deployed anywhere and provide Node.js with Docker templates that explicitly list Railway as a supported target.
- Railway documents direct GitHub deploys, Dockerfile-based builds, and separate guidance for controlling GitHub autodeploy behavior, including waiting for CI.

## Sources

- [Shopify headless stack docs](https://shopify.dev/docs/storefronts/headless/bring-your-own-stack/index)
- [Shopify account web component changelog](https://shopify.dev/changelog/shopify-account-web-component-for-storefronts)
- [Shopify Checkout Kit for Web changelog](https://shopify.dev/changelog/checkout-kit-for-web-is-now-available-in-early-access)
- [3D-Sign-Maker](https://github.com/pRizz/3D-Sign-Maker)
- [React Router home](https://reactrouter.com/api/home)
- [React Router framework installation](https://reactrouter.com/main/start/framework/installation)
- [React Router deploying](https://reactrouter.com/start/framework/deploying)
- [React Three Fiber introduction](https://r3f.docs.pmnd.rs/getting-started/introduction)
- [JSZip docs](https://stuk.github.io/jszip/)
- [PayPal Apple Pay integration docs](https://developer.paypal.com/docs/multiparty/checkout/apm/apple-pay/)
- [Amazon Pay buyer experience docs](https://developer.amazon.com/docs/amazon-pay-checkout/buyer-experience.html)
- [Apple Pay on the web configuration docs](https://developer.apple.com/help/account/capabilities/configure-apple-pay-on-the-web/)
- [Stripe Amazon Pay via Elements docs](https://docs.stripe.com/payments/amazon-pay/accept-a-payment?payment-ui=elements)
- [Railway Dockerfiles docs](https://docs.railway.com/deploy/dockerfiles)
- [Railway GitHub autodeploy docs](https://docs.railway.com/guides/github-autodeploys)
- [Railway PostgreSQL docs](https://docs.railway.com/databases/postgresql)
- [Auth.js getting started](https://authjs.dev/getting-started)
- [Better Auth session management docs](https://beta.better-auth.com/docs/concepts/session-management)
- [Prisma getting started](https://docs.prisma.io/docs/v6/orm/getting-started)
