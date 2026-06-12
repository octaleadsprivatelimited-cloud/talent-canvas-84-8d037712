import { Link, useParams } from "react-router-dom";
import { useFirebaseQuery } from "@/hooks/use-firebase-query";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  FileText,
  ArrowUpRight,
} from "lucide-react";
import { firebase } from "@/integrations/firebase/client";
import { Button } from "@/components/ui/button";
import { getServiceImage } from "@/lib/service-images";
import { useState } from "react";
import { DEFAULT_CASE_STUDIES } from "@/lib/case-studies-data";

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

const DEFAULT_SERVICES: Service[] = [
  {
    id: "service-1",
    slug: "executive-search",
    title: "Executive Search & Leadership Hiring",
    summary: "Retained search for C-suite, VP, and Director roles led by senior consultants with deep sector expertise.",
    icon: "target",
    features: [
      "Retained search practice",
      "Sector specialists",
      "C-level placement portfolio",
    ],
    body: `Finding transformational leaders requires more than a standard search process. At Virelix Consulting, we partner with boards, founders, and executive committees to source leaders who drive long-term business strategy and organizational culture.

Our research-backed methodology maps the entire passive candidate landscape, uncovering leadership talent that traditional job boards miss. We conduct deep competency-based interviews, evaluate culture-fit parameters, and run rigorous background/reference verification checks before making introductions.

We specialize in recruiting:
• Chief Executive Officers & Board Directors
• VP & Director Level Operations Leadership
• Chief Technology Officers & Engineering VPs
• Chief Financial Officers & Quantitative Partners`,
  },
  {
    id: "service-2",
    slug: "it-recruitment",
    title: "IT & Non-IT Recruitment",
    summary: "Specialist hiring across technology, engineering, finance, sales, operations, and support functions.",
    icon: "cpu",
    features: ["Tech talent network", "Contingent placement", "Multi-country delivery"],
    body: `To stay competitive, organizations need specialized talent who can execute complex tech roadmaps and manage operations smoothly. Virelix delivers end-to-end sourcing for contract, contract-to-hire, and direct-hire positions across the United States and India.

We maintain active candidate pools in Software Development, Cloud Architecture, DevOps, and Product Management, as well as critical operations, finance, and marketing roles. Our vetting process is managed by recruitment specialists with deep hands-on background in the industries they serve, ensuring you receive shortlists with real technical maturity.

Key functions we source:
• Full-Stack Developers & System Architects
• DevOps & Site Reliability Engineers
• Financial Analysts & Compliance Officers
• Operations Managers & Administrative Leads`,
  },
  {
    id: "service-3",
    slug: "rpo-workforce-solutions",
    title: "RPO & Workforce Solutions",
    summary: "Embedded recruiters and end-to-end hiring operations that scale with your business.",
    icon: "briefcase",
    features: ["Scale on-demand", "Dedicated recruiter model", "ATS configuration & metrics"],
    body: `Ramping up a team shouldn't mean overwhelming your HR staff or blowing your budget. Our Recruitment Process Outsourcing (RPO) model embeds dedicated recruiters, sourcing tools, and data-backed pipelines directly into your workflow.

We manage the entire talent acquisition cycle—from initial mapping and job posting to candidate screening, scheduling, offer management, and onboarding. This embedded partnership reduces your time-to-hire, decreases cost-per-hire by up to 50%, and ensures a consistent, high-standard candidate journey under your employer brand.

What our RPO solution delivers:
• Fully embedded talent partners in your Slack/Jira
• ATS setup, optimization, and analytics dashboards
• Customized employer brand messaging and outreach
• Seamless scaling of recruitment capacity on demand`,
  },
  {
    id: "service-4",
    slug: "consulting-training",
    title: "Consulting & Professional Training",
    summary: "Workforce planning, talent mapping, business consulting, and career development programs.",
    icon: "trending-up",
    features: ["Org design consulting", "Training bootcamps", "Salary benchmarking"],
    body: `Building a resilient workforce requires continuous alignment of organization design, compensation structures, and internal skills development. Virelix offers consulting and professional training programs designed to keep your business ahead of market shifts.

We advise leadership teams on salary benchmarking, workforce planning, talent retention strategies, and organizational restructuring. Additionally, we deliver tailored bootcamps, technical reskilling initiatives, and compliance workshops to keep your teams certified and efficient in modern technologies.

Consulting practices we offer:
• Organization Design & Restructuring Consulting
• Localized Salary Benchmarking & Intelligence
• Reskilling Bootcamps in Cloud, AI, and Cybersecurity
• Team Leadership and Management Vetting Programs`,
  },
];

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
  const { slug } = useParams();
  const { data: dbData, isLoading } = useFirebaseQuery(
    `service_${slug}`,
    async (): Promise<Service | null> => {
      const { data } = await firebase
        .from("services")
        .select("id,slug,title,summary,body,icon,features,image_url")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      return (data as Service | null) ?? null;
    },
  );
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const { data: caseStudies } = useFirebaseQuery("case_studies_published", async () => {
    const { data } = await firebase.from("case_studies").select("*").eq("published", true);
    return data ?? [];
  });

  const data = dbData ?? DEFAULT_SERVICES.find((s) => s.slug === slug) ?? null;

  if (isLoading)
    return (
      <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">Loading…</div>
    );
  if (!data)
    return <div className="container mx-auto px-4 py-20 text-center">Service not found.</div>;

  const additions = SERVICE_ADDITIONS[data.slug];
  const dbCaseStudies = caseStudies ?? [];
  const mergedCaseStudies = [...dbCaseStudies];
  DEFAULT_CASE_STUDIES.forEach((item) => {
    if (!mergedCaseStudies.some((d: any) => d.slug === item.slug || d.id === item.id)) {
      mergedCaseStudies.push(item);
    }
  });
  const relatedCaseStudies = mergedCaseStudies.filter((cs: any) => {
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
          className="bg-primary hover:opacity-90 text-primary-foreground font-semibold px-4 py-2 transition text-[10px] uppercase tracking-wider inline-flex items-center gap-1.5"
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

              <div className="mb-8 flex items-center gap-3">
                <span className="h-px w-8 bg-primary" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
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
                    <div key={i} className="group relative overflow-hidden bg-card border border-border rounded-none p-6 transition-all duration-300 hover:shadow-lg hover:border-primary/30">
                      {/* Top slide-in line accent focus indicator */}
                      <div className="absolute top-0 left-0 right-0 h-[3px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 z-10" />
                      <div className="font-display text-3xl font-bold text-primary transition-colors group-hover:text-primary-glow">
                        {stat.value}
                      </div>
                      <div className="mt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground leading-tight">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {data.features && data.features.length > 0 && (
                <div className="mt-16">
                  <div className="mb-8 flex items-center gap-3">
                    <span className="h-px w-8 bg-primary" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                      What's included
                    </span>
                  </div>
                  <ul className="divide-y divide-border border-y border-border">
                    {data.features.map((f, i) => (
                      <li
                        key={i}
                        className="group flex items-start gap-6 py-5 px-4 -mx-4 border-l-2 border-transparent hover:border-primary hover:bg-surface/50 transition-all duration-200"
                      >
                        <span className="text-[10px] font-bold tabular-nums tracking-widest text-primary">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <Check className="mt-1 h-4 w-4 shrink-0 text-primary transition-transform group-hover:scale-110" />
                        <span className="flex-1 text-sm text-foreground/80 font-medium">
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
                  <div className="mb-8 flex items-center gap-3">
                    <span className="h-px w-8 bg-primary" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                      Success Stories
                    </span>
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2">
                    {relatedCaseStudies.map((cs: any) => (
                      <Link
                        key={cs.id}
                        to={`/case-studies/${cs.slug}`}
                        className="group relative flex flex-col justify-between border border-border bg-card p-6 rounded-none transition-all duration-300 hover:shadow-lg hover:border-primary/30 overflow-hidden"
                      >
                        {/* Top slide-in line accent focus indicator */}
                        <div className="absolute top-0 left-0 right-0 h-[3px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 z-10" />
                        
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider text-primary">
                            {cs.client}
                          </div>
                          <h4 className="mt-2 font-display text-lg font-bold text-foreground transition-colors group-hover:text-primary">
                            {cs.title}
                          </h4>
                          <p className="mt-3 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                            {cs.summary}
                          </p>
                        </div>
                        
                        <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-primary">
                          <span className="group-hover:underline">Read Case Study</span>
                          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1 duration-300" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* FAQs Accordion */}
              {additions?.faqs && additions.faqs.length > 0 && (
                <div className="mt-16 border-t border-border pt-12">
                  <div className="mb-8 flex items-center gap-3">
                    <span className="h-px w-8 bg-primary" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                      Frequently Asked Questions
                    </span>
                  </div>
                  <div className="divide-y divide-border border-y border-border">
                    {additions.faqs.map((faq, i) => {
                      const isOpen = openFaq === i;
                      return (
                        <div
                          key={i}
                          className="bg-transparent transition-all duration-300"
                        >
                          <button
                            onClick={() => setOpenFaq(isOpen ? null : i)}
                            className="group/faq flex w-full items-center justify-between py-5 text-left transition-colors"
                          >
                            <span className="font-display text-base font-bold text-foreground group-hover/faq:text-primary transition-colors">
                              {faq.q}
                            </span>
                            {isOpen ? (
                              <ChevronUp className="h-4 w-4 text-primary" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            )}
                          </button>
                          {isOpen && (
                            <div className="pb-6 text-sm leading-relaxed text-muted-foreground animate-fadeIn">
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

            <aside className="group/sidebar relative h-fit border border-[#0066b2] bg-[#0076CE] p-8 lg:sticky lg:top-24 transition-all duration-300 hover:shadow-lg rounded-none overflow-hidden text-white">
              {/* Top slide-in line accent focus indicator */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#FDB913] scale-x-0 group-hover/sidebar:scale-x-100 transition-transform origin-left duration-300 z-10" />
              
              <div className="mb-6 flex items-center gap-3">
                <span className="h-px w-8 bg-[#FDB913]" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#FDB913]">
                  Engage
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white">Start a conversation</h3>
              <p className="mt-4 text-sm leading-relaxed text-blue-100/90">
                Share your hiring or workforce need — a Virelix consultant will respond within one
                business day with next steps.
              </p>
              <Button
                asChild
                className="mt-6 w-full rounded-none bg-[#FDB913] hover:bg-[#E5A80F] text-black py-6 text-xs font-bold uppercase tracking-widest transition-opacity flex items-center justify-center gap-2 group/btn border-none"
              >
                <Link to="/contact">
                  Contact Virelix <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1 text-black" />
                </Link>
              </Button>
              <Link
                to="/services"
                className="mt-6 block text-center text-[10px] font-bold uppercase tracking-[0.3em] text-blue-100/70 hover:text-[#FDB913] transition-colors"
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

export default ServiceDetail;
