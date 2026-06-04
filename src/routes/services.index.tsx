import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/firebase/client";
import { Button } from "@/components/ui/button";
import { getServiceImage } from "@/lib/service-images";
import { DynamicSeo } from "@/components/dynamic-seo";

type Service = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  icon: string | null;
  features: string[] | null;
};

const servicesQuery = queryOptions({
  queryKey: ["services", "published"],
  queryFn: async (): Promise<Service[]> => {
    const { data } = await supabase
      .from("services")
      .select("id,slug,title,summary,icon,features")
      .eq("published", true)
      .order("sort_order");
    return (data as Service[] | null) ?? [];
  },
});

const PAGE_TITLE = "Recruitment & Workforce Services — Virelix Consulting";
const PAGE_DESCRIPTION =
  "Executive search, IT and non-IT recruitment, RPO, workforce planning, business consulting, and professional training delivered across the USA and India by Virelix Consulting.";

export const Route = createFileRoute("/services/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(servicesQuery),
  head: ({ loaderData }) => {
    const items = (loaderData as Service[] | undefined) ?? [];
    return {
      meta: [
        { title: PAGE_TITLE },
        { name: "description", content: PAGE_DESCRIPTION },
        { property: "og:title", content: PAGE_TITLE },
        { property: "og:description", content: PAGE_DESCRIPTION },
        { property: "og:type", content: "website" },
        { property: "og:url", content: "/services" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: PAGE_TITLE },
        { name: "twitter:description", content: PAGE_DESCRIPTION },
        {
          name: "keywords",
          content:
            "recruitment agency, executive search, IT recruitment, RPO, staffing solutions, workforce planning, talent acquisition, USA India recruitment, Virelix Consulting",
        },
      ],
      links: [
        { rel: "canonical", href: "/services" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;1,500;1,600&display=swap",
        },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Virelix Consulting Services",
            itemListElement: items.map((s, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: s.title,
              url: `/services/${s.slug}`,
            })),
          }),
        },
      ],
    };
  },
  component: ServicesPage,
});

// Vary parallax image position per row for editorial rhythm
const IMAGE_VARIANTS = [
  { right: "right-[8%]", top: "-top-10", w: "w-60", h: "h-72" },
  { right: "right-[22%]", top: "top-1/2 -translate-y-1/2", w: "w-80", h: "h-56" },
  { right: "right-[5%]", top: "-bottom-16", w: "w-64", h: "h-64" },
];

const BG_VARIANTS = ["bg-muted/40", "bg-muted/20", "bg-muted/30"];

