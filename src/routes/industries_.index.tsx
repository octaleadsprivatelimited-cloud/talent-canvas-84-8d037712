import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import * as Icons from "lucide-react";
import { firebase } from "@/integrations/firebase/client";
import { PageHero } from "@/components/page-hero";
import { DynamicSeo } from "@/components/dynamic-seo";

export const Route = createFileRoute("/industries_/")({
  head: () => ({
    meta: [
      { title: "Industries We Serve" },
      {
        name: "description",
        content:
          "Recruiting across tech, finance, healthcare, industrial, consumer, and professional services.",
      },
    ],
  }),
  component: IndustriesPage,
});

function IndustriesPage() {
  const { data } = useQuery({
    queryKey: ["industries"],
    queryFn: async () => {
      const { data } = await firebase
        .from("industries")
        .select("*")
        .eq("published", true)
        .order("sort_order");
      return (data ?? []).filter((i: any) => i && i.slug && i.published !== false);
    },
  });
  const Lucide = Icons as unknown as Record<
    string,
    React.ComponentType<{ className?: string; strokeWidth?: number }>
  >;

  return (
    <main className="min-h-screen bg-background relative">
      <DynamicSeo
        pageKey="industries"
        fallbackTitle="Industries We Serve"
        fallbackDescription="Recruiting across tech, finance, healthcare, industrial, consumer, and professional services."
      />

      {/* Sub-header Bar (Breadcrumbs & CTA) */}
      <div className="bg-slate-900/90 dark:bg-slate-950 text-slate-300 py-3.5 px-6 md:px-12 flex justify-between items-center text-xs border-b border-slate-800">
        <div className="flex items-center gap-1.5 font-medium">
          <Link to="/" className="hover:text-white transition">
            Home
          </Link>
          <span className="text-slate-600">/</span>
          <span className="text-white font-semibold">Industries</span>
        </div>
        <Link
          to="/contact"
          className="bg-[#0070ad] hover:bg-[#005c8f] text-white font-bold px-4 py-2 transition text-[10px] uppercase tracking-wider inline-flex items-center gap-1.5"
        >
          Get in touch <Icons.ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Hero Banner Section */}
      <section className="relative w-full h-[280px] sm:h-[360px] md:h-[420px] overflow-hidden">
        {/* Generic High-Quality Industry/City Panoramic Image */}
        <img
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80"
          alt="Industries We Serve"
          className="h-full w-full object-cover"
          decoding="async"
        />
        {/* Subtle Dark Overlay */}
        <div className="absolute inset-0 bg-slate-950/20 pointer-events-none" />
        {/* Floating Corporate Blue Title Card */}
        <div className="absolute left-6 md:left-12 bottom-0 w-[240px] sm:w-[320px] md:w-[420px] h-[65%] sm:h-[75%] bg-[#0070ad]/95 text-white p-6 md:p-10 flex items-end justify-start shadow-2xl z-20 border-t border-r border-white/10">
          <h1 className="font-display text-2xl sm:text-3xl md:text-5xl font-black uppercase tracking-tight text-white leading-none">
            Industries
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
                Sector expertise that compounds. We don't generalize. Each practice is led by
                partners with decades inside the industry.
              </h2>
            </div>

            {/* Grid List */}
            <div className="grid gap-px bg-border md:grid-cols-2 lg:grid-cols-3">
              {data?.map((ind: any) => {
                const Icon = (ind.icon && Lucide[ind.icon]) || Icons.Building2;
                return (
                  <Link
                    key={ind.id}
                    to="/industries/$slug"
                    params={{ slug: ind.slug }}
                    className="flex flex-col gap-3 bg-background p-8 hover:bg-surface/50 transition group"
                  >
                    <div className="flex h-11 w-11 items-center justify-center border border-border group-hover:border-primary transition">
                      <Icon
                        className="h-5 w-5 text-muted-foreground group-hover:text-primary transition"
                        strokeWidth={1.5}
                      />
                    </div>
                    <h3 className="font-display text-xl font-bold group-hover:text-primary transition">
                      {ind.label}
                    </h3>
                    <p className="text-sm text-muted-foreground">{ind.description}</p>
                    <span className="mt-6 text-xs font-semibold text-primary/80 group-hover:text-primary flex items-center gap-1 transition">
                      Explore Sector <Icons.ArrowRight className="h-3 w-3" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
