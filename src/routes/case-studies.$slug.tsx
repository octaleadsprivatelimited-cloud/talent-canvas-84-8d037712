import { Link, useParams } from "react-router-dom";
import { useFirebaseQuery } from "@/hooks/use-firebase-query";
import { firebase } from "@/integrations/firebase/client";
import { PageHero } from "@/components/page-hero";
import { ArrowRight } from "lucide-react";

const DEFAULT_CASE_STUDIES = [
  {
    id: "case-1",
    title: "Scaling a Unicorn Startup Engineering Team",
    slug: "scaling-unicorn-startup",
    client: "Vix Tech Corp",
    industry: "Technology & Software",
    cover_url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=70",
    summary: "How we designed and executed an embedded RPO strategy to hire 45 software engineers in 90 days.",
    body: `### Background & Challenge
Vix Tech Corp, a fast-scaling tech platform, secured their Series B funding and needed to double their engineering team. They faced severe recruitment bottlenecking and high agency fees. The goal was to hire 45 high-caliber software engineers, including senior cloud architects and frontend leads, within 90 days.

### The Solution
We deployed an embedded Recruitment Process Outsourcing (RPO) team comprising three senior recruiters and two sourcers. Our team fully integrated into Vix Tech’s Slack, Jira, and ATS systems. We established a structured vetting pipeline, streamlined interview processes, and leveraged our global talent network across the USA and India.

### Results
Within 90 days, we successfully filled all 45 engineering positions. The embedded model allowed us to build a sustainable talent pipeline and reduce recruitment agency spend by over 60%. Time-to-hire dropped from 48 days to 26 days.`,
    results: [
      { label: "Hires Completed", value: "45" },
      { label: "Avg. Time to Hire", value: "26 Days" },
      { label: "Cost Savings", value: "62%" },
    ],
  },
  {
    id: "case-2",
    title: "C-Suite Recruiting for a National Logistics Leader",
    slug: "c-suite-logistics-recruiting",
    client: "Delaware Supply Chain",
    industry: "Logistics & Supply Chain",
    cover_url: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=70",
    summary: "Placing a Chief Operating Officer (COO) and VP of Logistics within a tight 60-day schedule.",
    body: `### Background & Challenge
Delaware Supply Chain, a national logistics operator, faced a sudden vacancy in their Chief Operating Officer position during a period of rapid expansion. They needed an experienced operational leader who could oversee 12 distribution centers and manage a team of 400+ personnel.

### The Solution
We launched a target-focused executive search engagement. Our senior partners conducted extensive talent mapping across competing tier-one logistics and supply chain enterprises in North America. We identified 18 highly qualified passive candidates, conducting detailed competency-based assessments and cultural alignment evaluations.

### Results
We presented a shortlist of 4 qualified candidates within 25 days. The chosen candidate, a seasoned logistics VP, accepted the COO offer and started onboarding within 50 days of contract signing. We subsequently placed their new VP of Logistics, compounding their operational leadership.`,
    results: [
      { label: "Positions Placed", value: "2" },
      { label: "Search Duration", value: "42 Days" },
      { label: "Candidate Fit Rate", value: "100%" },
    ],
  },
  {
    id: "case-3",
    title: "Building the Future of Medical Devices",
    slug: "medical-device-engineering",
    client: "BioPulse Diagnostics",
    industry: "Healthcare & Life Sciences",
    cover_url: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=1200&q=70",
    summary: "Sourcing and placing highly specialized hardware and embedded software engineers for clinical diagnostic tools.",
    body: `### Background & Challenge
BioPulse Diagnostics was developing a next-generation clinical diagnostic tool. They required a team of 6 specialist engineers with experience in FDA-regulated embedded software and microfluidics. These roles had been open for over six months due to the extreme scarcity of regional talent.

### The Solution
We initiated a global talent search utilizing our delivery hubs in both the USA and India. By searching globally, we identified candidates with the precise scientific credentials required. We managed the entire interview logistics, technical screen coordination, and immigration/relocation compliance.

### Results
All 6 engineering seats were filled within 75 days, with 4 US-based hires and 2 offshore senior systems developers. The product launch timeline remained on schedule, and BioPulse successfully completed its FDA submission.`,
    results: [
      { label: "Specialists Placed", value: "6" },
      { label: "Relocation Rate", value: "100%" },
      { label: "Retention (1 yr)", value: "95%" },
    ],
  },
];

