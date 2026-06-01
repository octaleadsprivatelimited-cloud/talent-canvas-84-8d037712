import { createFileRoute, Link } from "@tanstack/react-router";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import heroTeam from "@/assets/hero-team.jpg";
import heroPortrait from "@/assets/hero-portrait.jpg";
import heroHandshake from "@/assets/hero-handshake.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hireloop — Executive Search & Talent Solutions" },
      {
        name: "description",
        content:
          "Hireloop is a global recruiting agency placing exceptional talent with ambitious companies. Executive search, contract staffing, and RPO.",
      },
    ],
  }),
  component: Index,
});

const services = [
  {
    icon: Target,
    title: "Executive Search",
    desc: "Retained search for C-suite, VP, and Director roles across high-growth industries.",
  },
  {
    icon: Users,
    title: "Contract Staffing",
    desc: "Vetted contractors and interim leaders deployed in days, not months.",
  },
  {
    icon: Briefcase,
    title: "RPO & Embedded Teams",
    desc: "We embed senior recruiters inside your team to scale hiring without the overhead.",
  },
  {
    icon: TrendingUp,
    title: "Talent Advisory",
    desc: "Compensation benchmarking, org design, and talent strategy from people who've done it.",
  },
];

const industries = [
  { icon: Cpu, label: "Technology & SaaS" },
  { icon: Banknote, label: "Financial Services" },
  { icon: Stethoscope, label: "Healthcare & Life Sciences" },
  { icon: Factory, label: "Industrial & Energy" },
  { icon: ShoppingBag, label: "Consumer & Retail" },
  { icon: Building2, label: "Professional Services" },
];

const process = [
  {
    step: "01",
    icon: Search,
    title: "Discover",
    desc: "We dig into your business, culture, and the real shape of the role — beyond the JD.",
  },
  {
    step: "02",
    icon: Users,
    title: "Source & Assess",
    desc: "A dedicated partner runs a calibrated search and presents a shortlist of 4–6 in 14 days.",
  },
  {
    step: "03",
    icon: Handshake,
    title: "Close & Onboard",
    desc: "We manage offers, references, and the first 90 days — with a placement guarantee.",
  },
];

const stats = [
  { value: "1,800+", label: "Placements made" },
  { value: "94%", label: "Offer acceptance" },
  { value: "21d", label: "Avg. shortlist" },
  { value: "65", label: "Countries" },
];

const testimonials = [
  {
    quote:
      "Hireloop placed our VP of Engineering in under five weeks. The shortlist quality was the best I've seen in 15 years of hiring.",
    name: "Maya Chen",
    role: "Chief People Officer, Nimbus Labs",
  },
  {
    quote:
      "They feel like an extension of our team. Honest, fast, and they push back when we're wrong — exactly what we needed.",
    name: "Daniel Ortiz",
    role: "Co-founder & CEO, Helix Health",
  },
  {
    quote:
      "We scaled from 40 to 180 in 18 months with their embedded RPO model. Could not have done it with an agency on commission.",
    name: "Priya Raman",
    role: "VP Talent, Atlas Robotics",
  },
];

const clients = [
  "NIMBUS LABS",
  "HELIX HEALTH",
  "ATLAS ROBOTICS",
  "NORTHWIND",
  "KESTREL CAPITAL",
  "VANTAGE AI",
];

