import { Form, Link } from "react-router";

import type { DiscoveryQuery } from "~/lib/discovery/filter";

type CatalogToolbarProps = {
  availableCategories: string[];
  query: DiscoveryQuery;
  resultCount: number;
  totalCount: number;
};

function buildSearchParams(
  query: DiscoveryQuery,
  overrides: Partial<DiscoveryQuery>
): string {
  const nextQuery = { ...query, ...overrides };
  const params = new URLSearchParams();

  if (nextQuery.q) {
    params.set("q", nextQuery.q);
  }

  if (nextQuery.type !== "all") {
    params.set("type", nextQuery.type);
  }

  if (nextQuery.availability !== "all") {
    params.set("availability", nextQuery.availability);
  }

  if (nextQuery.category !== "all") {
    params.set("category", nextQuery.category);
  }

  if (nextQuery.sort !== "featured") {
    params.set("sort", nextQuery.sort);
  }

  return params.toString();
}

function chipClassName(isActive: boolean): string {
  return isActive
    ? "catalog-chip catalog-chip-active"
    : "catalog-chip";
}

export function CatalogToolbar({
  availableCategories,
  query,
  resultCount,
  totalCount
}: CatalogToolbarProps) {
  const hasActiveFilters =
    query.q.length > 0 ||
    query.type !== "all" ||
    query.availability !== "all" ||
    query.category !== "all" ||
    query.sort !== "featured";

  return (
    <section className="catalog-toolbar-shell">
      <div className="catalog-toolbar-head">
        <div>
          <p className="eyebrow">Catalog</p>
          <h1>Browse the full Bright Prints collection.</h1>
        </div>
        <p className="catalog-result-count">
          {resultCount} of {totalCount} items
        </p>
      </div>

      <div className="catalog-chip-row">
        {[
          ["all", "All"],
          ["prints", "Prints"],
          ["generators", "Generators"]
        ].map(([value, label]) => (
          <Link
            className={chipClassName(query.type === value)}
            key={value}
            prefetch="intent"
            to={`/catalog?${buildSearchParams(query, { type: value as DiscoveryQuery["type"] })}`}
          >
            {label}
          </Link>
        ))}

        {[
          ["all", "All Availability"],
          ["open-source", "Open Source"],
          ["physical-print", "Physical Print"]
        ].map(([value, label]) => (
          <Link
            className={chipClassName(query.availability === value)}
            key={value}
            prefetch="intent"
            to={`/catalog?${buildSearchParams(query, {
              availability: value as DiscoveryQuery["availability"]
            })}`}
          >
            {label}
          </Link>
        ))}
      </div>

      <Form className="catalog-toolbar-form" method="get" role="search">
        <input name="type" type="hidden" value={query.type} />
        <input name="availability" type="hidden" value={query.availability} />

        <label className="catalog-field">
          <span>Search</span>
          <input
            defaultValue={query.q}
            name="q"
            placeholder="Search by title, summary, category, or type"
            type="search"
          />
        </label>

        <label className="catalog-field">
          <span>Category</span>
          <select defaultValue={query.category} name="category">
            <option value="all">All categories</option>
            {availableCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="catalog-field">
          <span>Sort</span>
          <select defaultValue={query.sort} name="sort">
            <option value="featured">Curated</option>
            <option value="newest">Newest</option>
            <option value="title">Title A-Z</option>
          </select>
        </label>

        <div className="catalog-form-actions">
          <button className="home-primary-action" type="submit">
            Update View
          </button>
          {hasActiveFilters ? (
            <Link className="home-secondary-action" prefetch="intent" to="/catalog">
              Reset
            </Link>
          ) : null}
        </div>
      </Form>
    </section>
  );
}
