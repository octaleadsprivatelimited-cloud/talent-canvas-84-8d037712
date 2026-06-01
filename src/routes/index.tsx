import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
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
} from "lucide-react";
import { Button } from "@/components/ui/button";

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
  { value: "94%", label: "Offer acceptance rate" },
  { value: "21 days", label: "Average time to shortlist" },
  { value: "65", label: "Countries covered" },
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
      "They feel like an extension of our team. Honest, fast, and they push back when we're wrong — which is exactly what we needed.",
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
  "Nimbus Labs",
  "Helix Health",
  "Atlas Robotics",
  "Northwind",
  "Kestrel Capital",
  "Vantage AI",
];

function Index() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(255,255,255,0.10),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_80%,rgba(255,255,255,0.06),transparent_50%)]" />
        <div className="container relative mx-auto grid gap-12 px-4 py-20 md:py-28 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/5 px-3 py-1 text-xs font-medium text-primary-foreground/90">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Global recruiting partner since 2014
            </div>
            <h1 className="mt-6 font-display text-4xl font-bold tracking-tight text-balance text-primary-foreground md:text-6xl lg:text-7xl">
              The talent partner for{" "}
              <span className="text-accent">companies that can't afford to miss</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-primary-foreground/80 md:text-xl">
              We place exceptional leaders, engineers, and operators with ambitious teams across
              tech, healthcare, finance, and industrial sectors.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/signup">
                  Hire with us <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                <Link to="/jobs">View open roles</Link>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-primary-foreground/10 bg-primary-foreground/[0.04] p-6 backdrop-blur-sm md:p-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                By the numbers
              </p>
              <div className="mt-6 grid grid-cols-2 gap-6">
                {stats.map((s) => (
                  <div key={s.label}>
                    <p className="font-display text-3xl font-bold text-primary-foreground md:text-4xl">
                      {s.value}
                    </p>
                    <p className="mt-1 text-sm text-primary-foreground/70">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Client strip */}
        <div className="border-t border-primary-foreground/10 bg-primary-foreground/[0.03]">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm font-medium text-primary-foreground/60">
              <span className="text-xs uppercase tracking-wider text-primary-foreground/40">
                Trusted by
              </span>
              {clients.map((c) => (
                <span key={c} className="font-display tracking-tight">
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="container mx-auto px-4 py-20 md:py-28">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-primary">What we do</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-5xl">
            Recruiting services, built around how you actually hire
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Whether you're filling one critical seat or scaling a team by 10x, we plug in the right
            model for the moment.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <div
              key={s.title}
              className="group rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-elevated"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <s.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              <div className="mt-5 flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition group-hover:opacity-100">
                Learn more <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Industries */}
      <section className="bg-surface py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5">
              <p className="text-sm font-semibold text-primary">Industries</p>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">
                Deep specialization across the sectors shaping the next decade
              </h2>
              <p className="mt-4 text-muted-foreground">
                Our consultants come from the industries they recruit for. That means real
                conversations with candidates — and shortlists that actually land.
              </p>
              <Button variant="outline" className="mt-8" asChild>
                <Link to="/companies">See our clients</Link>
              </Button>
            </div>

            <div className="lg:col-span-7">
              <div className="grid gap-3 sm:grid-cols-2">
                {industries.map((i) => (
                  <div
                    key={i.label}
                    className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition hover:border-primary/40"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/15 text-accent-foreground">
                      <i.icon className="h-5 w-5" />
                    </div>
                    <span className="font-medium">{i.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="container mx-auto px-4 py-20 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold text-primary">How we work</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-5xl">
            A search process designed to be measured in weeks, not quarters
          </h2>
        </div>

        <div className="relative mt-16 grid gap-8 md:grid-cols-3">
          <div className="absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent md:block" />
          {process.map((p) => (
            <div key={p.step} className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background font-display text-sm font-bold text-primary shadow-sm">
                {p.step}
              </div>
              <div className="mt-5 flex items-center gap-2">
                <p.icon className="h-5 w-5 text-primary" />
                <h3 className="font-display text-xl font-semibold">{p.title}</h3>
              </div>
              <p className="mt-3 text-muted-foreground">{p.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-2xl border border-border bg-card p-8 md:p-10">
          <div className="grid gap-6 md:grid-cols-2 md:items-center">
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
                <li key={item} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-surface py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-primary">Client stories</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">
              What it's like to work with us
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure
                key={t.name}
                className="flex flex-col rounded-2xl border border-border bg-card p-6 md:p-8"
              >
                <Quote className="h-6 w-6 text-primary/40" />
                <div className="mt-3 flex gap-0.5 text-accent">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-base leading-relaxed">
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

      {/* CTA */}
      <section className="container mx-auto px-4 py-20 md:py-28">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-hero p-10 md:p-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.10),transparent_50%)]" />
          <div className="relative grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="font-display text-3xl font-bold tracking-tight text-primary-foreground md:text-5xl">
                Let's talk about your next hire.
              </h2>
              <p className="mt-4 max-w-lg text-primary-foreground/80">
                Tell us about the role — we'll come back within one business day with a plan,
                timeline, and a flat-fee quote.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/signup">Book an intro call</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
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
