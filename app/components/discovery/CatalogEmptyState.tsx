import { Link } from "react-router";

type CatalogEmptyStateProps = {
  hasActiveFilters: boolean;
};

export function CatalogEmptyState({
  hasActiveFilters
}: CatalogEmptyStateProps) {
  return (
    <section className="catalog-empty">
      <p className="eyebrow">No Matches</p>
      <h2>Nothing fits that slice yet.</h2>
      <p>
        Try a broader search or clear the current filters to return to the curated catalog.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        {hasActiveFilters ? (
          <Link className="home-primary-action" prefetch="intent" to="/catalog">
            Reset Catalog
          </Link>
        ) : null}
        <Link className="home-secondary-action" prefetch="intent" to="/generators/sign">
          Try the Sign Generator
        </Link>
      </div>
    </section>
  );
}
