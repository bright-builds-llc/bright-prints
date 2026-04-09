import { ShimmerText } from "~/components/ui/ShimmerText";

type SectionHeadingProps = {
  body: string;
  eyebrow: string;
  title: string;
};

export function SectionHeading({ body, eyebrow, title }: SectionHeadingProps) {
  return (
    <header className="section-heading-shell">
      <p className="eyebrow">
        <ShimmerText tone="accent">{eyebrow}</ShimmerText>
      </p>
      <h2 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-7 text-slate-700 sm:text-lg">
        {body}
      </p>
    </header>
  );
}
