import { Link } from "react-router-dom";
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
  Play,
  ChevronLeft,
  ChevronRight,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { HomeHero, type ThemeKey } from "@/components/home-themes";
import { useSiteSettings, getCachedHomeTheme } from "@/hooks/use-site-settings";
import { usePageContent } from "@/hooks/use-page-content";
import { HOMEPAGE_DEFAULTS } from "@/lib/homepage-defaults";
import { useFirebaseQuery } from "@/hooks/use-firebase-query";
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

const staticTestimonials = [
  {
    name: "Sarah Jenkins",
    role: "VP of People · TechSphere",
    quote: "Virelix Consulting transformed our engineering recruitment. We filled three VP roles in less than a month with exceptional cultural alignment.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
    cover: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&h=350&q=80",
    rating: 5,
  },
  {
    name: "David Chen",
    role: "CEO · Delaware Supply Chain",
    quote: "Their US-India continuous delivery loop is a game-changer. We received qualified shortlists overnight and scaled our operations team in record time.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
    cover: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&h=350&q=80",
    rating: 5,
  },
  {
    name: "Elena Rostova",
    role: "VP of Operations · MedLink",
    quote: "Compliance and background verification in healthcare hiring are strict. Virelix ensured 100% GCP and HIPAA compliance for all contractor placements.",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80",
    cover: "https://images.unsplash.com/photo-1580894732444-8fecef2271ff?auto=format&fit=crop&w=600&h=350&q=80",
    rating: 5,
  },
  {
    name: "Marcus Vance",
    role: "CTO · Nexus Labs",
    quote: "Nexus Labs needed to scale full-stack and cloud security engineering for our Series A. Virelix mapped candidate networks and delivered prime fits.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
    cover: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&h=350&q=80",
    rating: 5,
  },
  {
    name: "Liam O'Connor",
    role: "Director of Engineering · QuantumSaaS",
    quote: "The RPO model from Virelix functions like our own internal HR team. It lowered our average cost-per-hire by over 45% while building a quality pipeline.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80",
    cover: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&h=350&q=80",
    rating: 5,
  },
];

