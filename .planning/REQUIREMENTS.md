# Requirements: Bright Prints

**Defined:** 2026-04-04
**Core Value:** Users can quickly discover beautiful 3D prints and generate or download the right printable files with a sleek, trustworthy, accessible experience.

## v1 Requirements

### Discovery

- [ ] **DISC-01**: Visitor can land on a home page that features curated or rotating featured prints and explains the gallery, download, and generator capabilities of the product.
- [ ] **DISC-02**: Visitor can browse a full catalog of prints from the home page.
- [ ] **DISC-03**: Visitor can search and filter the catalog by relevant print attributes.

### Print Details

- [ ] **PRNT-01**: Visitor can open a print detail page for any catalog item.
- [ ] **PRNT-02**: Visitor can view model details, print settings, materials, and any special print steps on the print detail page.
- [ ] **PRNT-03**: Visitor can view licensing, source-file availability, and file-type information for a print.

### Files and Launch

- [ ] **FILE-01**: Visitor can download available free/open-source files for a print.
- [ ] **FILE-02**: Visitor can distinguish source model files from print-ready files before downloading.
- [ ] **FILE-03**: Visitor can use a supported slicer-launch or “print now” action for a print when that integration is available.

### Generators

- [ ] **GEN-01**: Visitor can open a generator page that explains what the generator produces and which inputs it accepts.
- [ ] **GEN-02**: Visitor can configure a sign generator with text, width, height, thickness, corner radius, and other bounded dimensional inputs.
- [ ] **GEN-03**: Visitor receives clear validation errors when generator inputs are missing, invalid, or outside allowed constraints.
- [ ] **GEN-04**: Visitor can generate and download a `3mf` file that reflects the submitted parameters.
- [ ] **GEN-05**: Visitor can view generated-model metadata associated with the output artifact.

### Accounts and Library

- [ ] **ACCT-01**: Visitor can create an account and sign in.
- [ ] **ACCT-02**: Signed-in user can bookmark a print.
- [ ] **ACCT-03**: Signed-in user can create a custom list and add or remove prints from it.
- [ ] **ACCT-04**: Signed-in user can view and manage saved bookmarks and custom lists.

### Commerce

- [ ] **COMM-01**: Visitor can see whether a print is available as a free download, a physical print, or both.
- [ ] **COMM-02**: Visitor can submit a request or interest for a physical print from the print detail page.
- [ ] **COMM-03**: The application can record provider-agnostic checkout or order-intent data for future live commerce integrations.
- [ ] **COMM-04**: Admin can configure per-print commerce metadata needed for future Shopify or direct-payment integrations without exposing secrets publicly.

### Authoring

- [ ] **ADMN-01**: Admin can add or edit print content using a repo-backed, schema-validated content model.
- [ ] **ADMN-02**: Admin can add or edit generator definitions using a repo-backed, schema-validated content model.
- [ ] **ADMN-03**: Print and generator records include creator ownership data even when only Peter publishes content in v1.

### Platform

- [ ] **PLAT-01**: Every push to `main` triggers an automated Railway deployment workflow.
- [ ] **PLAT-02**: The product shows version, commit, and build provenance in a visible user-facing surface, showing `Unavailable` when a field is missing.
- [ ] **PLAT-03**: Sensitive customer data, payment metadata, and secrets remain private and are not stored in public content files or committed to the public repository.

## v2 Requirements

### Commerce

- **COMM-05**: Visitor can complete live checkout for eligible physical prints using provider-supported on-site payment flows.
- **COMM-06**: Visitor can use Apple Pay, PayPal, Amazon Pay, Venmo, Shop Pay, or other supported providers through the best available provider-specific experience.
- **COMM-07**: Customer can view order history for physical-print purchases.

### Generators and Library

- **GEN-06**: Signed-in user can save, name, and revisit generator presets.
- **GEN-07**: Visitor can preview generated geometry before downloading where performance allows.

### Publishing

- **PUBL-01**: Additional creators can sign up and publish their own prints.
- **PUBL-02**: Additional creators can define and publish their own generators through the same schema-driven system.
- **PUBL-03**: Content authoring can be backed by a CMS without changing the core domain model.

## Out of Scope

| Feature | Reason |
|---------|--------|
| Full public multi-creator marketplace in v1 | Architecture should prepare for it, but first release stays focused on Peter-owned content |
| Universal live checkout coverage for every requested provider in v1 | Provider capabilities vary too much; groundwork comes first |
| Arbitrary user-authored CAD scripting in the browser | Too risky and too hard to validate for an early generator platform |
| Native mobile apps | Web-first product with responsive UX is the current priority |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| DISC-01 | Phase 2 | Complete |
| DISC-02 | Phase 2 | Complete |
| DISC-03 | Phase 2 | Complete |
| PRNT-01 | Phase 2 | Complete |
| PRNT-02 | Phase 3 | Complete |
| PRNT-03 | Phase 3 | Complete |
| FILE-01 | Phase 3 | Complete |
| FILE-02 | Phase 3 | Complete |
| FILE-03 | Phase 3 | Complete |
| GEN-01 | Phase 5 | Pending |
| GEN-02 | Phase 5 | Pending |
| GEN-03 | Phase 5 | Pending |
| GEN-04 | Phase 5 | Pending |
| GEN-05 | Phase 5 | Pending |
| ACCT-01 | Phase 4 | Complete |
| ACCT-02 | Phase 4 | Complete |
| ACCT-03 | Phase 4 | Complete |
| ACCT-04 | Phase 4 | Complete |
| COMM-01 | Phase 3 | Complete |
| COMM-02 | Phase 6 | Pending |
| COMM-03 | Phase 6 | Pending |
| COMM-04 | Phase 6 | Pending |
| ADMN-01 | Phase 1 | Complete |
| ADMN-02 | Phase 5 | Pending |
| ADMN-03 | Phase 1 | Complete |
| PLAT-01 | Phase 1 | Complete |
| PLAT-02 | Phase 6 | Pending |
| PLAT-03 | Phase 1 | Complete |

**Coverage:**
- v1 requirements: 28 total
- Mapped to phases: 28
- Unmapped: 0

---
*Requirements defined: 2026-04-04*
*Last updated: 2026-04-04 after initialization*