function Index() {
  return (
    <>
      {/* ============== HERO ============== */}
      <section className="relative overflow-hidden bg-gradient-hero">
        {/* sharp accent grid */}
        <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:64px_64px]" />
        <div className="absolute -right-32 -top-32 h-96 w-96 bg-accent/20 blur-3xl" />

        <div className="container relative mx-auto px-4 pb-0 pt-16 md:pt-24">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
            {/* LEFT: copy */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-3 border-l-2 border-accent pl-3 text-xs font-bold uppercase tracking-[0.2em] text-accent">
                <span>Global Recruiting Agency</span>
                <span className="h-px w-8 bg-accent/50" />
                <span className="text-primary-foreground/60">Est. 2014</span>
              </div>

              <h1 className="mt-6 font-display text-5xl font-bold leading-[0.95] tracking-tight text-primary-foreground md:text-7xl lg:text-[5.5rem]">
                We find the
                <br />
                people who
                <br />
                <span className="relative inline-block">
                  <span className="relative z-10 text-accent">move markets.</span>
                  <span className="absolute -bottom-1 left-0 right-0 z-0 h-3 bg-accent/20" />
                </span>
              </h1>

              <p className="mt-8 max-w-xl text-lg leading-relaxed text-primary-foreground/75">
                A specialist recruiting agency for ambitious companies in tech, healthcare,
                finance and industrial sectors. Retained search, embedded RPO and on-demand
                staffing — under one roof.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Button
                  size="lg"
                  variant="secondary"
                  asChild
                  className="rounded-none px-7 py-6 text-base font-semibold shadow-[6px_6px_0_0_hsl(var(--accent))] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_hsl(var(--accent))]"
                >
                  <Link to="/signup">
                    Hire with us <ArrowUpRight className="ml-1 h-5 w-5" />
                  </Link>
                </Button>
                <Link
                  to="/jobs"
                  className="group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary-foreground"
                >
                  <PlayCircle className="h-5 w-5 text-accent" />
                  <span className="border-b border-transparent pb-0.5 transition group-hover:border-accent">
                    View open roles
                  </span>
                </Link>
              </div>
            </div>

            {/* RIGHT: image collage */}
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/5] w-full">
                {/* Accent geometric block behind */}
                <div className="absolute -left-4 -top-4 h-32 w-32 bg-accent md:-left-6 md:-top-6 md:h-40 md:w-40" />
                <div className="absolute -bottom-4 -right-4 h-24 w-24 border-4 border-accent md:-bottom-6 md:-right-6 md:h-32 md:w-32" />

                {/* Main image */}
                <img
                  src={heroTeam}
                  alt="Hireloop recruiting consultants collaborating"
                  width={1280}
                  height={1600}
                  className="relative h-full w-full object-cover shadow-2xl"
                />

                {/* Floating portrait card */}
                <div className="absolute -left-6 bottom-12 hidden w-44 overflow-hidden border-4 border-background shadow-xl sm:block md:-left-10 md:w-52">
                  <img
                    src={heroPortrait}
                    alt="Senior consultant"
                    width={400}
                    height={400}
                    className="aspect-square w-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Floating stat card */}
                <div className="absolute -right-4 top-8 hidden border-l-4 border-accent bg-background px-5 py-4 shadow-xl sm:block md:-right-8">
                  <p className="font-display text-3xl font-bold text-foreground">94%</p>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    Offer accept rate
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stat strip — sharp bar */}
          <div className="relative mt-20 grid grid-cols-2 divide-y divide-primary-foreground/10 border-y-2 border-accent/40 md:mt-24 md:grid-cols-4 md:divide-x md:divide-y-0">
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
                <p className="font-display text-2xl font-bold">1,800+</p>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  Successful placements across 65 countries
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
            <h3 className="font-display text-2xl font-bold">Our placement guarantee</h3>
            <p className="mt-2 text-muted-foreground">
              Every retained search comes with a 90-day replacement guarantee. If it doesn't work
              out, we run the search again — on us.
            </p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {[
              "Dedicated senior partner",
              "Weekly progress reporting",
              "Diversity-first sourcing",
              "Transparent flat fees",
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
                Let's talk about your next hire.
              </h2>
              <p className="mt-4 max-w-lg text-primary-foreground/80">
                Tell us about the role — we'll come back within one business day with a plan,
                timeline, and a flat-fee quote.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <Button
                size="lg"
                variant="secondary"
                asChild
                className="rounded-none px-7 py-6 text-base font-semibold shadow-[6px_6px_0_0_hsl(var(--accent))] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_hsl(var(--accent))]"
              >
                <Link to="/signup">Book an intro call</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="rounded-none border-primary-foreground/30 bg-transparent px-7 py-6 text-base text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                <Link to="/jobs">Browse open roles</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
