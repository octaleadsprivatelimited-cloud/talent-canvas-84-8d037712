import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, PlayCircle, Play, Sparkles, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/hooks/use-site-settings";

import heroTeam from "@/assets/hero-team.jpg";
import heroPortrait from "@/assets/hero-portrait.jpg";
import heroHandshake from "@/assets/hero-handshake.jpg";
import themeMono from "@/assets/theme-mono.jpg";
import themeAurora from "@/assets/theme-aurora.jpg";
import themeMagazine from "@/assets/theme-magazine.jpg";
import themeNoir from "@/assets/theme-noir.jpg";
import themeCinema from "@/assets/theme-cinema.jpg";
import themePulse from "@/assets/theme-pulse.jpg";
import themeTerracotta from "@/assets/theme-terracotta.jpg";
import themeGlass from "@/assets/theme-glass.jpg";
import themeBrutalist from "@/assets/theme-brutalist.jpg";

export type ThemeKey =
  | "editorial"
  | "mono"
  | "aurora"
  | "magazine"
  | "noir"
  | "cinema"
  | "pulse"
  | "terracotta"
  | "glass"
  | "brutalist";

export const THEMES: {
  key: ThemeKey;
  name: string;
  tagline: string;
  preview: string;
  hasVideo?: boolean;
}[] = [
  { key: "editorial", name: "Editorial Bold", tagline: "Sharp, angular, magazine-style collage.", preview: heroTeam },
  { key: "mono", name: "Minimal Mono", tagline: "Calm monochrome with oversized typography.", preview: themeMono },
  { key: "aurora", name: "Aurora Gradient", tagline: "Vibrant gradient, glassy cards, modern tech.", preview: themeAurora },
  { key: "magazine", name: "Magazine Split", tagline: "Full-bleed cinematic editorial split.", preview: themeMagazine },
  { key: "noir", name: "Dark Noir", tagline: "Luxury black with warm gold accents.", preview: themeNoir },
  { key: "cinema", name: "Cinema Reel", tagline: "Full-bleed video hero, dramatic serif overlay.", preview: themeCinema, hasVideo: true },
  { key: "pulse", name: "Pulse Split", tagline: "Split layout with looping video panel.", preview: themePulse, hasVideo: true },
  { key: "terracotta", name: "Terracotta Warm", tagline: "Earthy sandstone palette with sage accents.", preview: themeTerracotta },
  { key: "glass", name: "Glass Aurora", tagline: "Iridescent pastel glassmorphism.", preview: themeGlass },
  { key: "brutalist", name: "Brutalist Pop", tagline: "High contrast yellow + black, no apologies.", preview: themeBrutalist },
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
  const clients = [
    "DELAWARE, USA",
    "GLOBAL DELIVERY",
    "USA + INDIA",
    "RPO",
    "EXECUTIVE SEARCH",
    "WORKFORCE SOLUTIONS",
  ];
  return (
    <section id="hero" className="relative snap-start overflow-hidden bg-gradient-hero min-h-screen flex flex-col justify-between py-16 md:py-24">
      {/* Background Image */}
      <div className="absolute inset-0 pointer-events-none select-none z-0">
        <img
          src="/hero-bg.jpg"
          alt=""
          className="h-full w-full object-cover opacity-[0.22] mix-blend-luminosity filter blur-[0.3px]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/90" />
      </div>
      <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:64px_64px]" />
      <div className="absolute -right-32 -top-32 h-96 w-96 bg-accent/20 blur-3xl z-0" />
      <div className="container relative mx-auto px-4 z-10 my-auto">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-3 border-l-2 border-accent pl-3 text-xs font-bold uppercase tracking-[0.2em] text-accent">
            <span>Global Talent & Workforce Solutions</span>
            <span className="hidden h-px w-8 bg-accent/50 sm:block" />
            <span className="hidden text-gradient-hero-foreground/60 sm:inline">
              Delaware, USA
            </span>
          </div>
          <h1 className="mt-6 font-display text-5xl font-bold leading-[0.95] tracking-tight text-gradient-hero-foreground md:text-7xl lg:text-[5.5rem]">
            Building
            <br />
            high-performing
            <br />
            <span className="relative inline-block">
              <span className="relative z-10 text-accent">teams.</span>
              <span className="absolute -bottom-1 left-0 right-0 z-0 h-3 bg-accent/20" />
            </span>
          </h1>
          <p className="mt-8 max-w-xl text-base leading-relaxed text-gradient-hero-foreground/75 md:text-lg">
            Virelix Consulting connects high-growth organizations with exceptional talent through
            strategic recruitment, workforce solutions, business consulting, and professional
            training — delivered across the USA and India.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button
              size="lg"
              variant="secondary"
              asChild
              className="rounded-none px-7 py-6 text-base font-semibold shadow-[6px_6px_0_0_hsl(var(--accent))] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_hsl(var(--accent))]"
            >
              <Link to="/contact">
                Hire with Virelix <ArrowUpRight className="ml-1 h-5 w-5" />
              </Link>
            </Button>
            <Link
              to="/services"
              className="group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gradient-hero-foreground"
            >
              <PlayCircle className="h-5 w-5 text-accent" />
              <span className="border-b border-transparent pb-0.5 transition group-hover:border-accent">
                Explore our services
              </span>
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-0 border-t border-gradient-hero-foreground/10 bg-gradient-hero-foreground/[0.04] py-5 z-10">
        <div className="container mx-auto flex flex-wrap items-center justify-center gap-x-8 gap-y-3 px-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gradient-hero-foreground/40">
            Trusted by
          </span>
          {clients.map((c) => (
            <span
              key={c}
              className="font-display text-[10px] font-bold tracking-[0.18em] text-gradient-hero-foreground/55 md:text-xs"
            >
              {c}
            </span>
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
    <section
      id="hero"
      className="relative min-h-screen snap-start overflow-hidden bg-background text-foreground"
    >
      <div className="container mx-auto grid min-h-screen gap-10 px-4 py-16 md:grid-cols-12 md:items-center md:py-24">
        <div className="md:col-span-7">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground">
            — Virelix Consulting / 001
          </p>
          <h1 className="mt-6 font-display text-[clamp(3rem,10vw,8.5rem)] font-bold leading-[0.9] tracking-tighter">
            Talent.
            <br />
            <span className="text-muted-foreground">Refined.</span>
            <br />
            Delivered.
          </h1>
          <div className="mt-10 max-w-md border-t border-foreground/15 pt-6 text-base text-muted-foreground">
            A discreet, monochrome practice for executive search, RPO, and workforce solutions —
            across the USA and India.
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-foreground px-7 text-background hover:bg-foreground/90"
            >
              <Link to="/contact">
                Start a brief <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
            <Link to="/services" className="text-sm font-medium underline-offset-4 hover:underline">
              View capabilities →
            </Link>
          </div>
        </div>
        <div className="md:col-span-5">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden md:max-w-none">
            <img
              src={themeMono}
              alt="Executive portrait"
              width={1024}
              height={1280}
              className="h-full w-full grayscale object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background to-transparent p-6">
              <p className="font-display text-xs font-bold uppercase tracking-[0.3em] text-foreground">
                Est. 2008 · USA + IN
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="border-y border-foreground/10">
        <div className="container mx-auto grid grid-cols-2 gap-px px-4 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="py-6">
              <p className="font-display text-3xl font-bold md:text-4xl">{s.value}</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {s.label}
              </p>
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
    <section
      id="hero"
      className="relative min-h-screen snap-start overflow-hidden bg-[#0a0a1f] text-white"
    >
      <img
        src={themeAurora}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover opacity-70"
      />
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
            Executive search, embedded RPO, and workforce consulting — wrapped in a delivery model
            that scales with you.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-white px-7 text-[#0a0a1f] hover:bg-white/90"
            >
              <Link to="/contact">
                Get started <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-white/30 bg-white/5 px-7 text-white backdrop-blur hover:bg-white/15 hover:text-white"
            >
              <Link to="/services">Explore services</Link>
            </Button>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-3 md:mt-20 md:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-xl"
            >
              <p className="font-display text-3xl font-bold md:text-4xl">{s.value}</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-white/60">
                {s.label}
              </p>
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
            <p className="font-display text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">
              Issue N° 24 · Talent Quarterly
            </p>
            <span className="hidden text-xs text-muted-foreground sm:inline">USA + India</span>
          </div>

          <div className="my-12">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Cover Story</p>
            <h1 className="mt-4 font-display text-5xl font-bold leading-[1] tracking-tight md:text-6xl lg:text-7xl">
              The new
              <br />
              <em className="font-serif italic text-primary">architecture</em>
              <br />
              of hiring.
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
              Inside Virelix Consulting's playbook for executive search, embedded RPO, and workforce
              design across two continents.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button asChild size="lg" className="rounded-none px-7">
                <Link to="/contact">
                  Read the brief <ArrowUpRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Link
                to="/services"
                className="text-sm font-semibold uppercase tracking-wider text-foreground underline-offset-4 hover:underline"
              >
                Table of contents →
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-border pt-6 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="font-display text-2xl font-bold md:text-3xl">{s.value}</p>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
        {/* RIGHT */}
        <div className="relative min-h-[60vh] overflow-hidden lg:min-h-screen">
          <img
            src={themeMagazine}
            alt="Boardroom collaboration"
            width={1600}
            height={1024}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 rounded-lg border border-white/20 bg-black/40 p-4 text-white backdrop-blur-md md:bottom-10 md:left-10 md:right-10 md:p-6">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-200">
              <Star className="h-3.5 w-3.5 fill-amber-200" /> Featured
            </div>
            <p className="mt-2 font-display text-lg font-semibold md:text-xl">
              "Virelix feels like an extension of our hiring team."
            </p>
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
    <section
      id="hero"
      className="relative min-h-screen snap-start overflow-hidden bg-black text-white"
    >
      <div className="absolute inset-0 [background-image:radial-gradient(circle_at_30%_20%,rgba(212,175,55,0.18),transparent_55%)]" />
      <div className="container relative mx-auto grid gap-12 px-4 py-16 md:grid-cols-12 md:items-center md:py-24">
        <div className="md:col-span-7">
          <div className="inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.4em] text-amber-300/90">
            <span className="h-px w-10 bg-amber-300/60" /> Private Talent Practice
          </div>
          <h1 className="mt-6 font-display text-5xl font-bold leading-[1] tracking-tight md:text-7xl lg:text-[5.5rem]">
            Quiet work.
            <br />
            <span className="bg-gradient-to-r from-amber-200 via-amber-300 to-yellow-100 bg-clip-text text-transparent">
              Loud results.
            </span>
          </h1>
          <p className="mt-8 max-w-lg text-base leading-relaxed text-white/65 md:text-lg">
            A boutique-grade search and workforce consultancy for leaders who care about the calibre
            of every hire. Discreet, decisive, delivered.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button
              asChild
              size="lg"
              className="rounded-none border border-amber-300/70 bg-amber-300 px-7 text-black hover:bg-amber-200"
            >
              <Link to="/contact">
                Request introduction <ArrowUpRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Link
              to="/services"
              className="text-sm font-semibold uppercase tracking-wider text-white/80 underline-offset-4 hover:text-amber-200 hover:underline"
            >
              Our practice →
            </Link>
          </div>

          <div className="mt-14 grid grid-cols-2 gap-px border border-white/10 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-white/[0.03] p-5">
                <p className="font-display text-2xl font-bold text-amber-200 md:text-3xl">
                  {s.value}
                </p>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-white/55">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="md:col-span-5">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden md:max-w-none">
            <div className="absolute inset-0 ring-1 ring-amber-300/40" />
            <img
              src={themeNoir}
              alt="Executive"
              width={1024}
              height={1280}
              className="h-full w-full object-cover"
            />
            <div className="absolute -bottom-px left-0 right-0 bg-gradient-to-t from-black via-black/60 to-transparent p-6">
              <p className="font-display text-xs font-bold uppercase tracking-[0.3em] text-amber-200">
                Delaware · Hyderabad
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================= */

/* =================================================================
   6. CINEMA REEL — full-bleed video background, dark cinematic overlay
   ================================================================= */
function HeroVideo({
  className,
  poster,
  fallbackImg,
}: {
  className?: string;
  poster?: string | null;
  fallbackImg: string;
}) {
  const { data: settings } = useSiteSettings();
  const videoUrl = settings?.hero_video_url || "/hero-video.mp4";
  const posterUrl = settings?.hero_video_poster_url || poster || fallbackImg;
  if (!videoUrl) {
    return (
      <img
        src={posterUrl}
        alt=""
        aria-hidden
        className={className}
        loading="eager"
      />
    );
  }
  return (
    <video
      className={className}
      src={videoUrl}
      poster={posterUrl}
      autoPlay
      muted
      loop
      playsInline
    />
  );
}

function CinemaHero() {
  return (
    <section id="hero" className="relative min-h-screen snap-start overflow-hidden bg-black text-white">
      <HeroVideo
        fallbackImg={themeCinema}
        className="absolute inset-0 h-full w-full object-cover opacity-70"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black" />
      <div className="absolute inset-0 [background-image:linear-gradient(180deg,transparent_85%,rgba(0,0,0,0.6))]" />
      <div className="container relative mx-auto flex min-h-screen flex-col justify-end px-4 pb-20 pt-32 md:pb-28">
        <div className="max-w-4xl">
          <span className="inline-flex items-center gap-2 border border-white/30 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.35em] text-white/90 backdrop-blur">
            <Play className="h-3 w-3 fill-white" /> Now Streaming · A Virelix Production
          </span>
          <h1 className="mt-6 font-display text-6xl font-bold leading-[0.9] tracking-tight md:text-8xl lg:text-[7rem]">
            <em className="font-serif italic">Talent,</em>
            <br />
            in motion.
          </h1>
          <p className="mt-6 max-w-xl text-base text-white/75 md:text-lg">
            A cinematic look at how Virelix Consulting builds teams that move markets — shot across the USA and India.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button asChild size="lg" className="rounded-none bg-white px-7 text-black hover:bg-white/90">
              <Link to="/contact">
                Book a screening <ArrowUpRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Link to="/services" className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-white/80 hover:text-white">
              <PlayCircle className="h-5 w-5" /> Watch the trailer
            </Link>
          </div>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-px border-t border-white/15 pt-6 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="px-2 py-4">
              <p className="font-display text-3xl font-bold md:text-4xl">{s.value}</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-white/55">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =================================================================
   7. PULSE SPLIT — text left, looping video frame right
   ================================================================= */
function PulseHero() {
  return (
    <section id="hero" className="relative min-h-screen snap-start overflow-hidden bg-background">
      <div className="grid min-h-screen lg:grid-cols-12">
        <div className="flex flex-col justify-center p-8 md:p-14 lg:col-span-6 lg:p-20">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">
            <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-primary align-middle" />
            Live · Global Talent Network
          </p>
          <h1 className="mt-6 font-display text-5xl font-bold leading-[1] tracking-tight md:text-7xl">
            Hire at the
            <br />
            <span className="bg-gradient-accent bg-clip-text text-transparent">speed of growth.</span>
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
            Embedded RPO, executive search, and workforce design — wired into your operating cadence.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="rounded-full px-7">
              <Link to="/contact">
                Start hiring <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full px-7">
              <Link to="/services">
                <Zap className="mr-1.5 h-4 w-4" /> See playbook
              </Link>
            </Button>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="font-display text-2xl font-bold md:text-3xl">{s.value}</p>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative min-h-[60vh] overflow-hidden bg-black lg:col-span-6 lg:min-h-screen">
          <HeroVideo
            fallbackImg={themePulse}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-black/50 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 flex items-center gap-3 rounded-full border border-white/25 bg-black/40 px-4 py-2 text-xs text-white backdrop-blur-md md:bottom-10 md:left-10 md:right-10">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            <span className="font-mono uppercase tracking-wider">Reel · USA + India delivery</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =================================================================
   8. TERRACOTTA WARM — sandstone + sage editorial
   ================================================================= */
function TerracottaHero() {
  return (
    <section id="hero" className="relative snap-start overflow-hidden bg-background text-foreground">
      <div className="absolute inset-0 bg-gradient-subtle" />
      <div className="absolute -right-20 top-20 h-72 w-72 rounded-full bg-accent/30 blur-3xl" />
      <div className="container relative mx-auto grid gap-12 px-4 py-20 md:grid-cols-12 md:items-center md:py-28">
        <div className="md:col-span-7">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent">
            ✦ Crafted Hiring · Est. 2008
          </p>
          <h1 className="mt-6 font-display text-5xl font-bold leading-[1.02] tracking-tight md:text-7xl">
            Hiring,
            <br />
            handmade
            <br />
            <span className="font-serif italic text-accent">with care.</span>
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
            We treat every search like a portrait — slow questions, warm conversations, lasting matches.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button asChild size="lg" className="rounded-full px-7">
              <Link to="/contact">
                Start a conversation <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
            <Link to="/services" className="text-sm font-semibold uppercase tracking-wider underline-offset-4 hover:underline">
              Our craft →
            </Link>
          </div>
        </div>
        <div className="md:col-span-5">
          <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-[40%_60%_55%_45%/55%_45%_60%_40%] border-4 border-accent/40 shadow-elevated">
            <img src={themeTerracotta} alt="" className="h-full w-full object-cover" />
          </div>
        </div>
      </div>
      <div className="container mx-auto grid grid-cols-2 gap-px border-t border-border px-4 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="py-6">
            <p className="font-display text-3xl font-bold text-accent md:text-4xl">{s.value}</p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* =================================================================
   9. GLASS AURORA — iridescent pastel glassmorphism
   ================================================================= */
function GlassHero() {
  return (
    <section id="hero" className="relative min-h-screen snap-start overflow-hidden bg-background">
      <img src={themeGlass} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-90" />
      <div className="absolute -left-20 top-20 h-96 w-96 rounded-full bg-fuchsia-300/40 blur-3xl" />
      <div className="absolute -right-20 bottom-10 h-96 w-96 rounded-full bg-cyan-300/40 blur-3xl" />
      <div className="container relative mx-auto px-4 py-24 md:py-32">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-3xl border border-white/40 bg-white/30 p-8 backdrop-blur-2xl md:p-14">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/40 px-4 py-1.5 text-xs font-semibold text-foreground backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> Soft power, hard results
            </span>
            <h1 className="mt-5 font-display text-5xl font-bold leading-[1.05] tracking-tight text-foreground md:text-7xl">
              Talent, clarified.
            </h1>
            <p className="mt-5 text-base text-foreground/75 md:text-lg">
              A modern lens on executive search — calm interfaces, considered process, glass-clear communication.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="rounded-full px-7">
                <Link to="/contact">
                  Start a brief <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full border-white/60 bg-white/30 px-7 backdrop-blur hover:bg-white/50">
                <Link to="/services">Explore services</Link>
              </Button>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl border border-white/40 bg-white/30 p-5 backdrop-blur-xl">
                <p className="font-display text-2xl font-bold md:text-3xl">{s.value}</p>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-foreground/70">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* =================================================================
   10. BRUTALIST POP — yellow + black, thick borders
   ================================================================= */
function BrutalistHero() {
  return (
    <section id="hero" className="relative min-h-screen snap-start overflow-hidden bg-[#FFEB00] text-black">
      <div className="absolute inset-0 [background-image:linear-gradient(to_right,#000_2px,transparent_2px),linear-gradient(to_bottom,#000_2px,transparent_2px)] [background-size:80px_80px] opacity-[0.08]" />
      <div className="container relative mx-auto px-4 py-16 md:py-24">
        <div className="flex items-center gap-3 border-y-4 border-black py-3 text-xs font-black uppercase tracking-widest">
          <span className="bg-black px-2 py-1 text-[#FFEB00]">NEW</span>
          <span>Virelix · Talent Without The Theater</span>
        </div>
        <h1 className="mt-10 font-display text-6xl font-black uppercase leading-[0.85] tracking-tighter md:text-[9rem]">
          HIRE
          <br />
          <span className="inline-block -rotate-1 border-4 border-black bg-white px-4">FAST.</span>
          <br />
          HIRE LOUD.
        </h1>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <p className="border-l-4 border-black pl-4 text-lg font-semibold md:text-xl">
            No fluff. No filler decks. We send résumés, you make hires. Repeat across two continents.
          </p>
          <div className="flex flex-wrap items-start gap-3">
            <Button asChild size="lg" className="rounded-none border-4 border-black bg-black px-7 text-[#FFEB00] shadow-[6px_6px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#000]">
              <Link to="/contact">
                BRIEF US <ArrowUpRight className="ml-1 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-none border-4 border-black bg-white px-7 text-black shadow-[6px_6px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-white hover:shadow-[2px_2px_0_0_#000]">
              <Link to="/services">SERVICES →</Link>
            </Button>
          </div>
        </div>
        <div className="mt-14 grid grid-cols-2 gap-0 border-4 border-black md:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`border-black p-5 ${i < 3 ? "border-r-4" : ""} ${i < 2 ? "border-b-4 md:border-b-0" : ""}`}
            >
              <p className="font-display text-3xl font-black md:text-5xl">{s.value}</p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================= */

export function HomeHero({ theme }: { theme: ThemeKey }) {
  switch (theme) {
    case "mono":
      return <MonoHero />;
    case "aurora":
      return <AuroraHero />;
    case "magazine":
      return <MagazineHero />;
    case "noir":
      return <NoirHero />;
    case "cinema":
      return <CinemaHero />;
    case "pulse":
      return <PulseHero />;
    case "terracotta":
      return <TerracottaHero />;
    case "glass":
      return <GlassHero />;
    case "brutalist":
      return <BrutalistHero />;
    case "editorial":
    default:
      return <EditorialHero />;
  }
}

// silence unused import warning if portrait/handshake stop being used by editorial variant
void heroPortrait;
void heroHandshake;
