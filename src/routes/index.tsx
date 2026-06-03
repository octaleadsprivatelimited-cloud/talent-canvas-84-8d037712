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

const sectionIds = ["hero", "services", "industries", "process", "testimonials", "cta"] as const;
const sectionLabels: Record<(typeof sectionIds)[number], string> = {
  hero: "Intro",
  services: "Services",
  industries: "Industries",
  process: "Process",
  testimonials: "Stories",
  cta: "Contact",
};

function Index() {
  const { data: settings } = useSiteSettings();
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
      <section id="services" className="container mx-auto snap-start px-4 py-20 md:py-28">
        <div className="grid gap-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <div className="inline-flex items-center gap-3 border-l-2 border-primary pl-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">
              What we do
            </div>
            <h2 className="mt-4 font-display text-4xl font-bold tracking-tight md:text-5xl">
              Services built around how you{" "}
              <span className="text-primary">actually hire.</span>
            </h2>
          </div>
          <div className="md:col-span-5">
            <p className="text-muted-foreground">
              Whether you're filling one critical seat or scaling by 10x, we plug in the right
              model for the moment — and stand behind the work.
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-0 border-t border-l border-border md:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => (
            <div
              key={s.title}
              className="group relative border-b border-r border-border bg-card p-8 transition hover:bg-primary hover:text-primary-foreground"
            >
              <span className="font-display text-xs font-bold tracking-wider text-muted-foreground group-hover:text-primary-foreground/60">
                0{i + 1}
              </span>
              <div className="mt-6 flex h-12 w-12 items-center justify-center bg-primary/10 text-primary group-hover:bg-primary-foreground/10 group-hover:text-accent">
                <s.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-6 font-display text-xl font-bold">{s.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground group-hover:text-primary-foreground/80">
                {s.desc}
              </p>
              <ArrowUpRight className="absolute right-6 top-6 h-5 w-5 -translate-y-1 translate-x-1 opacity-0 transition group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" />
            </div>
          ))}
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
                <p className="font-display text-2xl font-bold">USA + India</p>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  Global delivery across two continents
                </p>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-3 border-l-2 border-primary pl-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                Industries
              </div>
              <h2 className="mt-4 font-display text-4xl font-bold tracking-tight md:text-5xl">
                Deep specialization in the sectors shaping the next decade.
              </h2>
              <p className="mt-4 text-muted-foreground">
                Our consultants come from the industries they recruit for — that means real
                conversations with candidates and shortlists that land.
              </p>

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
            How we work
            <span className="h-px w-8 bg-primary" />
          </div>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight md:text-5xl">
            A search process measured in <span className="text-primary">weeks, not quarters.</span>
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
            <h3 className="font-display text-2xl font-bold">Why organizations choose Virelix</h3>
            <p className="mt-2 text-muted-foreground">
              A Delaware-headquartered partner with global delivery — combining quality,
              speed, and cost efficiency across every engagement.
            </p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {[
              "USA headquartered",
              "Global talent network",
              "Industry-specific expertise",
              "Dedicated recruitment specialists",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm font-medium">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============== TESTIMONIALS ============== */}
      <section id="testimonials" className="snap-start bg-surface py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-3 border-l-2 border-primary pl-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Client stories
            </div>
            <h2 className="mt-4 font-display text-4xl font-bold tracking-tight md:text-5xl">
              What it's like to work with us.
            </h2>
          </div>

          <div className="mt-12 grid gap-0 border-t border-l border-border md:grid-cols-3">
            {testimonials.map((t) => (
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
              <h2 className="font-display text-4xl font-bold tracking-tight text-primary-foreground md:text-5xl">
                Let's build your next high-performing team.
              </h2>
              <p className="mt-4 max-w-lg text-primary-foreground/80">
                Share your hiring or workforce need — a Virelix consultant will respond within
                one business day with a tailored plan.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <Button
                size="lg"
                variant="secondary"
                asChild
                className="rounded-none px-7 py-6 text-base font-semibold shadow-[6px_6px_0_0_hsl(var(--accent))] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_hsl(var(--accent))]"
              >
                <Link to="/contact">Contact Virelix</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="rounded-none border-primary-foreground/30 bg-transparent px-7 py-6 text-base text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                <Link to="/services">Our services</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
