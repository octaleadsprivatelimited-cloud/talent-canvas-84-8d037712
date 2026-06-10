export function PageHero({
  eyebrow,
  title,
  subtitle,
  bgImage,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  bgImage?: string;
}) {
  return (
    <section
      className={`relative border-b border-border bg-surface overflow-hidden ${
        bgImage
          ? "bg-cover bg-right md:bg-center bg-no-repeat min-h-[280px] md:min-h-[340px] flex items-center"
          : ""
      }`}
      style={bgImage ? { backgroundImage: `url(${bgImage})` } : undefined}
    >
      {bgImage && (
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/20 md:to-transparent" />
      )}
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        {eyebrow && (
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            {eyebrow}
          </p>
        )}
        <h1 className="max-w-3xl font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl text-foreground">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground font-medium">{subtitle}</p>
        )}
      </div>
    </section>
  );
}
