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
import { useSiteSettings, getCachedHomeTheme } from "@/hooks/use-site-settings";
import { usePageContent } from "@/hooks/use-page-content";
import { HOMEPAGE_DEFAULTS } from "@/lib/homepage-defaults";
import { useQuery } from "@tanstack/react-query";
import { firebase } from "@/integrations/firebase/client";
import { DynamicSeo } from "@/components/dynamic-seo";
import { getServiceImage } from "@/lib/service-images";
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

// Stats and clients ribbon are admin-editable via /dock/homepage
// and rendered from `copy.stats` / `copy.clients`. Do not redefine here.

const sectionIds = [
  "hero",
  "services",
  "industries",
  "process",
  "scale",
  "testimonials",
  "cta",
] as const;
const sectionLabels: Record<(typeof sectionIds)[number], string> = {
  hero: "Intro",
  services: "What We Do",
  industries: "Industries",
  process: "Process",
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

  const { data: dbTestimonials } = useQuery({
    queryKey: ["testimonials", "published"],
    queryFn: async () => {
      const { data } = await firebase
        .from("testimonials")
        .select("id, quote, author_name, author_role, company")
        .eq("published", true)
        .order("sort_order");
      return data ?? [];
    },
  });
  const liveTestimonials =
    dbTestimonials && dbTestimonials.length > 0
      ? dbTestimonials.map((t: any) => ({
          quote: t.quote,
          name: t.author_name,
          role: [t.author_role, t.company].filter(Boolean).join(" · "),
        }))
      : [];

  const { data: dbIndustries } = useQuery({
    queryKey: ["industries"],
    queryFn: async () => {
      const { data } = await firebase
        .from("industries")
        .select("*")
        .eq("published", true)
        .order("sort_order");
      return (data ?? []).filter((i: any) => i && i.slug && i.published !== false);
    },
  });

  const liveIndustries =
    dbIndustries && dbIndustries.length > 0
      ? dbIndustries.map((ind: any) => {
          let IconComponent = Building2;
          const iconName = ind.icon?.toLowerCase();
          if (iconName === "cpu") IconComponent = Cpu;
          else if (iconName === "heart" || iconName === "stethoscope") IconComponent = Stethoscope;
          else if (iconName === "factory" || iconName === "truck") IconComponent = Factory;
          else if (iconName === "wallet" || iconName === "banknote") IconComponent = Banknote;
          else if (iconName === "shopping-bag") IconComponent = ShoppingBag;

          return {
            icon: IconComponent,
            label: ind.label,
            slug: ind.slug,
            description: ind.description || "",
          };
        })
      : [
          {
            icon: Cpu,
            label: "Information Technology",
            slug: "technology-software",
            description:
              "Software engineering, cloud infrastructure, cybersecurity, and digital transformation talent.",
          },
          {
            icon: Stethoscope,
            label: "Healthcare",
            slug: "healthcare-lifesciences",
            description:
              "Clinical, pharmaceutical, biotech, and health-tech professionals across all levels.",
          },
          {
            icon: Factory,
            label: "Engineering & Manufacturing",
            slug: "logistics-supply-chain",
            description:
              "Supply chain, logistics, operations, and industrial engineering specialists.",
          },
          {
            icon: Banknote,
            label: "Finance & Accounting",
            slug: "financial-services",
            description: "Banking, fintech, accounting, and financial advisory talent.",
          },
          {
            icon: ShoppingBag,
            label: "Retail & E-Commerce",
            slug: "retail-ecommerce",
            description: "Omnichannel retail, e-commerce, and consumer goods leadership.",
          },
          {
            icon: Building2,
            label: "Professional Services",
            slug: "professional-services",
            description: "Consulting, legal, and business services professionals.",
          },
        ];

  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string>("hero");
  const [isTestimonialsPaused, setIsTestimonialsPaused] = useState(false);
  const [activeStep, setActiveStep] = useState<string | null>("01");

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
      <HomeHero
        theme={
          (settings?.home_theme as ThemeKey) ?? (getCachedHomeTheme() as ThemeKey) ?? "editorial"
        }
      />

      {/* ============== SERVICES ============== */}
      <section id="services" className="relative w-full snap-start py-20 md:py-28 overflow-hidden">
        {/* Section background image */}
        <div className="absolute inset-0 z-0 h-full w-full overflow-hidden opacity-[0.12] dark:opacity-[0.20] pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=70"
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover mix-blend-luminosity filter blur-[1px]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
        </div>
        <div className="container mx-auto flex min-h-[60vh] md:min-h-[80vh] flex-col justify-center px-4 relative z-10">
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
                    className={`group relative text-left py-3 px-4 sm:py-4 sm:px-6 border-l-2 -ml-[2px] transition duration-300 ${
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

            <div className="border border-border bg-card p-5 sm:p-8 md:p-10 relative overflow-hidden transition-all duration-500 group">
              {/* Dynamic service background watermark */}
              <div className="absolute inset-0 -z-10 transition-opacity duration-700 pointer-events-none">
                <img
                  src={(() => {
                    const slugs = ["contract-staffing", "executive-search", "rpo", "training"];
                    return getServiceImage(slugs[activeService]).src;
                  })()}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover opacity-[0.15] dark:opacity-[0.25] mix-blend-luminosity filter blur-[1px] transition-all duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-card" />
              </div>

              <div className="absolute right-6 top-6 opacity-[0.04] text-primary group-hover:opacity-[0.07] transition-opacity duration-300">
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
        </div>
      </section>

      {/* ============== INDUSTRIES — IMMERSIVE SECTOR SHOWCASE ============== */}
      <section
        id="industries"
        className="relative w-full snap-start bg-[#080a0f] text-white py-20 md:py-28 lg:py-36 overflow-hidden"
      >
        {/* Ambient glow effects */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-amber-500/[0.04] rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/[0.03] rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16 lg:mb-20">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-3 mb-5">
                <span className="h-px w-8 bg-amber-400" />
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-amber-400">
                  {copy.industries_eyebrow}
                </span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.1]">
                {copy.industries_heading}
              </h2>
              <p className="mt-4 text-sm sm:text-base text-gray-400 leading-relaxed max-w-xl">
                {copy.industries_intro}
              </p>
            </div>
            <Link
              to="/industries"
              className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-400 hover:text-amber-300 transition-colors shrink-0 self-start md:self-auto"
            >
              View all sectors
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Immersive Card Grid */}
          <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {liveIndustries.map((ind: any, index: number) => {
              const INDUSTRY_PHOTOS: Record<string, string> = {
                "technology-software": "photo-1519389950473-47ba0277781c",
                "healthcare-lifesciences": "photo-1576091160550-2173dba999ef",
                "financial-services": "photo-1559526324-4b87b5e36e44",
                "logistics-supply-chain": "photo-1586528116311-ad8dd3c8310d",
              };
              const photoId = INDUSTRY_PHOTOS[ind.slug] || "photo-1486406146926-c627a92ad1ab";
              const imgSrc = `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=900&q=70`;
              const num = String(index + 1).padStart(2, "0");

              // First card spans 2 cols on large screens for visual interest
              const isFeature = index === 0;
              const colSpan = isFeature ? "sm:col-span-2 lg:col-span-2" : "";
              const aspectClass = isFeature
                ? "aspect-[16/9] sm:aspect-[2/1] lg:aspect-[2.4/1]"
                : "aspect-[4/3] sm:aspect-[3/4] lg:aspect-[4/3]";

              return (
                <Link
                  key={ind.slug}
                  to="/industries/$slug"
                  params={{ slug: ind.slug }}
                  className={`group relative overflow-hidden rounded-xl ${aspectClass} ${colSpan} w-full cursor-pointer block`}
                >
                  {/* Full-bleed background image */}
                  <img
                    src={imgSrc}
                    alt={ind.label}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110"
                  />

                  {/* Multi-layer gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-colors duration-500 group-hover:from-black/80 group-hover:via-black/30" />

                  {/* Animated accent border on hover */}
                  <div className="absolute inset-0 rounded-xl border border-white/0 group-hover:border-amber-400/40 transition-all duration-500" />

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-6 lg:p-8 z-10">
                    {/* Index number — floats top-right */}
                    <span className="absolute top-5 right-5 sm:top-6 sm:right-6 lg:top-8 lg:right-8 font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white/[0.06] group-hover:text-amber-400/20 transition-colors duration-700 select-none leading-none">
                      {num}
                    </span>

                    {/* Title & description */}
                    <div>
                      <h3 className="font-display text-lg sm:text-xl lg:text-2xl font-bold text-white group-hover:text-amber-400 transition-colors duration-300 leading-tight">
                        {ind.label}
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm text-gray-300/80 line-clamp-2 max-w-md leading-relaxed opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out">
                        {ind.description}
                      </p>
                    </div>

                    {/* Explore link — slides in on hover */}
                    <div className="mt-4 flex items-center gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                      <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
                        Explore sector
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-amber-400 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============== PROCESS ============== */}
      <section id="process" className="relative w-full snap-start py-20 md:py-28 overflow-hidden">
        {/* Section background image */}
        <div className="absolute inset-0 z-0 h-full w-full overflow-hidden opacity-[0.35] dark:opacity-[0.45] pointer-events-none">
          <img
            src="/how-we-work-bg.jpg"
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover mix-blend-luminosity filter blur-[1px]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
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
            {process.map((p) => {
              const isOpen = activeStep === p.step;
              return (
                <div
                  key={p.step}
                  onClick={() => setActiveStep(activeStep === p.step ? null : p.step)}
                  className="border-b border-r border-border bg-card p-8 md:p-10 cursor-pointer select-none md:cursor-default"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-4">
                      <span className="font-display text-5xl font-bold text-primary/15">
                        {p.step}
                      </span>
                      <p.icon className="h-5 w-5 text-primary" />
                    </div>
                    {/* Expand icon for mobile only */}
                    <div
                      className="md:hidden text-primary transition-transform duration-300"
                      style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </div>
                  </div>
                  <h3 className="mt-4 font-display text-2xl font-bold">{p.title}</h3>
                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden md:max-h-none ${
                      isOpen
                        ? "max-h-40 mt-3 opacity-100"
                        : "max-h-0 md:max-h-none mt-0 md:mt-3 opacity-0 md:opacity-100"
                    }`}
                  >
                    <p className="text-muted-foreground">{p.desc}</p>
                  </div>
                </div>
              );
            })}
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
        </div>
      </section>

      {/* ============== GLOBAL PRESENCE & PHILOSOPHY (Adecco Group style) ============== */}
      <section
        id="scale"
        className="relative w-full snap-start bg-gradient-to-r from-[#f2f8cc] via-[#aee9bd] to-[#73aef5] py-20 md:py-28 overflow-hidden"
      >
        <div className="container mx-auto px-4 relative z-10">
          <div className="mx-auto max-w-5xl bg-white text-slate-900 p-8 md:p-12 lg:p-14 shadow-2xl rounded-2xl border border-white/50">
            <div className="grid gap-12 lg:grid-cols-12 lg:items-stretch">
              {/* Left Column - Main Intro & Stats */}
              <div className="lg:col-span-7 flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-3 border-l-2 border-cyan-500 pl-3 text-xs font-bold uppercase tracking-[0.2em] text-cyan-600">
                    Our Scale
                  </div>
                  <h2 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-950">
                    A global infrastructure with local delivery.
                  </h2>
                  <p className="mt-4 text-slate-600 leading-relaxed text-base">
                    Virelix Consulting acts as a strategic bridge between high-demand Western
                    markets and global talent hubs. Headquartered in Delaware, USA, with
                    state-of-the-art delivery centers in Hyderabad, India, we provide
                    round-the-clock sourcing, compliance engineering, and operations management.
                  </p>
                </div>

                {/* Stats Grid */}
                <div className="mt-10 grid grid-cols-2 gap-6 border-t border-slate-100 pt-8">
                  {copy.stats.map((s, i) => (
                    <div key={`${s.value}-${i}`}>
                      <h4 className="font-display text-3xl sm:text-4xl font-bold text-cyan-600">
                        {s.value}
                      </h4>
                      <p className="mt-2 text-[10px] sm:text-xs uppercase tracking-wider text-slate-500 font-semibold">
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column - Sourcing Philosophy Details */}
              <div className="lg:col-span-5 flex flex-col justify-between bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-100/80">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-display text-xl font-bold text-slate-950">
                      A more human approach to sourcing.
                    </h3>
                    <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                      We believe that the best teams aren't just built on algorithms. We combine
                      automated sourcing pipelines with authentic, peer-level technical assessments.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-100 text-cyan-700">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-slate-900 text-sm">
                          Diversity & Inclusion Sourcing
                        </h5>
                        <p className="text-xs text-slate-500 mt-0.5">
                          We employ blind vetting and demographic-neutral pipelines to ensure equal
                          opportunity and wider access.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-100 text-cyan-700">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-slate-900 text-sm">
                          Strict Verification
                        </h5>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Every candidate is technical-screened and background-verified prior to
                          client presentation.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA Button styled like the image */}
                <div className="mt-8 pt-4">
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 bg-[#00BCD4] text-white hover:bg-[#00acc1] px-6 py-3 rounded-full font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 text-sm w-full sm:w-auto justify-center group"
                  >
                    <span>Brief our team</span>
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============== TESTIMONIALS ============== */}
      <section
        id="testimonials"
        className="relative w-full snap-start bg-surface py-20 md:py-28 overflow-hidden"
      >
        {/* Section background image */}
        <div className="absolute inset-0 z-0 h-full w-full overflow-hidden opacity-[0.12] dark:opacity-[0.20] pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1920&q=70"
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover mix-blend-luminosity filter blur-[1px]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-surface via-transparent to-surface" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-3 border-l-2 border-primary pl-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">
              {copy.testimonials_eyebrow}
            </div>
            <h2 className="mt-4 font-display text-4xl font-bold tracking-tight md:text-5xl">
              {copy.testimonials_heading}
            </h2>
          </div>

          {/* Desktop Grid Layout */}
          <div className="mt-12 hidden md:grid gap-0 border-t border-l border-border md:grid-cols-3">
            {liveTestimonials.map((t: any) => (
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

          {/* Mobile Auto-Scrolling Layout */}
          <div className="mt-8 md:hidden overflow-hidden relative w-full border-y border-border py-4">
            <div
              className="animate-marquee flex gap-4"
              style={{
                animationPlayState: isTestimonialsPaused ? "paused" : "running",
              }}
              onMouseEnter={() => setIsTestimonialsPaused(true)}
              onMouseLeave={() => setIsTestimonialsPaused(false)}
              onTouchStart={() => setIsTestimonialsPaused(true)}
              onTouchEnd={() => setIsTestimonialsPaused(false)}
            >
              {[...liveTestimonials, ...liveTestimonials].map((t: any, idx: number) => (
                <figure
                  key={`${t.name}-${idx}`}
                  className="flex flex-col bg-card p-6 w-[280px] shrink-0 border border-border shadow-sm rounded-none"
                >
                  <Quote className="h-6 w-6 text-primary/30" />
                  <div className="mt-2 flex gap-0.5 text-accent">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                  <blockquote className="mt-3 flex-1 text-sm leading-relaxed line-clamp-4">
                    "{t.quote}"
                  </blockquote>
                  <figcaption className="mt-4 border-t border-border pt-3">
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============== CLIENTS / KEYWORD RIBBON ============== */}
      {copy.clients.length > 0 && (
        <section
          aria-label="Highlighted keywords"
          className="relative w-full snap-start overflow-hidden border-y border-border bg-foreground py-6 text-background"
        >
          <div className="flex overflow-hidden">
            <div className="animate-marquee flex shrink-0 items-center gap-10 whitespace-nowrap pr-10">
              {[...copy.clients, ...copy.clients].map((c, i) => (
                <span
                  key={`${c}-${i}`}
                  className="font-display text-sm font-bold uppercase tracking-[0.25em] text-background/80"
                >
                  {c}
                  <span className="ml-10 inline-block h-1 w-1 rounded-full bg-accent align-middle" />
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============== CTA ============== */}
      <section id="cta" className="relative w-full snap-start py-20 md:py-28 overflow-hidden">
        {/* Section background image */}
        <div className="absolute inset-0 z-0 h-full w-full overflow-hidden opacity-[0.10] dark:opacity-[0.18] pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1920&q=70"
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover mix-blend-luminosity filter blur-[1px]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
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
        </div>
      </section>
    </div>
  );
}