function parseMarkdown(text: string | null) {
  if (!text) return null;
  return text.split("\n").map((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("### ")) {
      return (
        <h3 key={idx} className="text-xl font-bold mt-8 mb-4 text-foreground font-display">
          {trimmed.replace("### ", "")}
        </h3>
      );
    }
    if (trimmed.startsWith("## ")) {
      return (
        <h2 key={idx} className="text-2xl font-bold mt-10 mb-4 text-foreground font-display">
          {trimmed.replace("## ", "")}
        </h2>
      );
    }
    if (trimmed.startsWith("- ")) {
      return (
        <li key={idx} className="ml-5 list-disc text-base text-foreground/80 my-1">
          {trimmed.replace("- ", "")}
        </li>
      );
    }
    if (trimmed === "") {
      return <div key={idx} className="h-2" />;
    }
    return (
      <p key={idx} className="text-base text-foreground/85 leading-relaxed my-3">
        {line}
      </p>
    );
  });
}

function CaseStudyDetail() {
  const { slug } = useParams();
  const { data: dbData, isLoading } = useFirebaseQuery(["case_study", slug], async () => {
    const { data } = await firebase
      .from("case_studies")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();
    return data;
  });

  const data = dbData ?? DEFAULT_CASE_STUDIES.find((cs) => cs.slug === slug) ?? null;

  if (isLoading)
    return (
      <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">Loading…</div>
    );
  if (!data) {
    return (
      <div className="flex-1 flex items-center justify-center py-20 bg-background text-foreground">
        <div className="text-center">
          <h1 className="text-4xl font-bold">404 - Case Study Not Found</h1>
          <p className="mt-2 text-muted-foreground">The case study you are looking for does not exist.</p>
          <Link to="/case-studies" className="mt-4 inline-block text-primary underline">Back to Case Studies</Link>
        </div>
      </div>
    );
  }
  const results = (data.results as Array<{ label: string; value: string }>) ?? [];

  return (
    <main className="min-h-screen bg-background relative">
      {/* Sub-header Bar (Breadcrumbs & CTA) */}
      <div className="bg-slate-900/90 dark:bg-slate-950 text-slate-300 py-3.5 px-6 md:px-12 flex justify-between items-center text-xs border-b border-slate-800">
        <div className="flex items-center gap-1.5 font-medium">
          <Link to="/" className="hover:text-white transition">
            Home
          </Link>
          <span className="text-slate-600">/</span>
          <Link to="/case-studies" className="hover:text-white transition">
            Case Studies
          </Link>
          <span className="text-slate-600">/</span>
          <span className="text-white font-semibold">{data.client}</span>
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
          src={
            data.cover_url ||
            "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1920&q=80"
          }
          alt={data.client}
          className="h-full w-full object-cover"
          decoding="async"
        />
        {/* Subtle Dark Overlay */}
        <div className="absolute inset-0 bg-slate-950/20 pointer-events-none" />
        {/* Floating Corporate Blue Title Card */}
        <div className="absolute left-6 md:left-12 bottom-0 w-[240px] sm:w-[320px] md:w-[420px] h-[65%] sm:h-[75%] bg-[#0070ad]/95 text-white p-6 md:p-10 flex items-end justify-start shadow-2xl z-20 border-t border-r border-white/10">
          <h1 className="font-display text-2xl sm:text-3xl md:text-5xl font-black uppercase tracking-tight text-white leading-none">
            {data.client}
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
              {/* Title & Summary */}
              <div className="mb-10">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground leading-snug">
                  {data.title}
                </h2>
                {data.summary && (
                  <p className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg">
                    {data.summary}
                  </p>
                )}
              </div>

              {/* Main Body */}
              <article className="prose prose-lg max-w-none text-foreground/90 font-sans">
                {parseMarkdown(data.body)}
              </article>
            </div>

            {/* Results Sidebar Panel */}
            <aside className="h-fit space-y-px border border-border bg-border">
              {results.map((r, i) => (
                <div key={i} className="bg-surface p-5">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    {r.label}
                  </p>
                  <p className="mt-1 font-display text-2xl font-bold">{r.value}</p>
                </div>
              ))}
              <div className="bg-background p-5">
                <Link to="/contact" className="text-sm font-medium text-primary hover:underline">
                  Start a similar search →
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}

export default CaseStudyDetail;
