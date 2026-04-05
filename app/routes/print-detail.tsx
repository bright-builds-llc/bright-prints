import { Link } from "react-router";

import type { Route } from "./+types/print-detail";
import itemDetailStyles from "./item-detail.css?url";

import { DiscoveryBadge } from "~/components/discovery/DiscoveryBadge";
import { DiscoveryCard } from "~/components/discovery/DiscoveryCard";
import { findPrintBySlug } from "~/lib/content/public";
import { loadPublicContent } from "~/lib/content/load.server";
import { buildRelatedDiscoveryItems, buildDiscoveryItems, findDiscoveryItem } from "~/lib/discovery/model";

export const links: Route.LinksFunction = () => [
  { rel: "stylesheet", href: itemDetailStyles }
];

export async function loader({ params }: Route.LoaderArgs) {
  const content = await loadPublicContent();
  const maybeSlug = params.slug;

  if (!maybeSlug) {
    throw new Response("Not Found", { status: 404 });
  }

  const maybePrint = findPrintBySlug(content, maybeSlug);
  const items = buildDiscoveryItems(content);
  const maybeItem = findDiscoveryItem(items, "print", maybeSlug);

  if (!maybePrint || !maybeItem) {
    throw new Response("Not Found", { status: 404 });
  }

  return {
    item: maybeItem,
    print: maybePrint,
    related: buildRelatedDiscoveryItems(items, maybeItem)
  };
}

export function meta({ data }: Route.MetaArgs) {
  return [
    { title: data ? `${data.item.title} | Bright Prints` : "Print | Bright Prints" },
    {
      content: data?.item.summary ?? "Print detail entry page for Bright Prints.",
      name: "description"
    }
  ];
}

export default function PrintDetail({ loaderData }: Route.ComponentProps) {
  return (
    <main className="item-detail-page">
      <section className="item-detail-shell">
        <article className="item-detail-frame">
          <div className="item-detail-poster">
            <DiscoveryCard item={loaderData.item} variant="hero" />
          </div>

          <div className="item-detail-copy">
            <div className="flex flex-wrap gap-2">
              <DiscoveryBadge label="Print" tone="accent" />
              {loaderData.item.openSource ? (
                <DiscoveryBadge label="Open Source" tone="ink" />
              ) : null}
              {loaderData.item.availability !== "open-source" ? (
                <DiscoveryBadge label="Physical Print" tone="warm" />
              ) : null}
            </div>

            <h1>{loaderData.item.title}</h1>
            <p>{loaderData.item.description}</p>

            <dl className="item-detail-meta">
              <div>
                <dt>Creator</dt>
                <dd>{loaderData.item.creatorName}</dd>
              </div>
              <div>
                <dt>Published</dt>
                <dd>{loaderData.item.publishedOn}</dd>
              </div>
              <div>
                <dt>Categories</dt>
                <dd>{loaderData.item.categories.join(", ")}</dd>
              </div>
            </dl>

            <div className="item-detail-actions">
              <Link className="home-primary-action" prefetch="intent" to="/catalog">
                Back to Catalog
              </Link>
              <Link className="home-secondary-action" prefetch="intent" to="/catalog?type=prints">
                Browse More Prints
              </Link>
            </div>
          </div>
        </article>

        <section className="item-detail-related">
          <p className="eyebrow">More to Explore</p>
          <div className="item-detail-related-grid">
            {loaderData.related.map((item) => (
              <DiscoveryCard key={item.id} item={item} variant="feature" />
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
