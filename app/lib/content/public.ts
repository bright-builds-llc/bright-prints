import type {
  CreatorRecord,
  GeneratorRecord,
  PrintRecord
} from "~/lib/content/schema";

export type PublicContentIndex = {
  creators: CreatorRecord[];
  generators: GeneratorRecord[];
  prints: PrintRecord[];
};

export type FoundationContent = {
  creatorCount: number;
  featuredPrints: Array<{
    creatorSlug: string;
    slug: string;
    summary: string;
    title: string;
  }>;
  generators: Array<{
    parameterCount: number;
    slug: string;
    summary: string;
    title: string;
  }>;
};

export function assertCreatorReferences(content: PublicContentIndex): void {
  const creatorSlugs = new Set(content.creators.map((creator) => creator.slug));

  for (const print of content.prints) {
    if (!creatorSlugs.has(print.creatorSlug)) {
      throw new Error(`Print "${print.slug}" references unknown creator "${print.creatorSlug}"`);
    }
  }

  for (const generator of content.generators) {
    if (!creatorSlugs.has(generator.creatorSlug)) {
      throw new Error(
        `Generator "${generator.slug}" references unknown creator "${generator.creatorSlug}"`
      );
    }
  }
}

export function buildFoundationContent(content: PublicContentIndex): FoundationContent {
  const featuredPrints = content.prints.filter((print) => print.featured);
  const selectedPrints = (featuredPrints.length > 0 ? featuredPrints : content.prints).slice(0, 3);

  return {
    creatorCount: content.creators.length,
    featuredPrints: selectedPrints.map((print) => ({
      creatorSlug: print.creatorSlug,
      slug: print.slug,
      summary: print.summary,
      title: print.title
    })),
    generators: content.generators.map((generator) => ({
      parameterCount: generator.parameters.length,
      slug: generator.slug,
      summary: generator.summary,
      title: generator.title
    }))
  };
}
