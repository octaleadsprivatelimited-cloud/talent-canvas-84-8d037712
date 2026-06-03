import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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

function Index() {
  const [slide, setSlide] = useState(0);
  const total = heroSlides.length;
  const go = (i: number) => setSlide(((i % total) + total) % total);

  useEffect(() => {
    const id = setInterval(() => setSlide((s) => (s + 1) % total), 6500);
    return () => clearInterval(id);
  }, [total]);

  return (
    <>
      {/* ============== HERO SLIDER ============== */}
      <section className="relative overflow-hidden bg-gradient-hero">
        {/* sharp accent grid */}
        <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:64px_64px]" />
        <div className="absolute -right-32 -top-32 h-96 w-96 bg-accent/20 blur-3xl" />

        <div className="container relative mx-auto px-4 pb-0 pt-16 md:pt-24">
          {/* Slide track */}
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]"
              style={{ transform: `translateX(-${slide * 100}%)` }}
            >
              {heroSlides.map((s, idx) => (
                <div key={idx} className="w-full shrink-0">
                  <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
                    {/* LEFT: copy */}
                    <div className="lg:col-span-7">
                      <div className="inline-flex items-center gap-3 border-l-2 border-accent pl-3 text-xs font-bold uppercase tracking-[0.2em] text-accent">
                        <span>{s.eyebrow}</span>
                        <span className="h-px w-8 bg-accent/50" />
                        <span className="text-primary-foreground/60">{s.location}</span>
                      </div>

                      <h1 className="mt-6 font-display text-5xl font-bold leading-[0.95] tracking-tight text-primary-foreground md:text-7xl lg:text-[5.5rem]">
                        {s.title.map((line, i) =>
                          line === s.accentWord ? (
                            <span key={i} className="relative inline-block">
                              <span className="relative z-10 text-accent">{line}</span>
                              <span className="absolute -bottom-1 left-0 right-0 z-0 h-3 bg-accent/20" />
                            </span>
                          ) : (
                            <span key={i}>
                              {line}
                              <br />
                            </span>
                          ),
                        )}
                      </h1>

                      <p className="mt-8 max-w-xl text-lg leading-relaxed text-primary-foreground/75">
                        {s.description}
                      </p>

                      <div className="mt-10 flex flex-wrap items-center gap-4">
                        <Button
                          size="lg"
                          variant="secondary"
                          asChild
                          className="rounded-none px-7 py-6 text-base font-semibold shadow-[6px_6px_0_0_hsl(var(--accent))] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_hsl(var(--accent))]"
                        >
                          <Link to={s.ctaPrimary.to}>
                            {s.ctaPrimary.label} <ArrowUpRight className="ml-1 h-5 w-5" />
                          </Link>
                        </Button>
                        <Link
                          to={s.ctaSecondary.to}
                          className="group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary-foreground"
                        >
                          <PlayCircle className="h-5 w-5 text-accent" />
                          <span className="border-b border-transparent pb-0.5 transition group-hover:border-accent">
                            {s.ctaSecondary.label}
                          </span>
                        </Link>
                      </div>
                    </div>

                    {/* RIGHT: image */}
                    <div className="lg:col-span-5">
                      <div className="relative aspect-[4/5] w-full">
                        <div className="absolute -left-4 -top-4 h-32 w-32 bg-accent md:-left-6 md:-top-6 md:h-40 md:w-40" />
                        <div className="absolute -bottom-4 -right-4 h-24 w-24 border-4 border-accent md:-bottom-6 md:-right-6 md:h-32 md:w-32" />
                        <img
                          src={s.image}
                          alt={s.eyebrow}
                          width={1280}
                          height={1600}
                          className="relative h-full w-full object-cover shadow-2xl"
                        />
                        <div className="absolute -right-4 top-8 hidden border-l-4 border-accent bg-background px-5 py-4 shadow-xl sm:block md:-right-8">
                          <p className="font-display text-3xl font-bold text-foreground">
                            {s.badge.value}
                          </p>
                          <p className="text-xs uppercase tracking-wider text-muted-foreground">
                            {s.badge.label}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Slider controls */}
          <div className="mt-12 flex items-center justify-between gap-6 border-t border-primary-foreground/10 pt-6">
            <div className="flex items-center gap-3">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => go(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-[3px] transition-all ${
                    i === slide ? "w-12 bg-accent" : "w-6 bg-primary-foreground/30 hover:bg-primary-foreground/60"
                  }`}
                />
              ))}
              <span className="ml-3 font-display text-xs font-bold tracking-[0.2em] text-primary-foreground/60">
                {String(slide + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => go(slide - 1)}
                aria-label="Previous slide"
                className="flex h-12 w-12 items-center justify-center border border-primary-foreground/20 text-primary-foreground transition hover:border-accent hover:bg-accent hover:text-accent-foreground"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => go(slide + 1)}
                aria-label="Next slide"
                className="flex h-12 w-12 items-center justify-center border border-primary-foreground/20 text-primary-foreground transition hover:border-accent hover:bg-accent hover:text-accent-foreground"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Stat strip — sharp bar */}
          <div className="relative mt-12 grid grid-cols-2 divide-y divide-primary-foreground/10 border-y-2 border-accent/40 md:mt-16 md:grid-cols-4 md:divide-x md:divide-y-0">
            {stats.map((s) => (
              <div key={s.label} className="px-6 py-6 md:px-8 md:py-8">
                <p className="font-display text-4xl font-bold text-primary-foreground md:text-5xl">
                  {s.value}
                </p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-primary-foreground/60">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Client marquee */}
        <div className="mt-0 border-t border-primary-foreground/10 bg-primary-foreground/[0.04] py-5">
          <div className="container mx-auto flex flex-wrap items-center justify-center gap-x-12 gap-y-3 px-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary-foreground/40">
              Trusted by
            </span>
            {clients.map((c) => (
              <span
                key={c}
                className="font-display text-xs font-bold tracking-[0.18em] text-primary-foreground/55"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>


      {/* ============== SERVICES ============== */}
      <section className="container mx-auto px-4 py-20 md:py-28">
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
      <section className="bg-surface py-20 md:py-28">
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
      <section className="container mx-auto px-4 py-20 md:py-28">
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
      <section className="bg-surface py-20 md:py-28">
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
      <section className="container mx-auto px-4 py-20 md:py-28">
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
    </>
  );
}
