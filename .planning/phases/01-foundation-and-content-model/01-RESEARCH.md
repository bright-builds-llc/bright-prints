# Phase 1 Research: Foundation and Content Model

**Phase:** 1  
**Date:** 2026-04-04  
**Goal:** Establish the deployable, privacy-safe, repo-backed foundation for the product.

## What matters for planning this phase well

### 1. The real React Router 7 scaffold is concrete and Docker-friendly

I verified the current framework-mode structure by scaffolding a temporary app with `create-react-router@7.14.0`.

Relevant generated files:

- `package.json`
- `app/root.tsx`
- `app/routes.ts`
- `react-router.config.ts`
- `vite.config.ts`
- `Dockerfile`

That matters because Phase 1 should not invent a custom app layout when the official structure already fits the deployment model and keeps execution risk down.

### 2. Use `pnpm`, not npm

This repo does not have `package-lock.json` or `yarn.lock`, and the repo-wide instruction says to prefer `pnpm` for TS/JS projects in that case.

Planning implication:

- bootstrap from the official React Router structure
- normalize the project to `pnpm`
- ensure scripts cover lint, typecheck, build, test, and content validation from day one

### 3. Railway support should be “real”, but part of it is human setup

React Router 7 officially supports Docker-based deployment, and Railway will deploy from a repo-root `Dockerfile`. That is enough for the code side of Phase 1.

However, production autodeploy on push to `main` still requires Railway dashboard setup that the user must perform:

- connect the GitHub repo
- provision the service
- provision Postgres when ready
- set environment variables

Planning implication:

- code the Dockerized deployment path in Phase 1
- include Railway user setup in plan frontmatter instead of pretending it is fully automatable

### 4. Repo-backed content should be schema-first and creator-aware

Phase 1 is the right time to lock the authoring shape before gallery work starts.

Recommended repo structure:

- `content/creators/<slug>.yaml`
- `content/prints/<slug>/print.yaml`
- `content/generators/<slug>/generator.yaml`

Recommended rules:

- every content file has `schemaVersion`
- prints and generators reference creators by `creatorSlug`
- only public fields live in repo-backed content
- no secrets, payment metadata, customer data, or private business data belong under `content/`

Planning implication:

- define public content schemas and loaders in Phase 1
- add at least one seed creator, one seed print, and one seed generator definition

### 5. Private runtime data still needs a first-class foundation

Even though accounts and commerce arrive later, the app should establish the private runtime boundary now.

Recommended private/runtime layer for Phase 1:

- `prisma/schema.prisma`
- server-only env parsing in `*.server.ts`
- DB client module in `*.server.ts`
- docs that explicitly separate public content from private runtime data

Planning implication:

- do not wait until auth or payments to introduce Prisma and env boundaries
- use `.server.ts` naming to keep secrets out of browser-importable modules

### 6. Client-side generation changes the foundation shape

The reference repo `3D-Sign-Maker` proves that browser-side `3mf` generation is viable for the intended sign-style generator class.

Planning implication:

- Phase 1 does **not** need a backend generator service
- Phase 1 **does** need the content schema and app structure to leave room for a future browser-side generator module tree

### 7. Phase 1 should produce a minimal but real read path

If Phase 1 only creates schemas and docs, it will be too easy for later phases to discover the content model is awkward in actual route code.

Planning implication:

- the seeded content should be loaded by the app
- the foundation home route should prove the content loader works
- this is not the full polished homepage from Phase 2; it is a foundation route that exercises the content pipeline

## Recommended plan split

### Wave 1

- **01-01**: Bootstrap React Router app, pnpm tooling, Docker/Railway deployment path, and a minimal foundation route

### Wave 2

- **01-02**: Define the repo-backed public content model, seed content, validation, and loader integration
- **01-03**: Establish private runtime boundaries with Prisma, server-only env modules, and privacy boundary documentation

This split keeps file overlap low:

- Plan `01-01` owns project scaffolding and shared tooling
- Plan `01-02` owns public content and loader files
- Plan `01-03` owns server-only env, Prisma, and privacy docs

## Sources

- Temporary scaffold via `npm init react-router@latest` using `create-react-router@7.14.0`
- [React Router](https://reactrouter.com/api/home)
- [React Router framework installation](https://reactrouter.com/main/start/framework/installation)
- [React Router deploying](https://reactrouter.com/start/framework/deploying)
- [Railway Dockerfiles docs](https://docs.railway.com/deploy/dockerfiles)
- [Railway GitHub autodeploy docs](https://docs.railway.com/guides/github-autodeploys)
- [3D-Sign-Maker](https://github.com/pRizz/3D-Sign-Maker)