function ServicesPage() {
  const { data } = useSuspenseQuery(servicesQuery);

  return (
    <section className="min-h-screen w-full bg-background py-20 px-6 md:px-12 md:py-32">
      <DynamicSeo
        pageKey="services"
        fallbackTitle={PAGE_TITLE}
        fallbackDescription={PAGE_DESCRIPTION}
      />
      <div className="mx-auto w-full max-w-6xl">
        {/* Editorial Header */}
        <div className="mb-20 flex flex-col gap-10 md:mb-32 md:flex-row md:items-end md:justify-between md:gap-12">
          <div className="max-w-2xl">
            <div className="mb-6 flex items-center gap-4 md:mb-8">
              <span className="h-px w-8 bg-foreground" />
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/70">
                Capabilities
              </span>
            </div>
            <h1 className="text-5xl font-light leading-[0.9] tracking-tighter text-foreground md:text-7xl lg:text-8xl">
              Our{" "}
              <span className="italic" style={{ fontFamily: "'Playfair Display', serif" }}>
                Service
              </span>{" "}
              Practices
            </h1>
          </div>
          <p className="max-w-xs border-l border-border pl-6 text-base leading-relaxed text-muted-foreground md:pl-8 md:text-lg">
            Strategic talent solutions engineered for high-growth enterprises and global leadership
            teams.
          </p>
        </div>

        {/* Editorial List */}
        <div className="border-t border-border">
          {data.map((s, i) => {
            const img = getServiceImage(s.slug);
            const num = String(i + 1).padStart(2, "0");
            const variant = IMAGE_VARIANTS[i % IMAGE_VARIANTS.length];
            const bg = BG_VARIANTS[i % BG_VARIANTS.length];
            const fromLeft = i % 2 === 1;

            return (
              <Link
                key={s.id}
                to="/services/$slug"
                params={{ slug: s.slug }}
                className="group relative block overflow-hidden border-b border-border py-12 transition-all duration-700 md:py-20"
              >
                {/* Sliding background layers */}
                <div
                  className={`absolute inset-0 ${bg} transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                    fromLeft
                      ? "-translate-x-full group-hover:translate-x-0"
                      : "translate-x-full group-hover:translate-x-0"
                  }`}
                />
                <div
                  className={`absolute inset-0 bg-card transition-transform duration-1000 delay-75 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                    fromLeft
                      ? "-translate-x-full group-hover:translate-x-0"
                      : "translate-x-full group-hover:translate-x-0"
                  }`}
                />
                {/* Mobile/Tablet backdrop image */}
                <div className="absolute inset-0 z-0 opacity-[0.10] dark:opacity-[0.18] transition-opacity duration-500 lg:hidden group-hover:opacity-[0.16]">
                  <img
                    src={img.src}
                    alt=""
                    className="h-full w-full object-cover mix-blend-luminosity filter blur-[1px]"
                  />
                </div>

                {/* Row content */}
                <div className="relative z-20 flex flex-col items-baseline gap-6 md:flex-row md:gap-16 lg:gap-24">
                  <span className="text-xs font-semibold tabular-nums tracking-widest text-muted-foreground/70 transition-colors duration-500 group-hover:text-foreground">
                    {num}
                  </span>
                  <div className="flex-1">
                    <h2
                      className="text-3xl font-medium tracking-tight text-foreground transition-transform duration-500 ease-out group-hover:translate-x-4 md:text-5xl lg:text-6xl"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {s.title}
                    </h2>
                    <div className="max-h-0 overflow-hidden opacity-0 transition-all duration-700 ease-in-out group-hover:max-h-48 group-hover:opacity-100">
                      <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground transition-transform duration-700 delay-100 group-hover:translate-x-8 md:mt-8 md:text-lg">
                        {s.summary}
                      </p>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border transition-all duration-500 group-hover:border-foreground group-hover:bg-foreground group-hover:text-background">
                      <ArrowRight className="h-5 w-5 transition-transform duration-500 group-hover:-rotate-45" />
                    </div>
                  </div>
                </div>

                {/* Parallax image — desktop only */}
                <div
                  className={`pointer-events-none absolute z-30 hidden opacity-0 transition-all duration-1000 group-hover:opacity-100 lg:block ${variant.right} ${variant.top} ${variant.w} ${variant.h}`}
                >
                  <div className="absolute -inset-4 -z-10 translate-x-4 translate-y-24 border border-border/60 transition-transform duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-12 group-hover:translate-y-8" />
                  <div className="relative h-full w-full translate-y-32 overflow-hidden shadow-2xl transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-x-4 group-hover:translate-y-4">
                    <img
                      src={img.src}
                      srcSet={img.srcSet}
                      sizes="400px"
                      alt={s.title}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full scale-110 object-cover grayscale transition-all duration-1000 group-hover:scale-100 group-hover:grayscale-0"
                    />
                  </div>
                  <span className="absolute -bottom-8 right-0 translate-y-12 text-[9px] uppercase italic tracking-[0.2em] text-muted-foreground/70 transition-transform duration-500 ease-out group-hover:-translate-y-4">
                    Practice {num}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-20 flex flex-col items-start justify-between gap-8 md:mt-32 md:flex-row md:items-center">
          <div className="flex items-center gap-6">
            <div className="flex gap-1.5">
              <div className="h-1 w-1 rounded-full bg-foreground" />
              <div className="h-1 w-1 rounded-full bg-muted-foreground/40" />
              <div className="h-1 w-1 rounded-full bg-muted-foreground/20" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
              Ten practices · USA & India
            </span>
          </div>
          <Button
            asChild
            size="lg"
            className="rounded-none bg-foreground text-background px-8 text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-foreground/90"
          >
            <Link to="/contact">
              Talk to a Virelix consultant
              <ArrowRight className="ml-3 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
