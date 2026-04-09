# Phase 4 Research: Accounts and Personal Library

**Phase:** 4  
**Date:** 2026-04-07  
**Goal:** Give users accounts, bookmarks, and custom lists without turning Bright Prints into a profile dashboard or a framework-heavy identity project.

## What matters for planning this phase well

### 1. The product stance is discovery-first, not identity-first

Phase 4 is only about identity when it unlocks saving. Browsing stays open, and auth appears only when a save, bookmark, or list action needs a user. That is already locked in the phase context and matches the current repo shape: public content is repo-backed, private runtime data belongs in Prisma, and the app already separates server-only DB access from public content loading.

Relevant local files:

- [`/Users/peterryszkiewicz/Repos/bright-prints/.planning/phases/04-accounts-and-personal-library/04-CONTEXT.md`](/Users/peterryszkiewicz/Repos/bright-prints/.planning/phases/04-accounts-and-personal-library/04-CONTEXT.md)
- [`/Users/peterryszkiewicz/Repos/bright-prints/docs/architecture/private-data-boundaries.md`](/Users/peterryszkiewicz/Repos/bright-prints/docs/architecture/private-data-boundaries.md)
- [`/Users/peterryszkiewicz/Repos/bright-prints/app/lib/db.server.ts`](/Users/peterryszkiewicz/Repos/bright-prints/app/lib/db.server.ts)

### 2. The current app stack already points to the right implementation shape

This repo is a React Router 7 framework app with route modules, server loaders, server actions, and route-scoped rendering. That means Phase 4 should stay in the same pattern: route modules for auth and library pages, server helpers for session and list mutations, and fetchers for in-place save actions.

Relevant local files:

- [`/Users/peterryszkiewicz/Repos/bright-prints/app/routes.ts`](/Users/peterryszkiewicz/Repos/bright-prints/app/routes.ts)
- [`/Users/peterryszkiewicz/Repos/bright-prints/app/routes/print-detail.tsx`](/Users/peterryszkiewicz/Repos/bright-prints/app/routes/print-detail.tsx)
- [`/Users/peterryszkiewicz/Repos/bright-prints/app/routes/print-download.ts`](/Users/peterryszkiewicz/Repos/bright-prints/app/routes/print-download.ts)

### 3. Prisma already has the core runtime tables, but the phase needs stronger constraints

The schema already includes `User`, `Session`, `SavedPrintList`, and `SavedPrintListItem`. That is the correct private boundary for accounts and the library. The missing part is not a different storage layer; it is the exact constraints and service helpers that make the product rules true, especially the fixed `Bookmarks` list and the one-bookmarks-list-per-user invariant.

Relevant local files:

- [`/Users/peterryszkiewicz/Repos/bright-prints/prisma/schema.prisma`](/Users/peterryszkiewicz/Repos/bright-prints/prisma/schema.prisma)
- [`/Users/peterryszkiewicz/Repos/bright-prints/docs/architecture/private-data-boundaries.md`](/Users/peterryszkiewicz/Repos/bright-prints/docs/architecture/private-data-boundaries.md)

### 4. Intent return after auth should be treated as server state, not UI state

The save intent has to survive a redirect to auth and then resume automatically. That means the intent belongs in server-managed session state or a very short-lived runtime record, not in local component state and not in browser storage. React Router’s current session docs explicitly support per-route session handling with loader/action access and session storage that can keep data in a database or filesystem.

### 5. The library page is a management surface, not an account profile

The locked context wants `Bookmarks` first, custom lists nearby, lightweight inline management, and discovery-forward empty states. That means the library route should derive its display model from public content plus runtime list membership, not from a new profile dashboard model.

## Standard Stack

Use React Router 7 route modules for all auth and library surfaces, with server actions for mutations and loaders for read models.

- Use a dedicated auth route with sign-in and create-account modes.
- Use `fetcher.Form` or `useFetcher` for bookmark and list mutations so quick-save interactions stay on the current page.
- Use server-side redirects to return to the original print, card, or library context after auth completes.
- Keep private user state in Prisma and keep print metadata in repo-backed content.
- Keep server-only DB/env access in `app/lib/db.server.ts` and `app/lib/env.server.ts`.

Current repo evidence supports this stack:

- React Router routes already drive the product shell.
- Public print content already lives in `content/` and is loaded through `loadPublicContent()`.
- Runtime-private models already exist in Prisma and should continue to own only user/session/library state.

## Architecture Patterns

### 1. Use one auth page, not a modal auth system

Use a single route for auth with mode switching. Keep the page lightweight and let it render either sign-in or create-account form state. The page can preserve the original save intent through a session-stored `returnTo` and `pendingIntent` payload.

Recommended shape:

1. Save action detects no active user.
2. Save action stores a pending intent in session state and redirects to auth.
3. Auth page submits to a server action.
4. Auth action creates or signs in the user, consumes the pending intent, performs the save, clears the intent, and redirects back with a flash message or inline success state.

This is an inference from the locked context and current session docs, not a schema already present in the repo.

### 2. Keep auth gating in actions, not in client-only conditionals

Use the server action as the gatekeeper. Client-only checks are fine for optimistic UI, but they cannot be the source of truth because signed-out visitors can still submit save actions directly. The action should reject or redirect unauthenticated mutations consistently.

### 3. Keep the public print model authoritative for display

Do not duplicate print title, description, file labels, or thumbnail metadata into runtime library rows. Store only `printSlug` in list items and derive the display card from public content when rendering the library.

That keeps the library aligned with the existing public-content boundary and avoids drift when authored content changes.

### 4. Model the fixed bookmarks list as a real system row

`Bookmarks` should be a normal list record with a special `kind`, not a UI-only concept. The app should create it automatically and enforce that it cannot be renamed or deleted.

Recommended invariant:

- exactly one `BOOKMARKS` list per user
- any print can be in `Bookmarks` and any number of custom lists
- list membership is many-to-many through `SavedPrintListItem`

### 5. Use transactions for save and list mutations

Bookmarking and list membership are small writes, but they are still race-prone. Use a transaction that:

1. ensures the system `Bookmarks` list exists
2. inserts or upserts the list item with a composite uniqueness guard
3. returns the current saved state for revalidation

That is the safest way to avoid duplicate items during rapid clicks or double submits.

## Runtime Data Guidance

### Keep in Prisma runtime state

- `User`
- `Session`
- `SavedPrintList`
- `SavedPrintListItem`
- future auth intent / flash metadata if it must survive the round trip through auth

### Keep in derived route state

- current auth mode
- `returnTo`
- save button busy state
- current fetcher state
- inline success copy
- empty-state copy
- whether a print is already saved to `Bookmarks` or another list

### Keep in public content

- print title, summary, description, availability, files, license, creator metadata, and published-on dates
- any print card data that should still be diff-friendly and repo-owned

### Inference

If the library needs a resolved print card, load the public print by `printSlug` and join it with the runtime list membership. Do not backfill runtime denormalizations of print content unless a later phase proves it is necessary.

## Don’t Hand-Roll

- Do not build auth state in `localStorage` or `sessionStorage`; use server-managed session storage.
- Do not introduce a full auth framework with passkeys, 2FA, organizations, captcha, or billing just to support bookmarks.
- Do not make the `Bookmarks` list optional or user-deletable.
- Do not store rendered print metadata redundantly in the library tables.
- Do not rely on icon-only save toggles or icon-only list actions.
- Do not hide auth or save failures behind silent redirects.
- Do not hand-roll client-only “saved” state that can disagree with the server after reload.

The current Better Auth docs show how broad a full auth suite can become, including passkeys, magic links, email OTP, 2FA, organizations, captcha, and billing. That breadth is useful later, but it is more surface area than Phase 4 needs.

## Common Pitfalls

- Missing labels on sign-in fields, list-name inputs, and save controls. WAI explicitly recommends labels that describe the purpose of the control.
- Success and error feedback that is visible but not announced. WAI’s status-message guidance expects status updates to be programmatically identifiable.
- Losing the original save intent when auth redirects happen.
- Allowing duplicate bookmark rows because the default list was not protected with a unique invariant.
- Hiding empty library states instead of linking back to discovery.
- Turning the library into an account dashboard with profile noise before the saved content is easy to manage.
- Making quick-save controls navigate away from the current page instead of using fetchers.

## Code Examples

```ts
// Save intent is server state, not component state.
export async function action({ request }: Route.ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const user = await getCurrentUser(session);

  if (!user) {
    session.set("pendingIntent", {
      kind: "bookmark",
      printSlug: "sample-featured-print",
      returnTo: "/prints/sample-featured-print"
    });

    return redirect("/account?mode=sign-in", {
      headers: { "Set-Cookie": await commitSession(session) }
    });
  }

  await savePrintToBookmarks({ userId: user.id, printSlug: "sample-featured-print" });
  return redirect("/prints/sample-featured-print");
}
```

```tsx
// Quick save stays on the current surface.
const fetcher = useFetcher();

<fetcher.Form method="post" action="/actions/save-print">
  <input type="hidden" name="printSlug" value={print.slug} />
  <button type="submit">
    {isSaved ? "Saved to Bookmarks" : "Save to Bookmarks"}
  </button>
</fetcher.Form>
```

```prisma
model SavedPrintList {
  id        String               @id @default(cuid())
  userId    String
  name      String
  kind      SavedPrintListKind    @default(CUSTOM)

  @@unique([userId, kind])
}
```

