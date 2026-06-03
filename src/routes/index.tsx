import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Target,
  Users,
  Briefcase,
  TrendingUp,
  Search,
  Handshake,
  CheckCircle2,
  Building2,
  Stethoscope,
  Cpu,
  Banknote,
  Factory,
  ShoppingBag,
  Quote,
  Star,
  PlayCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { HomeHero, type ThemeKey } from "@/components/home-themes";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { usePageContent } from "@/hooks/use-page-content";
import { HOMEPAGE_DEFAULTS } from "@/lib/homepage-defaults";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/firebase/client";
import { DynamicSeo } from "@/components/dynamic-seo";
import { JobCard, type JobCardData } from "@/components/jobs/job-card";
import heroTeam from "@/assets/hero-team.jpg";
import heroPortrait from "@/assets/hero-portrait.jpg";
import heroHandshake from "@/assets/hero-handshake.jpg";

const heroSlides = [
  {
    eyebrow: "Global Talent & Workforce Solutions",
    location: "Delaware, USA",
    title: ["Building", "high-performing", "teams."],
    accentWord: "teams.",
    description:
      "Virelix Consulting connects high-growth organizations with exceptional talent through strategic recruitment, workforce solutions, and consulting — delivered across the USA and India.",
    ctaPrimary: { label: "Hire with Virelix", to: "/contact" },
    ctaSecondary: { label: "Explore our services", to: "/services" },
    image: heroTeam,
    badge: { value: "USA + IN", label: "Global delivery model" },
  },
  {
    eyebrow: "Executive Search & Leadership Hiring",
    location: "C-Suite • VP • Director",
    title: ["Leaders who", "move your", "business."],
    accentWord: "business.",
    description:
      "Retained executive search led by senior consultants with deep sector expertise — placing transformational leaders across technology, healthcare, and financial services.",
    ctaPrimary: { label: "Start an executive search", to: "/contact" },
    ctaSecondary: { label: "See our approach", to: "/services" },
    image: heroPortrait,
    badge: { value: "C-Suite", label: "Retained search practice" },
  },
  {
    eyebrow: "RPO & Workforce Solutions",
    location: "Scale on demand",
    title: ["Recruitment", "that scales", "with you."],
    accentWord: "with you.",
    description:
      "Embedded recruiters and end-to-end hiring operations that flex with your headcount plan — scale up, ramp down, and stay efficient through every cycle.",
    ctaPrimary: { label: "Plan your RPO", to: "/contact" },
    ctaSecondary: { label: "Explore workforce solutions", to: "/services" },
    image: heroHandshake,
    badge: { value: "10x", label: "Faster time-to-hire" },
  },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Virelix Consulting — Strategic Talent Acquisition & Workforce Solutions" },
      {
        name: "description",
        content:
          "Virelix Consulting is a Delaware-headquartered global talent acquisition, workforce solutions, training and business consulting firm with operations across the USA and India.",
      },
    ],
  }),
  component: Index,
});

const services = [
  {
    icon: Target,
    title: "Executive Search & Leadership Hiring",
    desc: "Retained search for C-suite, VP, and Director roles led by senior consultants with deep sector expertise.",
  },
  {
    icon: Cpu,
    title: "IT & Non-IT Recruitment",
    desc: "Specialist hiring across technology, engineering, finance, sales, operations, and support functions.",
  },
  {
    icon: Briefcase,
    title: "RPO & Workforce Solutions",
    desc: "Embedded recruiters and end-to-end hiring operations that scale with your business.",
  },
  {
    icon: TrendingUp,
    title: "Consulting & Professional Training",
    desc: "Workforce planning, talent mapping, business consulting, and career development programs.",
  },
];

const industries = [
  { icon: Cpu, label: "Information Technology" },
  { icon: Stethoscope, label: "Healthcare" },
  { icon: Factory, label: "Engineering & Manufacturing" },
  { icon: Banknote, label: "Finance & Accounting" },
  { icon: ShoppingBag, label: "Retail & E-Commerce" },
  { icon: Building2, label: "Professional Services" },
];

