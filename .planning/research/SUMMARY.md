# Research Summary

**Date:** 2026-04-04

## Key findings

**Stack:** Use a single React Router 7 web app on Railway with Railway Postgres and Prisma for runtime data, repo-backed schemas for public print/generator content, and a browser-side generation pipeline for parametric `3mf` creation.

**Table stakes:** Featured home page, beautiful gallery, rich print detail pages, open-source downloads, sign-generator foundation, user accounts, bookmarks, custom lists, and Railway deployment automation.

**Differentiators:** Generator-first UX, unusually strong print/process detail, diff-friendly generator definitions, and architecture that is already future-ready for multi-creator expansion.

**Watch out for:** Do not let v1 get trapped by a perfect multi-provider checkout goal. Commerce providers are fragmented enough that the app needs a provider abstraction and should ship request/interest plus capability groundwork before promising every requested embedded checkout path.

## Recommended product stance

- Let the app own the user experience, catalog presentation, and user library.
- Use React Router 7 as the React-first, deploy-anywhere app framework baseline.
- Keep public content repo-backed for now, but version the schemas so CMS migration remains straightforward later.
- Make generator architecture a first-class browser-side platform, not a one-off feature.
- Keep commerce flexible: evaluate Shopify as leverage, not as the system that owns the whole product.

## Research-driven scope pressure guidance

If scope tightens, protect these first:

1. catalog and detail experience
2. sign-generator platform foundation
3. accounts, bookmarks, and custom lists
4. request/interest commerce groundwork

Cut these before cutting the core:

- full live multi-provider checkout
- public multi-creator publishing
- CMS migration

## Source set

- [Shopify headless stack docs](https://shopify.dev/docs/storefronts/headless/bring-your-own-stack/index)
- [Shopify Checkout Kit for Web changelog](https://shopify.dev/changelog/checkout-kit-for-web-is-now-available-in-early-access)
- [3D-Sign-Maker](https://github.com/pRizz/3D-Sign-Maker)
- [React Router home](https://reactrouter.com/api/home)
- [React Router deploying](https://reactrouter.com/start/framework/deploying)
- [React Three Fiber introduction](https://r3f.docs.pmnd.rs/getting-started/introduction)
- [JSZip docs](https://stuk.github.io/jszip/)
- [PayPal Apple Pay integration docs](https://developer.paypal.com/docs/multiparty/checkout/apm/apple-pay/)
- [Amazon Pay buyer experience docs](https://developer.amazon.com/docs/amazon-pay-checkout/buyer-experience.html)
- [Apple Pay on the web configuration docs](https://developer.apple.com/help/account/capabilities/configure-apple-pay-on-the-web/)
- [Railway Dockerfiles docs](https://docs.railway.com/deploy/dockerfiles)
- [Railway GitHub autodeploy docs](https://docs.railway.com/guides/github-autodeploys)
- [Railway PostgreSQL docs](https://docs.railway.com/databases/postgresql)
- [Auth.js getting started](https://authjs.dev/getting-started)
- [Prisma getting started](https://docs.prisma.io/docs/v6/orm/getting-started)
