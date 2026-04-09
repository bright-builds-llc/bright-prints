import { AnimatedShinyText } from "~/components/ui/animated-shiny-text";

type SectionHeadingProps = {
  body: string;
  eyebrow: string;
  title: string;
};

export function SectionHeading({ body, eyebrow, title }: SectionHeadingProps) {
  return (
    <header className="section-heading-shell">
      <p className="eyebrow">
        <AnimatedShinyText className="text-[0.8rem] font-bold tracking-[0.14em] uppercase text-accent">
          {eyebrow}
        </AnimatedShinyText>
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
