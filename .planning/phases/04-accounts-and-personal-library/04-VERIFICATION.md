---
phase: 04-accounts-and-personal-library
verified: 2026-04-08T15:38:36Z
status: passed
score: 4/4 must-haves verified
---

# Phase 4: Accounts and Personal Library Verification Report

**Phase Goal:** Give users accounts, bookmarks, and custom lists.  
**Verified:** 2026-04-08T15:38:36Z  
**Status:** passed

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Visitors can create an account and sign in through a dedicated account route with explicit email and password labels. | ✓ VERIFIED | `app/routes/account.tsx` renders the sign-in and create-account modes, and `tests/accounts/auth-route.test.ts` covers both the labels and the sign-in redirect path. |
| 2 | Signed-out save and list submissions preserve their original intent through server-managed session state and resume after auth. | ✓ VERIFIED | `app/routes/save-print.ts`, `app/routes/list-membership.ts`, and `app/lib/auth/session.server.ts` store pending intent plus `returnTo`; `tests/accounts/save-actions.test.ts` covers the redirect handoff and `tests/accounts/auth-session.test.ts` covers serialization and replay. |
| 3 | Signed-in users can bookmark prints and manage custom lists without leaving the current page. | ✓ VERIFIED | `SavePrintButton`, `PrintSaveActions`, and `LibraryListForms` use fetchers; `tests/accounts/save-actions.test.ts` and `tests/accounts/library-mutations.test.ts` verify the stable mutation contracts. |
| 4 | The library keeps `Bookmarks` primary, derives saved-print display data from public content, and supports inline management of custom lists. | ✓ VERIFIED | `app/lib/library/model.ts`, `app/lib/library/query.server.ts`, and `app/routes/library.tsx` build the read model from `printSlug`; `tests/accounts/library-model.test.ts` and `tests/accounts/library-route.test.ts` confirm the bookmarks-first behavior and redirect handling. |

**Score:** 4/4 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `app/lib/auth/session.server.ts` | Session storage, pending-intent helpers, and current-user lookup | ✓ EXISTS + SUBSTANTIVE | Carries the auth token, pending intent, flash state, and auth resume helpers in server-only code. |
| `app/routes/account.tsx` | Dedicated sign-in and create-account route | ✓ EXISTS + SUBSTANTIVE | Handles both modes with explicit labels, inline errors, and post-auth redirect replay. |
| `app/routes/save-print.ts` | Bookmark save/remove action route | ✓ EXISTS + SUBSTANTIVE | Redirects signed-out saves into auth and returns stable action data for signed-in saves. |
| `app/routes/list-membership.ts` | List CRUD and membership action route | ✓ EXISTS + SUBSTANTIVE | Handles create, rename, delete, add, and remove intents with the same auth handoff. |
| `app/lib/library/lists.server.ts` | Bookmarks list helpers | ✓ EXISTS + SUBSTANTIVE | Enforces the fixed `Bookmarks` list and returns bookmarks/custom-list summaries. |
| `app/lib/library/mutations.server.ts` | Transactional bookmark and list mutations | ✓ EXISTS + SUBSTANTIVE | Implements bookmark upserts, custom list writes, and pending-intent replay dispatch. |
| `app/lib/library/query.server.ts` | Runtime list loading | ✓ EXISTS + SUBSTANTIVE | Loads list membership and ensures the bookmarks row exists before read-model composition. |
| `app/lib/library/model.ts` | Pure library read model | ✓ EXISTS + SUBSTANTIVE | Joins saved `printSlug` values back to public content and keeps empty states discovery-forward. |
| `app/routes/library.tsx` | Personal library route | ✓ EXISTS + SUBSTANTIVE | Requires auth, loads the read model, and renders bookmarks plus custom lists. |
| `app/components/library/SavePrintButton.tsx` | Fetcher-driven bookmark control | ✓ EXISTS + SUBSTANTIVE | Uses explicit saved-state text instead of icon-only toggles. |
| `app/components/print-detail/PrintSaveActions.tsx` | Detail-page save and list controls | ✓ EXISTS + SUBSTANTIVE | Keeps `Bookmarks` primary and custom-list organization adjacent. |
| `tests/accounts/auth-session.test.ts` | Session and password helper coverage | ✓ EXISTS + SUBSTANTIVE | Covers password hashing, pending-intent serialization, session expiry, and replay. |
| `tests/accounts/auth-route.test.ts` | Account route coverage | ✓ EXISTS + SUBSTANTIVE | Covers explicit mode labels and auth redirect behavior. |
| `tests/accounts/save-actions.test.ts` | Save and list action coverage | ✓ EXISTS + SUBSTANTIVE | Covers signed-out redirects and signed-in mutation behavior. |
| `tests/accounts/library-mutations.test.ts` | Mutation service coverage | ✓ EXISTS + SUBSTANTIVE | Covers bookmarks invariants and custom-list mutation rules. |
| `tests/accounts/library-model.test.ts` | Library model coverage | ✓ EXISTS + SUBSTANTIVE | Covers bookmarks-first ordering and public-content resolution. |
| `tests/accounts/library-route.test.ts` | Library route coverage | ✓ EXISTS + SUBSTANTIVE | Covers signed-out access redirecting into auth. |

