import type { Route } from "./+types/home";

import { loadFoundationContent } from "~/lib/content/load.server";

export async function loader() {
  return loadFoundationContent();
}

export function meta({ data }: Route.MetaArgs) {
  const featuredCount = data?.featuredPrints.length ?? 0;

  return [
    { title: "Bright Prints" },
    {
      name: "description",
      content: `Foundation build for Bright Prints with ${featuredCount} featured prints ready in the content pipeline.`
    }
  ];
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <main className="foundation-shell">
      <section className="foundation-card">
        <p className="eyebrow">Phase 1 Foundation</p>
        <h1>Bright Prints</h1>
        <p className="lead">
          React Router 7 is in place, Railway deployment is Docker-backed, and
          the repo is loading real content while staying ready for private runtime
          boundaries.
        </p>

        <ul className="foundation-list">
          {loaderData.featuredPrints.map((print) => (
            <li key={print.slug}>
              <strong>{print.title}</strong>: {print.summary}
            </li>
          ))}
        </ul>

        <dl className="foundation-grid">
          <div>
            <dt>Creators</dt>
            <dd>{loaderData.creatorCount}</dd>
          </div>
          <div>
            <dt>Generators</dt>
            <dd>{loaderData.generators.length}</dd>
          </div>
        </dl>

        <ul className="foundation-list">
          {loaderData.generators.map((generator) => (
            <li key={generator.slug}>
              <strong>{generator.title}</strong>: {generator.summary} ({generator.parameterCount} parameters)
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
