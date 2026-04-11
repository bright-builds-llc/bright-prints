import type { HTMLAttributes } from "react";

import { MagicCard } from "~/components/ui/magic-card";
import { cn } from "~/lib/utils";

type LuminousPanelElement = "article" | "aside" | "div" | "section";
type LuminousPanelTone = "accent" | "ink" | "paper";

const toneConfig: Record<
  LuminousPanelTone,
  {
    gradientColor: string;
    gradientFrom: string;
    gradientTo: string;
  }
> = {
  accent: {
    gradientColor: "rgba(20, 94, 86, 0.18)",
    gradientFrom: "#5fcdb8",
    gradientTo: "#f7f3ec",
  },
  ink: {
    gradientColor: "rgba(51, 65, 85, 0.16)",
    gradientFrom: "#94a3b8",
    gradientTo: "#f8fafc",
  },
  paper: {
    gradientColor: "rgba(148, 163, 184, 0.14)",
    gradientFrom: "#fde68a",
    gradientTo: "#f8fafc",
  },
};

type LuminousPanelProps = HTMLAttributes<HTMLElement> & {
  as?: LuminousPanelElement;
  frameClassName?: string;
  tone?: LuminousPanelTone;
};

export function LuminousPanel({
  as = "section",
  children,
  className,
  frameClassName,
  tone = "accent",
  ...props
}: LuminousPanelProps) {
  const Component = as;
  const palette = toneConfig[tone];

  return (
    <MagicCard
      className={cn("luminous-panel-frame rounded-[1.6rem]", frameClassName)}
      gradientColor={palette.gradientColor}
      gradientFrom={palette.gradientFrom}
      gradientOpacity={0.7}
      gradientSize={280}
      gradientTo={palette.gradientTo}
    >
      <Component
        {...props}
        className={cn("luminous-panel", className)}
        data-tone={tone}
      >
        {children}
      </Component>
    </MagicCard>
  );
}
