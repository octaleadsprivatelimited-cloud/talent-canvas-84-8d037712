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
  {
    key: "editorial",
    name: "Editorial Bold",
    tagline: "Sharp, angular, magazine-style collage.",
    preview: heroTeam,
  },
  {
    key: "mono",
    name: "Crimson Bold",
    tagline: "Crimson banner, bold headlines, floating white CTA card.",
    preview: themeMono,
  },
  {
    key: "aurora",
    name: "Brighter Future",
    tagline: "Blue→green gradient hero with circular portrait and warm CTA.",
    preview: themeAurora,
  },
  {
    key: "magazine",
    name: "Service Mosaic",
    tagline: "Clean white split with colored service tiles.",
    preview: themeMagazine,
  },
  {
    key: "noir",
    name: "Dark Noir",
    tagline: "Luxury black with warm gold accents.",
    preview: themeNoir,
  },
  {
    key: "cinema",
    name: "Cinema Reel",
    tagline: "Full-bleed video hero, dramatic serif overlay.",
    preview: themeCinema,
    hasVideo: true,
  },
  {
    key: "pulse",
    name: "Pulse Split",
    tagline: "Split layout with looping video panel.",
    preview: themePulse,
    hasVideo: true,
  },
  {
    key: "terracotta",
    name: "Terracotta Warm",
    tagline: "Earthy sandstone palette with sage accents.",
    preview: themeTerracotta,
  },
  {
    key: "glass",
    name: "Glass Aurora",
    tagline: "Iridescent pastel glassmorphism.",
    preview: themeGlass,
  },
  {
    key: "brutalist",
    name: "Brutalist Pop",
    tagline: "High contrast yellow + black, no apologies.",
    preview: themeBrutalist,
  },
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
  return (
    <section
      id="hero"
      className="relative snap-start overflow-hidden bg-white text-neutral-900"
    >
      <div className="relative min-h-[78vh] md:min-h-[88vh] overflow-hidden">
        {/* Full-bleed background video */}
        <video
          src="/hero-video.mp4"
          autoPlay
          muted
          loop
          playsInline
          poster="/hero-bg.jpg"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Dark gradient overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-black/10" />



        {/* Floating white editorial card — bottom left */}
        <div className="relative z-10 container mx-auto px-4 h-full">
          <div className="flex h-full min-h-[78vh] md:min-h-[88vh] items-end md:items-center">
            <article className="w-full max-w-md bg-white/95 backdrop-blur-sm p-7 md:p-9 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.35)] mb-8 md:mb-0">
              <div className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-neutral-900">
                Global Workforce Solutions
              </div>
              <h1 className="mt-5 font-display text-3xl md:text-4xl lg:text-[44px] font-bold leading-[1.05] tracking-tight text-neutral-900">
                Building high-performing teams across borders.
              </h1>
              <p className="mt-5 text-[15px] leading-relaxed text-neutral-700">
                Virelix Consulting connects high-growth organizations with exceptional talent through
                executive search, specialist recruitment, embedded RPO, and professional training —
                delivered across the USA and India.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className="rounded-none bg-neutral-950 text-white hover:bg-neutral-800 px-6"
                >
                  <Link to="/contact">
                    Hire with Virelix <ArrowUpRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
                <Link
                  to="/services"
                  className="group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-neutral-900"
                >
                  <span className="border-b border-neutral-900 pb-0.5 transition group-hover:border-transparent">
                    Explore our services
                  </span>
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </Link>
              </div>
            </article>
          </div>
        </div>
      </div>

      {/* Stats strip below hero */}
      <div className="border-t border-neutral-200 bg-white">
        <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-neutral-200">
          {stats.map((s) => (
            <div key={s.label} className="px-5 py-6 text-center">
              <div className="font-display text-2xl md:text-3xl font-bold text-neutral-900">{s.value}</div>
              <div className="mt-1 text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* =================================================================
   2. ADECCO BOLD — crimson banner + floating white CTA card
   ================================================================= */
function MonoHero() {
  return (
    <section
      id="hero"
      className="relative snap-start overflow-hidden bg-background text-foreground"
    >
      {/* Crimson top band */}
      <div className="h-2 w-full bg-primary" />

      <div className="relative">
        {/* Hero photo */}
        <div className="relative h-[70vh] min-h-[520px] w-full overflow-hidden md:h-[78vh]">
          <img
            src={themeMono}
            alt="Confident professional"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />

          {/* Floating white card */}
          <div className="container relative mx-auto flex h-full items-center px-4">
            <div className="w-full max-w-xl rounded-md bg-background p-6 shadow-2xl sm:p-10">
              <h1 className="font-display text-3xl font-extrabold uppercase leading-[0.95] tracking-tight text-foreground sm:text-5xl md:text-6xl">
                Looking for
                <br />
                a job?
              </h1>
              <p className="mt-4 text-sm text-muted-foreground sm:text-base">
                Discover thousands of opportunities worldwide. Find your perfect match with
                Virelix.
              </p>
              <Link
                to="/jobs"
                className="mt-5 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-primary hover:underline"
              >
                Find a Job <ArrowRight className="h-4 w-4" />
              </Link>

              <div className="mt-8 border-t border-border pt-6">
                <h2 className="font-display text-2xl font-extrabold uppercase leading-[0.95] tracking-tight text-foreground sm:text-4xl md:text-5xl">
                  Hiring talent?
                </h2>
                <p className="mt-3 text-sm text-muted-foreground sm:text-base">
                  Join thousands of companies. Build your best team with us.
                </p>
                <Link
                  to="/contact"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-primary hover:underline"
                >
                  View Employer Services <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="border-t border-border bg-surface">
          <div className="container mx-auto grid grid-cols-2 gap-px px-4 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="py-6">
                <p className="font-display text-3xl font-extrabold text-primary md:text-4xl">
                  {s.value}
                </p>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* =================================================================
   3. BRIGHTER FUTURE — ManpowerGroup style blue→green gradient
   ================================================================= */
function AuroraHero() {
  return (
    <section
      id="hero"
      className="relative snap-start overflow-hidden text-white"
      style={{
        backgroundImage:
          "linear-gradient(120deg, #1e4d8c 0%, #2d7fb8 35%, #4aa8a0 70%, #6ec07a 100%)",
      }}
    >
      <div className="container relative mx-auto grid gap-10 px-4 py-16 md:grid-cols-12 md:items-center md:py-24">
        <div className="md:col-span-7">
          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            A Brighter Future is
            <br />
            Humanly Possible
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base md:text-lg">
            At Virelix, we believe meaningful, sustainable employment has the power to change the
            world. When you combine talented people with innovative companies, you build a brighter
            future for everyone.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-[#e8721c] px-7 py-6 text-base font-semibold text-white shadow-lg hover:bg-[#d8631a]"
            >
              <Link to="/contact">
                Get in Touch <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Link
              to="/services"
              className="text-sm font-semibold uppercase tracking-wider text-white/90 underline-offset-4 hover:underline"
            >
              What We Do →
            </Link>
          </div>
        </div>

        {/* Circular portrait */}
        <div className="md:col-span-5">
          <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-full ring-4 ring-white/20">
            <img
              src={themeAurora}
              alt="Professional collaboration"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Talent shortage stat band */}
      <div className="bg-white text-foreground">
        <div className="container mx-auto grid gap-6 px-4 py-10 md:grid-cols-2 md:py-14">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
              Employers are facing a talent shortage
            </p>
            <p className="mt-3 font-display text-5xl font-extrabold leading-none md:text-7xl">
              74<span className="text-3xl md:text-5xl">%</span>{" "}
              <span className="block text-2xl font-semibold text-muted-foreground md:inline md:text-3xl">
                can't find the talent they need
              </span>
            </p>
          </div>
          <div className="flex items-center">
            <p className="text-sm text-muted-foreground md:text-base">
              Our expert teams across the USA and India connect millions of people to meaningful
              work and hundreds of organizations to skilled talent — at scale.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =================================================================
   4. VISA PATHWAY — Y-Axis style clean split with colored service tiles
   ================================================================= */
function MagazineHero() {
  const tiles = [
    { label: "Executive Search", to: "/services", color: "#e8482a", text: "#ffffff" },
    { label: "Recruitment", to: "/services", color: "#8e3fb3", text: "#ffffff" },
    { label: "RPO", to: "/services", color: "#1ba1a8", text: "#ffffff" },
    { label: "Training", to: "/services", color: "#6ab04c", text: "#ffffff" },
  ];
  return (
    <section id="hero" className="relative snap-start overflow-hidden bg-background text-foreground">
      {/* Top colored strip (mimics Y-Axis nav underlines) */}
      <div className="flex h-1.5 w-full">
        <span className="flex-1 bg-[#e8482a]" />
        <span className="flex-1 bg-[#8e3fb3]" />
        <span className="flex-1 bg-[#1ba1a8]" />
        <span className="flex-1 bg-[#6ab04c]" />
        <span className="flex-1 bg-[#f5b800]" />
      </div>

      <div className="grid min-h-[80vh] gap-0 lg:grid-cols-2">
        {/* LEFT: photo + overlay */}
        <div className="relative min-h-[420px] overflow-hidden">
          <img
            src={themeMagazine}
            alt="Global opportunity"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white md:p-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#f5b800]">
              Virelix Consulting · USA + India
            </p>
            <p className="mt-3 font-display text-3xl font-bold leading-tight md:text-5xl">
              Build high-performing
              <br />
              <span className="text-white/90">teams across borders.</span>
            </p>
            <Button
              asChild
              size="lg"
              className="mt-5 rounded-md bg-[#e8482a] px-6 text-white hover:bg-[#d23e22]"
            >
              <Link to="/contact">
                Hire with Virelix <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* RIGHT: question + tile grid */}
        <div className="flex flex-col justify-center p-8 md:p-14 lg:p-20">
          <h1 className="font-display text-3xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
            What can we do for you today?
          </h1>
          <p className="mt-4 max-w-md text-sm text-muted-foreground md:text-base">
            Choose your pathway. Virelix delivers executive search, specialist recruitment, embedded RPO, and professional training — tailored to your growth.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4">
            {tiles.map((t) => (
              <Link
                key={t.label}
                to={t.to}
                className="group flex aspect-[2/1] items-center justify-center rounded-md p-4 font-display text-lg font-bold text-center transition-transform hover:-translate-y-1 md:text-xl"
                style={{ backgroundColor: t.color, color: t.text }}
              >
                {t.label}
              </Link>
            ))}
          </div>

          <div className="mt-8 flex items-center gap-3 border-t border-border pt-6">
            <Zap className="h-5 w-5 text-[#e8482a]" />
            <p className="text-sm font-medium text-foreground">
              Not sure what you need?{" "}
              <Link to="/contact" className="text-[#e8482a] underline-offset-4 hover:underline">
                Talk to our team
              </Link>
            </p>
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
    return <img src={posterUrl} alt="" aria-hidden className={className} loading="eager" />;
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
    <section
      id="hero"
      className="relative min-h-[85dvh] md:min-h-screen snap-start overflow-hidden bg-black text-white"
    >
      <HeroVideo
        fallbackImg={themeCinema}
        className="absolute inset-0 h-full w-full object-cover opacity-70"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black" />
      <div className="absolute inset-0 [background-image:linear-gradient(180deg,transparent_85%,rgba(0,0,0,0.6))]" />
      <div className="container relative mx-auto flex min-h-[85dvh] md:min-h-screen flex-col justify-end px-4 pb-16 pt-28 md:pb-28">
        <div className="max-w-4xl">
          <span className="inline-flex items-center gap-2 border border-white/30 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.35em] text-white/90 backdrop-blur">
            <Play className="h-3 w-3 fill-white" /> Now Streaming · A Virelix Production
          </span>
          <h1 className="mt-4 md:mt-6 font-display text-5xl sm:text-6xl font-bold leading-[0.9] tracking-tight md:text-8xl lg:text-[7rem]">
            <em className="font-serif italic">Talent,</em>
            <br />
            in motion.
          </h1>
          <p className="mt-4 md:mt-6 max-w-xl text-sm sm:text-base text-white/75 md:text-lg">
            A cinematic look at how Virelix Consulting builds teams that move markets — shot across
            the USA and India.
          </p>
          <div className="mt-6 md:mt-8 flex flex-wrap items-center gap-4">
            <Button
              asChild
              size="lg"
              className="rounded-none bg-white px-6 sm:px-7 text-black hover:bg-white/90"
            >
              <Link to="/contact">
                Book a screening <ArrowUpRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-white/80 hover:text-white"
            >
              <PlayCircle className="h-5 w-5" /> Watch the trailer
            </Link>
          </div>
        </div>
        <div className="mt-8 md:mt-12 grid grid-cols-2 gap-px border-t border-white/15 pt-6 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="px-2 py-3 sm:py-4">
              <p className="font-display text-2xl sm:text-3xl font-bold md:text-4xl">{s.value}</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-white/55">
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
            <span className="bg-gradient-accent bg-clip-text text-transparent">
              speed of growth.
            </span>
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
            Embedded RPO, executive search, and workforce design — wired into your operating
            cadence.
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
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </p>
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
    <section
      id="hero"
      className="relative snap-start overflow-hidden bg-background text-foreground"
    >
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
            We treat every search like a portrait — slow questions, warm conversations, lasting
            matches.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button asChild size="lg" className="rounded-full px-7">
              <Link to="/contact">
                Start a conversation <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
            <Link
              to="/services"
              className="text-sm font-semibold uppercase tracking-wider underline-offset-4 hover:underline"
            >
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
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {s.label}
            </p>
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
      <img
        src={themeGlass}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover opacity-90"
      />
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
              A modern lens on executive search — calm interfaces, considered process, glass-clear
              communication.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="rounded-full px-7">
                <Link to="/contact">
                  Start a brief <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-white/60 bg-white/30 px-7 backdrop-blur hover:bg-white/50"
              >
                <Link to="/services">Explore services</Link>
              </Button>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-white/40 bg-white/30 p-5 backdrop-blur-xl"
              >
                <p className="font-display text-2xl font-bold md:text-3xl">{s.value}</p>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-foreground/70">
                  {s.label}
                </p>
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
    <section
      id="hero"
      className="relative min-h-screen snap-start overflow-hidden bg-[#FFEB00] text-black"
    >
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
            No fluff. No filler decks. We send résumés, you make hires. Repeat across two
            continents.
          </p>
          <div className="flex flex-wrap items-start gap-3">
            <Button
              asChild
              size="lg"
              className="rounded-none border-4 border-black bg-black px-7 text-[#FFEB00] shadow-[6px_6px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#000]"
            >
              <Link to="/contact">
                BRIEF US <ArrowUpRight className="ml-1 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-none border-4 border-black bg-white px-7 text-black shadow-[6px_6px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-white hover:shadow-[2px_2px_0_0_#000]"
            >
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
