import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Check, Sparkles, Briefcase, TrendingUp } from "lucide-react";
import * as Icons from "lucide-react";
import { supabase } from "@/integrations/firebase/client";
import { Button } from "@/components/ui/button";

const INDUSTRY_PHOTOS: Record<string, string> = {
  "technology-software": "photo-1519389950473-47ba0277781c",
  "healthcare-lifesciences": "photo-1576091160550-2173dba999ef",
  "financial-services": "photo-1559526324-4b87b5e36e44",
  "logistics-supply-chain": "photo-1586528116311-ad8dd3c8310d",
};
const FALLBACK_PHOTO = "photo-1486406146926-c627a92ad1ab";

function getIndustryImage(slug: string | null | undefined) {
  const id = (slug && INDUSTRY_PHOTOS[slug]) || FALLBACK_PHOTO;
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=70`;
}

type IndustryDetail = {
  hero_title: string;
  hero_subtitle: string;
  capabilities: string[];
  sourcing_stats: { value: string; label: string }[];
};

type Industry = {
  id: string;
  slug: string;
  label: string;
  description: string;
  icon: string | null;
  detail_content?: IndustryDetail | null;
};

type CaseStudy = {
  id: string;
  title: string;
  slug: string;
  client: string;
  industry: string;
  summary: string;
  cover_url?: string;
};

type Job = {
  id: string;
  title: string;
  slug: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  companies?: {
    name: string;
    logo_url?: string;
  };
};

const industryQuery = (slug: string) =>
  queryOptions({
    queryKey: ["industry", slug],
    queryFn: async (): Promise<Industry | null> => {
      const { data } = await supabase
        .from("industries")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      return (data as Industry | null) ?? null;
    },
  });

const relatedDataQuery = () =>
  queryOptions({
    queryKey: ["industry_related_data"],
    queryFn: async () => {
      const [caseStudiesRes, jobsRes] = await Promise.all([
        supabase.from("case_studies").select("*").eq("published", true),
        supabase.from("jobs").select("*, companies(*)").eq("published", true),
      ]);
      return {
        caseStudies: (caseStudiesRes.data as CaseStudy[]) ?? [],
        jobs: (jobsRes.data as Job[]) ?? [],
      };
    },
  });

export const Route = createFileRoute("/industries_/$slug")({
  loader: async ({ params, context }) => {
    const data = await context.queryClient.ensureQueryData(industryQuery(params.slug));
    if (!data) throw notFound();
    return data;
  },
  head: ({ params, loaderData }) => {
    const ind = loaderData as Industry | undefined;
    const title = ind ? `${ind.label} Recruitment Practice — Virelix` : "Industry Practice";
    const description =
      ind?.description ?? "Specialized sector recruitment from Virelix Consulting.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: `/industries/${params.slug}` },
      ],
      links: [
        { rel: "canonical", href: `/industries/${params.slug}` },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;1,500;1,600&display=swap",
        },
      ],
    };
  },
  component: IndustryDetailComponent,
  notFoundComponent: () => (
    <div className="container mx-auto px-4 py-20 text-center">Industry sector not found.</div>
  ),
});

function IndustryDetailComponent() {
  const { slug } = Route.useParams();
  const { data: industry } = useSuspenseQuery(industryQuery(slug));
  const { data: related } = useSuspenseQuery(relatedDataQuery());

  if (!industry) return null;

  const serif = { fontFamily: "'Playfair Display', serif" };

  // Resolve Lucide Icon dynamically
  const Lucide = Icons as unknown as Record<
    string,
    React.ComponentType<{ className?: string; strokeWidth?: number }>
  >;
  const Icon = (industry.icon && Lucide[industry.icon]) || Icons.Building2;

  // 1. Fallback content structure if detail_content is empty
  const defaultDetail: IndustryDetail = {
    hero_title: `Leading Recruiting Practices in ${industry.label}`,
    hero_subtitle: industry.description,
    capabilities: [
      "Executive & Board Level Sourcing",
      "Direct Hire Contingent Placement",
      "Dedicated Contractor Resourcing",
      "Offshore Engineering Integration",
      "Salary Benchmarking & Insights",
    ],
    sourcing_stats: [
      { value: "18 Days", label: "Avg. Time-to-Submit" },
      { value: "93%", label: "Placement Retention" },
      { value: "2 Continents", label: "Delivery Footprint" },
    ],
  };

  // Safe parse detail content
  let detail: IndustryDetail = defaultDetail;
  if (industry.detail_content) {
    try {
      detail = (
        typeof industry.detail_content === "string"
          ? JSON.parse(industry.detail_content)
          : industry.detail_content
      ) as IndustryDetail;
    } catch {
      /* fallback */
    }
  }

  // 2. Filter related Case Studies in-memory based on industry name
  const filteredCaseStudies = related.caseStudies.filter((cs) => {
    const csInd = cs.industry?.toLowerCase() ?? "";
    const indLabel = industry.label.toLowerCase();
    const indSlug = industry.slug.toLowerCase();
    return (
      csInd.includes(indLabel) ||
      indLabel.includes(csInd) ||
      csInd.includes(indSlug) ||
      (indSlug.includes("tech") && csInd.includes("tech"))
    );
  });

  // 3. Filter related Jobs in-memory based on title keywords
  const filteredJobs = related.jobs.filter((job) => {
    const title = job.title.toLowerCase();
    const desc = job.description?.toLowerCase() ?? "";
    const slug = industry.slug;

    if (slug.includes("tech") || slug.includes("software")) {
      return (
        title.includes("cloud") ||
        title.includes("architect") ||
        title.includes("developer") ||
        title.includes("engineer") ||
        title.includes("tech") ||
        desc.includes("software")
      );
    }
    if (slug.includes("health") || slug.includes("life")) {
      return title.includes("clinical") || title.includes("medical") || title.includes("health");
    }
    if (slug.includes("finance") || slug.includes("fintech")) {
      return title.includes("finance") || title.includes("risk") || title.includes("quant");
    }
    if (slug.includes("logistics") || slug.includes("supply")) {
      return (
        title.includes("logistics") ||
        title.includes("supply") ||
        title.includes("warehouse") ||
        title.includes("recruiter")
      );
    }
    return true;
  });

  const defaultBenefits: Record<string, { title: string; description: string }[]> = {
    "technology-software": [
      {
        title: "Accelerated Product Velocity",
        description:
          "By sourcing pre-vetted senior software architects and machine learning engineers, we help clients hit critical development milestones and ship features ahead of schedule.",
      },
      {
        title: "Reduced Sourcing Cost & Agency Fee Overhead",
        description:
          "Our scalable embedded RPO model integrates recruiters directly into your internal teams, reducing contingent recruitment costs by up to 60%.",
      },
      {
        title: "Expert Peer-to-Peer Technical Vetting",
        description:
          "Every candidate undergoes deep technical screening led by our in-house systems developers, ensuring shortlists are immediately ready for final hiring loops.",
      },
    ],
    "healthcare-lifesciences": [
      {
        title: "FDA & Regulatory Compliance Safeguards",
        description:
          "We source scientific talent familiar with GxP, HIPAA, and FDA regulatory frameworks, ensuring zero compliance friction in clinical drug trials or medical device launches.",
      },
      {
        title: "Niche Scientific & Clinical Networks",
        description:
          "Direct relationship lines into passive networks of bioinformatics specialists, clinical research coordinators, and biomedical engineers.",
      },
      {
        title: "Rigorous Background & Credentialing Audits",
        description:
          "Full compliance reviews, credential verification, license checks, and background screening processed before candidates are introduced.",
      },
    ],
    "financial-services": [
      {
        title: "Algorithmic & Quantitative Vetting",
        description:
          "Vetting candidates on advanced mathematics, distributed system infrastructure, and quantitative risk modeling tools to protect asset portfolios.",
      },
      {
        title: "Secure & Compliant Sourcing",
        description:
          "Thorough verification of regulatory histories, financial licenses, and credit ratings for personnel in sensitive fiduciary roles.",
      },
      {
        title: "Real-time Compensation Audits",
        description:
          "Sourcing talent with localized intelligence on salary benchmarks, regulatory changes, and candidate pool distributions.",
      },
    ],
    "logistics-supply-chain": [
      {
        title: "Operational Business Continuity",
        description:
          "Prevent logistics or transport bottlenecks by rapidly replacing fleet directors, systems managers, and procurement leads.",
      },
      {
        title: "Systems Optimization & Resiliency",
        description:
          "Placing candidates skilled in Warehouse Management Systems (WMS), Enterprise Resource Planning (ERP), and risk mitigation frameworks.",
      },
      {
        title: "Scalable Sourcing & Flex Capacity",
        description:
          "Scaling our sourcing pipeline up or down to align with seasonal peaks, facility expansions, or logistics network mergers.",
      },
    ],
  };

  const benefits = (industry.detail_content as any)?.client_benefits ||
    defaultBenefits[slug] || [
      {
        title: "Strategic Talent Alignment",
        description:
          "We match specialist candidates with the technical maturity and organizational culture of your team.",
      },
      {
        title: "Reduced Sourcing Cycles",
        description:
          "Our overnight candidate vetting cycle guarantees qualified shortlists are ready within days, not weeks.",
      },
      {
        title: "Mitigated Hiring Risks",
        description:
          "Comprehensive background screening and reference vetting protects your team from bad placement hires.",
      },
    ];

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      {/* Background watermark */}
      <div className="absolute inset-0 -z-10 h-[65vh] w-full overflow-hidden opacity-[0.04] dark:opacity-[0.07] pointer-events-none">
        <img
          src={getIndustryImage(industry.slug)}
          alt=""
          className="h-full w-full object-cover filter blur-[1px] mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
      </div>

      {/* Editorial Header Section */}
      <section className="px-6 pt-20 pb-12 md:px-12 md:pt-32 md:pb-20">
        <div className="mx-auto max-w-6xl">
          <Link
            to="/industries"
            className="mb-10 inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/70 transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3 w-3" /> All Industries
          </Link>

          <div className="grid gap-12 lg:grid-cols-[1fr_auto] items-end">
            <div className="max-w-3xl">
              <div className="mb-6 flex items-center gap-4">
                <div className="h-8 w-8 bg-primary/10 text-primary flex items-center justify-center rounded-sm">
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">
                  {industry.label} Practice
                </span>
              </div>
              <h1
                className="text-4xl font-medium leading-[0.95] tracking-tight text-foreground md:text-6xl lg:text-7xl"
                style={serif}
              >
                {detail.hero_title.split(" ").map((word, i, arr) =>
                  i === Math.floor(arr.length / 2) ? (
                    <span key={i} className="italic text-muted-foreground">
                      {word}{" "}
                    </span>
                  ) : (
                    <span key={i}>{word} </span>
                  ),
                )}
              </h1>
              <p className="mt-8 max-w-xl border-l border-border/80 pl-6 text-base leading-relaxed text-muted-foreground md:text-lg">
                {detail.hero_subtitle || industry.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sourcing Stats metrics row */}
      <section className="border-y border-border bg-surface/30">
        <div className="mx-auto max-w-6xl px-6 py-12 md:px-12">
          <div className="grid gap-8 sm:grid-cols-3">
            {detail.sourcing_stats.map((s, idx) => (
              <div key={idx} className="space-y-1">
                <span className="font-display text-3xl font-bold text-foreground md:text-4xl">
                  {s.value}
                </span>
                <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Client value proposition / How we help section */}
      <section className="px-6 pt-20 pb-4 md:px-12 md:pt-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12">
            <div className="mb-4 flex items-center gap-4">
              <span className="h-px w-8 bg-foreground" />
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/70">
                Client Impact
              </span>
            </div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              How We Support Our Partners
            </h2>
            <p className="mt-4 max-w-2xl text-muted-foreground text-sm">
              We align our search methodology with your business goals, offering tailored talent
              acquisition solutions designed to solve critical operational challenges in the{" "}
              {industry.label} sector.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {benefits.map((b: any, idx: number) => (
              <div
                key={idx}
                className="border border-border bg-card p-8 flex flex-col gap-4 rounded-lg relative overflow-hidden group hover:border-primary/50 transition-all duration-300"
              >
                <span className="text-3xl font-light text-primary/30 group-hover:text-primary transition duration-300">
                  0{idx + 1}
                </span>
                <h3 className="font-display text-xl font-bold text-foreground group-hover:text-primary transition duration-300">
                  {b.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main core content + sidebar capabilities */}
      <section className="px-6 py-20 md:px-12 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-[2fr_1fr]">
          <div>
            {/* Capabilities list */}
            <div>
              <div className="mb-8 flex items-center gap-4">
                <span className="h-px w-8 bg-foreground" />
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/70">
                  Key Capabilities
                </span>
              </div>
              <p className="mb-8 text-muted-foreground text-sm">
                We maintain active talent communities and demographic-neutral pipelines across these
                specialist competencies:
              </p>
              <ul className="divide-y divide-border border-y border-border mb-16">
                {detail.capabilities.map((c, i) => (
                  <li
                    key={i}
                    className="group flex items-start gap-6 py-5 transition-colors hover:bg-card/50"
                  >
                    <span className="text-[10px] font-semibold tabular-nums tracking-widest text-muted-foreground/70">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <Check className="mt-1 h-4 w-4 shrink-0 text-primary" />
                    <span className="flex-1 text-base text-foreground/80 font-medium" style={serif}>
                      {c}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Related Case Studies section */}
            {filteredCaseStudies.length > 0 && (
              <div className="mt-16">
                <div className="mb-8 flex items-center gap-4">
                  <span className="h-px w-8 bg-foreground" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/70">
                    Sourcing in Action
                  </span>
                </div>
                <h3 className="font-display text-2xl font-bold mb-6">Success Stories</h3>
                <div className="grid gap-6 sm:grid-cols-2">
                  {filteredCaseStudies.map((cs) => (
                    <Link
                      key={cs.id}
                      to="/case-studies/$slug"
                      params={{ slug: cs.slug }}
                      className="bg-card border border-border p-6 rounded-lg hover:border-primary transition group flex flex-col justify-between"
                    >
                      <div>
                        <span className="text-[9px] uppercase tracking-widest text-primary font-bold">
                          {cs.client}
                        </span>
                        <h4 className="mt-2 font-display text-lg font-bold text-foreground group-hover:text-primary transition line-clamp-2">
                          {cs.title}
                        </h4>
                        <p className="mt-3 text-muted-foreground text-xs line-clamp-3">
                          {cs.summary}
                        </p>
                      </div>
                      <span className="mt-6 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-foreground">
                        View Study <ArrowRight className="h-3 w-3" />
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Active Careers section */}
            {filteredJobs.length > 0 && (
              <div className="mt-16">
                <div className="mb-8 flex items-center gap-4">
                  <Briefcase className="h-4 w-4 text-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/70">
                    Active Careers
                  </span>
                </div>
                <h3 className="font-display text-2xl font-bold mb-6">Open Roles in this Sector</h3>
                <div className="divide-y divide-border border-y border-border">
                  {filteredJobs.map((job) => (
                    <div
                      key={job.id}
                      className="py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                    >
                      <div>
                        <h4 className="font-display text-lg font-bold text-foreground">
                          {job.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {job.companies?.name || "Virelix Consulting"} · {job.location} ({job.type}
                          )
                        </p>
                      </div>
                      <Button asChild size="sm" variant="outline">
                        <Link to="/jobs/$slug" params={{ slug: job.slug }}>
                          View Details
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sourcing Engagement Callout */}
          <aside className="h-fit border border-border bg-card p-8 lg:sticky lg:top-24 rounded-lg">
            <div className="mb-6 flex items-center gap-4">
              <span className="h-px w-8 bg-foreground" />
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/70">
                Engage Practice
              </span>
            </div>
            <h3 className="text-2xl font-medium text-foreground" style={serif}>
              Talk with a <span className="italic text-muted-foreground">specialist</span>
            </h3>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              Speak directly with a lead partner who coordinates client engagements and candidate
              vetting in the {industry.label} field.
            </p>
            <Button
              asChild
              className="mt-6 w-full bg-foreground text-background py-6 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-foreground/90"
            >
              <Link to="/contact">
                Connect Now <ArrowRight className="ml-3 h-4 w-4" />
              </Link>
            </Button>
            <Link
              to="/industries"
              className="mt-6 block text-center text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/70 hover:text-foreground"
            >
              ← Back to all sectors
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
}
