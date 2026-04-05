# Roadmap: Bright Prints

**Created:** 2026-04-04  
**Project:** [PROJECT.md](./PROJECT.md)  
**Requirements:** [REQUIREMENTS.md](./REQUIREMENTS.md)

## Summary

**6 phases** | **28 v1 requirements mapped** | **All v1 requirements covered ✓**

| # | Phase | Goal | Requirements | Success Criteria |
|---|---|---|---|---|
| 1 | Foundation and Content Model | Establish the deployable, privacy-safe, repo-backed foundation for the product. | ADMN-01, ADMN-03, PLAT-01, PLAT-03 | 3 |
| 2 | Discovery and Catalog Experience | Ship the first polished journey from home page to searchable catalog to print entry. | DISC-01, DISC-02, DISC-03, PRNT-01 | 3 |
| 3 | Print Detail, Files, and Launch Actions | Deliver useful print detail pages with trustworthy file access and print-state clarity. | PRNT-02, PRNT-03, FILE-01, FILE-02, FILE-03, COMM-01 | 3 |
| 4 | Accounts and Personal Library | Give users accounts, bookmarks, and custom lists. | ACCT-01, ACCT-02, ACCT-03, ACCT-04 | 3 |
| 5 | Generator Platform MVP | Ship the sign-generator foundation and the first reusable generator authoring path. | GEN-01, GEN-02, GEN-03, GEN-04, GEN-05, ADMN-02 | 4 |
| 6 | Commerce Groundwork and Product Ops | Add physical-print interest flows, commerce metadata, and visible product provenance without overcommitting to full checkout breadth. | COMM-02, COMM-03, COMM-04, PLAT-02 | 3 |

## Phase Details

### Phase 1: Foundation and Content Model

**Goal:** Establish the deployable, privacy-safe, repo-backed foundation for the product.

**Requirements:** ADMN-01, ADMN-03, PLAT-01, PLAT-03

**Status:** Complete (verified 2026-04-05)

**Success criteria:**

1. A baseline Bright Prints app deploys successfully to Railway on every push to `main`.
2. Print content can be authored in a repo-backed, schema-validated format that already includes creator ownership fields.
3. Public content and private runtime data are separated cleanly enough that secrets, payment metadata, and customer data cannot live in public content files by default.

### Phase 2: Discovery and Catalog Experience

**Goal:** Ship the first polished journey from home page to searchable catalog to print entry.

**Requirements:** DISC-01, DISC-02, DISC-03, PRNT-01

**Success criteria:**

1. Visitors land on a featured home page that explains both the gallery/storefront side and the generator side of the product.
2. Visitors can browse, search, and filter the catalog without losing visual polish or basic accessibility.
3. Every catalog item links into a dedicated print detail page.

### Phase 3: Print Detail, Files, and Launch Actions

**Goal:** Deliver useful print detail pages with trustworthy file access and print-state clarity.

**Requirements:** PRNT-02, PRNT-03, FILE-01, FILE-02, FILE-03, COMM-01

**Success criteria:**

1. Print detail pages show model details, print settings, materials, special steps, licensing, and file-type information.
2. Visitors can download available files and clearly distinguish source model assets from print-ready assets.
3. Visitors can see whether a print is free, physical, or both, and use supported slicer-launch actions when that integration is available.

### Phase 4: Accounts and Personal Library

**Goal:** Give users accounts, bookmarks, and custom lists.

**Requirements:** ACCT-01, ACCT-02, ACCT-03, ACCT-04

**Success criteria:**

1. Visitors can create an account and sign in.
2. Signed-in users can bookmark prints from discovery and detail surfaces.
3. Signed-in users can create, manage, and revisit custom lists of prints.

### Phase 5: Generator Platform MVP

**Goal:** Ship the sign-generator foundation and the first reusable generator authoring path.

**Requirements:** GEN-01, GEN-02, GEN-03, GEN-04, GEN-05, ADMN-02

**Success criteria:**

1. Visitors can open a generator page, understand the generator, and configure a sign with bounded parameters.
2. Invalid input states are blocked with clear validation feedback before generation runs.
3. Successful in-browser runs produce downloadable `3mf` artifacts with associated generated-model metadata.
4. Admin can define generator behavior through a repo-backed, schema-validated authoring path rather than hardcoded page logic.

### Phase 6: Commerce Groundwork and Product Ops

**Goal:** Add physical-print interest flows, commerce metadata, and visible product provenance without overcommitting to full checkout breadth.

**Requirements:** COMM-02, COMM-03, COMM-04, PLAT-02

**Success criteria:**

1. Eligible print detail pages let visitors submit request or interest for physical-print fulfillment.
2. The application stores provider-agnostic commerce intent plus per-print commerce metadata without exposing secrets publicly.
3. The product shows visible version, commit, and build provenance with `Unavailable` fallbacks where data is missing.

## Coverage Check

- Total v1 requirements: 28
- Mapped requirements: 28
- Unmapped requirements: 0
- Coverage status: Complete

## Phase Order Rationale

1. **Foundation first** because repo-backed content, Railway automation, and privacy boundaries are prerequisites for every later feature.
2. **Discovery before accounts** because the product must be worth visiting before it is worth saving to a library.
3. **Detail and file delivery before generators** because it establishes the baseline trust model for print metadata and artifacts.
4. **Accounts before generators** because library state and user identity become reusable for saved generator outputs and future creator flows.
5. **Generators before real commerce depth** because the generator/download experience is the declared differentiator.
6. **Commerce groundwork last in v1** because provider complexity is real, and the app should not let checkout breadth dominate the product’s strongest value.

---
*Roadmap created: 2026-04-04 after project initialization*
