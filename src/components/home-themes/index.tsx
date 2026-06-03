import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, PlayCircle, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

import heroTeam from "@/assets/hero-team.jpg";
import heroPortrait from "@/assets/hero-portrait.jpg";
import heroHandshake from "@/assets/hero-handshake.jpg";
import themeMono from "@/assets/theme-mono.jpg";
import themeAurora from "@/assets/theme-aurora.jpg";
import themeMagazine from "@/assets/theme-magazine.jpg";
import themeNoir from "@/assets/theme-noir.jpg";

export type ThemeKey = "editorial" | "mono" | "aurora" | "magazine" | "noir";

export const THEMES: { key: ThemeKey; name: string; tagline: string; preview: string }[] = [
  { key: "editorial", name: "Editorial Bold", tagline: "Sharp, angular, magazine-style collage.", preview: heroTeam },
  { key: "mono", name: "Minimal Mono", tagline: "Calm monochrome with oversized typography.", preview: themeMono },
  { key: "aurora", name: "Aurora Gradient", tagline: "Vibrant gradient, glassy cards, modern tech.", preview: themeAurora },
  { key: "magazine", name: "Magazine Split", tagline: "Full-bleed cinematic editorial split.", preview: themeMagazine },
  { key: "noir", name: "Dark Noir", tagline: "Luxury black with warm gold accents.", preview: themeNoir },
];

const stats = [
  { value: "USA", label: "Delaware HQ" },
  { value: "2", label: "USA & India" },
  { value: "10+", label: "Industries" },
  { value: "24/7", label: "Delivery" },
];

/* =================================================================
   1. EDITORIAL BOLD  — original layout
   ================================================================= */
