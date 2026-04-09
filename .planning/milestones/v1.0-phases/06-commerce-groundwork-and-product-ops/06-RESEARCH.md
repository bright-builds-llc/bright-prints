# Phase 6 Research: Commerce Groundwork and Product Ops

**Phase:** 6
**Date:** 2026-04-08
**Goal:** Add physical-print interest flows, commerce metadata, and visible product provenance without overcommitting to full checkout breadth.

## What matters for planning this phase well

1. The runtime schema already has `CommerceIntent`, so the missing work is the route/action contract and public per-print metadata, not a new storage model.
2. The print detail route is already the right home for a lightweight physical-print interest flow.
3. Provenance belongs in the shared product shell and must show `Unavailable` fallbacks visibly.

## Standard Stack

- React Router 7 route modules and fetchers
- Prisma-backed `CommerceIntent`
- Repo-backed per-print `commerce` metadata in content
- Root-loader provenance data surfaced in the app shell

## Architecture Patterns

- Keep public commerce metadata in print content and keep sensitive/provider-private data out of repo files.
- Store provider-agnostic interest records in Prisma with optional `userId`.
- Keep the request form in-place on the print detail route and use fetchers for submission.
- Keep provenance in the root loader/footer surface rather than a page-specific widget.

## Don’t Hand-Roll

- Do not introduce real checkout in this phase.
- Do not store secrets or provider-private metadata in public YAML.
- Do not hide provenance when fields are missing; show `Unavailable`.

## Common Pitfalls

- Letting “interest” UI look like a working checkout flow.
- Treating `availability` as enough to express commerce metadata without a separate public `commerce` object.
- Putting provenance in a developer-only corner instead of a visible product surface.

## Recommended Plan Split

### Wave 1

- Public commerce metadata and provenance env/model layer

### Wave 2

- Interest action route and print-detail UI integration

### Wave 3

- Provenance shell surface and final integration verification

## Sources

### Local

- `prisma/schema.prisma`
- `app/routes/print-detail.tsx`
- `app/root.tsx`
- `app/lib/content/schema.ts`

## Prescriptive conclusion

Use repo-backed public `commerce` metadata, Prisma-backed interest records, a fetcher-driven print-detail request form, and a shared visible provenance surface with explicit `Unavailable` fallbacks.
