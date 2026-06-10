import { Link } from "react-router-dom";
import { useFirebaseQuery } from "@/hooks/use-firebase-query";
import { ArrowRight } from "lucide-react";
import { firebase } from "@/integrations/firebase/client";
import { Button } from "@/components/ui/button";
import { getServiceImage } from "@/lib/service-images";
import { DynamicSeo } from "@/components/dynamic-seo";

type Service = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  icon: string | null;
  features: string[] | null;
  image_url?: string | null;
};

const PAGE_TITLE = "Recruitment & Workforce Services — Virelix Consulting";
const PAGE_DESCRIPTION =
  "Executive search, IT and non-IT recruitment, RPO, workforce planning, business consulting, and professional training delivered across the USA and India by Virelix Consulting.";

// Vary parallax image position per row for editorial rhythm
const IMAGE_VARIANTS = [
  { right: "right-[8%]", top: "-top-10", w: "w-60", h: "h-72" },
  { right: "right-[22%]", top: "top-1/2 -translate-y-1/2", w: "w-80", h: "h-56" },
  { right: "right-[5%]", top: "-bottom-16", w: "w-64", h: "h-64" },
];

const BG_VARIANTS = ["bg-muted/40", "bg-muted/20", "bg-muted/30"];

function ServicesPage() {
  const { data = [] } = useFirebaseQuery("services_published", async (): Promise<Service[]> => {
    const { data } = await firebase
      .from("services")
      .select("id,slug,title,summary,icon,features,image_url")
      .eq("published", true)
      .order("sort_order");
    return (data as Service[] | null) ?? [];
  });

  return (
    <main className="min-h-screen bg-background relative">
      {/* Sub-header Bar (Breadcrumbs & CTA) */}
      <div className="bg-slate-900/90 dark:bg-slate-950 text-slate-300 py-3.5 px-6 md:px-12 flex justify-between items-center text-xs border-b border-slate-800">
        <div className="flex items-center gap-1.5 font-medium">
          <Link to="/" className="hover:text-white transition">
            Home
          </Link>
          <span className="text-slate-600">/</span>
          <span className="text-white font-semibold">Services</span>
        </div>
        <Link
          to="/contact"
          className="bg-[#0070ad] hover:bg-[#005c8f] text-white font-bold px-4 py-2 transition text-[10px] uppercase tracking-wider inline-flex items-center gap-1.5"
        >
          Get in touch <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Hero Banner Section */}
      <section className="relative w-full h-[280px] sm:h-[360px] md:h-[420px] overflow-hidden">
        {/* Generic High-Quality Corporate Team/Office Banner Image */}
        <img
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80"
          alt="Services Capabilities"
          className="h-full w-full object-cover"
          decoding="async"
        />
        {/* Subtle Dark Overlay */}
        <div className="absolute inset-0 bg-slate-950/20 pointer-events-none" />
        {/* Floating Corporate Blue Title Card */}
        <div className="absolute left-6 md:left-12 bottom-0 w-[240px] sm:w-[320px] md:w-[420px] h-[65%] sm:h-[75%] bg-[#0070ad]/95 text-white p-6 md:p-10 flex items-end justify-start shadow-2xl z-20 border-t border-r border-white/10">
          <h1 className="font-display text-2xl sm:text-3xl md:text-5xl font-black uppercase tracking-tight text-white leading-none">
            Services
          </h1>
        </div>
      </section>

      {/* Content Section */}
      <section className="px-6 py-16 md:px-12 md:py-24 relative z-10">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[auto_1fr]">
          {/* Leftmost column - Social Sharing Icons (Desktop only) */}
          <div className="hidden lg:flex flex-col gap-4 pt-1 shrink-0">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-[#0077b5] hover:text-white hover:border-[#0077b5] transition-all duration-300 font-bold text-sm"
              aria-label="Share on LinkedIn"
            >
              in
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-[#1877f2] hover:text-white hover:border-[#1877f2] transition-all duration-300 font-bold text-sm"
              aria-label="Share on Facebook"
            >
              f
            </a>
          </div>

          {/* Rest of Page Content */}
          <div>
            {/* Header Text */}
            <div className="mb-16">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground leading-snug">
                Strategic talent solutions engineered for high-growth enterprises and global
                leadership teams.
              </h2>
            </div>

            {/* Editorial List */}
            <div className="border-t border-border">
              {data.map((s, i) => {
                const img = s.image_url
                  ? { src: s.image_url, srcSet: undefined }
                  : getServiceImage(s.slug);
                const num = String(i + 1).padStart(2, "0");
                const variant = IMAGE_VARIANTS[i % IMAGE_VARIANTS.length];
                const bg = BG_VARIANTS[i % BG_VARIANTS.length];
                const fromLeft = i % 2 === 1;

                return (
                  <Link
                    key={s.id}
                    to="/services/$slug"
                    params={{ slug: s.slug }}
                    className="group relative block overflow-hidden border-b border-border py-12 transition-all duration-700 md:py-20"
                  >
                    {/* Sliding background layers */}
                    <div
                      className={`absolute inset-0 ${bg} transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                        fromLeft
                          ? "-translate-x-full group-hover:translate-x-0"
                          : "translate-x-full group-hover:translate-x-0"
                      }`}
                    />
                    <div
                      className={`absolute inset-0 bg-card transition-transform duration-1000 delay-75 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                        fromLeft
                          ? "-translate-x-full group-hover:translate-x-0"
                          : "translate-x-full group-hover:translate-x-0"
                      }`}
                    />
                    {/* Mobile/Tablet backdrop image */}
                    <div className="absolute inset-0 z-0 opacity-[0.10] dark:opacity-[0.18] transition-opacity duration-500 lg:hidden group-hover:opacity-[0.16]">
                      <img
                        src={img.src}
                        alt=""
                        className="h-full w-full object-cover mix-blend-luminosity filter blur-[1px]"
                      />
                    </div>

                    {/* Row content */}
                    <div className="relative z-20 flex flex-col items-baseline gap-6 md:flex-row md:gap-16 lg:gap-24">
                      <span className="text-xs font-semibold tabular-nums tracking-widest text-muted-foreground/70 transition-colors duration-500 group-hover:text-foreground">
                        {num}
                      </span>
                      <div className="flex-1">
                        <h2 className="text-3xl font-medium tracking-tight text-foreground transition-transform duration-500 ease-out group-hover:translate-x-4 md:text-5xl lg:text-6xl">
                          {s.title}
                        </h2>
                        <div className="max-h-0 overflow-hidden opacity-0 transition-all duration-700 ease-in-out group-hover:max-h-48 group-hover:opacity-100">
                          <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground transition-transform duration-700 delay-100 group-hover:translate-x-8 md:mt-8 md:text-lg">
                            {s.summary}
                          </p>
                        </div>
                      </div>
                      <div className="hidden md:block">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border transition-all duration-500 group-hover:border-foreground group-hover:bg-foreground group-hover:text-background">
                          <ArrowRight className="h-5 w-5 transition-transform duration-500 group-hover:-rotate-45" />
                        </div>
                      </div>
                    </div>

                    {/* Parallax image — desktop only */}
                    <div
                      className={`pointer-events-none absolute z-30 hidden opacity-0 transition-all duration-1000 group-hover:opacity-100 lg:block ${variant.right} ${variant.top} ${variant.w} ${variant.h}`}
                    >
                      <div className="absolute -inset-4 -z-10 translate-x-4 translate-y-24 border border-border/60 transition-transform duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-12 group-hover:translate-y-8" />
                      <div className="relative h-full w-full translate-y-32 overflow-hidden shadow-2xl transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-x-4 group-hover:translate-y-4">
                        <img
                          src={img.src}
                          srcSet={img.srcSet}
                          sizes="400px"
                          alt={s.title}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full scale-110 object-cover grayscale transition-all duration-1000 group-hover:scale-100 group-hover:grayscale-0"
                        />
                      </div>
                      <span className="absolute -bottom-8 right-0 translate-y-12 text-[9px] uppercase italic tracking-[0.2em] text-muted-foreground/70 transition-transform duration-500 ease-out group-hover:-translate-y-4">
                        Practice {num}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Footer */}
            <div className="mt-20 flex flex-col items-start justify-between gap-8 md:mt-32 md:flex-row md:items-center">
              <div className="flex items-center gap-6">
                <div className="flex gap-1.5">
                  <div className="h-1 w-1 rounded-full bg-foreground" />
                  <div className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                  <div className="h-1 w-1 rounded-full bg-muted-foreground/20" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
                  Ten practices · USA & India
                </span>
              </div>
              <Button
                asChild
                size="lg"
                className="rounded-none bg-foreground text-background px-8 text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-foreground/90"
              >
                <Link to="/contact">
                  Talk to a Virelix consultant
                  <ArrowRight className="ml-3 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ServicesPage;
