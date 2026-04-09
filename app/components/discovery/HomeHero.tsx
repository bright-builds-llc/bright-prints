import type { DiscoveryItem } from "~/lib/discovery/model";

import { ShimmerActionLink } from "~/components/ui/ShimmerAction";
import { ShimmerText } from "~/components/ui/ShimmerText";

import { DiscoveryCard } from "./DiscoveryCard";

type HomeHeroProps = {
  generatorHref: string;
  heroItem: DiscoveryItem;
  supportItems: DiscoveryItem[];
};

export function HomeHero({
  generatorHref,
  heroItem,
  supportItems,
}: HomeHeroProps) {
  return (
    <section className="home-hero">
      <div className="home-hero-copy">
        <p className="eyebrow">
          <ShimmerText tone="accent">Open-Source 3D Prints</ShimmerText>
        </p>
        <h1>
          Beautiful printable objects and generators that feel curated, not
          dumped into a grid.
        </h1>
        <p className="lead">
          Bright Prints puts editorial discovery first: open-source prints, calm
          browsing, and parameterized generators that stay close to the object.
        </p>

        <div className="home-hero-actions">
          <ShimmerActionLink prefetch="intent" to="/catalog">
            Browse Prints
          </ShimmerActionLink>
          <ShimmerActionLink
            prefetch="intent"
            tone="secondary"
            to={generatorHref}
          >
            Try a Generator
          </ShimmerActionLink>
        </div>

        <p className="mt-4 text-sm leading-6 text-slate-500">
          Start with the curated catalog, or jump straight into the generator
          spotlight if you already know you want something customizable.
        </p>
      </div>

      <div className="home-hero-grid">
        <DiscoveryCard item={heroItem} variant="hero" />
        <div className="home-hero-support">
          {supportItems.map((item) => (
            <DiscoveryCard key={item.id} item={item} variant="feature" />
          ))}
        </div>
      </div>
    </section>
  );
}
