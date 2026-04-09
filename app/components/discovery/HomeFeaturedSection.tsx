import { Link } from "react-router";

import type { DiscoveryItem } from "~/lib/discovery/model";

import { DiscoveryCard } from "./DiscoveryCard";
import { SectionHeading } from "./SectionHeading";

type HomeFeaturedSectionProps = {
  items: DiscoveryItem[];
};

export function HomeFeaturedSection({ items }: HomeFeaturedSectionProps) {
  return (
    <section className="home-section">
      <SectionHeading
        body="A compact featured set that makes the catalog feel selective before you ever open the full grid."
        eyebrow="Featured Prints"
        title="A tight edit, not an endless wall."
      />

      <div className="home-feature-grid">
        {items.map((item) => (
          <DiscoveryCard key={item.id} item={item} variant="feature" />
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link className="home-primary-action" prefetch="intent" to="/catalog">
          View Full Catalog
        </Link>
      </div>
    </section>
  );
}
