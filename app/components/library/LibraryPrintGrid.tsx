import { useFetcher } from "react-router";

import { DiscoveryCard } from "~/components/discovery/DiscoveryCard";
import { SavePrintButton } from "~/components/library/SavePrintButton";
import { LuminousPanel } from "~/components/ui/luminous-panel";

type LibraryPrintGridProps = {
  emptyState: {
    ctaHref: string;
    ctaLabel: string;
    description: string;
    title: string;
  } | null;
  selectedList: {
    id: string;
    kind: "BOOKMARKS" | "CUSTOM";
    missingCount: number;
    name: string;
    prints: Array<{
      customLists: Array<{
        containsPrint: boolean;
        id: string;
        name: string;
      }>;
      isBookmarked: boolean;
      item: import("~/lib/discovery/model").DiscoveryItem;
    }>;
  };
};

export function LibraryPrintGrid({
  emptyState,
  selectedList,
}: LibraryPrintGridProps) {
  const membershipFetcher = useFetcher<{
    intent: string;
    listId?: string;
    ok: boolean;
  }>();

  if (emptyState) {
    return (
      <LuminousPanel className="library-empty-state" tone="accent">
        <p className="eyebrow">Empty State</p>
        <h2>{emptyState.title}</h2>
        <p>{emptyState.description}</p>
        <a className="home-primary-action" href={emptyState.ctaHref}>
          {emptyState.ctaLabel}
        </a>
      </LuminousPanel>
    );
  }

  return (
    <section
      className="library-grid"
      aria-label={`${selectedList.name} prints`}
    >
      {selectedList.prints.map((print) => (
        <LuminousPanel
          as="article"
          className="library-grid-card"
          frameClassName="h-full"
          key={print.item.id}
          tone="paper"
        >
          <DiscoveryCard item={print.item} variant="feature" />
          <div className="library-grid-actions">
            <SavePrintButton
              printSlug={print.item.slug}
              returnTo={`/library?list=${selectedList.id}`}
            />
            {print.customLists.map((list) => (
              <membershipFetcher.Form
                action="/actions/list-membership"
                key={list.id}
                method="post"
              >
                <input
                  name="intent"
                  type="hidden"
                  value={
                    list.containsPrint
                      ? "remove-print-from-list"
                      : "add-print-to-list"
                  }
                />
                <input name="listId" type="hidden" value={list.id} />
                <input name="printSlug" type="hidden" value={print.item.slug} />
                <input
                  name="returnTo"
                  type="hidden"
                  value={`/library?list=${selectedList.id}`}
                />
                <button className="home-secondary-action" type="submit">
                  {list.containsPrint
                    ? `Remove from ${list.name}`
                    : `Add to ${list.name}`}
                </button>
              </membershipFetcher.Form>
            ))}
          </div>
        </LuminousPanel>
      ))}

      {selectedList.missingCount > 0 ? (
        <p className="library-missing-note">
          {selectedList.missingCount} saved print
          {selectedList.missingCount === 1 ? "" : "s"} no longer exist in public
          content.
        </p>
      ) : null}
    </section>
  );
}
