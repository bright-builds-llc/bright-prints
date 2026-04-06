import { Link } from "react-router";

import type {
  PrintDetailActionIntent,
  PrintDetailAvailabilityPanel
} from "~/lib/prints/detail";

type PrintHeroActionsProps = {
  actionIntents: {
    primary: PrintDetailActionIntent;
    secondary: PrintDetailActionIntent[];
  };
  availabilityPanel: PrintDetailAvailabilityPanel;
};

function buildActionHref(action: PrintDetailActionIntent): string {
  switch (action.kind) {
    case "browse-catalog":
      return "/catalog?type=prints";
    case "download":
      return action.label.includes("Source") ? "#source-files" : "#print-ready-files";
    case "request-contact":
      return "#print-trust";
  }
}

function isRouteAction(action: PrintDetailActionIntent): boolean {
  return action.kind === "browse-catalog";
}

function renderAction(
  action: PrintDetailActionIntent,
  className: "home-primary-action" | "home-secondary-action"
) {
  const href = buildActionHref(action);

  if (isRouteAction(action)) {
    return (
      <Link className={className} prefetch="intent" to={href}>
        {action.label}
      </Link>
    );
  }

  return (
    <a className={className} href={href}>
      {action.label}
    </a>
  );
}

export function PrintHeroActions({
  actionIntents,
  availabilityPanel
}: PrintHeroActionsProps) {
  return (
    <section className="print-hero-actions" aria-label="Availability and actions">
      <div className="print-availability-panel" id="print-availability">
        <p className="eyebrow">Availability</p>
        <h2>{availabilityPanel.label}</h2>
        <p>{availabilityPanel.description}</p>
      </div>

      <div className="print-action-stack">
        <div className="print-action-row">
          {renderAction(actionIntents.primary, "home-primary-action")}
          {actionIntents.secondary.map((action) => (
            <div key={action.label}>{renderAction(action, "home-secondary-action")}</div>
          ))}
        </div>

        <div className="print-action-copy">
          <p>{actionIntents.primary.description}</p>
          {actionIntents.secondary.map((action) => (
            <p key={action.label}>{action.description}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
