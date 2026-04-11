import { Link } from "react-router";

import { LuminousPanel } from "~/components/ui/luminous-panel";

type LibraryPresetSectionProps = {
  presets: Array<{
    generatorSlug: string;
    generatorTitle: string;
    href: string;
    id: string;
    name: string;
    size: string;
    text: string;
    updatedAt: string;
  }>;
};

function formatPresetDate(isoDate: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
  }).format(new Date(isoDate));
}

export function LibraryPresetSection({ presets }: LibraryPresetSectionProps) {
  return (
    <LuminousPanel
      aria-labelledby="library-preset-heading"
      className="library-preset-section"
      tone="accent"
    >
      <div className="library-preset-head">
        <div>
          <p className="eyebrow">Generator Presets</p>
          <h2 id="library-preset-heading">Resume saved generator work</h2>
        </div>
        <p>
          Jump straight back into generator context with the preset already
          loaded.
        </p>
      </div>

      {presets.length > 0 ? (
        <div className="library-preset-grid">
          {presets.map((preset) => (
            <LuminousPanel
              as="article"
              className="library-preset-card"
              frameClassName="h-full"
              key={preset.id}
              tone="paper"
            >
              <div className="library-preset-meta">
                <p className="library-preset-generator">
                  {preset.generatorTitle}
                </p>
                <p className="library-preset-updated">
                  Updated {formatPresetDate(preset.updatedAt)}
                </p>
              </div>
              <div className="library-preset-copy">
                <h3>{preset.name}</h3>
                <p>{preset.text}</p>
                <p>{preset.size}</p>
              </div>
              <Link
                className="home-secondary-action"
                prefetch="intent"
                to={preset.href}
              >
                Open in Generator
              </Link>
            </LuminousPanel>
          ))}
        </div>
      ) : (
        <LuminousPanel as="div" className="library-preset-empty" tone="paper">
          <p>
            Save a generator preset first, then it will show up here as a quick
            reopen launch point.
          </p>
        </LuminousPanel>
      )}
    </LuminousPanel>
  );
}
