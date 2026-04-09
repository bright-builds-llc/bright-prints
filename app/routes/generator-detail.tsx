import { useDeferredValue, useEffect, useState, useTransition } from "react";
import { Link } from "react-router";

import type { Route } from "./+types/generator-detail";
import generatorDetailStyles from "./generator-detail.css?url";

import { DiscoveryBadge } from "~/components/discovery/DiscoveryBadge";
import { DiscoveryCard } from "~/components/discovery/DiscoveryCard";
import { GeneratedArtifactPanel } from "~/components/generator/GeneratedArtifactPanel";
import { GeneratorPreview } from "~/components/generator/GeneratorPreview";
import { ShimmerButton } from "~/components/ui/shimmer-button";
import {
  buildGeneratedSignArtifact,
  getDefaultSignValues,
  type SignGeneratorValues,
  validateSignValues,
} from "~/lib/generators/sign";
import { findGeneratorBySlug } from "~/lib/content/public";
import { loadPublicContent } from "~/lib/content/load.server";
import {
  buildRelatedDiscoveryItems,
  buildDiscoveryItems,
  findDiscoveryItem,
} from "~/lib/discovery/model";

export const links: Route.LinksFunction = () => [
  { rel: "stylesheet", href: generatorDetailStyles },
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
    related: buildRelatedDiscoveryItems(items, maybeItem),
  };
}

export function meta({ data }: Route.MetaArgs) {
  return [
    {
      title: data
        ? `${data.item.title} | Bright Prints`
        : "Generator | Bright Prints",
    },
    {
      content:
        data?.item.summary ?? "Generator detail entry page for Bright Prints.",
      name: "description",
    },
  ];
}

export default function GeneratorDetail({ loaderData }: Route.ComponentProps) {
  const [values, setValues] = useState<SignGeneratorValues>(() =>
    getDefaultSignValues(loaderData.generator),
  );
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [artifact, setArtifact] = useState<Awaited<
    ReturnType<typeof buildGeneratedSignArtifact>
  > | null>(null);
  const [isPending, startTransition] = useTransition();
  const deferredValues = useDeferredValue(values);
  const validation = validateSignValues(loaderData.generator, deferredValues);

  useEffect(() => {
    return () => {
      if (artifact) {
        URL.revokeObjectURL(artifact.objectUrl);
      }
    };
  }, [artifact]);

  function updateValue<K extends keyof SignGeneratorValues>(
    key: K,
    value: SignGeneratorValues[K],
  ) {
    setValues((currentValues) => ({
      ...currentValues,
      [key]: value,
    }));
  }

  async function handleGenerate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextValidation = validateSignValues(loaderData.generator, values);

    if (Object.keys(nextValidation.issues).length > 0) {
      setStatusMessage("Fix the validation issues before generating the sign.");
      return;
    }

    const nextArtifact = await buildGeneratedSignArtifact({
      definition: loaderData.generator.definition,
      generator: loaderData.generator,
      values,
    });

    startTransition(() => {
      if (artifact) {
        URL.revokeObjectURL(artifact.objectUrl);
      }

      setArtifact(nextArtifact);
      setStatusMessage("Generated a downloadable 3MF artifact.");
    });
  }

  return (
    <main className="generator-page">
      <section className="generator-shell">
        <p className="eyebrow">Generator</p>
        <h1>{loaderData.item.title}</h1>
        <p>{loaderData.item.description}</p>
      </section>

      <article className="generator-hero">
        <div className="generator-hero-poster">
          <DiscoveryCard
            interactive={false}
            item={loaderData.item}
            variant="hero"
          />
        </div>

        <div className="generator-hero-copy">
          <div className="flex flex-wrap gap-2">
            <DiscoveryBadge label="Generator" tone="accent" />
            <DiscoveryBadge label="3MF Output" tone="ink" />
          </div>

          <h2>Configure a sign in one pass</h2>
          <p>
            This generator stays schema-driven: the content file defines the
            parameters and sign behavior, while the route turns those parameters
            into a live preview and downloadable artifact.
          </p>
        </div>
      </article>

      <section className="generator-layout">
        <div className="generator-layout-main">
          <section
            className="generator-form-shell"
            aria-labelledby="generator-form-heading"
          >
            <div className="generator-section-head">
              <p className="eyebrow">Parameters</p>
              <h2 id="generator-form-heading">Shape the finished sign</h2>
              <p>
                Invalid states are blocked before generation runs, and the
                preview stays close to the form.
              </p>
            </div>

            <form className="generator-form-grid" onSubmit={handleGenerate}>
              {loaderData.generator.parameters.map((parameter) => {
                const value =
                  parameter.name === "text"
                    ? values.text
                    : parameter.name === "width-mm"
                      ? values.widthMm
                      : parameter.name === "height-mm"
                        ? values.heightMm
                        : parameter.name === "thickness-mm"
                          ? values.thicknessMm
                          : values.cornerRadiusMm;
                const issue =
                  parameter.name === "text"
                    ? validation.issues.text
                    : parameter.name === "width-mm"
                      ? validation.issues.widthMm
                      : parameter.name === "height-mm"
                        ? validation.issues.heightMm
                        : parameter.name === "thickness-mm"
                          ? validation.issues.thicknessMm
                          : validation.issues.cornerRadiusMm;

                return (
                  <div className="generator-field" key={parameter.name}>
                    <label htmlFor={parameter.name}>{parameter.label}</label>
                    <input
                      id={parameter.name}
                      max={parameter.max}
                      min={parameter.min}
                      name={parameter.name}
                      onChange={(event) =>
                        updateValue(
                          parameter.name === "text"
                            ? "text"
                            : parameter.name === "width-mm"
                              ? "widthMm"
                              : parameter.name === "height-mm"
                                ? "heightMm"
                                : parameter.name === "thickness-mm"
                                  ? "thicknessMm"
                                  : "cornerRadiusMm",
                          parameter.type === "number"
                            ? Number(event.target.value)
                            : event.target.value,
                        )
                      }
                      step={parameter.step}
                      type={parameter.type === "number" ? "number" : "text"}
                      value={value}
                    />
                    <p className="generator-field-note">
                      {parameter.type === "number" && parameter.unit
                        ? `${parameter.min} to ${parameter.max} ${parameter.unit}`
                        : `${parameter.maxLength ?? 40} characters max`}
                    </p>
                    {issue ? (
                      <p className="generator-error-message">{issue}</p>
                    ) : null}
                  </div>
                );
              })}

              <div className="generator-form-actions">
                <ShimmerButton disabled={isPending} type="submit">
                  {isPending ? "Generating" : "Generate 3MF"}
                </ShimmerButton>
                <Link
                  className="home-secondary-action"
                  prefetch="intent"
                  to="/catalog?type=generators"
                >
                  Browse Generators
                </Link>
              </div>
            </form>
          </section>

          <GeneratorPreview
            definition={loaderData.generator.definition}
            validation={validation}
            values={deferredValues}
          />
        </div>

        <div className="generator-layout-side">
          <GeneratedArtifactPanel
            artifact={artifact}
            statusMessage={statusMessage}
          />
        </div>
      </section>

      {loaderData.related.length > 0 ? (
        <section className="generator-related">
          <p className="eyebrow">Related Discovery</p>
          <div className="generator-related-grid">
            {loaderData.related.map((item) => (
              <DiscoveryCard key={item.id} item={item} variant="feature" />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
