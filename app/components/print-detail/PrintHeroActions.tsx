import { Link } from "react-router";

import type { PrintDetailAvailabilityPanel } from "~/lib/prints/detail";
import type { ResolvedPrintActionGroup } from "~/lib/prints/launch";

type PrintHeroActionsProps = {
  actions: ResolvedPrintActionGroup;
  availabilityPanel: PrintDetailAvailabilityPanel;
};

function isRouteAction(action: ResolvedPrintActionGroup["primary"]): boolean {
  return action.kind === "browse-catalog";
}

function renderAction(
  action: ResolvedPrintActionGroup["primary"],
  className: "home-primary-action" | "home-secondary-action"
) {
  if (isRouteAction(action)) {
    return (
      <Link className={className} prefetch="intent" to={action.href}>
        {action.label}
      </Link>
    );
  }

  return (
    <a
      className={className}
      href={action.href}
      rel={action.external ? "noreferrer" : undefined}
      target={action.external ? "_blank" : undefined}
    >
      {action.label}
    </a>
  );
}

export function PrintHeroActions({
  actions,
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
          {renderAction(actions.primary, "home-primary-action")}
          {actions.secondary.map((action) => (
            <div key={action.label}>{renderAction(action, "home-secondary-action")}</div>
          ))}
        </div>

        <div className="print-action-copy">
          <p>{actions.primary.description}</p>
          {actions.secondary.map((action) => (
            <p key={action.label}>{action.description}</p>
          ))}
          {actions.fallbackNote ? <p>{actions.fallbackNote}</p> : null}
        </div>
      </div>
    </section>
  );
}
