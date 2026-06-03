import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import * as Icons from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageHero } from "@/components/page-hero";
import { Button } from "@/components/ui/button";
import { getServiceImage } from "@/lib/service-images";


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

const PAGE_TITLE =
  "Recruitment & Workforce Services — Virelix Consulting";
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
      links: [{ rel: "canonical", href: "/services" }],
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

function getIcon(name?: string | null) {
  const Lucide = Icons as unknown as Record<
    string,
    React.ComponentType<{ className?: string; strokeWidth?: number }>
  >;
  return (name && Lucide[name]) || Icons.Sparkles;
}

function ServicesPage() {
  const { data } = useSuspenseQuery(servicesQuery);

  return (
    <>
      <PageHero
        eyebrow="What we do"
        title="Strategic talent acquisition & workforce solutions, end to end."
        subtitle="From a single executive hire to building entire teams — Virelix combines USA-headquartered consulting with global delivery across ten service practices."
      />
      <section className="container mx-auto px-4 py-20">
        <div className="grid gap-px bg-border md:grid-cols-2">
          {data.map((s) => {
            const Icon = getIcon(s.icon);
            return (
              <Link
                key={s.id}
                to="/services/$slug"
                params={{ slug: s.slug }}
                className="group flex flex-col gap-4 bg-background p-8 transition-colors hover:bg-surface"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center border border-border">
                    <Icon className="h-5 w-5" strokeWidth={1.5} />
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                </div>
                <h2 className="font-display text-2xl font-bold">{s.title}</h2>
                <p className="text-muted-foreground">{s.summary}</p>
                {s.features && s.features.length > 0 && (
                  <ul className="mt-2 space-y-2">
                    {s.features.slice(0, 4).map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check className="mt-0.5 h-4 w-4 text-primary" /> {f}
                      </li>
                    ))}
                  </ul>
                )}
              </Link>
            );
          })}
        </div>
        <div className="mt-12 flex justify-center">
          <Button size="lg" asChild>
            <Link to="/contact">
              Talk to a Virelix consultant <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
