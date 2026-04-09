# Research: Pitfalls

**Date:** 2026-04-09
**Scope:** Milestone v1.1 Saved Generators and Magic UI Upgrade

## Pitfall 1: Letting Magic UI define the milestone instead of the product

### Why it happens

UI libraries make it easy to confuse visual novelty with product progress.

### Warning signs

- the milestone backlog becomes a list of components rather than user flows
- discovery, library, and generator work all get “polished” at once without a priority order
- copied components land faster than the shared design rules around them

### Prevention

- prioritize user flows first, components second
- require each adapted Magic UI pattern to justify a product outcome
- start with shared primitives, not page-by-page copy/paste

### Phase to absorb it

The earliest UI-foundation phase in the roadmap

## Pitfall 2: Saving artifacts instead of saving reusable generator intent

### Why it happens

It is tempting to treat the downloaded file as the saved object.

### Warning signs

- schema discussions revolve around binary storage too early
- saved state cannot be easily edited back in the generator
- users can save something but not understand or reuse it

### Prevention

- save normalized parameters and human-readable preset identity
- keep generation client-side
- only add server-side artifact storage if a later milestone has a strong reason

### Phase to absorb it

The preset data-model phase

## Pitfall 3: Making presets sign-specific

### Why it happens

The first real generator is a sign generator, so the shortest path is to hardcode sign semantics into the persistence layer.

### Warning signs

- preset schema names fields after one generator instead of a generic parameter model
- routes and components assume a single generator forever

### Prevention

- key saved work by `generatorSlug`
- store parameter maps or normalized structured values
- keep generator-specific interpretation in the generator domain, not in generic preset storage

### Phase to absorb it

The preset architecture phase

## Pitfall 4: Fragmenting the user’s saved world

### Why it happens

Print bookmarks, custom lists, and generator presets can drift into separate silos if each is built independently.

### Warning signs

- library navigation becomes confusing
- preset management feels like an admin panel instead of part of “my saved work”

### Prevention

- keep the library as the conceptual home for saved user work
- make preset cards/actions feel aligned with existing save/list mental models

### Phase to absorb it

The library-integration phase

## Pitfall 5: Over-animating critical surfaces

### Why it happens

Magic UI patterns are attractive, but Bright Prints still needs trust, clarity, and performance.

### Warning signs

- motion delays critical information
- file/trust surfaces become harder to parse
- generator interactions feel heavier after the redesign

### Prevention

- reserve stronger motion for emphasis, transitions, and empty states
- keep downloads, trust fields, and core form interactions visually direct
- verify accessibility and perceived performance after each adapted component lands

### Phase to absorb it

The UI polish phase
