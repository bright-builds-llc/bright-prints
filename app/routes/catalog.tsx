import type { Route } from "./+types/catalog";
import catalogStyles from "./catalog.css?url";

import { CatalogEmptyState } from "~/components/discovery/CatalogEmptyState";
import { CatalogToolbar } from "~/components/discovery/CatalogToolbar";
import { DiscoveryCard } from "~/components/discovery/DiscoveryCard";
import { loadPublicContent } from "~/lib/content/load.server";
import {
  filterDiscoveryItems,
  getDiscoveryCategories,
  parseDiscoveryQuery
} from "~/lib/discovery/filter";
import { buildDiscoveryItems } from "~/lib/discovery/model";

export const links: Route.LinksFunction = () => [
  { rel: "stylesheet", href: catalogStyles }
];

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const query = parseDiscoveryQuery(url.searchParams);
  const content = await loadPublicContent();
  const items = buildDiscoveryItems(content);
  const filteredItems = filterDiscoveryItems(items, query);

  return {
    availableCategories: getDiscoveryCategories(items),
    items: filteredItems,
    query,
    totalCount: items.length
  };
}

export function meta({ data }: Route.MetaArgs) {
  const count = data?.items.length ?? 0;

  return [
    { title: "Catalog | Bright Prints" },
    {
      content: `Browse ${count} discovery items across prints and generators.`,
      name: "description"
    }
  ];
}

export default function Catalog({ loaderData }: Route.ComponentProps) {
  const hasActiveFilters =
    loaderData.query.q.length > 0 ||
    loaderData.query.type !== "all" ||
    loaderData.query.availability !== "all" ||
    loaderData.query.category !== "all" ||
    loaderData.query.sort !== "featured";

  return (
    <main className="catalog-page">
      <CatalogToolbar
        availableCategories={loaderData.availableCategories}
        query={loaderData.query}
        resultCount={loaderData.items.length}
        totalCount={loaderData.totalCount}
      />

      <p className="catalog-intro-copy">
        Prints and generators live in one calm catalog. Narrow the field without turning the page into a control panel.
      </p>

      {loaderData.items.length === 0 ? (
        <CatalogEmptyState hasActiveFilters={hasActiveFilters} />
      ) : (
        <section className="catalog-grid">
          {loaderData.items.map((item) => (
            <DiscoveryCard key={item.id} item={item} />
          ))}
        </section>
      )}
    </main>
  );
}
