type LuminousPanelProps = {
  as?: "article" | "div" | "footer" | "section";
  children: React.ReactNode;
  className?: string;
  tone?: "accent" | "paper";
} & React.HTMLAttributes<HTMLElement>;

export function LuminousPanel({
  as = "div",
  children,
  className = "",
  tone = "paper",
  ...props
}: LuminousPanelProps) {
  const Component = as;
  const classes = `luminous-panel luminous-panel--${tone}${className ? ` ${className}` : ""}`;

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
}
