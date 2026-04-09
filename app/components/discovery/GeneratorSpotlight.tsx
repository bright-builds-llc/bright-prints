import type { DiscoveryItem } from "~/lib/discovery/model";

import { LuminousPanel } from "~/components/ui/LuminousPanel";
import { ShimmerActionLink } from "~/components/ui/ShimmerAction";

import { DiscoveryBadge } from "./DiscoveryBadge";
import { DiscoveryCard } from "./DiscoveryCard";
import { SectionHeading } from "./SectionHeading";

type GeneratorSpotlightProps = {
  item: DiscoveryItem;
};

export function GeneratorSpotlight({ item }: GeneratorSpotlightProps) {
  return (
    <section className="home-section">
      <SectionHeading
        body="Generators are presented as first-class design objects, not a hidden utility tab."
        eyebrow="Generator Spotlight"
        title="A generator should feel like an invitation, not a form."
      />

      <LuminousPanel as="div" className="generator-spotlight" tone="accent">
        <div className="generator-spotlight-copy">
          <div className="flex flex-wrap gap-2">
            <DiscoveryBadge label="Generator" tone="accent" />
            <DiscoveryBadge label="3MF Output" tone="ink" />
          </div>

          <h3>{item.title}</h3>
          <p>{item.description}</p>

          <ul className="generator-points">
            <li>Direct parameter-driven generation path</li>
            <li>Visible fit for the broader catalog, not a side experience</li>
            <li>Calm route into the eventual generator detail page</li>
          </ul>

          <ShimmerActionLink prefetch="intent" to={item.href}>
            Open {item.title}
          </ShimmerActionLink>
        </div>

        <DiscoveryCard item={item} variant="hero" />
      </LuminousPanel>
    </section>
  );
}
