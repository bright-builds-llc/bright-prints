# Phase 6: Commerce Groundwork and Product Ops - Context

**Gathered:** 2026-04-08
**Status:** Ready for planning

<domain>
## Phase Boundary

Add a lightweight physical-print interest flow on eligible print detail pages, store provider-agnostic commerce intent plus per-print commerce metadata without exposing secrets, and surface visible version, commit, and build provenance with `Unavailable` fallbacks in a normal product surface. This phase is groundwork only, not full checkout or broad commerce depth.

</domain>

<decisions>
## Implementation Decisions

### Physical-print interest flow

- Only prints with `availability` of `physical-print` or `both` should show the physical-print interest surface.
- The flow should be lightweight and in-place on the print detail page: email plus optional note is sufficient.
- Submission should create a runtime `CommerceIntent` record without requiring account creation, while still attaching `userId` when a signed-in user exists.

### Commerce metadata

- Per-print commerce metadata should live in repo-backed content and stay free of secrets.
- Public metadata can include provider hints, public product references, lead-time or fulfillment notes, and whether the page is in `interest` mode.
- The runtime record should store provider-agnostic intent data plus a copy of the relevant public metadata needed for future integration handoff.

### Provenance surface

- Version, commit, and build provenance should be visible on every page in a normal footer-like product surface.
- Missing provenance fields should render as `Unavailable`.
- The surface should include a copyable summary so the exact commit/build state can be shared when present.

### Claude's Discretion

- Exact field labels, microcopy, and placement of the provenance surface as long as it remains visible and non-modal.
- Exact public commerce metadata field names as long as they stay migration-friendly and secret-free.

</decisions>

<specifics>
## Specific Ideas

- Shopify can appear as a provider hint or product reference in content metadata, but no live Shopify checkout integration is required here.
- Physical-print interest should feel like a calm request form, not a fake cart or checkout.
- The provenance surface should feel like part of the product shell, not a debug-only developer panel.

</specifics>

<deferred>
## Deferred Ideas

- Full live checkout and order capture
- Broader provider-specific checkout flows
- Customer order history or account-bound commerce management

</deferred>

---

_Phase: 06-commerce-groundwork-and-product-ops_
_Context gathered: 2026-04-08_
