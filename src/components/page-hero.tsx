export function PageHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="border-b border-border bg-surface">
      <div className="container mx-auto px-4 py-16 md:py-24">
        {eyebrow && (
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            {eyebrow}
          </p>
        )}
        <h1 className="max-w-3xl font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">
          {title}
        </h1>
        {subtitle && <p className="mt-5 max-w-2xl text-lg text-muted-foreground">{subtitle}</p>}
      </div>
    </section>
  );
}
