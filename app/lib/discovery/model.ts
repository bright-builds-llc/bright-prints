import type {
  AvailabilityState,
  DiscoveryTone,
  GeneratorRecord,
  PrintRecord
} from "~/lib/content/schema";
import { buildCreatorMap, type PublicContentIndex } from "~/lib/content/public";

export type DiscoveryKind = "generator" | "print";

export type DiscoveryItem = {
  accentTone: DiscoveryTone;
  availability: AvailabilityState;
  categories: string[];
  creatorName: string;
  creatorSlug: string;
  description: string;
  eyebrow: string;
  featuredRank: number | null;
  href: string;
  id: string;
  kind: DiscoveryKind;
  mark: string;
  material: string | null;
  openSource: boolean;
  publishedOn: string;
  slug: string;
  summary: string;
  title: string;
};

export type HomeDiscoveryModel = {
  featuredRail: DiscoveryItem[];
  generatorSpotlight: DiscoveryItem | null;
  heroItem: DiscoveryItem;
  heroSupport: DiscoveryItem[];
};

function sortDiscoveryItems(left: DiscoveryItem, right: DiscoveryItem): number {
  if (left.featuredRank !== null && right.featuredRank !== null) {
    return left.featuredRank - right.featuredRank;
  }

  if (left.featuredRank !== null) {
    return -1;
  }

  if (right.featuredRank !== null) {
    return 1;
  }

  if (left.publishedOn !== right.publishedOn) {
    return right.publishedOn.localeCompare(left.publishedOn);
  }

  return left.title.localeCompare(right.title);
}

function normalizePrint(
  print: PrintRecord,
  creatorName: string
): DiscoveryItem {
  return {
    accentTone: print.discovery.accentTone,
    availability: print.availability,
    categories: print.categories,
    creatorName,
    creatorSlug: print.creatorSlug,
    description: print.description,
    eyebrow: print.discovery.eyebrow,
    featuredRank: print.discovery.featuredRank ?? null,
    href: `/prints/${print.slug}`,
    id: `print:${print.slug}`,
    kind: "print",
    mark: print.discovery.mark,
    material: print.printDetails.material ?? null,
    openSource: print.openSource,
    publishedOn: print.publishedOn,
    slug: print.slug,
    summary: print.summary,
    title: print.title
  };
}

function normalizeGenerator(
  generator: GeneratorRecord,
  creatorName: string
): DiscoveryItem {
  return {
    accentTone: generator.discovery.accentTone,
    availability: generator.availability,
    categories: generator.categories,
    creatorName,
    creatorSlug: generator.creatorSlug,
    description: generator.description,
    eyebrow: generator.discovery.eyebrow,
    featuredRank: generator.discovery.featuredRank ?? null,
    href: `/generators/${generator.slug}`,
    id: `generator:${generator.slug}`,
    kind: "generator",
    mark: generator.discovery.mark,
    material: null,
    openSource: true,
    publishedOn: generator.publishedOn,
    slug: generator.slug,
    summary: generator.summary,
    title: generator.title
  };
}

export function buildDiscoveryItems(content: PublicContentIndex): DiscoveryItem[] {
  const creatorMap = buildCreatorMap(content);

  const items = [
    ...content.prints.map((print) =>
      normalizePrint(
        print,
        creatorMap.get(print.creatorSlug)?.displayName ?? print.creatorSlug
      )
    ),
    ...content.generators.map((generator) =>
      normalizeGenerator(
        generator,
        creatorMap.get(generator.creatorSlug)?.displayName ?? generator.creatorSlug
      )
    )
  ];

  return items.sort(sortDiscoveryItems);
}

export function buildHomeDiscoveryModel(items: DiscoveryItem[]): HomeDiscoveryModel {
  const featuredPrints = items.filter((item) => item.kind === "print" && item.featuredRank !== null);
  const heroCandidate = featuredPrints[0] ?? items[0];

  if (!heroCandidate) {
    throw new Error("At least one discovery item is required to build the home page.");
  }

  const heroSupport = featuredPrints.filter((item) => item.id !== heroCandidate.id).slice(0, 2);
  const featuredRail = featuredPrints.slice(0, 6);
  const generatorSpotlight =
    items.find((item) => item.kind === "generator" && item.featuredRank !== null) ??
    items.find((item) => item.kind === "generator") ??
    null;

  return {
    featuredRail,
    generatorSpotlight,
    heroItem: heroCandidate,
    heroSupport
  };
}
