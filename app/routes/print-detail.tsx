import { Link } from "react-router";

import type { Route } from "./+types/print-detail";
import printDetailStyles from "./print-detail.css?url";

import { DiscoveryBadge } from "~/components/discovery/DiscoveryBadge";
import { DiscoveryCard } from "~/components/discovery/DiscoveryCard";
import { PrintFileSections } from "~/components/print-detail/PrintFileSections";
import { PrintHeroActions } from "~/components/print-detail/PrintHeroActions";
import { PrintSpecsSection } from "~/components/print-detail/PrintSpecsSection";
import { PrintTrustSection } from "~/components/print-detail/PrintTrustSection";
import { findPrintBySlug } from "~/lib/content/public";
import { loadPublicContent } from "~/lib/content/load.server";
import { buildPrintDetailModel } from "~/lib/prints/detail";

export const links: Route.LinksFunction = () => [
  { rel: "stylesheet", href: printDetailStyles }
];

export async function loader({ params }: Route.LoaderArgs) {
  const content = await loadPublicContent();
  const maybeSlug = params.slug;

  if (!maybeSlug) {
    throw new Response("Not Found", { status: 404 });
  }

  const maybePrint = findPrintBySlug(content, maybeSlug);

  if (!maybePrint) {
    throw new Response("Not Found", { status: 404 });
  }

  return buildPrintDetailModel(content, maybePrint);
}

export function meta({ data }: Route.MetaArgs) {
  return [
    { title: data ? `${data.hero.title} | Bright Prints` : "Print | Bright Prints" },
    {
      content: data?.hero.summary ?? "Print detail page for Bright Prints.",
      name: "description"
    }
  ];
}

export default function PrintDetail({ loaderData }: Route.ComponentProps) {
  return (
    <main className="print-detail-page">
      <section className="print-detail-shell">
        <p className="print-detail-breadcrumb">
          <Link prefetch="intent" to="/catalog?type=prints">
            Catalog
          </Link>
          <span>/</span>
          <span>Print</span>
        </p>

        <article className="print-detail-hero">
          <div className="print-detail-poster">
            <DiscoveryCard interactive={false} item={loaderData.posterItem} variant="hero" />
          </div>

          <div className="print-detail-main">
            <div className="flex flex-wrap gap-2">
              <DiscoveryBadge label="Print" tone="accent" />
              {loaderData.posterItem.openSource ? (
                <DiscoveryBadge label="Open Source" tone="ink" />
              ) : null}
              {loaderData.posterItem.availability !== "open-source" ? (
                <DiscoveryBadge label="Physical Print" tone="warm" />
              ) : null}
            </div>

            <h1>{loaderData.hero.title}</h1>
            <p className="print-detail-summary">{loaderData.hero.summary}</p>
            <p className="print-detail-description">{loaderData.hero.description}</p>
            <p className="print-detail-kicker">
              The page now starts with the next real decision: understand the offer,
              choose the right file path, and keep trust close to the action.
            </p>

            <PrintHeroActions
              actionIntents={loaderData.actionIntents}
              availabilityPanel={loaderData.availabilityPanel}
            />
          </div>
        </article>

        <div className="print-detail-content">
          <div className="print-detail-content-main">
            <PrintFileSections sections={loaderData.fileSections} />
            <PrintTrustSection fields={loaderData.trustFields} />
          </div>

          <div className="print-detail-content-side">
            <PrintSpecsSection guidance={loaderData.guidance} hero={loaderData.hero} />
          </div>
        </div>

        {loaderData.relatedItems.length > 0 ? (
          <section className="print-detail-related">
            <p className="eyebrow">More to Explore</p>
            <div className="print-detail-related-grid">
              {loaderData.relatedItems.map((item) => (
                <DiscoveryCard key={item.id} item={item} variant="feature" />
              ))}
            </div>
          </section>
        ) : null}
      </section>
    </main>
  );
}