const process = [
  {
    step: "01",
    icon: Search,
    title: "Discovery & Workforce Planning",
    desc: "We align with your business objectives, workforce challenges, and long-term hiring goals.",
  },
  {
    step: "02",
    icon: Users,
    title: "Talent Mapping & Sourcing",
    desc: "Market research, targeted sourcing, screening, and shortlisting through our global network.",
  },
  {
    step: "03",
    icon: Handshake,
    title: "Interview, Offer & Onboarding",
    desc: "Coordinated interviews, offer management, and onboarding support for a smooth start.",
  },
];

const stats = [
  { value: "USA", label: "Delaware HQ" },
  { value: "2", label: "Continents — USA & India" },
  { value: "10+", label: "Industries served" },
  { value: "24/7", label: "Recruitment delivery" },
];

const testimonials = [
  {
    quote:
      "Virelix delivered a senior shortlist faster than any partner we've worked with — quality candidates, deeply aligned with our culture.",
    name: "Talent Leader",
    role: "US Technology Client",
  },
  {
    quote:
      "Their RPO team integrated with us seamlessly. We scaled hiring without adding internal overhead.",
    name: "Head of People",
    role: "Healthcare Client",
  },
  {
    quote:
      "Transparent, responsive, and outcome-driven. Virelix feels like an extension of our hiring team.",
    name: "VP Operations",
    role: "Financial Services Client",
  },
];

const clients = [
  "DELAWARE, USA",
  "GLOBAL DELIVERY",
  "USA + INDIA",
  "RPO",
  "EXECUTIVE SEARCH",
  "WORKFORCE SOLUTIONS",
];

const sectionIds = [
  "hero",
  "services",
  "industries",
  "process",
  "careers",
  "scale",
  "testimonials",
  "cta",
] as const;
const sectionLabels: Record<(typeof sectionIds)[number], string> = {
  hero: "Intro",
  services: "Services",
  industries: "Industries",
  process: "Process",
  careers: "Careers",
  scale: "Scale",
  testimonials: "Stories",
  cta: "Contact",
};

const detailedServices = [
  {
    title: "Flexible Placement & Temporary Staffing",
    subtitle: "Scale your operations dynamically while minimizing risk and administrative burden.",
    desc: "We manage your flexible staffing end to end, from sourcing and screening to onboarding, payroll, and compliance. Our flexible recruitment solutions help you scale your workforce quickly, respond to seasonal demand, and reduce risk. With access to qualified talent across industries, we ensure you have the right people in place exactly when you need them.",
    icon: Users,
    bullets: [
      "End-to-end payroll & statutory compliance in US & India",
      "Dynamic headcount scaling for peak seasonal periods",
      "Robust contractor onboarding & localized support hubs",
      "Reduced long-term employment risk and fixed overheads",
    ],
    stat: "48h",
    statLabel: "Average turnaround time for flexible placements",
  },
  {
    title: "Permanent Placement & Executive Search",
    subtitle:
      "Secure high-performing leaders and specialists aligned to your organizational culture.",
    desc: "Hiring for the long term takes more than filling a vacancy. Our permanent recruitment services combine targeted sourcing, structured assessment, and cultural fit evaluation to secure professionals who stay and perform. From specialist roles to volume hiring, we deliver permanent talent aligned to your strategy, values, and future growth plans.",
    icon: Target,
    bullets: [
      "Retained search methodology for C-Suite, VP, and Director level roles",
      "Competency-based assessment frameworks for precise candidate vetting",
      "Access to highly qualified passive candidates globally",
      "90-day placement guarantee for leadership roles",
    ],
    stat: "96%",
    statLabel: "First-year retention rate for permanent placements",
  },
  {
    title: "Embedded RPO & Workforce Outsourcing",
    subtitle: "Streamline operations with dedicated talent acquisition teams and process control.",
    desc: "Streamline operations with tailored workforce management solutions. Through RPO or integrated HR outsourcing, we manage recruitment, administration, and workforce processes for you. Our outsourcing models improve efficiency, ensure compliance, and give you greater cost control, so you can stay focused on your core business and strategic growth.",
    icon: Briefcase,
    bullets: [
      "Dedicated onsite/nearshore recruiters acting as your brand ambassadors",
      "ATS integration, recruitment branding, and pipeline analytics setup",
      "Up to 50% savings on traditional third-party agency expenditures",
      "Standardized service level agreements (SLAs) for time-to-hire",
    ],
    stat: "40%+",
    statLabel: "Average reduction in recruitment cycle times",
  },
  {
    title: "Upskilling, Training & Workforce Development",
    subtitle: "Close critical skills gaps and prepare your internal teams for future demands.",
    desc: "Workforce performance depends on continuous development. Our training and upskilling programs help close critical skills gaps, improve productivity, and prepare your teams for change. From targeted reskilling initiatives to large-scale workforce development programs, we design practical learning solutions aligned to your business objectives.",
    icon: TrendingUp,
    bullets: [
      "Targeted technical bootcamps and leadership development coaching",
      "Organization design consulting and salary benchmarking metrics",
      "Comprehensive digital transformation readiness training",
      "Strategic talent mapping aligned with technology roadmaps",
    ],
    stat: "15k+",
    statLabel: "Professionals trained and certified globally",
  },
];

