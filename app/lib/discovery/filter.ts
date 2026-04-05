import { z } from "zod";

import type { DiscoveryItem } from "~/lib/discovery/model";

const querySchema = z.object({
  availability: z.enum(["all", "open-source", "physical-print"]).default("all"),
  category: z.string().trim().default("all"),
  q: z.string().trim().default(""),
  sort: z.enum(["featured", "newest", "title"]).default("featured"),
  type: z.enum(["all", "prints", "generators"]).default("all")
});

export type DiscoveryQuery = z.infer<typeof querySchema>;

function normalize(value: string): string {
  return value.toLocaleLowerCase();
}

function matchesAvailability(item: DiscoveryItem, availability: DiscoveryQuery["availability"]): boolean {
  if (availability === "all") {
    return true;
  }

  if (availability === "open-source") {
    return item.availability === "open-source" || item.availability === "both";
  }

  return item.availability === "physical-print" || item.availability === "both";
}

function matchesType(item: DiscoveryItem, type: DiscoveryQuery["type"]): boolean {
  if (type === "all") {
    return true;
  }

  return type === "prints" ? item.kind === "print" : item.kind === "generator";
}

function matchesCategory(item: DiscoveryItem, category: string): boolean {
  if (category === "all") {
    return true;
  }

  return item.categories.some((itemCategory) => normalize(itemCategory) === normalize(category));
}

function matchesSearch(item: DiscoveryItem, q: string): boolean {
  if (q.length === 0) {
    return true;
  }

  const haystack = [
    item.title,
    item.summary,
    item.eyebrow,
    item.kind,
    item.mark,
    ...item.categories
  ]
    .join(" ")
    .toLocaleLowerCase();

  return haystack.includes(normalize(q));
}

function compareByFeatured(left: DiscoveryItem, right: DiscoveryItem): number {
  if (left.featuredRank !== null && right.featuredRank !== null) {
    return left.featuredRank - right.featuredRank;
  }

  if (left.featuredRank !== null) {
    return -1;
  }

  if (right.featuredRank !== null) {
    return 1;
  }

  return compareByNewest(left, right);
}

function compareByNewest(left: DiscoveryItem, right: DiscoveryItem): number {
  if (left.publishedOn !== right.publishedOn) {
    return right.publishedOn.localeCompare(left.publishedOn);
  }

  return left.title.localeCompare(right.title);
}

function compareByTitle(left: DiscoveryItem, right: DiscoveryItem): number {
  return left.title.localeCompare(right.title);
}

export function parseDiscoveryQuery(searchParams: URLSearchParams): DiscoveryQuery {
  return querySchema.parse({
    availability: searchParams.get("availability") ?? "all",
    category: searchParams.get("category") ?? "all",
    q: searchParams.get("q") ?? "",
    sort: searchParams.get("sort") ?? "featured",
    type: searchParams.get("type") ?? "all"
  });
}

export function getDiscoveryCategories(items: DiscoveryItem[]): string[] {
  return [...new Set(items.flatMap((item) => item.categories))]
    .sort((left, right) => left.localeCompare(right));
}

export function filterDiscoveryItems(
  items: DiscoveryItem[],
  query: DiscoveryQuery
): DiscoveryItem[] {
  const filtered = items.filter(
    (item) =>
      matchesType(item, query.type) &&
      matchesAvailability(item, query.availability) &&
      matchesCategory(item, query.category) &&
      matchesSearch(item, query.q)
  );

  const comparator =
    query.sort === "title"
      ? compareByTitle
      : query.sort === "newest"
        ? compareByNewest
        : compareByFeatured;

  return filtered.sort(comparator);
}
