# Research: Stack

**Date:** 2026-04-09
**Scope:** Milestone v1.1 Saved Generators and Magic UI Upgrade

## Recommended stack stance

Keep the current application stack intact:

- React Router 7
- React 19
- Tailwind CSS 4
- Prisma + PostgreSQL
- Bun for local/build workflows
- Node for production runtime

This milestone does **not** justify a framework migration or a design-system reset.

## Magic UI adoption recommendation

### Use Magic UI as a source-pattern library, not as the app’s governing framework

Magic UI is a good fit conceptually because it is React-based and has current installation guidance for Vite/Remix-style setups plus Tailwind v4 support. The right integration model for Bright Prints is:

- selectively copy or adapt components and patterns
- wrap them in repo-owned components under Bright Prints’ conventions
- keep visual ownership inside the app

### Do not frame this milestone as:

- migrating to a Next.js-style app structure
- adopting Magic UI wholesale
- introducing a blanket shadcn-style registry workflow across the app

## Likely stack additions

### UI and motion

- `framer-motion`
  Why: many Magic UI interaction patterns assume animation as a first-class primitive, and Bright Prints currently has no dedicated motion library
- `lucide-react`
  Why: useful if selected Magic UI-derived components or affordances need a consistent icon layer
- `tailwind-merge` and `clsx` or `class-variance-authority`
  Why: useful if the new shared UI primitives become more variant-heavy than the current hand-rolled class strings

Add only what the adopted component set actually needs.

## Saved-generator runtime recommendation

### Persist presets, not generated binaries

For v1.1, store:

- `userId`
- `generatorSlug`
- preset `name`
- normalized parameter JSON
- lightweight metadata such as `updatedAt`, `lastGeneratedAt`, or summary fields

Do **not** store generated `.3mf` binaries server-side in this milestone unless a specific requirement appears that truly needs it.

## Non-recommendations

- No backend CAD worker
- No binary artifact storage service
- No full library-wide redesign before the shared primitive layer exists
- No reopening full live-checkout scope in the same milestone

## Source notes

- Magic UI docs indicate React/Vite/Remix installation paths and Tailwind v4 support, which makes it a realistic adaptation source for Bright Prints.
- The current Bright Prints stack already matches the app/runtime side of the problem; the main work is selective UI adaptation plus preset persistence.
