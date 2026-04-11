import { useFetcher } from "react-router";

import { LuminousPanel } from "~/components/ui/luminous-panel";

type LibraryListFormsProps = {
  selectedList: {
    id: string;
    kind: "BOOKMARKS" | "CUSTOM";
    name: string;
  };
};

export function LibraryListForms({ selectedList }: LibraryListFormsProps) {
  const createFetcher = useFetcher<{
    intent: string;
    listId?: string;
    ok: boolean;
  }>();
  const renameFetcher = useFetcher<{
    intent: string;
    listId?: string;
    ok: boolean;
  }>();
  const deleteFetcher = useFetcher<{
    intent: string;
    listId?: string;
    ok: boolean;
  }>();
  const createStatus =
    createFetcher.state !== "idle"
      ? "Creating list."
      : createFetcher.data?.ok
        ? "List created."
        : "";
  const renameStatus =
    renameFetcher.state !== "idle"
      ? "Renaming list."
      : renameFetcher.data?.ok
        ? "List renamed."
        : "";
  const deleteStatus =
    deleteFetcher.state !== "idle"
      ? "Deleting list."
      : deleteFetcher.data?.ok
        ? "List deleted."
        : "";

  return (
    <LuminousPanel
      aria-label="List management"
      className="library-list-forms"
      tone="paper"
    >
      <createFetcher.Form
        action="/actions/list-membership"
        className="library-list-form"
        method="post"
      >
        <input name="intent" type="hidden" value="create-list" />
        <input
          name="returnTo"
          type="hidden"
          value={`/library?list=${selectedList.id}`}
        />
        <label htmlFor="library-create-list">Create list</label>
        <input
          id="library-create-list"
          name="name"
          placeholder="Desk Favorites"
          type="text"
        />
        <button className="home-secondary-action" type="submit">
          Create List
        </button>
        <span aria-live="polite" className="library-status-text">
          {createStatus}
        </span>
      </createFetcher.Form>

      {selectedList.kind === "CUSTOM" ? (
        <>
          <renameFetcher.Form
            action="/actions/list-membership"
            className="library-list-form"
            method="post"
          >
            <input name="intent" type="hidden" value="rename-list" />
            <input name="listId" type="hidden" value={selectedList.id} />
            <input
              name="returnTo"
              type="hidden"
              value={`/library?list=${selectedList.id}`}
            />
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
            <span aria-live="polite" className="library-status-text">
              {renameStatus}
            </span>
          </renameFetcher.Form>

          <deleteFetcher.Form
            action="/actions/list-membership"
            className="library-list-form"
            method="post"
          >
            <input name="intent" type="hidden" value="delete-list" />
            <input name="listId" type="hidden" value={selectedList.id} />
            <input name="returnTo" type="hidden" value="/library" />
            <button className="home-secondary-action" type="submit">
              Delete List
            </button>
            <span aria-live="polite" className="library-status-text">
              {deleteStatus}
            </span>
          </deleteFetcher.Form>
        </>
      ) : null}
    </LuminousPanel>
  );
}
