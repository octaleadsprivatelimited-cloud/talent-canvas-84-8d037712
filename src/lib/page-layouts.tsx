import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, Quote, Star } from "lucide-react";

export type LayoutId = "hero-features" | "split-content" | "longform" | "landing-cta" | "gallery";

export type LayoutContent = Record<string, unknown>;

export type RepeaterSubField = {
  key: string;
  label: string;
  type: "text" | "textarea" | "url";
  rows?: number;
  placeholder?: string;
};

export type LayoutFieldDef = {
  key: string;
  label: string;
  type: "text" | "textarea" | "url" | "repeater";
  rows?: number;
  placeholder?: string;
  help?: string;
  // for type === "repeater"
  itemLabel?: string;
  itemFields?: RepeaterSubField[];
};

export type LayoutMeta = {
  id: LayoutId;
  label: string;
  description: string;
  preview: string; // emoji/wireframe hint
  fields: LayoutFieldDef[];
  sample: LayoutContent;
};

export const LAYOUTS: LayoutMeta[] = [
  {
    id: "hero-features",
    label: "Hero + Features",
    description: "Bold hero with eyebrow + headline, followed by a 3-column feature grid.",
    preview: "▮▮▮  ⬚⬚⬚",
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text", placeholder: "What we do" },
      { key: "headline", label: "Headline", type: "text" },
      { key: "subhead", label: "Subhead", type: "textarea", rows: 2 },
      { key: "cta_label", label: "CTA label", type: "text", placeholder: "Get started" },
      { key: "cta_href", label: "CTA link", type: "url", placeholder: "/contact" },
      {
        key: "features",
        label: "Features",
        type: "repeater",
        itemLabel: "Feature",
        itemFields: [
          { key: "title", label: "Title", type: "text" },
          { key: "body", label: "Body", type: "textarea", rows: 2 },
        ],
      },
    ],
    sample: {
      eyebrow: "Introducing",
      headline: "A new way to work",
      subhead: "Everything your team needs in one place.",
      cta_label: "Get started",
      cta_href: "/contact",
      features: [
        { title: "Fast", body: "Built for speed and clarity." },
        { title: "Secure", body: "Privacy and access controls included." },
        { title: "Reliable", body: "99.9% uptime, monitored 24/7." },
      ],
    },
  },
  {
    id: "split-content",
    label: "Split Content",
    description: "Alternating image / text rows. Great for product or service walkthroughs.",
    preview: "▮ ▦   ▦ ▮",
    fields: [
      { key: "headline", label: "Headline", type: "text" },
      { key: "subhead", label: "Subhead", type: "textarea", rows: 2 },
      {
        key: "sections",
        label: "Sections",
        type: "repeater",
        itemLabel: "Section",
        itemFields: [
          { key: "title", label: "Title", type: "text" },
          { key: "body", label: "Body", type: "textarea", rows: 3 },
          { key: "image_url", label: "Image URL", type: "url" },
        ],
      },
    ],
    sample: {
      headline: "How it works",
      subhead: "Three simple steps from idea to launch.",
      sections: [
        { title: "Discover", body: "We learn your goals and audience.", image_url: "" },
        { title: "Design", body: "We craft the visual system end-to-end.", image_url: "" },
        { title: "Deliver", body: "We ship and iterate based on data.", image_url: "" },
      ],
    },
  },
  {
    id: "longform",
    label: "Long-form Article",
    description: "Centered editorial column with cover image and rich body text.",
    preview: "▭   ▤▤▤",
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "headline", label: "Headline", type: "text" },
      { key: "cover_url", label: "Cover image URL", type: "url" },
      { key: "body", label: "Body (plain text / markdown-ish)", type: "textarea", rows: 18 },
    ],
    sample: {
      eyebrow: "Article",
      headline: "Why craft still matters",
      cover_url: "",
      body: "Write your article body here. Double line breaks become new paragraphs.",
    },
  },
  {
    id: "landing-cta",
    label: "Landing + CTA",
    description: "Hero, stats strip, and a high-contrast call-to-action banner.",
    preview: "▮▮▮  ▦▦▦  ▮",
    fields: [
      { key: "headline", label: "Headline", type: "text" },
      { key: "subhead", label: "Subhead", type: "textarea", rows: 2 },
      {
        key: "stats",
        label: "Stats (JSON array)",
        type: "json",
        rows: 6,
        help: '[{"value":"120+","label":"Clients"}, …]',
      },
      { key: "cta_headline", label: "CTA headline", type: "text" },
      { key: "cta_body", label: "CTA body", type: "textarea", rows: 2 },
      { key: "cta_label", label: "CTA button label", type: "text" },
      { key: "cta_href", label: "CTA button link", type: "url" },
    ],
    sample: {
      headline: "Built for ambitious teams",
      subhead: "Results that scale with you.",
      stats: [
        { value: "120+", label: "Clients" },
        { value: "98%", label: "Retention" },
        { value: "30d", label: "Avg launch" },
      ],
      cta_headline: "Ready when you are.",
      cta_body: "Talk to our team and get a proposal in 48 hours.",
      cta_label: "Book a call",
      cta_href: "/contact",
    },
  },
  {
    id: "gallery",
    label: "Gallery Showcase",
    description: "Intro block with a responsive image gallery and captions.",
    preview: "▭   ▦▦ ▦▦",
    fields: [
      { key: "headline", label: "Headline", type: "text" },
      { key: "subhead", label: "Subhead", type: "textarea", rows: 2 },
      {
        key: "items",
        label: "Gallery items (JSON array)",
        type: "json",
        rows: 12,
        help: '[{"image_url":"https://…","caption":"…"}, …]',
      },
    ],
    sample: {
      headline: "Selected work",
      subhead: "A taste of recent projects.",
      items: [
        { image_url: "", caption: "Project one" },
        { image_url: "", caption: "Project two" },
        { image_url: "", caption: "Project three" },
        { image_url: "", caption: "Project four" },
      ],
    },
  },
];

