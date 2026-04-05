import { Link } from "react-router";

import type { DiscoveryItem } from "~/lib/discovery/model";

import { DiscoveryCard } from "./DiscoveryCard";

type HomeHeroProps = {
  generatorHref: string;
  heroItem: DiscoveryItem;
  supportItems: DiscoveryItem[];
};

export function HomeHero({
  generatorHref,
  heroItem,
  supportItems
}: HomeHeroProps) {
  return (
    <section className="home-hero">
      <div className="home-hero-copy">
        <p className="eyebrow">Open-Source 3D Prints</p>
        <h1>Beautiful printable objects and generators that feel curated, not dumped into a grid.</h1>
        <p className="lead">
          Bright Prints puts editorial discovery first: open-source prints,
          calm browsing, and parameterized generators that stay close to the object.
        </p>

        <div className="home-hero-actions">
          <Link className="home-primary-action" prefetch="intent" to="/catalog">
            Browse Prints
          </Link>
          <Link className="home-secondary-action" prefetch="intent" to={generatorHref}>
            Try a Generator
          </Link>
        </div>
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
