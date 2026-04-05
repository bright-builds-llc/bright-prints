import { Link } from "react-router";

import type { DiscoveryItem } from "~/lib/discovery/model";

import { DiscoveryBadge } from "./DiscoveryBadge";

type DiscoveryCardProps = {
  interactive?: boolean;
  item: DiscoveryItem;
  variant?: "catalog" | "feature" | "hero";
};

const toneClassNames: Record<DiscoveryItem["accentTone"], string> = {
  berry:
    "from-rose-200 via-fuchsia-100 to-white text-rose-950",
  copper:
    "from-amber-200 via-orange-100 to-white text-amber-950",
  sand:
    "from-stone-200 via-amber-50 to-white text-stone-950",
  slate:
    "from-slate-300 via-slate-100 to-white text-slate-950",
  verdigris:
    "from-emerald-200 via-teal-100 to-white text-teal-950"
};

function buildBadges(item: DiscoveryItem): string[] {
  const badges = [
    item.kind === "generator" ? "Generator" : "Print"
  ];

  if (item.openSource) {
    badges.push("Open Source");
  }

  if (item.availability === "physical-print" || item.availability === "both") {
    badges.push("Physical Print");
  }

  if (item.material) {
    badges.push(item.material);
  }

  return badges.slice(0, 3);
}

export function DiscoveryCard({
  interactive = true,
  item,
  variant = "catalog"
}: DiscoveryCardProps) {
  const sizeClassName =
    variant === "hero"
      ? "gap-5 p-6 sm:p-8"
      : variant === "feature"
        ? "gap-4 p-5"
        : "gap-4 p-4";
  const wrapperClassName = `group relative grid overflow-hidden rounded-[1.6rem] border border-slate-900/8 bg-white/82 backdrop-blur-sm transition duration-300 ${interactive ? "hover:-translate-y-0.5 hover:shadow-[0_28px_80px_rgba(19,32,43,0.12)]" : ""} ${sizeClassName}`;
  const body = (
    <>
      <div
        className={`relative overflow-hidden rounded-[1.2rem] bg-gradient-to-br ${toneClassNames[item.accentTone]} p-5`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.75),transparent_42%)]" />
        <div className="relative flex min-h-40 flex-col justify-between">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] opacity-70">
            {item.eyebrow}
          </p>
          <p className="max-w-[12ch] text-3xl font-semibold leading-none sm:text-4xl">
            {item.mark}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {buildBadges(item).map((badge, index) => (
            <DiscoveryBadge
              key={badge}
              label={badge}
              tone={index === 0 ? "accent" : index === 1 ? "ink" : "warm"}
            />
          ))}
        </div>

        <div className="space-y-2">
          <h3 className="text-2xl font-semibold tracking-tight text-slate-950">
            {item.title}
          </h3>
          <p className="max-w-[28rem] text-sm leading-6 text-slate-700 sm:text-base">
            {item.summary}
          </p>
        </div>

        <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-slate-500">
          <span>{item.creatorName}</span>
          <span className={interactive ? "transition group-hover:translate-x-1" : ""}>
            {interactive ? "Open" : "Viewing"}
          </span>
        </div>
      </div>
    </>
  );

  if (!interactive) {
    return <article className={wrapperClassName}>{body}</article>;
  }

  return (
    <Link
      className={wrapperClassName}
      prefetch="intent"
      to={item.href}
    >
      {body}
    </Link>
  );
}
