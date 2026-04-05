import type { DiscoveryItem } from "~/lib/discovery/model";

import { DiscoveryCard } from "./DiscoveryCard";
import { SectionHeading } from "./SectionHeading";

type HomeFeaturedSectionProps = {
  items: DiscoveryItem[];
};

export function HomeFeaturedSection({
  items
}: HomeFeaturedSectionProps) {
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
    </section>
  );
}
