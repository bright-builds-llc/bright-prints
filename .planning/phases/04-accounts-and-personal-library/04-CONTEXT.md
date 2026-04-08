# Phase 4: Accounts and Personal Library - Context

**Gathered:** 2026-04-07
**Status:** Ready for planning

<domain>
## Phase Boundary

Give visitors account entry points when save or list actions require identity, let signed-in users bookmark prints, and let them organize saved prints into a default bookmarks list plus custom lists. This phase is about useful personal-library behavior, not broader profile/dashboard product depth, social features, or commerce workflows.

</domain>

<decisions>
## Implementation Decisions

### Auth entry and onboarding
- Browsing stays fully open; authentication appears only when a save, bookmark, or list action requires it.
- If a signed-out visitor tries to save a print, the app should prompt for auth and then complete the original save automatically after success.
- Use a lightweight dedicated auth page with sign-in and create-account modes rather than a modal-heavy or multi-step onboarding flow.
- After successful account creation, return the user to the exact print or save intent they came from and confirm success inline.

### Bookmark and save behavior
- Show a quick save control on catalog cards and a fuller save or list action area on print detail pages.
- Saving should update immediately and show lightweight confirmation without redirecting the user away from the current page.
- The default save action should add the print to a built-in `Bookmarks` list automatically.
- Saved state should remain explicit with text or labels, not just an icon-only state change.

### List organization model
- There is one built-in system `Bookmarks` list that always exists.
- Users can create additional custom lists as needed.
- A print can belong to more than one list, including staying in `Bookmarks` while also appearing in custom lists.
- Custom lists support lightweight create, rename, and delete flows, while `Bookmarks` stays fixed and non-removable.
- From the print detail page, save should complete to `Bookmarks` first, and custom-list organization should be a secondary action.

### Personal library surfaces
- The main library page should prioritize saved prints and list management, not a profile or status dashboard.
- `Bookmarks` should be the default landing section, with custom lists clearly visible nearby.
- Empty library and empty-list states should route users back into discovery with a clear next click.
- The library page should support lightweight inline management: create list, rename list, remove items, and add or move saved prints into lists without turning the page into an admin console.

### Claude's Discretion
- Exact auth copy, success messaging, and whether confirmations render inline, as a toast, or both.
- Exact layout for the library page on mobile and desktop as long as `Bookmarks` remains primary and custom lists remain nearby.
- Exact control styling and placement details for save actions on cards versus detail pages.

</decisions>

<specifics>
## Specific Ideas

- The product should stay discovery-first: identity appears when it unlocks useful saving behavior, not as a prerequisite for browsing.
- `Bookmarks` should feel frictionless and default, while custom lists should feel like optional organization for people who want more structure.
- The library should feel like a calm management surface for saved prints, not a social profile or account dashboard.
- Returning users to the original save intent after auth matters more than celebrating account creation with a standalone onboarding sequence.

</specifics>

<deferred>
## Deferred Ideas

- Profile/dashboard-first account surfaces are deferred; Phase 4 focuses on saved-print utility.
- Social or community features are out of scope for this phase.
- Broader account settings or preference-management depth can be handled later if needed.

</deferred>

---

*Phase: 04-accounts-and-personal-library*
*Context gathered: 2026-04-07*
