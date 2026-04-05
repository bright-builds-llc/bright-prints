import { Link } from "react-router";

import type { Route } from "./+types/generator-detail";
import itemDetailStyles from "./item-detail.css?url";

import { DiscoveryBadge } from "~/components/discovery/DiscoveryBadge";
import { DiscoveryCard } from "~/components/discovery/DiscoveryCard";
import { findGeneratorBySlug } from "~/lib/content/public";
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

  const maybeGenerator = findGeneratorBySlug(content, maybeSlug);
  const items = buildDiscoveryItems(content);
  const maybeItem = findDiscoveryItem(items, "generator", maybeSlug);

  if (!maybeGenerator || !maybeItem) {
    throw new Response("Not Found", { status: 404 });
  }

  return {
    generator: maybeGenerator,
    item: maybeItem,
    related: buildRelatedDiscoveryItems(items, maybeItem)
  };
}

export function meta({ data }: Route.MetaArgs) {
  return [
    { title: data ? `${data.item.title} | Bright Prints` : "Generator | Bright Prints" },
    {
      content: data?.item.summary ?? "Generator detail entry page for Bright Prints.",
      name: "description"
    }
  ];
}

export default function GeneratorDetail({ loaderData }: Route.ComponentProps) {
  return (
    <main className="item-detail-page">
      <section className="item-detail-shell">
        <article className="item-detail-frame">
          <div className="item-detail-poster">
            <DiscoveryCard item={loaderData.item} variant="hero" />
          </div>

          <div className="item-detail-copy">
            <div className="flex flex-wrap gap-2">
              <DiscoveryBadge label="Generator" tone="accent" />
              <DiscoveryBadge label="3MF Output" tone="ink" />
            </div>

            <h1>{loaderData.item.title}</h1>
            <p>{loaderData.item.description}</p>
            <p className="item-detail-kicker">
              The generator opens inside the same discovery language as the
              prints, so it feels like a designed object instead of a detached
              tool screen.
            </p>

            <ul className="generator-parameter-list">
              {loaderData.generator.parameters.map((parameter) => (
                <li key={parameter.name}>
                  <strong>{parameter.label}</strong>
                  <span>
                    {parameter.type === "number"
                      ? `${parameter.defaultValue}${parameter.unit ? ` ${parameter.unit}` : ""}`
                      : `${parameter.defaultValue}`}
                  </span>
                </li>
              ))}
            </ul>

            <div className="item-detail-actions">
              <Link className="home-primary-action" prefetch="intent" to="/catalog?type=generators">
                Browse Generators
              </Link>
              <Link className="home-secondary-action" prefetch="intent" to="/catalog">
                Back to Catalog
              </Link>
            </div>
          </div>
        </article>

        <section className="item-detail-related">
          <p className="eyebrow">Related Discovery</p>
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
