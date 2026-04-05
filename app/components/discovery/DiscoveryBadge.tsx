type DiscoveryBadgeProps = {
  label: string;
  tone?: "accent" | "ink" | "warm";
};

const toneClassNames: Record<NonNullable<DiscoveryBadgeProps["tone"]>, string> = {
  accent: "bg-emerald-900/85 text-emerald-50",
  ink: "bg-slate-900/85 text-slate-50",
  warm: "bg-amber-600/90 text-amber-950"
};

export function DiscoveryBadge({
  label,
  tone = "ink"
}: DiscoveryBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] ${toneClassNames[tone]}`}
    >
      {label}
    </span>
  );
}
