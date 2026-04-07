import { useFetcher, useRouteLoaderData } from "react-router";

import type { loader as rootLoader } from "~/root";

type SavePrintButtonProps = {
  printSlug: string;
  returnTo: string;
};

export function SavePrintButton({ printSlug, returnTo }: SavePrintButtonProps) {
  const fetcher = useFetcher<{
    intent: "remove-bookmark" | "save-bookmark";
    ok: boolean;
    printSlug: string;
    saved: boolean;
  }>();
  const rootData = useRouteLoaderData<typeof rootLoader>("root");
  const bookmarkedPrintSlugs = rootData?.bookmarkedPrintSlugs ?? [];
  const currentUser = rootData?.currentUser ?? null;
  const submittedPrintSlug = fetcher.formData?.get("printSlug");
  const submittedIntent = fetcher.formData?.get("intent");
  const isHandlingCurrentPrint = submittedPrintSlug === printSlug;
  const isInitiallySaved = bookmarkedPrintSlugs.includes(printSlug);
  const isSaved =
    isHandlingCurrentPrint && submittedIntent
      ? submittedIntent === "save-bookmark"
      : fetcher.data?.printSlug === printSlug
        ? fetcher.data.saved
        : isInitiallySaved;
  const nextIntent = isSaved ? "remove-bookmark" : "save-bookmark";
  const buttonLabel =
    fetcher.state !== "idle"
      ? currentUser
        ? isSaved
          ? "Updating Bookmark"
          : "Saving Print"
        : "Opening Sign In"
      : isSaved
        ? "Saved to Bookmarks"
        : "Save to Bookmarks";

  return (
    <fetcher.Form action="/actions/save-print" method="post">
      <input name="intent" type="hidden" value={nextIntent} />
      <input name="printSlug" type="hidden" value={printSlug} />
      <input name="returnTo" type="hidden" value={returnTo} />
      <button
        aria-pressed={isSaved}
        className="library-save-button"
        type="submit"
      >
        {buttonLabel}
      </button>
    </fetcher.Form>
  );
}
