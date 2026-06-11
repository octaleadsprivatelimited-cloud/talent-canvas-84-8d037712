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

const DEFAULT_SERVICES: Service[] = [
  {
    id: "service-1",
    slug: "executive-search",
    title: "Executive Search & Leadership Hiring",
    summary: "Retained search for C-suite, VP, and Director roles led by senior consultants with deep sector expertise.",
    icon: "target",
    features: [
      "Retained search practice",
      "Sector specialists",
      "C-level placement portfolio",
    ],
  },
  {
    id: "service-2",
    slug: "it-recruitment",
    title: "IT & Non-IT Recruitment",
    summary: "Specialist hiring across technology, engineering, finance, sales, operations, and support functions.",
    icon: "cpu",
    features: ["Tech talent network", "Contingent placement", "Multi-country delivery"],
  },
  {
    id: "service-3",
    slug: "rpo-workforce-solutions",
    title: "RPO & Workforce Solutions",
    summary: "Embedded recruiters and end-to-end hiring operations that scale with your business.",
    icon: "briefcase",
    features: ["Scale on-demand", "Dedicated recruiter model", "ATS configuration & metrics"],
  },
  {
    id: "service-4",
    slug: "consulting-training",
    title: "Consulting & Professional Training",
    summary: "Workforce planning, talent mapping, business consulting, and career development programs.",
    icon: "trending-up",
    features: ["Org design consulting", "Training bootcamps", "Salary benchmarking"],
  },
];

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
  const { data: dbData = [] } = useFirebaseQuery("services_published", async (): Promise<Service[]> => {
    const { data } = await firebase
      .from("services")
      .select("id,slug,title,summary,icon,features,image_url")
      .eq("published", true)
      .order("sort_order");
    return (data as Service[] | null) ?? [];
  });

  const data = dbData.length > 0 ? dbData : DEFAULT_SERVICES;

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

            {/* Corporate Grid */}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2">
              {data.map((s, i) => {
                const img = s.image_url
                  ? { src: s.image_url, srcSet: undefined }
                  : getServiceImage(s.slug);

                return (
                  <Link
                    key={s.id}
                    to={`/services/${s.slug}`}
                    className="group relative flex flex-col justify-between border border-border bg-card p-6 md:p-8 transition-all duration-300 hover:border-primary/50 hover:shadow-lg rounded-none text-left"
                  >
                    <div>
                      {/* Top cover image for corporate visual card style */}
                      <div className="aspect-[16/10] w-full overflow-hidden bg-muted mb-6">
                        <img
                          src={img.src}
                          alt={s.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                      
                      <h3 className="font-display text-2xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                        {s.title}
                      </h3>
                      
                      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                        {s.summary}
                      </p>

                      {/* Capabilities checklist */}
                      {s.features && s.features.length > 0 && (
                        <ul className="mt-6 space-y-2.5 border-t border-border/50 pt-5">
                          {s.features.slice(0, 3).map((feat, idx) => (
                            <li key={idx} className="flex items-center gap-2.5 text-xs text-foreground/80 font-medium">
                              <span className="text-[#0070ad] font-bold">✓</span> {feat}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="mt-8 pt-4 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0070ad] group-hover:underline">
                      Learn more <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
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