function Index() {
  const { data: settings } = useSiteSettings();
  const { data: copy } = usePageContent("home", HOMEPAGE_DEFAULTS);
  const [activeService, setActiveService] = useState(0);

  const { data: dbTestimonials } = useFirebaseQuery("testimonials_published", async () => {
    const { data } = await firebase
      .from("testimonials")
      .select("id, quote, author_name, author_role, company")
      .eq("published", true)
      .order("sort_order");
    return data ?? [];
  });
  
  const filteredDbTestimonials = (dbTestimonials || []).filter((t: any) => {
    if (!t.author_name || t.author_name.toLowerCase() === "test") return false;
    if (!t.quote || t.quote.toLowerCase() === "test") return false;
    return true;
  });

  const liveTestimonials = [
    ...filteredDbTestimonials.map((t: any, idx: number) => {
      const fallback = staticTestimonials[idx % staticTestimonials.length];
      return {
        quote: t.quote || fallback.quote,
        name: t.author_name || fallback.name,
        role: [t.author_role, t.company].filter(Boolean).join(" · ") || fallback.role,
        avatar: fallback.avatar,
        cover: fallback.cover,
        rating: 5,
      };
    }),
    ...staticTestimonials
  ].filter((t, index, self) => 
    self.findIndex((item) => item.name === t.name) === index
  );

  const [testiIndex, setTestiIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerView(3);
      } else if (window.innerWidth >= 768) {
        setItemsPerView(2);
      } else {
        setItemsPerView(1);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (liveTestimonials.length === 0) return;
    const timer = setInterval(() => {
      setTestiIndex((prev) => {
        const maxIndex = liveTestimonials.length - itemsPerView;
        if (maxIndex <= 0) return 0;
        return prev >= maxIndex ? 0 : prev + 1;
      });
    }, 4000);
    return () => clearInterval(timer);
  }, [liveTestimonials.length, itemsPerView]);


  const { data: dbIndustries } = useFirebaseQuery("industries", async () => {
    const { data } = await firebase
      .from("industries")
      .select("*")
      .eq("published", true)
      .order("sort_order");
    return (data ?? []).filter((i: any) => i && i.slug && i.published !== false);
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
      { root: null, rootMargin: "-20% 0px -40% 0px", threshold: [0, 0.1, 0.2] },
    );
    sectionIds.forEach((id) => {
      const el = root.querySelector(`#${id}`);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div ref={scrollerRef} className="relative min-h-screen bg-background">
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
                className={`absolute right-6 whitespace-nowrap rounded-sm bg-foreground px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-background opacity-0 transition group-hover:opacity-100 ${isActive ? "opacity-100" : ""
                  }`}
              >
                {sectionLabels[id]}
              </span>
              <span
                className={`block transition-all duration-300 ${isActive
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
      <section id="services" className="relative w-full py-20 md:py-28 overflow-hidden">
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
              <h2 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.2]">
                <span className="block md:inline font-semibold">
                  {copy.services_heading}{" "}
                </span>
                <span className="relative inline-block mt-1 md:mt-0">
                  <span className="relative z-10 bg-gradient-to-r from-[#0076CE] via-blue-600 to-indigo-600 dark:from-[#38bdf8] dark:to-indigo-400 bg-clip-text text-transparent font-extrabold">
                    {copy.services_heading_accent}
                  </span>
                  <span className="absolute left-0 bottom-1.5 w-full h-[6px] bg-[#FDB913]/90 rounded-sm z-0" />
                </span>
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
                    className={`group relative text-left py-3 px-4 sm:py-4 sm:px-6 border-l-2 -ml-[2px] transition duration-300 ${isActive
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
                    className="text-xs font-bold uppercase tracking-wider text-[#FDB913] hover:text-[#E5A80F] hover:underline inline-flex items-center gap-1.5 transition-colors duration-200"
                  >
                    Explore solutions portfolio <ArrowUpRight className="h-4 w-4 text-[#FDB913]" />
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
        className="relative w-full bg-surface text-foreground py-20 md:py-28 lg:py-36 overflow-hidden"
      >
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16 lg:mb-20">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-3 mb-5">
                <span className="h-px w-8 bg-primary" />
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-primary">
                  {copy.industries_eyebrow}
                </span>
              </div>
              <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-[1.8] sm:leading-[1.9] lg:leading-[2.0]">
                <span className="inline-block whitespace-nowrap bg-[#bae6fd] text-black px-1.5 py-0 rounded shadow-sm">
                  Deep specialization
                </span>{" "}
                <span className="inline sm:whitespace-nowrap">in the sectors</span>
                <br />
                shaping the{" "}
                <span className="inline-block whitespace-nowrap bg-[#bae6fd] text-black px-1.5 py-0 rounded shadow-sm">
                  next decade.
                </span>
              </h2>
              <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl">
                {copy.industries_intro}
              </p>
            </div>
            <Link
              to="/industries"
              className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary hover:opacity-85 transition-opacity shrink-0 self-start md:self-auto"
            >
              View all sectors
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Microsoft-Style Card Grid */}
          <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {liveIndustries.slice(0, 5).map((ind: any, index: number) => {
              const INDUSTRY_PHOTOS: Record<string, string> = {
                "technology-software": "photo-1519389950473-47ba0277781c",
                "healthcare-lifesciences": "photo-1576091160550-2173dba999ef",
                "financial-services": "photo-1559526324-4b87b5e36e44",
                "logistics-supply-chain": "photo-1586528116311-ad8dd3c8310d",
              };
              const photoId = INDUSTRY_PHOTOS[ind.slug] || "photo-1486406146926-c627a92ad1ab";
              const imgSrc = `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=900&q=70`;

              const IconComponent = ind.icon || Building2;

              return (
                <Link
                  key={ind.slug}
                  to={`/industries/${ind.slug}`}
                  className="group relative flex flex-col justify-between bg-card border border-border rounded-none overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/30 w-full cursor-pointer"
                >
                  {/* Top slide-in line accent focus indicator */}
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 z-10" />

                  <div>
                    {/* Top cover image */}
                    <div className="aspect-[16/9] w-full overflow-hidden bg-muted">
                      <img
                        src={imgSrc}
                        alt={ind.label}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-101"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-6 md:p-8 flex flex-col">
                      <div className="flex items-center gap-2 mb-3">
                        <IconComponent className="h-4 w-4 text-primary shrink-0" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
                          Industry Sector
                        </span>
                      </div>

                      <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary leading-tight">
                        {ind.label}
                      </h3>

                      <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-3">
                        {ind.description}
                      </p>
                    </div>
                  </div>

                  {/* bottom link aligned with chevron */}
                  <div className="px-6 pb-6 md:px-8 md:pb-8 pt-0">
                    <div className="inline-flex w-full items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-transparent border border-[#0076CE]/30 group-hover:border-[#0076CE] group-hover:bg-[#0076CE]/5 text-[#0076CE] py-3 px-4 rounded-lg transition-all duration-300">
                      Explore sector
                      <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 duration-300" />
                    </div>
                  </div>
                </Link>
              );
            })}

            {/* 6th Card - Contact Us (hidden on mobile, visible on tablet and desktop) */}
            <div className="hidden md:flex flex-col justify-between bg-[#0076CE] text-white border border-[#0066b2] rounded-none overflow-hidden transition-all duration-300 hover:shadow-lg w-full p-8 relative min-h-[350px] group/contact">
              {/* Top slide-in line accent focus indicator */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#FDB913] scale-x-0 group-hover/contact:scale-x-100 transition-transform origin-left duration-300 z-10" />
              
              <div className="flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Mail className="h-4 w-4 text-[#FDB913] shrink-0 animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-100/90">
                      Partner With Us
                    </span>
                  </div>

                  <h3 className="font-display text-2xl font-bold tracking-tight text-white leading-tight">
                    Need specialized talent for your sector?
                  </h3>

                  <p className="mt-4 text-sm text-blue-100/95 leading-relaxed">
                    Virelix coordinates customized global sourcing pipelines for enterprises and high-growth firms. Contact us today to brief our industry specialists.
                  </p>
                </div>

                <div className="mt-8">
                  <Link
                    to="/contact"
                    className="inline-flex w-full items-center justify-center gap-2 bg-[#FDB913] hover:bg-[#E5A80F] text-black font-bold uppercase tracking-wider py-3.5 px-4 transition-all duration-200 text-xs shadow-sm rounded-none border-none group-hover/contact:scale-[1.01]"
                  >
                    Contact Us <ArrowRight className="h-4 w-4 text-black" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============== PROCESS ============== */}
      <section id="process" className="relative w-full py-20 md:py-28 bg-background border-t border-border">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto mb-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary block mb-3">
                  {copy.process_eyebrow || "Our Methodology"}
                </span>
                <h2 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-relaxed">
                  {copy.process_heading || "How We"}{" "}
                  <span className="inline-block bg-[#FDB913] text-black px-3.5 py-1.5 rounded-lg font-bold shadow-sm border-none">
                    {copy.process_heading_accent || "Work"}
                  </span>
                </h2>
              </div>
              <p className="text-muted-foreground max-w-md text-sm md:text-base leading-relaxed">
                We combine industry-leading search methodology with deep technical screening to deliver top talent at scale.
              </p>
            </div>
          </div>

          <div className="max-w-6xl mx-auto grid gap-8 lg:grid-cols-3 items-stretch">
            {/* Column 1 (Left / Step 1) - Tall vertical cover card */}
            <div className="group relative flex flex-col justify-end overflow-hidden rounded-2xl bg-card border border-border min-h-[480px] lg:min-h-full aspect-[3/4] lg:aspect-auto transition-all duration-500 hover:shadow-xl hover:border-primary/20 cursor-pointer">
              {/* Full-bleed background image */}
              <img
                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80"
                alt={process[0]?.title || "Discovery"}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[800ms] ease-out group-hover:scale-105"
              />
              {/* Dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent transition-colors duration-500 group-hover:from-black/100 group-hover:via-black/50" />
              


              {/* Content overlayed at bottom */}
              <div className="relative p-8 z-10">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/70 block mb-2">
                  Step {process[0]?.step || "01"} / Discovery
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight transition-colors duration-300">
                  {process[0]?.title || "Discovery & Workforce Planning"}
                </h3>
                <p className="mt-3 text-sm text-white/80 leading-relaxed line-clamp-3">
                  {process[0]?.desc || "We align with your business objectives, workforce challenges, and long-term hiring goals."}
                </p>
              </div>
            </div>

            {/* Column 2 (Middle / Step 2) - Top-text, bottom-image card in Dell blue background */}
            <div className="group flex flex-col justify-between overflow-hidden rounded-2xl bg-[#0076CE] border border-[#0066b2] p-8 transition-all duration-500 hover:shadow-xl hover:border-[#005290] cursor-pointer">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-100 block mb-2">
                  Step {process[1]?.step || "02"} / Strategy
                </span>
                <h3 className="font-serif text-2xl font-bold tracking-tight text-white transition-colors duration-300">
                  {process[1]?.title || "Talent Sourcing & Mapping"}
                </h3>
                <p className="mt-3 text-sm text-blue-50/90 leading-relaxed">
                  {process[1]?.desc || "Market research, targeted sourcing, screening, and shortlisting through our global network."}
                </p>
              </div>
              <div className="mt-8 overflow-hidden rounded-xl aspect-[16/10] bg-blue-900/40 border border-white/10">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
                  alt={process[1]?.title || "Sourcing"}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-103"
                />
              </div>
            </div>

            {/* Column 3 (Right / Step 3) - Top-text, bottom-image card with play overlay */}
            <div className="group flex flex-col justify-between overflow-hidden rounded-2xl bg-card border border-border p-8 transition-all duration-500 hover:shadow-xl hover:border-primary/20 cursor-pointer">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary block mb-2">
                  Step {process[2]?.step || "03"} / Execution
                </span>
                <h3 className="font-serif text-2xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors duration-300">
                  {process[2]?.title || "Interview, Offer & Onboarding"}
                </h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  {process[2]?.desc || "Coordinated interviews, offer management, and onboarding support for a smooth start."}
                </p>
              </div>
              <div className="relative mt-8 overflow-hidden rounded-xl aspect-[16/10] bg-muted border border-border">
                <img
                  src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80"
                  alt={process[2]?.title || "Onboarding"}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-103"
                />

            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-8 border-l-4 border-accent bg-card p-8 md:grid-cols-2 md:items-center md:p-10">
            <div>
              <h3 className="font-display text-2xl font-bold">
                <span className="bg-red-600 text-white px-3 py-1 rounded-md inline-block">
                  {copy.why_heading}
                </span>
              </h3>
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

      {/* ============== GLOBAL PRESENCE & PHILOSOPHY (Virelix/Who We Are style) ============== */}
      <section
        id="scale"
        className="relative w-full bg-[#f9f8f6] dark:bg-slate-900 py-20 md:py-28 overflow-hidden border-y border-slate-200/60 dark:border-slate-800"
      >
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="mx-auto bg-white dark:bg-slate-950 text-foreground p-8 md:p-12 lg:p-14 shadow-md rounded-none border border-slate-200/60 dark:border-slate-800">
            <div className="grid gap-12 lg:grid-cols-12 lg:items-stretch">
              {/* Left Column - Main Intro & Stats */}
              <div className="lg:col-span-7 flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-3 border-l-2 border-[#0076CE] pl-3 text-xs font-bold uppercase tracking-[0.2em] text-[#0076CE] dark:text-[#38bdf8]">
                    Our Scale
                  </div>
                  <h2 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-950 dark:text-white leading-[1.25]">
                    A global infrastructure with local delivery.
                  </h2>
                  <p className="mt-4 text-slate-600 dark:text-slate-300 leading-relaxed text-base">
                    Virelix Consulting acts as a strategic bridge between high-demand Western
                    markets and global talent hubs. Headquartered in Delaware, USA, with
                    state-of-the-art delivery centers in Hyderabad, India, we provide
                    round-the-clock sourcing, compliance engineering, and operations management.
                  </p>
                </div>

                {/* Stats Grid */}
                <div className="mt-10 grid grid-cols-2 gap-6 border-t border-slate-100 dark:border-slate-800/80 pt-8">
                  {copy.stats.map((s, i) => (
                    <div key={`${s.value}-${i}`}>
                      <h4 className="font-display text-3xl sm:text-4xl font-extrabold text-[#0076CE] dark:text-[#38bdf8]">
                        {s.value}
                      </h4>
                      <p className="mt-2 text-[10px] sm:text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column - Sourcing Philosophy Details */}
              <div className="lg:col-span-5 flex flex-col justify-between bg-black p-6 md:p-8 rounded-none border border-neutral-900">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-display text-xl font-bold text-white">
                      A more human approach to sourcing.
                    </h3>
                    <p className="text-neutral-300 text-sm mt-2 leading-relaxed">
                      We believe that the best teams aren't just built on algorithms. We combine
                      automated sourcing pipelines with authentic, peer-level technical assessments.
                    </p>
                  </div>

                  <div className="space-y-4 font-sans">
                    <div className="flex gap-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-[#0076CE] dark:text-[#38bdf8]">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-white text-sm">
                          Diversity & Inclusion Sourcing
                        </h5>
                        <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed">
                          We employ blind vetting and demographic-neutral pipelines to ensure equal
                          opportunity and wider access.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-[#0076CE] dark:text-[#38bdf8]">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-white text-sm">
                          Strict Verification
                        </h5>
                        <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed">
                          Every candidate is technically screened and background-verified prior to
                          client presentation.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA Button styled in yellow like Virelix standard */}
                <div className="mt-8 pt-4">
                  <Link
                    to="/contact"
                    className="inline-flex w-full items-center justify-center gap-2 bg-[#FDB913] hover:bg-[#E5A80F] text-black font-bold uppercase tracking-wider py-3.5 px-6 rounded-none shadow-sm transition-all duration-200 text-xs group border-none"
                  >
                    <span>Brief our team</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 text-black" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============== TESTIMONIALS (Overlapping Who We Are style) ============== */}
      <section
        id="testimonials"
        className="relative w-full bg-[#f9f8f6] dark:bg-slate-900/60 py-24 overflow-hidden border-b border-slate-200/60 dark:border-slate-800"
      >
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          {/* Header row offset to the right */}
          <div className="flex justify-end mb-12">
            <div className="w-full lg:w-2/3 text-left">
              <span className="text-[#0076CE] dark:text-[#38bdf8] text-xs font-bold uppercase tracking-[0.2em]">
                {copy.testimonials_eyebrow}
              </span>
              <h2 className="font-serif text-3xl md:text-5xl text-[#2b2b2b] dark:text-white tracking-tight mt-2 leading-tight">
                {copy.testimonials_heading}
              </h2>
            </div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Tall Portrait Image on Left */}
              <div className="lg:col-span-4 rounded-lg overflow-hidden shadow-lg h-[520px] hidden lg:block border border-slate-100 dark:border-slate-800">
                <img 
                  src="https://images.unsplash.com/photo-1573497161161-c3e73707e25c?auto=format&fit=crop&w=600&h=900&q=80" 
                  alt="Client success and partnership" 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Slider for Testimonials */}
              <div className="lg:col-span-8 lg:-ml-24 lg:mt-16 z-10 w-full overflow-hidden">
                <div className="relative w-full">
                  <div 
                    className="flex transition-transform duration-700 ease-in-out"
                    style={{ 
                      transform: `translateX(-${testiIndex * (100 / itemsPerView)}%)` 
                    }}
                  >
                    {liveTestimonials.map((t: any, idx: number) => (
                      <div 
                        key={idx} 
                        className="w-full md:w-1/2 lg:w-1/3 shrink-0 px-3"
                      >
                        <figure className="bg-white dark:bg-slate-950 p-0 rounded-lg shadow-md border border-slate-100 dark:border-slate-800/80 flex flex-col justify-between min-h-[360px] sm:min-h-[380px] hover:translate-y-[-4px] transition duration-300 overflow-hidden">
                          {/* Cover Photo - hidden on mobile to be compact */}
                          <div className="hidden sm:block aspect-[16/10] w-full overflow-hidden bg-slate-100">
                            <img 
                              src={t.cover} 
                              alt={t.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-4 sm:p-6 flex flex-col justify-between flex-grow">
                            <div className="space-y-3">
                              <div className="flex gap-0.5 text-[#FDB913]">
                                {Array.from({ length: t.rating || 5 }).map((_, i) => (
                                  <Star key={i} className="h-3.5 w-3.5 fill-current" />
                                ))}
                              </div>
                              <blockquote className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-light italic">
                                "{t.quote}"
                              </blockquote>
                            </div>
                            <figcaption className="mt-4 border-t border-slate-100 dark:border-slate-800/80 pt-3">
                              <div className="flex items-center gap-3">
                                <img 
                                  src={t.avatar} 
                                  className="h-8 w-8 rounded-full object-cover shrink-0" 
                                  alt={t.name} 
                                />
                                <div className="min-w-0">
                                  <p className="font-semibold text-xs text-slate-900 dark:text-white truncate">{t.name}</p>
                                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{t.role}</p>
                                </div>
                              </div>
                            </figcaption>
                          </div>
                        </figure>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dot Pagination */}
                {liveTestimonials.length > itemsPerView && (
                  <div className="flex justify-center gap-2 mt-8">
                    {Array.from({ length: liveTestimonials.length - itemsPerView + 1 }).map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setTestiIndex(idx)}
                        className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                          testiIndex === idx 
                            ? "w-6 bg-[#0076CE]" 
                            : "w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400"
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============== CLIENTS / KEYWORD RIBBON ============== */}
      {copy.clients.length > 0 && (
        <section
          aria-label="Highlighted keywords"
          className="relative w-full overflow-hidden border-y border-border bg-foreground py-6 text-background"
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
      <section id="cta" className="relative w-full py-20 md:py-28 bg-background border-t border-border">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto relative overflow-hidden bg-[#f8fafc] border border-border border-l-4 border-l-[#0672cb] rounded-none p-10 md:p-16 shadow-md dark:bg-slate-900/40">
            <div className="relative grid gap-8 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-8">
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#0672cb] block mb-3 font-sans">
                  Collaboration
                </span>
                <h2 className="font-sans text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                  {copy.cta_heading}
                </h2>
                <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl font-sans">
                  {copy.cta_description}
                </p>
              </div>
              <div className="lg:col-span-4 flex flex-wrap gap-3 lg:justify-end shrink-0 w-full">
                <Button
                  size="lg"
                  asChild
                  className="rounded-none px-7 py-6 text-base font-semibold transition-colors duration-200 bg-[#0672cb] text-white hover:bg-[#005a9c] w-full sm:w-auto text-center border border-[#0672cb] shadow-none"
                >
                  <a href={copy.cta_primary_to} className="justify-center font-sans">{copy.cta_primary_label}</a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="rounded-none px-7 py-6 text-base font-semibold transition-colors duration-200 border-[#0672cb] text-[#0672cb] hover:bg-slate-100 dark:hover:bg-slate-800 w-full sm:w-auto text-center bg-transparent shadow-none"
                >
                  <a href={copy.cta_secondary_to} className="justify-center font-sans">{copy.cta_secondary_label}</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Index;
