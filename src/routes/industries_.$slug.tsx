import { Link, useParams } from "react-router-dom";
import { useFirebaseQuery } from "@/hooks/use-firebase-query";
import { ArrowLeft, ArrowRight, Check, Sparkles, Briefcase, TrendingUp } from "lucide-react";
import * as Icons from "lucide-react";
import { firebase } from "@/integrations/firebase/client";
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

const DEFAULT_INDUSTRIES: Industry[] = [
  {
    id: "ind-1",
    label: "Technology & Software Engineering",
    slug: "technology-software",
    description: "AI, cloud infrastructure, enterprise software, and engineering roles.",
    icon: "cpu",
    detail_content: {
      hero_title: "Powering the Next Wave of Technology Talent",
      hero_subtitle: "From early-stage venture-backed AI firms to enterprise SaaS leaders, we source the software architects and engineering leaders shaping the digital frontier.",
      capabilities: [
        "Software Engineering & Architecture",
        "Artificial Intelligence & Machine Learning",
        "Cloud Infrastructure & Devops",
        "Product Management & UX Design",
        "Cybersecurity & Threat Intel",
      ],
      sourcing_stats: [
        { value: "15 Days", label: "Avg. Tech Time-to-Submit" },
        { value: "450+", label: "Engineers Placed" },
        { value: "94%", label: "Retention Rate at 12 Months" },
      ],
    },
  },
  {
    id: "ind-2",
    label: "Healthcare & Life Sciences",
    slug: "healthcare-lifesciences",
    description: "Medical devices, biotech, pharmaceuticals, and healthcare providers.",
    icon: "heart",
    detail_content: {
      hero_title: "Vetting Specialists for Critical Care & Medical Innovation",
      hero_subtitle: "Sourcing clinical research coordinators, regulatory compliance experts, and biomedical engineers for FDA-approved diagnostic and therapeutic platforms.",
      capabilities: [
        "Biomedical & Hardware Engineering",
        "Clinical Trials Operations",
        "FDA Regulatory Affairs & Compliance",
        "Biostatistics & Bioinformatics",
        "Healthcare IT & Patient Portals",
      ],
      sourcing_stats: [
        { value: "22 Days", label: "Avg. Clinical Time-to-Submit" },
        { value: "120+", label: "Medical Devices Placed" },
        { value: "98%", label: "Compliance Audit Pass Rate" },
      ],
    },
  },
  {
    id: "ind-3",
    label: "Financial Services & FinTech",
    slug: "financial-services",
    description: "Quantitative trading, asset management, risk compliance, banking operations, and financial engineering.",
    icon: "wallet",
    detail_content: {
      hero_title: "Sourcing Leadership in Quantitative Finance & Risk",
      hero_subtitle: "Placing expert financial analysts, risk modeling specialists, and blockchain developers with leading asset management firms and modern FinTech innovators.",
      capabilities: [
        "Quantitative Trading & Analytics",
        "Risk Management & Compliance",
        "Blockchain & Distributed Ledger Technology",
        "Investment Banking & Corporate Finance",
        "Information Security & Auditing",
      ],
      sourcing_stats: [
        { value: "18 Days", label: "Avg. Finance Time-to-Submit" },
        { value: "$10B+", label: "AUM Administered by Placed Talent" },
        { value: "91%", label: "Placement Longevity at 2 Years" },
      ],
    },
  },
  {
    id: "ind-4",
    label: "Logistics & Supply Chain",
    slug: "logistics-supply-chain",
    description: "Global supply chains, logistics operations, warehouse management systems, and procurement.",
    icon: "truck",
    detail_content: {
      hero_title: "Strengthening Supply Chains with Modern Leadership",
      hero_subtitle: "Delivering logistics directors, fleet operations managers, and warehouse systems experts to build highly resilient distribution pipelines.",
      capabilities: [
        "Fleet Operations & Routing",
        "Warehouse Management Systems (WMS)",
        "Global Procurement & Sourcing",
        "Inventory Optimization & Analytics",
        "Distribution Center Administration",
      ],
      sourcing_stats: [
        { value: "19 Days", label: "Avg. Logistics Time-to-Submit" },
        { value: "24/7", label: "Operations Support" },
        { value: "95%", label: "SLA Sourcing Compliance" },
      ],
    },
  },
];

const DEFAULT_CASE_STUDIES: CaseStudy[] = [
  {
    id: "case-1",
    title: "Scaling a Unicorn Startup Engineering Team",
    slug: "scaling-unicorn-startup",
    client: "Vix Tech Corp",
    industry: "Technology & Software",
    summary: "How we designed and executed an embedded RPO strategy to hire 45 software engineers in 90 days.",
  },
  {
    id: "case-2",
    title: "C-Suite Recruiting for a National Logistics Leader",
    slug: "c-suite-logistics-recruiting",
    client: "Delaware Supply Chain",
    industry: "Logistics & Supply Chain",
    summary: "Placing a Chief Operating Officer (COO) and VP of Logistics within a tight 60-day schedule.",
  },
  {
    id: "case-3",
    title: "Building the Future of Medical Devices",
    slug: "medical-device-engineering",
    client: "BioPulse Diagnostics",
    industry: "Healthcare & Life Sciences",
    summary: "Sourcing and placing highly specialized hardware and embedded software engineers for clinical diagnostic tools.",
  },
];

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