function EditorialHero() {
  const clients = ["DELAWARE, USA", "GLOBAL DELIVERY", "USA + INDIA", "RPO", "EXECUTIVE SEARCH", "WORKFORCE SOLUTIONS"];
  return (
    <section id="hero" className="relative snap-start overflow-hidden bg-gradient-hero">
      <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:64px_64px]" />
      <div className="absolute -right-32 -top-32 h-96 w-96 bg-accent/20 blur-3xl" />
      <div className="container relative mx-auto px-4 pb-0 pt-16 md:pt-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-3 border-l-2 border-accent pl-3 text-xs font-bold uppercase tracking-[0.2em] text-accent">
              <span>Global Talent & Workforce Solutions</span>
              <span className="hidden h-px w-8 bg-accent/50 sm:block" />
              <span className="hidden text-primary-foreground/60 sm:inline">Delaware, USA</span>
            </div>
            <h1 className="mt-6 font-display text-5xl font-bold leading-[0.95] tracking-tight text-primary-foreground md:text-7xl lg:text-[5.5rem]">
              Building<br />high-performing<br />
              <span className="relative inline-block">
                <span className="relative z-10 text-accent">teams.</span>
                <span className="absolute -bottom-1 left-0 right-0 z-0 h-3 bg-accent/20" />
              </span>
            </h1>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-primary-foreground/75 md:text-lg">
              Virelix Consulting connects high-growth organizations with exceptional talent through strategic recruitment, workforce solutions, business consulting, and professional training — delivered across the USA and India.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button size="lg" variant="secondary" asChild className="rounded-none px-7 py-6 text-base font-semibold shadow-[6px_6px_0_0_hsl(var(--accent))] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_hsl(var(--accent))]">
                <Link to="/contact">Hire with Virelix <ArrowUpRight className="ml-1 h-5 w-5" /></Link>
              </Button>
              <Link to="/services" className="group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary-foreground">
                <PlayCircle className="h-5 w-5 text-accent" />
                <span className="border-b border-transparent pb-0.5 transition group-hover:border-accent">Explore our services</span>
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-sm lg:max-w-none">
              <div className="absolute -left-4 -top-4 h-24 w-24 bg-accent md:h-40 md:w-40" />
              <div className="absolute -bottom-4 -right-4 h-20 w-20 border-4 border-accent md:h-32 md:w-32" />
              <img src={heroTeam} alt="Virelix consultants" width={1280} height={1600} className="relative h-full w-full object-cover shadow-2xl" />
            </div>
          </div>
        </div>
        <div className="relative mt-16 grid grid-cols-2 divide-y divide-primary-foreground/10 border-y-2 border-accent/40 md:mt-20 md:grid-cols-4 md:divide-x md:divide-y-0">
          {stats.map((s) => (
            <div key={s.label} className="px-4 py-5 md:px-8 md:py-8">
              <p className="font-display text-3xl font-bold text-primary-foreground md:text-5xl">{s.value}</p>
              <p className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground/60 md:text-xs">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-0 border-t border-primary-foreground/10 bg-primary-foreground/[0.04] py-5">
        <div className="container mx-auto flex flex-wrap items-center justify-center gap-x-8 gap-y-3 px-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary-foreground/40">Trusted by</span>
          {clients.map((c) => (
            <span key={c} className="font-display text-[10px] font-bold tracking-[0.18em] text-primary-foreground/55 md:text-xs">{c}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =================================================================
   2. MINIMAL MONO  — oversized type, black & white portrait
   ================================================================= */
function MonoHero() {
  return (
    <section id="hero" className="relative min-h-screen snap-start overflow-hidden bg-background text-foreground">
      <div className="container mx-auto grid min-h-screen gap-10 px-4 py-16 md:grid-cols-12 md:items-center md:py-24">
        <div className="md:col-span-7">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground">— Virelix Consulting / 001</p>
          <h1 className="mt-6 font-display text-[clamp(3rem,10vw,8.5rem)] font-bold leading-[0.9] tracking-tighter">
            Talent.<br />
            <span className="text-muted-foreground">Refined.</span><br />
            Delivered.
          </h1>
          <div className="mt-10 max-w-md border-t border-foreground/15 pt-6 text-base text-muted-foreground">
            A discreet, monochrome practice for executive search, RPO, and workforce solutions — across the USA and India.
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <Button asChild size="lg" className="rounded-full bg-foreground px-7 text-background hover:bg-foreground/90">
              <Link to="/contact">Start a brief <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
            </Button>
            <Link to="/services" className="text-sm font-medium underline-offset-4 hover:underline">View capabilities →</Link>
          </div>
        </div>
        <div className="md:col-span-5">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden md:max-w-none">
            <img src={themeMono} alt="Executive portrait" width={1024} height={1280} className="h-full w-full grayscale object-cover" />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background to-transparent p-6">
              <p className="font-display text-xs font-bold uppercase tracking-[0.3em] text-foreground">Est. 2008 · USA + IN</p>
            </div>
          </div>
        </div>
      </div>
      <div className="border-y border-foreground/10">
        <div className="container mx-auto grid grid-cols-2 gap-px px-4 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="py-6">
              <p className="font-display text-3xl font-bold md:text-4xl">{s.value}</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =================================================================
   3. AURORA GRADIENT  — vivid gradient + glass cards
   ================================================================= */
function AuroraHero() {
  return (
    <section id="hero" className="relative min-h-screen snap-start overflow-hidden bg-[#0a0a1f] text-white">
      <img src={themeAurora} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-70" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a1f]/30 via-[#0a0a1f]/40 to-[#0a0a1f]" />
      <div className="absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-fuchsia-500/30 blur-3xl" />
      <div className="absolute -right-24 top-10 h-96 w-96 rounded-full bg-cyan-400/30 blur-3xl" />

      <div className="container relative mx-auto px-4 pt-20 pb-16 md:pt-28">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-medium backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-fuchsia-300" /> Global Talent · USA + India
          </span>
          <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
            The talent platform for{" "}
            <span className="bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-amber-200 bg-clip-text text-transparent">
              ambitious teams.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base text-white/70 md:text-lg">
            Executive search, embedded RPO, and workforce consulting — wrapped in a delivery model that scales with you.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="rounded-full bg-white px-7 text-[#0a0a1f] hover:bg-white/90">
              <Link to="/contact">Get started <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full border-white/30 bg-white/5 px-7 text-white backdrop-blur hover:bg-white/15 hover:text-white">
              <Link to="/services">Explore services</Link>
            </Button>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-3 md:mt-20 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-xl">
              <p className="font-display text-3xl font-bold md:text-4xl">{s.value}</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-white/60">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =================================================================
   4. MAGAZINE SPLIT  — left text, full-bleed image right
   ================================================================= */
function MagazineHero() {
  return (
    <section id="hero" className="relative snap-start overflow-hidden bg-background">
      <div className="grid min-h-screen gap-0 lg:grid-cols-2">
        {/* LEFT */}
        <div className="flex flex-col justify-between p-8 md:p-14 lg:p-20">
          <div className="flex items-center justify-between">
            <p className="font-display text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">Issue N° 24 · Talent Quarterly</p>
            <span className="hidden text-xs text-muted-foreground sm:inline">USA + India</span>
          </div>

          <div className="my-12">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Cover Story</p>
            <h1 className="mt-4 font-display text-5xl font-bold leading-[1] tracking-tight md:text-6xl lg:text-7xl">
              The new<br />
              <em className="font-serif italic text-primary">architecture</em><br />
              of hiring.
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
              Inside Virelix Consulting's playbook for executive search, embedded RPO, and workforce design across two continents.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button asChild size="lg" className="rounded-none px-7">
                <Link to="/contact">Read the brief <ArrowUpRight className="ml-1 h-4 w-4" /></Link>
              </Button>
              <Link to="/services" className="text-sm font-semibold uppercase tracking-wider text-foreground underline-offset-4 hover:underline">Table of contents →</Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-border pt-6 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="font-display text-2xl font-bold md:text-3xl">{s.value}</p>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
        {/* RIGHT */}
        <div className="relative min-h-[60vh] overflow-hidden lg:min-h-screen">
          <img src={themeMagazine} alt="Boardroom collaboration" width={1600} height={1024} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 rounded-lg border border-white/20 bg-black/40 p-4 text-white backdrop-blur-md md:bottom-10 md:left-10 md:right-10 md:p-6">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-200">
              <Star className="h-3.5 w-3.5 fill-amber-200" /> Featured
            </div>
            <p className="mt-2 font-display text-lg font-semibold md:text-xl">"Virelix feels like an extension of our hiring team."</p>
            <p className="mt-1 text-xs text-white/70">VP Operations, Financial Services Client</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =================================================================
   5. DARK NOIR  — black + gold luxury
   ================================================================= */
function NoirHero() {
  return (
    <section id="hero" className="relative min-h-screen snap-start overflow-hidden bg-black text-white">
      <div className="absolute inset-0 [background-image:radial-gradient(circle_at_30%_20%,rgba(212,175,55,0.18),transparent_55%)]" />
      <div className="container relative mx-auto grid gap-12 px-4 py-16 md:grid-cols-12 md:items-center md:py-24">
        <div className="md:col-span-7">
          <div className="inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.4em] text-amber-300/90">
            <span className="h-px w-10 bg-amber-300/60" /> Private Talent Practice
          </div>
          <h1 className="mt-6 font-display text-5xl font-bold leading-[1] tracking-tight md:text-7xl lg:text-[5.5rem]">
            Quiet work.<br />
            <span className="bg-gradient-to-r from-amber-200 via-amber-300 to-yellow-100 bg-clip-text text-transparent">Loud results.</span>
          </h1>
          <p className="mt-8 max-w-lg text-base leading-relaxed text-white/65 md:text-lg">
            A boutique-grade search and workforce consultancy for leaders who care about the calibre of every hire. Discreet, decisive, delivered.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button asChild size="lg" className="rounded-none border border-amber-300/70 bg-amber-300 px-7 text-black hover:bg-amber-200">
              <Link to="/contact">Request introduction <ArrowUpRight className="ml-1 h-4 w-4" /></Link>
            </Button>
            <Link to="/services" className="text-sm font-semibold uppercase tracking-wider text-white/80 underline-offset-4 hover:text-amber-200 hover:underline">Our practice →</Link>
          </div>

          <div className="mt-14 grid grid-cols-2 gap-px border border-white/10 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-white/[0.03] p-5">
                <p className="font-display text-2xl font-bold text-amber-200 md:text-3xl">{s.value}</p>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-white/55">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="md:col-span-5">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden md:max-w-none">
            <div className="absolute inset-0 ring-1 ring-amber-300/40" />
            <img src={themeNoir} alt="Executive" width={1024} height={1280} className="h-full w-full object-cover" />
            <div className="absolute -bottom-px left-0 right-0 bg-gradient-to-t from-black via-black/60 to-transparent p-6">
              <p className="font-display text-xs font-bold uppercase tracking-[0.3em] text-amber-200">Delaware · Hyderabad</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================= */

export function HomeHero({ theme }: { theme: ThemeKey }) {
  switch (theme) {
    case "mono": return <MonoHero />;
    case "aurora": return <AuroraHero />;
    case "magazine": return <MagazineHero />;
    case "noir": return <NoirHero />;
    case "editorial":
    default: return <EditorialHero />;
  }
}

// silence unused import warning if portrait/handshake stop being used by editorial variant
void heroPortrait; void heroHandshake;
