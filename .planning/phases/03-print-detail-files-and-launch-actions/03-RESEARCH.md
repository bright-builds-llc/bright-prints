# Phase 3 Research: Print Detail, Files, and Launch Actions

**Phase:** 3  
**Date:** 2026-04-06  
**Goal:** Deliver useful print detail pages with trustworthy file access and print-state clarity.

## What matters for planning this phase well

### 1. The current print detail route is still a Phase 2 placeholder

`app/routes/print-detail.tsx` is currently a lightweight entry page built around `DiscoveryItem`, not a real print-detail read model. It shows title, summary, a few badges, and generic navigation, but it does not yet expose the file/trust/action depth required by Phase 3.

Planning implication:

- replace the placeholder with a print-specific view model
- keep the route loader as the source of truth for page data
- do not expand the discovery model into a second print-detail schema

### 2. The repo already has the right stack shape for this phase

The existing app is a React Router 7 framework app with route modules in `app/routes.ts`, server loaders in route files, and route-scoped CSS. That is the right stack for print detail because it already supports server-loaded content, typed route props, and route-specific head/styling behavior.

Planning implication:

- keep Phase 3 in route modules, not a separate client data layer
- keep the page declarative and loader-driven
- add print-specific pure helpers for normalization and grouping

### 3. File access is a trust problem, not just a rendering problem

The locked context requires separate `Print-Ready Files` and `Source Files` sections, visible unavailable groups, explicit provenance, and a clear difference between internal repo files and external file destinations.

Planning implication:

- model file provenance and purpose explicitly
- derive the visible sectioning and fallback states in code
- keep unavailable groups visible with an `Unavailable` treatment

### 4. Slicer launch support is vendor-specific, not universal

Current official docs show a documented open-in-slicer flow for PrusaSlicer on supported websites, but not a universal browser-to-slicer standard. Bambu Lab and UltiMaker docs reviewed here emphasize downloading the slicer or using their own app/cloud workflows, not a generic public protocol.

Planning implication:

- gate launch actions behind an explicit capability allowlist
- show a download fallback whenever support is not explicitly documented
- never label a generic action as `Print now` unless the integration really exists

### 5. Accessibility failures on detail/action pages are usually self-inflicted

The common breakage patterns are predictable: vague link text, hidden provenance, external destinations that are not marked as such, and action rows that become visually obvious but semantically ambiguous.

Planning implication:

- make each file link self-describing in context
- keep the trust section visible, not tucked behind disclosure
- use semantic links for downloads and external file hosts

## Standard Stack

Use the current React Router 7 route-module pattern already present in the repo:

- route config in `app/routes.ts`
- route module `loader`, `meta`, and `links` exports
- route-scoped CSS like `app/routes/item-detail.css`
- `loadPublicContent()` as the server-backed content read path
- `Link` from `react-router` for in-app navigation only

Use a print-detail-specific pure model module rather than adding more branching to `app/routes/print-detail.tsx`. The current discovery model in `app/lib/discovery/model.ts` should stay focused on catalog cards and hero rails.

For repo-backed downloads, use a server route or resource route that returns attachment responses with `Content-Disposition: attachment`. For external files, link directly to the destination and treat the browser as the final authority on whether the file downloads or opens.

## Architecture Patterns

### 1. Build a dedicated print-detail read model

The print route should load public content, resolve the print by slug, and then call a pure `buildPrintDetailModel()` helper. That helper should return:

- hero content
- availability panel data
- grouped files
- trust fields
- launch actions that are actually supported
- related prints

This keeps the route component thin and makes the complicated part testable without rendering.

### 2. Keep file grouping and action gating out of JSX

The component should not decide whether something belongs in `Print-Ready Files`, `Source Files`, `Trust`, or `Actions`. That logic belongs in the read model so the page can render a stable structure even when content is incomplete.

Use explicit `Unavailable` placeholders for missing fields instead of conditional omission when the field is part of the product contract.

### 3. Preserve the current page order

Use the locked hierarchy:

- editorial two-column hero
- availability panel and actions near the hero
- files immediately after the hero
- trust section near the files
- special steps as a short checklist or callout, not a hidden disclosure
- technical guidance below the file area
- related prints at the bottom

That order matches the product decisions and keeps the page from becoming a dense spec sheet.

For physical-print availability, use a lightweight request or contact-style action. Do not introduce checkout, cart, or payment flow in this phase.

### 4. Keep the launch matrix separate from content facts

The object itself should describe files, licensing, and print settings. Slicer-launch support is an integration capability, not a property of the print record. Keep the integration matrix in app code or a small registry keyed by vendor and file type.

That separation avoids polluting the content schema with vendor-specific implementation details.

## Content Model Guidance

Model these fields now:

- `printDetails.material`
- `printDetails.layerHeightMm`
- `printDetails.specialSteps`
- `license` information as a dedicated trust object, with at least a name and optional URL
- file records with `kind`, `repoPath`, `externalUrl`, and short authored purpose text

Keep these as derived UI state:

- file section order and visibility
- the `Print-Ready Files` versus `Source Files` headings
- provenance labels such as `Repo file` and `External`
- file type chips when the type can be derived from the file path or URL
- `Unavailable` placeholders
- related print ordering
- primary versus secondary CTA selection

Do not add a generic `slicerLaunchUrl` field to the content schema unless the team has a real supported integration to represent. For now, keep launch support in code as a capability registry or adapter layer.

Treat `availability` as the visitor-facing offer state:

- `open-source`
- `physical-print`
- `both`

Use `openSource` only as a coarse badge or compatibility flag. It is not enough by itself to describe license, source-file availability, or launch support.

## Don't Hand-Roll

