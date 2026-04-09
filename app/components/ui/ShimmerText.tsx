type ShimmerTextProps = {
  children: React.ReactNode;
  className?: string;
  tone?: "accent" | "muted";
};

export function ShimmerText({
  children,
  className = "",
  tone = "accent",
}: ShimmerTextProps) {
  return (
    <span
      className={`shimmer-text shimmer-text--${tone}${className ? ` ${className}` : ""}`}
    >
      {children}
    </span>
  );
}