**Artifacts:** 16/16 verified

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|----|--------|---------|
| `app/routes.ts` | `account`, `actions/save-print`, `actions/list-membership`, `library` | route registration | ✓ WIRED | The Phase 4 routes are registered in the app route tree. |
| `app/routes/account.tsx` | `app/lib/auth/session.server.ts` and `app/lib/library/mutations.server.ts` | server action replay | ✓ WIRED | Account submission creates or signs in a user, then replays the stored pending intent. |
| `app/routes/save-print.ts` and `app/routes/list-membership.ts` | pending-intent session helpers | auth handoff | ✓ WIRED | Signed-out mutations store the parsed intent and `returnTo` before redirecting to auth. |
| `app/routes/library.tsx` | `app/lib/library/query.server.ts` and `app/lib/library/model.ts` | loader-driven read model | ✓ WIRED | The library route renders bookmarks-first data from runtime list membership plus public content. |
| `app/root.tsx` | `app/lib/auth/session.server.ts` and `app/lib/library/lists.server.ts` | root session surface | ✓ WIRED | Root loader exposes current user, flash state, and bookmarked slugs for the save controls. |
| `app/lib/db.server.ts` | Prisma Postgres adapter | live runtime bootstrap | ✓ WIRED | The final live verification required the `@prisma/adapter-pg` path to make Prisma 7 connect cleanly. |

**Wiring:** 6/6 connections verified

## Requirements Coverage

| Requirement | Status | Blocking Issue |
|-------------|--------|----------------|
| `ACCT-01`: Visitor can create an account and sign in. | ✓ SATISFIED | - |
| `ACCT-02`: Signed-in user can bookmark a print. | ✓ SATISFIED | - |
| `ACCT-03`: Signed-in user can create a custom list and add or remove prints from it. | ✓ SATISFIED | - |
| `ACCT-04`: Signed-in user can view and manage saved bookmarks and custom lists. | ✓ SATISFIED | - |

**Coverage:** 4/4 requirements satisfied

## Anti-Patterns Found

- `pnpm lint` reports one existing Fast Refresh warning in `app/routes/account.tsx` because the route file exports both components and helper functions. It is non-blocking and does not affect phase status.

## Human Verification Required

Completed. The user reviewed the running app and approved the final Phase 4 experience after the live auth, save-resume, and library flows were validated against a disposable local Postgres instance.

## Gaps Summary

**No blocking gaps found.** Phase 4 meets its goal and the only residual issue is the non-blocking lint warning noted above.

## Verification Metadata

**Verification approach:** Goal-backward, derived from the Phase 4 must-haves and the four wave plans  
**Must-haves source:** Phase 4 roadmap and plan files  
**Automated checks:** 5 passed, 0 failed  
**Human checks required:** 1 passed  
**Runtime note:** Live verification required the Prisma Postgres adapter so Prisma 7 could connect to the disposable Postgres database used for the final checkpoint  
**Total verification time:** ~20 min

---
*Verified: 2026-04-08T15:38:36Z*  
*Verifier: Codex*
