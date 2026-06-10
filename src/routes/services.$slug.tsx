import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery, useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  FileText,
  ArrowUpRight,
} from "lucide-react";
import { firebase } from "@/integrations/firebase/client";
import { Button } from "@/components/ui/button";
import { getServiceImage } from "@/lib/service-images";
import { useState } from "react";

type Service = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  body: string | null;
  icon: string | null;
  features: string[] | null;
  image_url?: string | null;
};

const serviceQuery = (slug: string) =>
  queryOptions({
    queryKey: ["service", slug],
    queryFn: async (): Promise<Service | null> => {
      const { data } = await firebase
        .from("services")
        .select("id,slug,title,summary,body,icon,features,image_url")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      return (data as Service | null) ?? null;
    },
  });

export const Route = createFileRoute("/services/$slug")({
  loader: async ({ params, context }) => {
    const data = await context.queryClient.ensureQueryData(serviceQuery(params.slug));
    if (!data) throw notFound();
    return data;
  },
  head: ({ params, loaderData }) => {
    const s = loaderData as Service | undefined;
    const title = s ? `${s.title} — Virelix Consulting` : "Service — Virelix Consulting";
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
    <div className="container mx-auto px-4 py-20 text-center">Service not found.</div>
  ),
});

const SERVICE_ADDITIONS: Record<
  string,
  {
    stats: { value: string; label: string }[];
    faqs: { q: string; a: string }[];
  }
> = {
  "executive-search": {
    stats: [
      { value: "96%", label: "1-Year Leadership Retention" },
      { value: "42 Days", label: "Average Search Cycle" },
      { value: "180+", label: "C-Level Placements" },
    ],
    faqs: [
      {
        q: "How long does a typical executive search take?",
        a: "Most leadership assignments are completed in 45 to 60 days from kickoff to signed offer, with initial shortlist presentation within 21 days.",
      },
      {
        q: "Do you offer a placement guarantee?",
        a: "Yes. All of our retained executive searches include a 180-day placement guarantee. If a leader exits within that period, we redo the search at zero additional professional fees.",
      },
      {
        q: "How do you source passive executive talent?",
        a: "We perform deep, target-focused talent mapping across competing tier-one enterprises globally. We leverage proprietary direct outreach networks and trust relationships built over decades.",
      },
    ],
  },
  "it-recruitment": {
    stats: [
      { value: "48 Hours", label: "Average Shortlist Delivery" },
      { value: "450+", label: "Tech Engineers Placed" },
      { value: "94%", label: "Placement Success Rate" },
    ],
    faqs: [
      {
        q: "What geographical regions do you support?",
        a: "We have recruiting hubs operating in the United States and India, enabling us to support local, remote, and offshore sourcing requirements.",
      },
      {
        q: "What is your vetting process?",
        a: "Candidates undergo a peer-to-peer technical assessment, custom culture-fit questions, and previous employer reference validation prior to submittal.",
      },
      {
        q: "Do you handle contract-to-hire arrangements?",
        a: "Yes. We offer flexible permanent, contract, and contract-to-hire staffing models to align with your project timelines and budget requirements.",
      },
    ],
  },
  "rpo-workforce-solutions": {
    stats: [
      { value: "62%", label: "Agency Fee Cost Reduction" },
      { value: "26 Days", label: "Average Time-to-Hire" },
      { value: "100%", label: "SLA Sourcing Compliance" },
    ],
    faqs: [
      {
        q: "What is the typical contract length for an RPO engagement?",
        a: "Our RPO partnerships range from 3-month seasonal scale-ups to multi-year embedded operations, customized to your hiring forecasts.",
      },
      {
        q: "How does your pricing model work?",
        a: "RPO features a combination of a fixed monthly management fee and a reduced success fee per hire, reducing hiring costs by up to 50% compared to contingent agencies.",
      },
      {
        q: "Will you use our existing Applicant Tracking System (ATS)?",
        a: "Yes, our embedded recruitment teams are fully trained across all major systems (Greenhouse, Lever, Workday) and can also help configure and optimize your instance.",
      },
    ],
  },
  "consulting-training": {
    stats: [
      { value: "15k+", label: "Professionals Certified" },
      { value: "30%+", label: "Client Sourcing Speed Gain" },
      { value: "24/7", label: "Strategic Account Management" },
    ],
    faqs: [
      {
        q: "Can training bootcamps be customized for our tech stack?",
        a: "Absolutely. We build bespoke curriculum covering modern technologies (Cloud Architecture, SRE, Cybersecurity, AI/ML engineering) aligned to your stack.",
      },
      {
        q: "What data do you use for salary benchmarking?",
        a: "We compile active, localized compensation data across tech hubs in the USA and India, cross-referenced with recent placement metrics.",
      },
      {
        q: "How do you align training programs with business impact?",
        a: "We perform an initial skills-gap analysis with your engineering leaders and measure post-training certification and project velocity improvements.",
      },
    ],
  },
};

