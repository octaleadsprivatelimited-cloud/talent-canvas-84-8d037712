import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, Check } from "lucide-react";
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
  body: string | null;
  icon: string | null;
  features: string[] | null;
};

const serviceQuery = (slug: string) =>
  queryOptions({
    queryKey: ["service", slug],
    queryFn: async (): Promise<Service | null> => {
      const { data } = await supabase
        .from("services")
        .select("id,slug,title,summary,body,icon,features")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      return (data as Service | null) ?? null;
    },
  });

export const Route = createFileRoute("/services/$slug")({
  loader: async ({ params, context }) => {
    const data = await context.queryClient.ensureQueryData(
      serviceQuery(params.slug),
    );
    if (!data) throw notFound();
    return data;
  },
  head: ({ params, loaderData }) => {
    const s = loaderData as Service | undefined;
    const title = s
      ? `${s.title} — Virelix Consulting`
      : "Service — Virelix Consulting";
    const description =
      s?.summary ??
      "Specialist recruitment and workforce solutions delivered by Virelix Consulting.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: `/services/${params.slug}` },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
      ],
      links: [
        { rel: "canonical", href: `/services/${params.slug}` },
      ],
      scripts: s
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Service",
                name: s.title,
                description,
                provider: {
                  "@type": "Organization",
                  name: "Virelix Consulting",
                  url: "/",
                },
                areaServed: ["United States", "India"],
                url: `/services/${params.slug}`,
              }),
            },
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Home", item: "/" },
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: "Services",
                    item: "/services",
                  },
                  {
                    "@type": "ListItem",
                    position: 3,
                    name: s.title,
                    item: `/services/${params.slug}`,
                  },
                ],
              }),
            },
          ]
        : [],
    };
  },
  component: ServiceDetail,
  errorComponent: ({ error }) => (
    <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">
      {error.message}
    </div>
  ),
  notFoundComponent: () => (
    <div className="container mx-auto px-4 py-20 text-center">
      Service not found.
    </div>
  ),
});

function ServiceDetail() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(serviceQuery(slug));
  if (!data) return null;

  const Lucide = Icons as unknown as Record<
    string,
    React.ComponentType<{ className?: string }>
  >;
  const Icon = (data.icon && Lucide[data.icon]) || Icons.Sparkles;

  const img = getServiceImage(data.slug);

  return (
    <>
      <PageHero
        eyebrow="Service"
        title={data.title}
        subtitle={data.summary ?? undefined}
      />
      <div className="container mx-auto px-4 pt-8">
        <div className="relative aspect-[21/9] w-full overflow-hidden border border-border bg-muted sm:aspect-[16/7] md:aspect-[21/8]">
          <img
            src={img.src}
            srcSet={img.srcSet}
            sizes="(min-width: 1024px) 1100px, 100vw"
            alt={data.title}
            decoding="async"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
      <section className="container mx-auto grid gap-12 px-4 py-16 lg:grid-cols-[2fr_1fr]">
        <div>
          <div className="mb-6 flex h-14 w-14 items-center justify-center border border-border">
            <Icon className="h-6 w-6" />
          </div>
          <div className="prose prose-lg max-w-none whitespace-pre-line text-foreground/90">
            {data.body}
          </div>

          {data.features && data.features.length > 0 && (
            <div className="mt-10">
              <h2 className="mb-4 font-display text-xl font-semibold">
                What's included
              </h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {data.features.map((f, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 border border-border p-4"
                  >
                    <Check className="mt-0.5 h-4 w-4 text-primary" />
                    <span className="text-sm">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <aside className="h-fit border border-border bg-surface p-6">
          <h3 className="font-display text-lg font-bold">
            Start a conversation
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Share your hiring or workforce need — a Virelix consultant will
            respond within one business day with next steps.
          </p>
          <Button asChild className="mt-5 w-full">
            <Link to="/contact">
              Contact Virelix <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Link
            to="/services"
            className="mt-4 block text-center text-xs text-muted-foreground hover:text-foreground"
          >
            ← All services
          </Link>
        </aside>
      </section>
    </>
  );
}