- Do not build file downloads with browser blob URLs and client-side fetches for repo-backed assets. For internal files, use a server attachment response.
- Do not rely on the HTML `download` attribute as your only download mechanism. It is a hint, not a guarantee.
- Do not use generic external-link text like `Download` or `Open` without naming the file or the destination type in context.
- Do not infer slicer launch support from anecdotes or URL patterns. Use only documented, allowlisted integrations.
- Do not hide unavailable file groups. The locked context requires the missing concept to stay visible.
- Do not duplicate file grouping and trust logic in multiple route components.
- Do not create a second content store just for Phase 3 assets. Keep repo-backed YAML as the source of truth.

## Common Pitfalls

- Presenting `source`, `print-ready`, and `external` as badges without explaining what each one means.
- Hiding licensing when source files are missing, or hiding missing source files when the print is otherwise open source.
- Making the top of the page too dense and pushing the file area below the fold.
- Labeling a browser download as a slicer launch or `Print now` action when the app cannot actually hand off to a supported tool.
- Opening external file hosts in a way that loses the page context or omits `rel="noopener noreferrer"` when a new tab is used.
- Using icon-only or context-free links for the file rows, which fails link-purpose guidance.
- Treating `availability` as equivalent to license, source-file access, or physical fulfillment.

## Code Examples

```ts
export async function loader({ params }: Route.LoaderArgs) {
  const content = await loadPublicContent();
  const maybeSlug = params.slug;

  if (!maybeSlug) {
    throw new Response("Not Found", { status: 404 });
  }

  const maybePrint = findPrintBySlug(content, maybeSlug);

  if (!maybePrint) {
    throw new Response("Not Found", { status: 404 });
  }

  return buildPrintDetailModel(content, maybePrint);
}
```

```tsx
<a
  href={file.href}
  download={file.isSameOrigin ? file.downloadName : undefined}
  rel={file.isExternal ? "noopener noreferrer" : undefined}
>
  {file.label}
</a>
```

```ts
// Server-side file route response for repo-backed assets
return new Response(fileStream, {
  headers: {
    "Content-Disposition": `attachment; filename="${downloadName}"`,
    "Content-Type": mimeType
  }
});
```

```ts
const maybeLaunchAction = printDetail.launchActions[0] ?? null;

if (!maybeLaunchAction) {
  // Fall back to download messaging instead of pretending launch exists.
}
```

## Recommended Plan Split

### Wave 1: Print detail data and trust model

- Add a print-detail read model and test it directly.
- Expand the content schema only for object facts that are truly authored data.
- Add explicit trust fields and `Unavailable` behavior.

### Wave 2: Hero, availability, and files

- Rebuild the print detail page around the two-column hero.
- Add the explicit availability panel.
- Render `Print-Ready Files` first, then `Source Files`, with visible inactive states when needed.

### Wave 3: Downloads and launch support

- Add server-backed download handling for repo files.
- Wire external file links with clear provenance labeling.
- Add a small vendor capability registry for slicer-launch or print-now actions.
- Show download fallback messaging whenever support is missing.

### Wave 4: Accessibility and final cohesion

- Audit keyboard flow, focus order, and link naming.
- Verify file rows, trust content, and action labels remain understandable without color or layout context.
- Finish the related-prints section and responsive polish.

If the phase needs to compress, merge Wave 4 into Wave 2. Do not merge Wave 3 into the composition work; launch/download semantics are the highest-risk part of this phase.

## Sources

### Local repo

- `app/routes/print-detail.tsx`
- `app/routes/item-detail.css`
- `app/routes/generator-detail.tsx`
- `app/routes.ts`
- `app/lib/content/schema.ts`
- `app/lib/content/load.server.ts`
- `app/lib/content/public.ts`
- `app/lib/discovery/model.ts`
- `content/prints/sample-featured-print/print.yaml`
- `content/prints/modular-cable-clip/print.yaml`
- `content/prints/stackable-desk-sign/print.yaml`
- `.planning/phases/03-print-detail-files-and-launch-actions/03-CONTEXT.md`
- `.planning/phases/02-discovery-and-catalog-experience/02-RESEARCH.md`

### External

- [React Router route modules](https://reactrouter.com/start/framework/route-module)
- [React Router routing](https://reactrouter.com/start/framework/routing)
- [React Router data loading](https://reactrouter.com/start/framework/data-loading)
- [React Router Link](https://reactrouter.com/api/components/Link)
- [HTMLAnchorElement.download](https://developer.mozilla.org/en-US/docs/Web/API/HTMLAnchorElement/download)
- [Content-Disposition header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Disposition)
- [W3C WCAG 2.4.4: Link Purpose (In Context)](https://www.w3.org/WAI/WCAG22/Understanding/link-purpose-in-context.html)
- [Prusa: Opening models in PrusaSlicer from supported websites](https://help.prusa3d.com/article/opening-models-in-prusaslicer-from-supported-websites_399198)
- [Prusa: Printables in PrusaSlicer](https://help.prusa3d.com/article/printables-in-prusaslicer_822448)
- [Bambu Lab Bambu Studio download page](https://bambulab.com/download/studio)
- [Bambu Lab quick-start docs showing Bambu Studio download and project creation](https://cdn1.bambulab.com/documentation/quick-start-59b0cefdc0fc4/P1S/English%20version-Quick%20Start%20Guide%20for%20P1S.pdf)
- [UltiMaker Cura Cloud](https://ultimaker.com/software/cura-cloud/)

### Inference notes

- The recommendation to treat slicer-launch as an explicit allowlisted capability is an inference from the reviewed vendor docs. Prusa documents a supported open-in-slicer flow for whitelisted websites, while the Bambu and UltiMaker materials reviewed here describe download/open-project or browser/cloud workflows rather than a universal public URL scheme.
