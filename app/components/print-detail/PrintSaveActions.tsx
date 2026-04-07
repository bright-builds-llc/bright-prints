import { useFetcher } from "react-router";

import { SavePrintButton } from "~/components/library/SavePrintButton";

type PrintSaveActionsProps = {
  lists: Array<{
    containsPrint: boolean;
    id: string;
    name: string;
  }>;
  printSlug: string;
  returnTo: string;
};

export function PrintSaveActions({
  lists,
  printSlug,
  returnTo
}: PrintSaveActionsProps) {
  const createListFetcher = useFetcher<{ intent: string; listId?: string; ok: boolean }>();
  const membershipFetcher = useFetcher<{
    intent: string;
    listId?: string;
    ok: boolean;
    printSlug?: string;
  }>();

  return (
    <section className="print-save-actions" aria-label="Save and list actions">
      <div className="print-save-actions-head">
        <p className="eyebrow">Library</p>
        <h2>Keep it in reach later</h2>
        <p>Save to Bookmarks first, then use custom lists when you want more structure.</p>
      </div>

      <div className="print-save-actions-main">
        <SavePrintButton printSlug={printSlug} returnTo={returnTo} />
      </div>

      <div className="print-save-actions-side">
        <createListFetcher.Form action="/actions/list-membership" className="print-save-list-form" method="post">
          <input name="intent" type="hidden" value="create-list" />
          <input name="returnTo" type="hidden" value={returnTo} />
          <label htmlFor="new-list-name">Create list</label>
          <input id="new-list-name" name="name" placeholder="Desk Favorites" type="text" />
          <button className="home-secondary-action" type="submit">
            Create List
          </button>
        </createListFetcher.Form>

        {lists.length > 0 ? (
          <ul className="print-save-list-grid">
            {lists.map((list) => (
              <li key={list.id}>
                <membershipFetcher.Form action="/actions/list-membership" method="post">
                  <input
                    name="intent"
                    type="hidden"
                    value={list.containsPrint ? "remove-print-from-list" : "add-print-to-list"}
                  />
                  <input name="listId" type="hidden" value={list.id} />
                  <input name="printSlug" type="hidden" value={printSlug} />
                  <input name="returnTo" type="hidden" value={returnTo} />
                  <button className="home-secondary-action" type="submit">
                    {list.containsPrint ? `Remove from ${list.name}` : `Add to ${list.name}`}
                  </button>
                </membershipFetcher.Form>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
