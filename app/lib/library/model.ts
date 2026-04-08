import type { RuntimeLibraryList } from "~/lib/library/query.server";
import type { PublicContentIndex } from "~/lib/content/public";
import { buildDiscoveryItems, type DiscoveryItem } from "~/lib/discovery/model";

export type LibraryModel = {
  emptyState: {
    ctaHref: string;
    ctaLabel: string;
    description: string;
    title: string;
  } | null;
  lists: Array<{
    count: number;
    id: string;
    isSelected: boolean;
    kind: RuntimeLibraryList["kind"];
    name: string;
  }>;
  selectedList: {
    id: string;
    kind: RuntimeLibraryList["kind"];
    missingCount: number;
    name: string;
    prints: Array<{
      customLists: Array<{
        containsPrint: boolean;
        id: string;
        name: string;
      }>;
      isBookmarked: boolean;
      item: DiscoveryItem;
    }>;
  };
};

function buildEmptyState(listName: string): LibraryModel["emptyState"] {
  return {
    ctaHref: "/catalog?type=prints",
    ctaLabel: "Browse Prints",
    description:
      listName === "Bookmarks"
        ? "Save a few prints from discovery or detail pages, then come back here to organize them."
        : "This list is empty right now. Browse the catalog and add prints when something is worth keeping.",
    title:
      listName === "Bookmarks" ? "Bookmarks are empty" : `${listName} does not have any prints yet`
  };
}

export function buildLibraryModel(options: {
  content: PublicContentIndex;
  maybeSelectedListId: string | null;
  runtimeLists: RuntimeLibraryList[];
}): LibraryModel {
  const { content, maybeSelectedListId, runtimeLists } = options;
  const discoveryPrints = buildDiscoveryItems(content).filter((item) => item.kind === "print");
  const selectedList =
    runtimeLists.find((list) => list.id === maybeSelectedListId) ?? runtimeLists[0];

  if (!selectedList) {
    return {
      emptyState: buildEmptyState("Bookmarks"),
      lists: [],
      selectedList: {
        id: "bookmarks",
        kind: "BOOKMARKS",
        missingCount: 0,
        name: "Bookmarks",
        prints: []
      }
    };
  }

  const customLists = runtimeLists.filter((list) => list.kind === "CUSTOM");
  const selectedPrints = selectedList.items
    .map((item) => {
      const maybeDiscoveryItem = discoveryPrints.find(
        (candidate) => candidate.slug === item.printSlug
      );

      if (!maybeDiscoveryItem) {
        return null;
      }

      const membership = customLists.map((list) => ({
        containsPrint: list.items.some((savedItem) => savedItem.printSlug === item.printSlug),
        id: list.id,
        name: list.name
      }));

      return {
        customLists: membership,
        isBookmarked:
          runtimeLists.find((list) => list.kind === "BOOKMARKS")?.items.some(
            (savedItem) => savedItem.printSlug === item.printSlug
          ) ?? false,
        item: maybeDiscoveryItem
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  return {
    emptyState: selectedPrints.length === 0 ? buildEmptyState(selectedList.name) : null,
    lists: runtimeLists.map((list) => ({
      count: list.items.length,
      id: list.id,
      isSelected: list.id === selectedList.id,
      kind: list.kind,
      name: list.name
    })),
    selectedList: {
      id: selectedList.id,
      kind: selectedList.kind,
      missingCount: selectedList.items.length - selectedPrints.length,
      name: selectedList.name,
      prints: selectedPrints
    }
  };
}
