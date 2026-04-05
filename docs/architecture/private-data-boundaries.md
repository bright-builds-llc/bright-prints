# Private Data Boundaries

Bright Prints is open source, so the repository needs an explicit line between public content, private runtime data, and secrets.

## Public content

Public content belongs in repo-backed files under `content/`.

Examples:

- creator records
- print metadata
- generator definitions
- public descriptions
- public file references
- public licensing metadata

Rules:

- every file must be schema-validated
- only public, intentional data belongs here
- creator ownership is represented by public identifiers such as `creatorSlug`

## Private runtime data

Private operational data belongs in Prisma-backed runtime storage.

Examples:

- users
- sessions
- saved lists and bookmarks
- commerce intent records
- future order and payment-adjacent operational state

Rules:

- runtime-private models live in `prisma/schema.prisma`
- runtime access happens through server-only modules such as `app/lib/db.server.ts`
- repo-backed public content is not duplicated into runtime storage without a deliberate reason

## Secrets and environment configuration

Secrets must never be committed to the public repository.

Examples:

- `DATABASE_URL`
- payment provider secrets
- private API keys
- webhook secrets

Rules:

- parse secrets only from server-side code
- use `app/lib/env.server.ts` as the single environment parsing entrypoint
- keep real values out of fixtures, docs, and example content

## Fast placement guide

| Data | Where it belongs | Why |
|---|---|---|
| Print title and description | `content/prints/...` | Public, diff-friendly product metadata |
| Generator parameter definitions | `content/generators/...` | Public schema-driven generator authoring |
| User email and sessions | Prisma runtime models | Private user data |
| Bookmark lists | Prisma runtime models | User-specific runtime state |
| Payment metadata | Prisma runtime models or provider systems | Sensitive operational data |
| API keys and database URLs | Environment variables only | Secrets, never public content |

## Non-goals

- Do not store customer or provider metadata in public YAML files.
- Do not store secrets in route modules or browser-importable files.
- Do not turn Prisma into the source of truth for public print and generator metadata during Phase 1.
