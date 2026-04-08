import { useFetcher } from "react-router";

type LibraryListFormsProps = {
  selectedList: {
    id: string;
    kind: "BOOKMARKS" | "CUSTOM";
    name: string;
  };
};

export function LibraryListForms({ selectedList }: LibraryListFormsProps) {
  const createFetcher = useFetcher<{ intent: string; listId?: string; ok: boolean }>();
  const renameFetcher = useFetcher<{ intent: string; listId?: string; ok: boolean }>();
  const deleteFetcher = useFetcher<{ intent: string; listId?: string; ok: boolean }>();

  return (
    <section className="library-list-forms" aria-label="List management">
      <createFetcher.Form action="/actions/list-membership" className="library-list-form" method="post">
        <input name="intent" type="hidden" value="create-list" />
        <input name="returnTo" type="hidden" value={`/library?list=${selectedList.id}`} />
        <label htmlFor="library-create-list">Create list</label>
        <input id="library-create-list" name="name" placeholder="Desk Favorites" type="text" />
        <button className="home-secondary-action" type="submit">
          Create List
        </button>
      </createFetcher.Form>

      {selectedList.kind === "CUSTOM" ? (
        <>
          <renameFetcher.Form action="/actions/list-membership" className="library-list-form" method="post">
            <input name="intent" type="hidden" value="rename-list" />
            <input name="listId" type="hidden" value={selectedList.id} />
            <input name="returnTo" type="hidden" value={`/library?list=${selectedList.id}`} />
            <label htmlFor="library-rename-list">Rename list</label>
            <input
              defaultValue={selectedList.name}
              id="library-rename-list"
              name="name"
              type="text"
            />
            <button className="home-secondary-action" type="submit">
              Rename List
            </button>
          </renameFetcher.Form>

          <deleteFetcher.Form action="/actions/list-membership" className="library-list-form" method="post">
            <input name="intent" type="hidden" value="delete-list" />
            <input name="listId" type="hidden" value={selectedList.id} />
            <input name="returnTo" type="hidden" value="/library" />
            <button className="home-secondary-action" type="submit">
              Delete List
            </button>
          </deleteFetcher.Form>
        </>
      ) : null}
    </section>
  );
}
