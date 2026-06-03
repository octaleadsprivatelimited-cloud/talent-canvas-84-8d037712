import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
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
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;1,500;1,600&display=swap",
        },
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

  const img = getServiceImage(data.slug);
  const serif = { fontFamily: "'Playfair Display', serif" };

  return (
    <main className="min-h-screen bg-[#fcfbf9]">
      {/* Editorial hero */}
      <section className="px-6 pt-20 pb-12 md:px-12 md:pt-32 md:pb-20">
        <div className="mx-auto max-w-6xl">
          <Link
            to="/services"
            className="mb-10 inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400 transition-colors hover:text-slate-900"
          >
            <ArrowLeft className="h-3 w-3" /> All practices
          </Link>

          <div className="grid items-end gap-12 lg:grid-cols-[1fr_auto]">
            <div className="max-w-3xl">
              <div className="mb-6 flex items-center gap-4">
                <span className="h-px w-8 bg-slate-900" />
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400">
                  Service Practice
                </span>
              </div>
              <h1
                className="text-4xl font-medium leading-[0.95] tracking-tight text-slate-900 md:text-6xl lg:text-7xl"
                style={serif}
              >
                {data.title.split(" ").map((word, i, arr) =>
                  i === Math.floor(arr.length / 2) ? (
                    <span key={i} className="italic text-slate-500">
                      {word}{" "}
                    </span>
                  ) : (
                    <span key={i}>{word} </span>
                  ),
                )}
              </h1>
              {data.summary && (
                <p className="mt-8 max-w-xl border-l border-slate-200 pl-6 text-base leading-relaxed text-slate-500 md:text-lg">
                  {data.summary}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Editorial image — offset, layered */}
      <section className="px-6 pb-16 md:px-12 md:pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="relative mx-auto max-w-3xl">
            <div className="absolute -inset-4 -z-10 translate-x-6 translate-y-6 border border-slate-200/80" />
            <div className="relative aspect-[16/10] overflow-hidden shadow-2xl">
              <img
                src={img.src}
                srcSet={img.srcSet}
                sizes="(min-width: 1024px) 768px, 100vw"
                alt={data.title}
                decoding="async"
                className="h-full w-full object-cover"
              />
            </div>
            <span className="mt-4 block text-right text-[9px] uppercase italic tracking-[0.2em] text-slate-400">
              Practice Study · Virelix
            </span>
          </div>
        </div>
      </section>

      {/* Body + features + sidebar */}
      <section className="px-6 pb-24 md:px-12 md:pb-32">
        <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-[2fr_1fr]">
          <div>
            <div className="mb-8 flex items-center gap-4">
              <span className="h-px w-8 bg-slate-900" />
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400">
                Overview
              </span>
            </div>
            {data.body && (
              <div className="whitespace-pre-line text-lg leading-relaxed text-slate-700 [&>*+*]:mt-6">
                {data.body}
              </div>
            )}

            {data.features && data.features.length > 0 && (
              <div className="mt-16">
                <div className="mb-8 flex items-center gap-4">
                  <span className="h-px w-8 bg-slate-900" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400">
                    What's included
                  </span>
                </div>
                <ul className="divide-y divide-slate-200 border-y border-slate-200">
                  {data.features.map((f, i) => (
                    <li
                      key={i}
                      className="group flex items-start gap-6 py-5 transition-colors hover:bg-white"
                    >
                      <span className="text-[10px] font-semibold tabular-nums tracking-widest text-slate-400">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <Check className="mt-1 h-4 w-4 shrink-0 text-slate-900" />
                      <span className="flex-1 text-base text-slate-700" style={serif}>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <aside className="h-fit border border-slate-200 bg-white p-8 lg:sticky lg:top-24">
            <div className="mb-6 flex items-center gap-4">
              <span className="h-px w-8 bg-slate-900" />
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400">
                Engage
              </span>
            </div>
            <h3 className="text-2xl font-medium text-slate-900" style={serif}>
              Start a <span className="italic text-slate-500">conversation</span>
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-slate-500">
              Share your hiring or workforce need — a Virelix consultant will
              respond within one business day with next steps.
            </p>
            <Button
              asChild
              className="mt-6 w-full rounded-none bg-slate-900 py-6 text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-slate-800"
            >
              <Link to="/contact">
                Contact Virelix <ArrowRight className="ml-3 h-4 w-4" />
              </Link>
            </Button>
            <Link
              to="/services"
              className="mt-6 block text-center text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 hover:text-slate-900"
            >
              ← Back to all practices
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
}