function Index() {
  const { data: settings } = useSiteSettings();
  const { data: copy } = usePageContent("home", HOMEPAGE_DEFAULTS);
  const [activeService, setActiveService] = useState(0);

  const { data: dbJobs } = useQuery({
    queryKey: ["jobs", "featured-home"],
    queryFn: async () => {
      const { data } = await supabase
        .from("jobs")
        .select(
          "id,slug,title,location,work_mode,job_type,salary_min,salary_max,salary_currency,featured,created_at,companies(name,slug,logo_url,industry)",
        )
        .eq("status", "published")
        .eq("featured", true)
        .limit(3);
      return data as unknown as JobCardData[];
    },
  });

  const { data: dbTestimonials } = useQuery({
    queryKey: ["testimonials", "published"],
    queryFn: async () => {
      const { data } = await supabase
        .from("testimonials")
        .select("id, quote, author_name, author_role, company")
        .eq("published", true)
        .order("sort_order");
      return data ?? [];
    },
  });
  const liveTestimonials =
    dbTestimonials && dbTestimonials.length > 0
      ? dbTestimonials.map((t) => ({
          quote: t.quote,
          name: t.author_name,
          role: [t.author_role, t.company].filter(Boolean).join(" · "),
        }))
      : testimonials;
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string>("hero");

  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { root, threshold: [0.4, 0.6, 0.8] },
    );
    sectionIds.forEach((id) => {
      const el = root.querySelector(`#${id}`);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const root = scrollerRef.current;
    const el = root?.querySelector<HTMLElement>(`#${id}`);
    if (!root || !el) return;
    root.scrollTo({ top: el.offsetTop, behavior: "smooth" });
  };

  return (
    <div
      ref={scrollerRef}
      className="relative h-screen snap-y snap-mandatory overflow-y-scroll scroll-smooth [scroll-behavior:smooth]"
    >
      <DynamicSeo
        pageKey="home"
        fallbackTitle="Strategic Talent Acquisition & Workforce Solutions"
        fallbackDescription="Delaware-headquartered global talent acquisition and workforce solutions."
      />
      {/* Side dot nav */}
      <nav
        aria-label="Section navigation"
        className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-4 md:flex"
      >
        {sectionIds.map((id) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              aria-label={`Scroll to ${sectionLabels[id]}`}
              aria-current={isActive ? "true" : undefined}
              className="group relative flex items-center"
            >
              <span
                className={`absolute right-6 whitespace-nowrap rounded-sm bg-foreground px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-background opacity-0 transition group-hover:opacity-100 ${
                  isActive ? "opacity-100" : ""
                }`}
              >
                {sectionLabels[id]}
              </span>
              <span
                className={`block transition-all duration-300 ${
                  isActive
                    ? "h-6 w-[3px] bg-accent"
                    : "h-2.5 w-2.5 rounded-full border border-foreground/40 bg-transparent hover:bg-foreground/40"
                }`}
              />
            </button>
          );
        })}
      </nav>

      {/* ============== HERO (theme-driven) ============== */}
      <HomeHero theme={(settings?.home_theme as ThemeKey) ?? "editorial"} />

      {/* ============== SERVICES ============== */}
      <section
        id="services"
        className="container mx-auto flex min-h-screen snap-start flex-col justify-center px-4 py-20 md:py-28"
      >
        <div className="grid gap-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <div className="inline-flex items-center gap-3 border-l-2 border-primary pl-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">
              {copy.services_eyebrow}
            </div>
            <h2 className="mt-4 font-display text-4xl font-bold tracking-tight md:text-5xl">
              {copy.services_heading}{" "}
              <span className="text-primary">{copy.services_heading_accent}</span>
            </h2>
          </div>
          <div className="md:col-span-5">
            <p className="text-muted-foreground">{copy.services_intro}</p>
          </div>
        </div>

        {/* Tabbed Interactive Showcase (Adecco-style) */}
        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_2fr] items-start">
          {/* Tabs Column */}
          <div className="flex flex-col gap-2 border-l border-border">
            {detailedServices.map((ds, idx) => {
              const isActive = activeService === idx;
              return (
                <button
                  key={ds.title}
                  onClick={() => setActiveService(idx)}
                  className={`group relative text-left py-4 px-6 border-l-2 -ml-[2px] transition duration-300 ${
                    isActive
                      ? "border-primary bg-surface/50 text-foreground font-semibold"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:bg-surface/20"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-[10px] font-bold ${isActive ? "text-primary" : "text-muted-foreground/60"}`}
                    >
                      0{idx + 1}
                    </span>
                    <span className="text-sm uppercase tracking-wider">
                      {ds.title.split(" & ")[0]}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Tab Panel */}
          <div className="border border-border bg-card p-8 md:p-10 relative overflow-hidden transition-all duration-500">
            <div className="absolute right-6 top-6 opacity-[0.03] text-primary group-hover:opacity-[0.05]">
              {(() => {
                const Icon = detailedServices[activeService].icon;
                return <Icon className="h-40 w-40" />;
              })()}
            </div>

            <div className="relative">
              <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-primary">
                {(() => {
                  const Icon = detailedServices[activeService].icon;
                  return <Icon className="h-4 w-4" />;
                })()}
                Solution Overview
              </div>
              <h3 className="mt-4 font-display text-2xl font-bold md:text-3xl">
                {detailedServices[activeService].title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground italic">
                {detailedServices[activeService].subtitle}
              </p>

              <p className="mt-6 text-sm text-foreground/80 leading-relaxed max-w-2xl">
                {detailedServices[activeService].desc}
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {detailedServices[activeService].bullets.map((bullet) => (
                  <div key={bullet} className="flex gap-2.5 items-start">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                    <span className="text-xs text-muted-foreground">{bullet}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-border flex flex-wrap gap-8 items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="font-display text-3xl font-bold text-accent">
                    {detailedServices[activeService].stat}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground leading-tight max-w-[140px]">
                    {detailedServices[activeService].statLabel}
                  </div>
                </div>
                <Link
                  to="/services"
                  className="text-xs font-bold uppercase tracking-wider text-primary hover:underline inline-flex items-center gap-1.5"
                >
                  Explore solutions portfolio <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============== IMAGE + INDUSTRIES SPLIT ============== */}
      <section id="industries" className="snap-start bg-surface py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="relative lg:col-span-5">
              <div className="absolute -left-4 -top-4 h-24 w-24 border-4 border-primary" />
              <img
                src={heroHandshake}
                alt="Closing a deal"
                width={800}
                height={600}
                loading="lazy"
                className="relative aspect-[4/5] w-full object-cover shadow-xl"
              />
              <div className="absolute -bottom-6 -right-4 max-w-[220px] border-l-4 border-accent bg-background p-5 shadow-xl md:-right-8">
                <p className="font-display text-2xl font-bold">{copy.industries_badge_value}</p>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  {copy.industries_badge_label}
                </p>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-3 border-l-2 border-primary pl-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                {copy.industries_eyebrow}
              </div>
              <h2 className="mt-4 font-display text-4xl font-bold tracking-tight md:text-5xl">
                {copy.industries_heading}
              </h2>
              <p className="mt-4 text-muted-foreground">{copy.industries_intro}</p>

              <div className="mt-8 grid gap-px bg-border sm:grid-cols-2">
                {industries.map((i) => (
                  <div
                    key={i.label}
                    className="flex items-center gap-4 bg-background p-5 transition hover:bg-primary hover:text-primary-foreground"
                  >
                    <i.icon className="h-5 w-5 shrink-0 text-primary" />
                    <span className="font-semibold">{i.label}</span>
                    <ArrowRight className="ml-auto h-4 w-4 opacity-40" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============== PROCESS ============== */}
      <section id="process" className="container mx-auto snap-start px-4 py-20 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            <span className="h-px w-8 bg-primary" />
            {copy.process_eyebrow}
            <span className="h-px w-8 bg-primary" />
          </div>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight md:text-5xl">
            {copy.process_heading}{" "}
            <span className="text-primary">{copy.process_heading_accent}</span>
          </h2>
        </div>

        <div className="relative mt-16 grid gap-0 border-t border-l border-border md:grid-cols-3">
          {process.map((p) => (
            <div key={p.step} className="border-b border-r border-border bg-card p-8 md:p-10">
              <div className="flex items-baseline gap-4">
                <span className="font-display text-5xl font-bold text-primary/15">{p.step}</span>
                <p.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mt-4 font-display text-2xl font-bold">{p.title}</h3>
              <p className="mt-3 text-muted-foreground">{p.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-8 border-l-4 border-accent bg-card p-8 md:grid-cols-2 md:items-center md:p-10">
          <div>
            <h3 className="font-display text-2xl font-bold">{copy.why_heading}</h3>
            <p className="mt-2 text-muted-foreground">{copy.why_intro}</p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {copy.why_bullets.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm font-medium">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============== FEATURED JOBS SECTION (Adecco-style career board) ============== */}
      <section
        id="careers"
        className="container mx-auto flex min-h-screen snap-start flex-col justify-center px-4 py-20 md:py-28 border-t border-border"
      >
        <div className="grid gap-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <div className="inline-flex items-center gap-3 border-l-2 border-primary pl-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Careers
            </div>
            <h2 className="mt-4 font-display text-4xl font-bold tracking-tight md:text-5xl">
              Explore active <span className="text-primary">career opportunities</span>.
            </h2>
          </div>
          <div className="md:col-span-5 text-right">
            <Link
              to="/jobs"
              className="text-sm font-semibold text-primary hover:underline inline-flex items-center gap-1.5"
            >
              View all open positions <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="mt-12">
          {dbJobs && dbJobs.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {dbJobs.map((j) => (
                <JobCard key={j.id} job={j} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-card p-10 text-center text-muted-foreground">
              No active job openings listed right now. Check back soon or register with us.
            </div>
          )}
        </div>
      </section>

      {/* ============== GLOBAL PRESENCE & PHILOSOPHY (Adecco Group style) ============== */}
      <section
        id="scale"
        className="flex min-h-screen snap-start flex-col justify-center bg-foreground text-background py-20 md:py-28"
      >
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="inline-flex items-center gap-3 border-l-2 border-accent pl-3 text-xs font-bold uppercase tracking-[0.2em] text-accent">
                Our Scale
              </div>
              <h2 className="mt-4 font-display text-4xl font-bold tracking-tight md:text-5xl text-background">
                A global infrastructure with local delivery.
              </h2>
              <p className="mt-6 text-background/80 leading-relaxed text-lg">
                Virelix Consulting acts as a strategic bridge between high-demand Western markets
                and global talent hubs. Headquartered in Delaware, USA, with state-of-the-art
                delivery centers in Hyderabad, India, we provide round-the-clock sourcing,
                compliance engineering, and operations management.
              </p>

              <div className="mt-10 grid grid-cols-2 gap-8">
                <div>
                  <h4 className="font-display text-5xl font-bold text-accent">24/7</h4>
                  <p className="mt-2 text-xs uppercase tracking-wider text-background/60">
                    Continuous search operations
                  </p>
                </div>
                <div>
                  <h4 className="font-display text-5xl font-bold text-accent">100%</h4>
                  <p className="mt-2 text-xs uppercase tracking-wider text-background/60">
                    Compliance & payroll coverage
                  </p>
                </div>
                <div>
                  <h4 className="font-display text-5xl font-bold text-accent">30+</h4>
                  <p className="mt-2 text-xs uppercase tracking-wider text-background/60">
                    US States & Indian UTs served
                  </p>
                </div>
                <div>
                  <h4 className="font-display text-5xl font-bold text-accent">15k+</h4>
                  <p className="mt-2 text-xs uppercase tracking-wider text-background/60">
                    Candidates vetted annually
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6 bg-background/5 p-8 md:p-12 border border-background/10">
              <h3 className="font-display text-2xl font-bold text-background">
                A more human approach to sourcing.
              </h3>
              <p className="text-background/70 leading-relaxed">
                We believe that the best teams aren't just built on algorithms. We combine automated
                sourcing pipelines with authentic, peer-level technical assessments.
              </p>
              <div className="space-y-4 pt-4">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-accent/20 text-accent">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-background">
                      Diversity & Inclusion Sourcing
                    </h5>
                    <p className="text-sm text-background/60 mt-1">
                      We employ blind vetting and demographic-neutral pipelines to ensure equal
                      opportunity and wider access.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-accent/20 text-accent">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-background">Strict Verification</h5>
                    <p className="text-sm text-background/60 mt-1">
                      Every candidate is technical-screened and background-verified prior to client
                      presentation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============== TESTIMONIALS ============== */}
      <section id="testimonials" className="snap-start bg-surface py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-3 border-l-2 border-primary pl-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">
              {copy.testimonials_eyebrow}
            </div>
            <h2 className="mt-4 font-display text-4xl font-bold tracking-tight md:text-5xl">
              {copy.testimonials_heading}
            </h2>
          </div>

          <div className="mt-12 grid gap-0 border-t border-l border-border md:grid-cols-3">
            {liveTestimonials.map((t) => (
              <figure
                key={t.name}
                className="flex flex-col border-b border-r border-border bg-card p-8"
              >
                <Quote className="h-7 w-7 text-primary/30" />
                <div className="mt-3 flex gap-0.5 text-accent">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <blockquote className="mt-5 flex-1 text-base leading-relaxed">
                  "{t.quote}"
                </blockquote>
                <figcaption className="mt-6 border-t border-border pt-4">
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-sm text-muted-foreground">{t.role}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ============== CTA ============== */}
      <section id="cta" className="container mx-auto snap-start px-4 py-20 md:py-28">
        <div className="relative overflow-hidden bg-gradient-hero p-10 md:p-16">
          <div className="absolute -right-20 -top-20 h-72 w-72 bg-accent/15 blur-3xl" />
          <div className="absolute inset-y-0 left-0 w-2 bg-accent" />
          <div className="relative grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="font-display text-4xl font-bold tracking-tight text-gradient-hero-foreground md:text-5xl">
                {copy.cta_heading}
              </h2>
              <p className="mt-4 max-w-lg text-gradient-hero-foreground/80">
                {copy.cta_description}
              </p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <Button
                size="lg"
                variant="secondary"
                asChild
                className="rounded-none px-7 py-6 text-base font-semibold shadow-[6px_6px_0_0_hsl(var(--accent))] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_hsl(var(--accent))]"
              >
                <a href={copy.cta_primary_to}>{copy.cta_primary_label}</a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="rounded-none border-gradient-hero-foreground/30 bg-transparent px-7 py-6 text-base text-gradient-hero-foreground hover:bg-gradient-hero-foreground/10 hover:text-gradient-hero-foreground"
              >
                <a href={copy.cta_secondary_to}>{copy.cta_secondary_label}</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
