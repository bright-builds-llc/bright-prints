import type { Route } from "./+types/home";
import homeStyles from "./home.css?url";

import { GeneratorSpotlight } from "~/components/discovery/GeneratorSpotlight";
import { HomeFeaturedSection } from "~/components/discovery/HomeFeaturedSection";
import { HomeHero } from "~/components/discovery/HomeHero";
import { ProductPositioningBand } from "~/components/discovery/ProductPositioningBand";
import { loadPublicContent } from "~/lib/content/load.server";
import { buildDiscoveryItems, buildHomeDiscoveryModel } from "~/lib/discovery/model";

export const links: Route.LinksFunction = () => [
  { rel: "stylesheet", href: homeStyles }
];

export async function loader() {
  const content = await loadPublicContent();
  const items = buildDiscoveryItems(content);

  return buildHomeDiscoveryModel(items);
}

export function meta({ data }: Route.MetaArgs) {
  const featuredCount = data?.featuredRail.length ?? 0;

  return [
    { title: "Bright Prints" },
    {
      content: `Bright Prints opens with ${featuredCount} featured discovery objects and a calm path into the catalog.`,
      name: "description"
    }
  ];
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const generatorHref = loaderData.generatorSpotlight?.href ?? "/catalog?type=generators";

  return (
    <main className="home-page">
      <HomeHero
        generatorHref={generatorHref}
        heroItem={loaderData.heroItem}
        supportItems={loaderData.heroSupport}
      />

      <ProductPositioningBand />

      <HomeFeaturedSection items={loaderData.featuredRail} />

      {loaderData.generatorSpotlight ? (
        <GeneratorSpotlight item={loaderData.generatorSpotlight} />
      ) : null}
    </main>
  );
}
