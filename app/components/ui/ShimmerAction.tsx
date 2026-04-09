import { Link, type LinkProps } from "react-router";

type ActionTone = "primary" | "secondary";

function buildActionClassName(tone: ActionTone, className?: string) {
  return `ui-action ui-action--${tone}${className ? ` ${className}` : ""}`;
}

type ShimmerActionButtonProps =
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    tone?: ActionTone;
  };

export function ShimmerActionButton({
  className,
  tone = "primary",
  type = "button",
  ...props
}: ShimmerActionButtonProps) {
  return (
    <button
      className={buildActionClassName(tone, className)}
      type={type}
      {...props}
    />
  );
}

type ShimmerActionAnchorProps =
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    tone?: ActionTone;
  };

export function ShimmerActionAnchor({
  className,
  tone = "primary",
  ...props
}: ShimmerActionAnchorProps) {
  return <a className={buildActionClassName(tone, className)} {...props} />;
}

type ShimmerActionLinkProps = LinkProps & {
  tone?: ActionTone;
};

export function ShimmerActionLink({
  className,
  tone = "primary",
  ...props
}: ShimmerActionLinkProps) {
  return <Link className={buildActionClassName(tone, className)} {...props} />;
}