function IndustryDetailComponent() {
  const { slug } = useParams();
  const { data: dbIndustry, isLoading } = useFirebaseQuery(
    `industry_${slug}`,
    async (): Promise<Industry | null> => {
      const { data } = await firebase
        .from("industries")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      return (data as Industry | null) ?? null;
    },
  );
  const { data: dbRelated } = useFirebaseQuery("industry_related_data", async () => {
    const [caseStudiesRes, jobsRes] = await Promise.all([
      firebase.from("case_studies").select("*").eq("published", true),
      firebase.from("jobs").select("*, companies(*)").eq("published", true),
    ]);
    return {
      caseStudies: (caseStudiesRes.data as CaseStudy[]) ?? [],
      jobs: (jobsRes.data as Job[]) ?? [],
    };
  });

  const industry = dbIndustry ?? DEFAULT_INDUSTRIES.find((ind) => ind.slug === slug) ?? null;

  if (isLoading)
    return (
      <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">Loading…</div>
    );
  if (!industry)
    return (
      <div className="container mx-auto px-4 py-20 text-center">Industry sector not found.</div>
    );

  const rawRelated = dbRelated ?? { caseStudies: [], jobs: [] };
  const relatedCaseStudiesData = rawRelated.caseStudies.length > 0 ? rawRelated.caseStudies : DEFAULT_CASE_STUDIES;
  const relatedJobsData = rawRelated.jobs;

  const serif = {};

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
  const filteredCaseStudies = relatedCaseStudiesData.filter((cs) => {
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
  const filteredJobs = relatedJobsData.filter((job) => {
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
    <main className="min-h-screen bg-background relative">
      {/* Sub-header Bar (Breadcrumbs & CTA) */}
      <div className="bg-slate-900/90 dark:bg-slate-950 text-slate-300 py-3.5 px-6 md:px-12 flex justify-between items-center text-xs border-b border-slate-800">
        <div className="flex items-center gap-1.5 font-medium">
          <Link to="/" className="hover:text-white transition">
            Home
          </Link>
          <span className="text-slate-600">/</span>
          <Link to="/industries" className="hover:text-white transition">
            Industries
          </Link>
          <span className="text-slate-600">/</span>
          <span className="text-white font-semibold">{industry.label}</span>
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
          src={getIndustryImage(industry.slug)}
          alt={industry.label}
          className="h-full w-full object-cover"
          decoding="async"
        />
        {/* Subtle Dark Overlay */}
        <div className="absolute inset-0 bg-slate-950/20 pointer-events-none" />
        {/* Floating Corporate Blue Title Card */}
        <div className="absolute left-6 md:left-12 bottom-0 w-[240px] sm:w-[320px] md:w-[420px] h-[65%] sm:h-[75%] bg-[#0070ad]/95 text-white p-6 md:p-10 flex items-end justify-start shadow-2xl z-20 border-t border-r border-white/10">
          <h1 className="font-display text-2xl sm:text-3xl md:text-5xl font-black uppercase tracking-tight text-white leading-none">
            {industry.label}
          </h1>
        </div>
      </section>

      {/* Body Section */}
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
              {/* Industry Subheading / Summary */}
              <div className="mb-10">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground leading-snug">
                  {detail.hero_title}
                </h2>
                <p className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg">
                  {detail.hero_subtitle || industry.description}
                </p>
              </div>

              {/* Sourcing Stats metrics row */}
              <div className="mt-10 grid gap-8 grid-cols-3 border-y border-border py-8 mb-16 bg-surface/10 px-4 rounded-sm">
                {detail.sourcing_stats.map((s, idx) => (
                  <div key={idx} className="space-y-1 text-center sm:text-left">
                    <span className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                      {s.value}
                    </span>
                    <p className="text-[10px] sm:text-xs uppercase tracking-wider text-muted-foreground">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Client value proposition / How we help section */}
              <div className="mb-16">
                <div className="mb-6 flex items-center gap-4">
                  <span className="h-px w-8 bg-foreground" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/70">
                    Client Impact
                  </span>
                </div>
                <h3 className="font-display text-2xl font-bold tracking-tight text-foreground mb-4">
                  How We Support Our Partners
                </h3>
                <p className="text-muted-foreground text-sm mb-8">
                  We align our search methodology with your business goals, offering tailored talent
                  acquisition solutions designed to solve critical operational challenges in the{" "}
                  {industry.label} sector.
                </p>

                <div className="grid gap-6 sm:grid-cols-3">
                  {benefits.map((b: any, idx: number) => (
                    <div
                      key={idx}
                      className="border border-border bg-card p-6 flex flex-col gap-4 rounded-lg relative overflow-hidden group hover:border-primary/50 transition-all duration-300"
                    >
                      <span className="text-2xl font-light text-primary/30 group-hover:text-primary transition duration-300">
                        0{idx + 1}
                      </span>
                      <h4 className="font-display text-lg font-bold text-foreground group-hover:text-primary transition duration-300 leading-tight">
                        {b.title}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {b.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Capabilities list */}
              <div>
                <div className="mb-8 flex items-center gap-4">
                  <span className="h-px w-8 bg-foreground" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/70">
                    Key Capabilities
                  </span>
                </div>
                <p className="mb-8 text-muted-foreground text-sm">
                  We maintain active talent communities and demographic-neutral pipelines across
                  these specialist competencies:
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
                      <span
                        className="flex-1 text-base text-foreground/80 font-medium"
                        style={serif}
                      >
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
                        to={`/case-studies/${cs.slug}`}
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
                  <h3 className="font-display text-2xl font-bold mb-6">
                    Open Roles in this Sector
                  </h3>
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
                            {job.companies?.name || "Virelix Consulting"} · {job.location} (
                            {job.type})
                          </p>
                        </div>
                        <Button asChild size="sm" variant="outline">
                          <Link to={`/jobs/${job.slug}`}>
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
              <h3 className="text-2xl font-semibold text-foreground">Talk with a specialist</h3>
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
        </div>
      </section>
    </main>
  );
}

export default IndustryDetailComponent;