export function getLayout(id: string): LayoutMeta {
  return LAYOUTS.find((l) => l.id === id) ?? LAYOUTS[0];
}

/* -------------------- Renderers -------------------- */

function asString(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}
function asArray<T = unknown>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}

function CtaButton({ href, label }: { href?: string; label?: string }) {
  if (!label) return null;
  const to = href || "/contact";
  const isExternal = /^https?:\/\//i.test(to);
  const className =
    "inline-flex items-center gap-2 bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90";
  return isExternal ? (
    <a className={className} href={to}>
      {label} <ArrowRight className="h-4 w-4" />
    </a>
  ) : (
    <Link className={className} to={to}>
      {label} <ArrowRight className="h-4 w-4" />
    </Link>
  );
}

export function RenderLayout({ layout, content }: { layout: LayoutId; content: LayoutContent }) {
  switch (layout) {
    case "hero-features":
      return <HeroFeatures content={content} />;
    case "split-content":
      return <SplitContent content={content} />;
    case "longform":
      return <Longform content={content} />;
    case "landing-cta":
      return <LandingCta content={content} />;
    case "gallery":
      return <Gallery content={content} />;
    default:
      return <Longform content={content} />;
  }
}

function HeroFeatures({ content }: { content: LayoutContent }) {
  const features = asArray<{ title?: string; body?: string }>(content.features);
  return (
    <>
      <section className="border-b border-border bg-surface">
        <div className="container mx-auto px-4 py-20 md:py-28">
          {asString(content.eyebrow) && (
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              {asString(content.eyebrow)}
            </p>
          )}
          <h1 className="max-w-3xl font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">
            {asString(content.headline, "Untitled page")}
          </h1>
          {asString(content.subhead) && (
            <p className="mt-5 max-w-2xl text-lg text-muted-foreground">{asString(content.subhead)}</p>
          )}
          <div className="mt-8">
            <CtaButton href={asString(content.cta_href)} label={asString(content.cta_label)} />
          </div>
        </div>
      </section>
      {features.length > 0 && (
        <section className="container mx-auto grid gap-px bg-border px-0 md:grid-cols-3">
          {features.map((f, i) => (
            <div key={i} className="bg-background p-8">
              <Check className="mb-4 h-5 w-5 text-primary" />
              <h3 className="font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </section>
      )}
    </>
  );
}

function SplitContent({ content }: { content: LayoutContent }) {
  const sections = asArray<{ title?: string; body?: string; image_url?: string }>(content.sections);
  return (
    <>
      <section className="border-b border-border bg-surface">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <h1 className="max-w-3xl font-display text-4xl font-bold tracking-tight md:text-5xl">
            {asString(content.headline, "Untitled page")}
          </h1>
          {asString(content.subhead) && (
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{asString(content.subhead)}</p>
          )}
        </div>
      </section>
      <div className="container mx-auto space-y-20 px-4 py-20">
        {sections.map((s, i) => (
          <div key={i} className="grid items-center gap-10 md:grid-cols-2">
            <div className={i % 2 === 1 ? "md:order-2" : ""}>
              <h2 className="font-display text-3xl font-bold tracking-tight">{s.title}</h2>
              <p className="mt-4 whitespace-pre-line text-muted-foreground">{s.body}</p>
            </div>
            <div className={`aspect-[4/3] overflow-hidden border border-border bg-surface ${i % 2 === 1 ? "md:order-1" : ""}`}>
              {s.image_url ? (
                <img src={s.image_url} alt={s.title ?? ""} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs uppercase tracking-widest text-muted-foreground">
                  Image
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function Longform({ content }: { content: LayoutContent }) {
  const body = asString(content.body);
  return (
    <article className="container mx-auto max-w-3xl px-4 py-16 md:py-24">
      {asString(content.eyebrow) && (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          {asString(content.eyebrow)}
        </p>
      )}
      <h1 className="font-display text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl">
        {asString(content.headline, "Untitled page")}
      </h1>
      {asString(content.cover_url) && (
        <img src={asString(content.cover_url)} alt="" className="mt-10 aspect-[16/9] w-full object-cover" />
      )}
      <div className="prose prose-neutral mt-10 max-w-none text-base leading-relaxed text-foreground">
        {body.split(/\n\n+/).map((p, i) => (
          <p key={i} className="mb-5 whitespace-pre-line">
            {p}
          </p>
        ))}
      </div>
    </article>
  );
}

function LandingCta({ content }: { content: LayoutContent }) {
  const stats = asArray<{ value?: string; label?: string }>(content.stats);
  return (
    <>
      <section className="border-b border-border bg-surface">
        <div className="container mx-auto px-4 py-20 text-center md:py-28">
          <h1 className="mx-auto max-w-3xl font-display text-4xl font-bold tracking-tight md:text-6xl">
            {asString(content.headline, "Untitled page")}
          </h1>
          {asString(content.subhead) && (
            <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">{asString(content.subhead)}</p>
          )}
        </div>
      </section>
      {stats.length > 0 && (
        <section className="container mx-auto grid gap-px bg-border md:grid-cols-3">
          {stats.map((s, i) => (
            <div key={i} className="bg-background p-10 text-center">
              <p className="font-display text-4xl font-bold text-primary">{s.value}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </section>
      )}
      <section className="border-t border-border bg-primary text-primary-foreground">
        <div className="container mx-auto flex flex-col items-start gap-6 px-4 py-16 md:flex-row md:items-center md:justify-between md:py-20">
          <div className="max-w-2xl">
            <Quote className="mb-3 h-6 w-6 opacity-60" />
            <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
              {asString(content.cta_headline, "Get in touch")}
            </h2>
            {asString(content.cta_body) && (
              <p className="mt-3 text-base opacity-90">{asString(content.cta_body)}</p>
            )}
          </div>
          <CtaButton href={asString(content.cta_href)} label={asString(content.cta_label, "Contact us")} />
        </div>
      </section>
    </>
  );
}

function Gallery({ content }: { content: LayoutContent }) {
  const items = asArray<{ image_url?: string; caption?: string }>(content.items);
  return (
    <>
      <section className="border-b border-border bg-surface">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <h1 className="max-w-3xl font-display text-4xl font-bold tracking-tight md:text-5xl">
            {asString(content.headline, "Untitled page")}
          </h1>
          {asString(content.subhead) && (
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{asString(content.subhead)}</p>
          )}
        </div>
      </section>
      <section className="container mx-auto grid gap-6 px-4 py-16 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it, i) => (
          <figure key={i} className="group border border-border bg-surface">
            <div className="aspect-square overflow-hidden">
              {it.image_url ? (
                <img
                  src={it.image_url}
                  alt={it.caption ?? ""}
                  className="h-full w-full object-cover transition group-hover:scale-[1.02]"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs uppercase tracking-widest text-muted-foreground">
                  <Star className="h-5 w-5" />
                </div>
              )}
            </div>
            {it.caption && (
              <figcaption className="border-t border-border p-3 text-sm text-muted-foreground">
                {it.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </section>
    </>
  );
}
