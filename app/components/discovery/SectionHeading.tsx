type SectionHeadingProps = {
  body: string;
  eyebrow: string;
  title: string;
};

export function SectionHeading({
  body,
  eyebrow,
  title
}: SectionHeadingProps) {
  return (
    <header className="max-w-2xl">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-7 text-slate-700 sm:text-lg">
        {body}
      </p>
    </header>
  );
}