function ServiceDetail() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(serviceQuery(slug));
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const { data: caseStudies } = useQuery({
    queryKey: ["case_studies", "published"],
    queryFn: async () => {
      const { data } = await firebase.from("case_studies").select("*").eq("published", true);
      return data ?? [];
    },
  });

  if (!data) return null;

  const additions = SERVICE_ADDITIONS[data.slug];
  const relatedCaseStudies = (caseStudies ?? []).filter((cs: any) => {
    if (data.slug === "executive-search")
      return cs.slug.includes("c-suite") || cs.slug.includes("search");
    if (data.slug === "it-recruitment")
      return cs.slug.includes("medical") || cs.slug.includes("unicorn");
    if (data.slug === "rpo-workforce-solutions")
      return cs.slug.includes("unicorn") || cs.slug.includes("rpo");
    if (data.slug === "consulting-training")
      return (
        cs.slug.includes("training") || cs.slug.includes("unicorn") || cs.slug.includes("medical")
      );
    return false;
  });

  const img = data.image_url
    ? { src: data.image_url, srcSet: undefined }
    : getServiceImage(data.slug);
  const serif = {};

  return (
    <main className="min-h-screen bg-background relative">
      {/* Sub-header Bar (Breadcrumbs & CTA) */}
      <div className="bg-slate-900/90 dark:bg-slate-950 text-slate-300 py-3.5 px-6 md:px-12 flex justify-between items-center text-xs border-b border-slate-800">
        <div className="flex items-center gap-1.5 font-medium">
          <Link to="/" className="hover:text-white transition">
            Home
          </Link>
          <span className="text-slate-600">/</span>
          <Link to="/services" className="hover:text-white transition">
            Services
          </Link>
          <span className="text-slate-600">/</span>
          <span className="text-white font-semibold">{data.title}</span>
        </div>
        <Link
          to="/contact"
          className="bg-[#0070ad] hover:bg-[#005c8f] text-white font-semibold px-4 py-2 transition text-[10px] uppercase tracking-wider inline-flex items-center gap-1.5"
        >
          Get in touch <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Hero Banner Section */}
      <section className="relative w-full h-[280px] sm:h-[360px] md:h-[420px] overflow-hidden">
        {/* Banner Image */}
        <img
          src={img.src}
          srcSet={img.srcSet}
          alt={data.title}
          className="h-full w-full object-cover"
          decoding="async"
        />
        {/* Subtle Dark Overlay */}
        <div className="absolute inset-0 bg-slate-950/20 pointer-events-none" />
        {/* Floating Corporate Blue Title Card */}
        <div className="absolute left-6 md:left-12 bottom-0 w-[240px] sm:w-[320px] md:w-[420px] h-[65%] sm:h-[75%] bg-[#0070ad]/95 text-white p-6 md:p-10 flex items-end justify-start shadow-2xl z-20 border-t border-r border-white/10">
          <h1 className="font-display text-2xl sm:text-3xl md:text-5xl font-black uppercase tracking-tight text-white leading-none">
            {data.title}
          </h1>
        </div>
      </section>

      {/* Body + features + sidebar */}
      <section className="px-6 py-16 md:px-12 md:py-24 relative z-10">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[auto_1fr]">
          {/* Leftmost column - Social Sharing Icons (Desktop only) */}
          <div className="hidden lg:flex flex-col gap-4 pt-1 shrink-0">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-[#0077b5] hover:text-white hover:border-[#0077b5] transition-all duration-300 font-bold text-sm"
              aria-label="Share on LinkedIn"
            >
              in
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-[#1877f2] hover:text-white hover:border-[#1877f2] transition-all duration-300 font-bold text-sm"
              aria-label="Share on Facebook"
            >
              f
            </a>
          </div>

          {/* Rest of Page Layout */}
          <div className="grid gap-16 lg:grid-cols-[2fr_1fr]">
            <div>
              {/* Service Subheading / Summary */}
              {data.summary && (
                <div className="mb-10">
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground leading-snug">
                    {data.summary}
                  </h2>
                </div>
              )}

              <div className="mb-8 flex items-center gap-4">
                <span className="h-px w-8 bg-foreground" />
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/70">
                  Overview
                </span>
              </div>
              {data.body && (
                <div className="whitespace-pre-line text-base leading-relaxed text-foreground/80 [&>*+*]:mt-6">
                  {data.body}
                </div>
              )}

              {/* Sourcing Stats */}
              {additions?.stats && (
                <div className="mt-16 grid grid-cols-1 gap-6 border-t border-border pt-12 sm:grid-cols-3">
                  {additions.stats.map((stat, i) => (
                    <div key={i} className="border border-border/60 bg-card p-6">
                      <div className="font-display text-3xl font-bold text-accent">
                        {stat.value}
                      </div>
                      <div className="mt-2 text-xs uppercase tracking-wider text-muted-foreground leading-tight">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {data.features && data.features.length > 0 && (
                <div className="mt-16">
                  <div className="mb-8 flex items-center gap-4">
                    <span className="h-px w-8 bg-foreground" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/70">
                      What's included
                    </span>
                  </div>
                  <ul className="divide-y divide-border border-y border-border">
                    {data.features.map((f, i) => (
                      <li
                        key={i}
                        className="group flex items-start gap-6 py-5 transition-colors hover:bg-card/50"
                      >
                        <span className="text-[10px] font-semibold tabular-nums tracking-widest text-muted-foreground/70">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <Check className="mt-1 h-4 w-4 shrink-0 text-foreground" />
                        <span className="flex-1 text-base text-foreground/80" style={serif}>
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Related Success Stories */}
              {relatedCaseStudies.length > 0 && (
                <div className="mt-16 border-t border-border pt-12">
                  <div className="mb-8 flex items-center gap-4">
                    <span className="h-px w-8 bg-foreground" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/70">
                      Success Stories
                    </span>
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2">
                    {relatedCaseStudies.map((cs: any) => (
                      <Link
                        key={cs.id}
                        to="/case-studies/$slug"
                        params={{ slug: cs.slug }}
                        className="group border border-border bg-card p-6 transition hover:bg-surface/50"
                      >
                        <div className="text-[10px] font-bold uppercase tracking-wider text-accent">
                          {cs.client}
                        </div>
                        <h4 className="mt-2 font-display text-lg font-bold group-hover:text-primary transition">
                          {cs.title}
                        </h4>
                        <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                          {cs.summary}
                        </p>
                        <span className="mt-4 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-primary group-hover:underline">
                          Read Case Study <ArrowUpRight className="h-3.5 w-3.5" />
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* FAQs Accordion */}
              {additions?.faqs && additions.faqs.length > 0 && (
                <div className="mt-16 border-t border-border pt-12">
                  <div className="mb-8 flex items-center gap-4">
                    <span className="h-px w-8 bg-foreground" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/70">
                      Frequently Asked Questions
                    </span>
                  </div>
                  <div className="space-y-4">
                    {additions.faqs.map((faq, i) => {
                      const isOpen = openFaq === i;
                      return (
                        <div
                          key={i}
                          className="border border-border bg-card transition-all duration-300"
                        >
                          <button
                            onClick={() => setOpenFaq(isOpen ? null : i)}
                            className="flex w-full items-center justify-between p-6 text-left"
                          >
                            <span className="font-display text-base font-bold text-foreground">
                              {faq.q}
                            </span>
                            {isOpen ? (
                              <ChevronUp className="h-4 w-4 text-primary" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            )}
                          </button>
                          {isOpen && (
                            <div className="border-t border-border p-6 text-sm leading-relaxed text-muted-foreground bg-surface/20">
                              {faq.a}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <aside className="h-fit border border-border bg-card p-8 lg:sticky lg:top-24">
              <div className="mb-6 flex items-center gap-4">
                <span className="h-px w-8 bg-foreground" />
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/70">
                  Engage
                </span>
              </div>
              <h3 className="text-2xl font-semibold text-foreground">Start a conversation</h3>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Share your hiring or workforce need — a Virelix consultant will respond within one
                business day with next steps.
              </p>
              <Button
                asChild
                className="mt-6 w-full rounded-none bg-foreground text-background py-6 text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-foreground/90"
              >
                <Link to="/contact">
                  Contact Virelix <ArrowRight className="ml-3 h-4 w-4" />
                </Link>
              </Button>
              <Link
                to="/services"
                className="mt-6 block text-center text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/70 hover:text-foreground"
              >
                ← Back to all practices
              </Link>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
