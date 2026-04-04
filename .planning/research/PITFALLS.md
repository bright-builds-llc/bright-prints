# Research: Pitfalls

**Date:** 2026-04-04  
**Scope:** Domain-specific failure modes for Bright Prints and how to avoid them early.

## Pitfall 1: Designing v1 around a perfect embedded checkout matrix

### Why it happens

Apple Pay, PayPal, Venmo, Amazon Pay, and Shopify do not line up cleanly behind one stable web checkout integration path.

### Warning signs

- Requirements keep expanding around provider-specific edge cases.
- Commerce work starts dominating the roadmap before gallery or generator value ships.
- The team starts assuming Shopify alone can satisfy every embedded-web checkout requirement.

### Prevention

- Keep v1 commerce scope at request/interest plus adapter groundwork.
- Put a provider abstraction in place before adding live payment integrations.
- Treat provider capability discovery as a spike, not a foundational assumption.

### Phase to address

Phase 1 and Phase 5

## Pitfall 2: Letting public repo content and private operational data blur together

### Why it happens

This project intentionally keeps source model files public, which makes it easy to accidentally widen what gets treated as “safe to commit.”

### Warning signs

- Private runtime metadata starts showing up in repo-backed content files.
- Secrets, payment metadata, or customer details appear in example fixtures.
- Admin workflows expect private state to be edited via Git commits.

### Prevention

- Separate repo-backed public content from database-backed runtime data immediately.
- Use explicit schema boundaries for public versus private fields.
- Add environment/secret handling conventions before building commerce.

### Phase to address

Phase 1

## Pitfall 3: Building the generator as ad hoc app code instead of a platform

### Why it happens

It is tempting to hardcode a single sign generator into page logic and defer structure until later.

### Warning signs

- Generator parameters are defined inline in React components.
- There is no reusable generator-definition schema.
- A second generator would require rewriting the first one.

### Prevention

- Define generator schemas before implementing the first real generator.
- Isolate geometry/runtime logic in a worker service.
- Store generator definitions in diff-friendly files with explicit versioning.

### Phase to address

Phase 1 and Phase 4

## Pitfall 4: Modeling the product as single-owner only

### Why it happens

The first release focuses on Peter’s own prints, so it is easy to skip ownership, permissions, and creator boundaries.

### Warning signs

- Prints and generators do not have creator or owner IDs.
- Admin assumptions are hardcoded around one global owner.
- Bookmark/library and creator content use incompatible identity models.

### Prevention

- Include creator ownership fields in the relational model from day one.
- Keep admin authorization separate from content identity.
- Make generator and print schemas creator-aware even before public creator onboarding exists.

### Phase to address

Phase 1 and Phase 6

## Pitfall 5: Treating slicer handoff links as generic URLs

### Why it happens

“Print now” sounds simple, but slicer ecosystem launcher behavior is vendor-specific.

### Warning signs

- Product copy promises one-click slicer launch without verifying the provider workflow.
- Link handling is designed before any provider-specific spike.
- Team assumes every slicer supports arbitrary external domains equally.

### Prevention

- Keep launcher support behind capability flags.
- Validate each ecosystem separately before productizing it.
- Start with plain downloads unless the provider path is documented and reliable.

### Phase to address

Phase 2 and Phase 4

## Pitfall 6: Performance collapse from media-heavy catalog pages

### Why it happens

3D print galleries naturally encourage lots of images, rich detail, and potentially interactive previews.

### Warning signs

- Home page becomes a dense wall of heavy media.
- Core navigation requires large client bundles.
- Accessibility issues appear because motion and visual polish override basic interaction quality.

### Prevention

- Optimize for server-rendered content and progressive enhancement.
- Set budgets for image counts, image sizes, and client JavaScript.
- Treat accessibility review as part of UI definition, not final QA.

### Phase to address

Phase 2

## Pitfall 7: Overfitting repo-backed content in a way that blocks CMS migration

### Why it happens

Repo-first authoring is correct for now, but ad hoc file formats can quietly harden into the long-term model.

### Warning signs

- Content files are inconsistent and manually interpreted.
- Rich content is stored in opaque blobs without stable schema versions.
- No ingestion boundary exists between content files and app queries.

### Prevention

- Keep schemas versioned and explicit.
- Build an ingestion/read-model step instead of reading arbitrary files directly everywhere.
- Treat file storage as one authoring backend, not the domain model itself.

### Phase to address

Phase 1 and Phase 6

## Sources

- [Shopify headless stack docs](https://shopify.dev/docs/storefronts/headless/bring-your-own-stack/index)
- [Shopify Checkout Kit for Web changelog](https://shopify.dev/changelog/checkout-kit-for-web-is-now-available-in-early-access)
- [PayPal Apple Pay integration docs](https://developer.paypal.com/docs/multiparty/checkout/apm/apple-pay/)
- [Amazon Pay buyer experience docs](https://developer.amazon.com/docs/amazon-pay-checkout/buyer-experience.html)
- [Apple Pay on the web configuration docs](https://developer.apple.com/help/account/capabilities/configure-apple-pay-on-the-web/)
- [Railway GitHub autodeploy docs](https://docs.railway.com/guides/github-autodeploys)