```ts
await db.$transaction(async (tx) => {
  const bookmarks = await ensureBookmarksList(tx, user.id);

  await tx.savedPrintListItem.upsert({
    where: {
      listId_printSlug: {
        listId: bookmarks.id,
        printSlug
      }
    },
    create: { listId: bookmarks.id, printSlug },
    update: {}
  });
});
```

## Recommended Plan Split

### Wave 1: Auth and session primitives

- Add the auth route, session storage, and current-user lookup.
- Model the save-intent round trip through server state.
- Prove unauthenticated save actions redirect and resume correctly.

### Wave 2: Bookmarking and list writes

- Create and enforce the fixed `Bookmarks` list.
- Add bookmark save/remove actions from discovery and print detail.
- Add custom list create/rename/delete and list membership writes.

### Wave 3: Library read model and inline management

- Build the library loader from Prisma lists plus public print content.
- Render `Bookmarks` first, custom lists nearby, and empty states that return to discovery.
- Add lightweight inline management for removing items and moving items between lists.

### Wave 4: UX and accessibility hardening

- Add labels, status messages, and focus behavior for auth and save flows.
- Verify saved-state copy, success messaging, and empty states on mobile and desktop.
- Check that the page stays discovery-forward and does not drift into profile-dashboard territory.

## Sources

### Local sources

- [`/Users/peterryszkiewicz/Repos/bright-prints/.planning/phases/04-accounts-and-personal-library/04-CONTEXT.md`](/Users/peterryszkiewicz/Repos/bright-prints/.planning/phases/04-accounts-and-personal-library/04-CONTEXT.md)
- [`/Users/peterryszkiewicz/Repos/bright-prints/docs/architecture/private-data-boundaries.md`](/Users/peterryszkiewicz/Repos/bright-prints/docs/architecture/private-data-boundaries.md)
- [`/Users/peterryszkiewicz/Repos/bright-prints/prisma/schema.prisma`](/Users/peterryszkiewicz/Repos/bright-prints/prisma/schema.prisma)
- [`/Users/peterryszkiewicz/Repos/bright-prints/app/routes.ts`](/Users/peterryszkiewicz/Repos/bright-prints/app/routes.ts)
- [`/Users/peterryszkiewicz/Repos/bright-prints/app/lib/db.server.ts`](/Users/peterryszkiewicz/Repos/bright-prints/app/lib/db.server.ts)
- [`/Users/peterryszkiewicz/Repos/bright-prints/app/lib/content/schema.ts`](/Users/peterryszkiewicz/Repos/bright-prints/app/lib/content/schema.ts)
- [`/Users/peterryszkiewicz/Repos/bright-prints/app/routes/print-detail.tsx`](/Users/peterryszkiewicz/Repos/bright-prints/app/routes/print-detail.tsx)

### External sources

- [React Router Sessions and Cookies](https://reactrouter.com/explanation/sessions-and-cookies)
- [React Router createCookieSessionStorage](https://reactrouter.com/api/utils/createCookieSessionStorage)
- [React Router SessionIdStorageStrategy](https://api.reactrouter.com/v7/interfaces/react-router.SessionIdStorageStrategy.html)
- [React Router Form vs. fetcher](https://reactrouter.com/explanation/form-vs-fetcher)
- [React Router useFetcher](https://reactrouter.com/api/hooks/useFetcher)
- [React Router Form](https://api.reactrouter.com/v7/functions/react-router.Form)
- [React Router Progressive Enhancement](https://reactrouter.com/explanation/progressive-enhancement)
- [Prisma relation mode](https://docs.prisma.io/docs/orm/prisma-schema/data-model/relations/relation-mode)
- [Prisma database features matrix](https://docs.prisma.io/docs/v6/orm/reference/database-features)
- [WAI Labeling Controls](https://www.w3.org/WAI/tutorials/forms/labels/)
- [WAI User Notification](https://www.w3.org/WAI/tutorials/forms/notifications/)
- [WAI Status Messages](https://www.w3.org/WAI/WCAG21/Understanding/status-messages.html)
- [WAI Technique H44: Using label elements to associate text labels with form controls](https://www.w3.org/WAI/WCAG21/Techniques/html/H44)
- [Better Auth Plugins](https://better-auth.com/docs/plugins)
- [Better Auth Passkey](https://better-auth.com/docs/plugins/passkey)
- [Better Auth 2FA](https://better-auth.com/docs/plugins/2fa)
- [Better Auth Organization](https://better-auth.com/docs/plugins/organization)
- [Better Auth Captcha](https://www.better-auth.com/docs/plugins/captcha)

## Prescriptive conclusion

Use app-owned auth with Prisma-backed session storage, server actions, and fetchers. Keep `Bookmarks` as a fixed system list, keep public print metadata out of runtime rows, and model saved intent as server state so the user returns to the exact save flow after signing in or creating an account.
