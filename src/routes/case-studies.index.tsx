import { Link } from "react-router-dom";
import { useFirebaseQuery } from "@/hooks/use-firebase-query";
import { ArrowUpRight } from "lucide-react";
import { firebase } from "@/integrations/firebase/client";
import { PageHero } from "@/components/page-hero";
import { DynamicSeo } from "@/components/dynamic-seo";
import { DEFAULT_CASE_STUDIES } from "@/lib/case-studies-data";

function CaseStudiesIndex() {
  const { data: dbData } = useFirebaseQuery(["case_studies"], async () => {
    const { data } = await firebase
      .from("case_studies")
      .select("*")
      .eq("published", true)
      .order("sort_order");
    return data ?? [];
  });

  const rawData = dbData ?? [];
  const data = [...rawData];
  DEFAULT_CASE_STUDIES.forEach((item) => {
    if (!data.some((d) => d.slug === item.slug || d.id === item.id)) {
      data.push(item);
    }
  });

  return (
    <main className="min-h-screen bg-background relative">
      <DynamicSeo
        pageKey="case-studies"
        fallbackTitle="Case Studies"
        fallbackDescription="How we've helped companies build leadership teams and ship outcomes."
      />

      {/* Sub-header Bar (Breadcrumbs & CTA) */}
      <div className="bg-slate-900/90 dark:bg-slate-950 text-slate-300 py-3.5 px-6 md:px-12 flex justify-between items-center text-xs border-b border-slate-800">
        <div className="flex items-center gap-1.5 font-medium">
          <Link to="/" className="hover:text-white transition">
            Home
          </Link>
          <span className="text-slate-600">/</span>
          <span className="text-white font-semibold">Case Studies</span>
        </div>
        <Link
          to="/contact"
          className="bg-[#0070ad] hover:bg-[#005c8f] text-white font-bold px-4 py-2 transition text-[10px] uppercase tracking-wider inline-flex items-center gap-1.5"
        >
          Get in touch <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Hero Banner Section */}
      <section className="relative w-full h-[280px] sm:h-[360px] md:h-[420px] overflow-hidden">
        {/* Generic High-Quality Team meeting Panoramic Image */}
        <img
          src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1920&q=80"
          alt="Case Studies Outcomes"
          className="h-full w-full object-cover"
          decoding="async"
        />
        {/* Subtle Dark Overlay */}
        <div className="absolute inset-0 bg-slate-950/20 pointer-events-none" />
        {/* Floating Corporate Blue Title Card */}
        <div className="absolute left-6 md:left-12 bottom-0 w-[240px] sm:w-[320px] md:w-[420px] h-[65%] sm:h-[75%] bg-[#0070ad]/95 text-white p-6 md:p-10 flex items-end justify-start shadow-2xl z-20 border-t border-r border-white/10">
          <h1 className="font-display text-2xl sm:text-3xl md:text-5xl font-black uppercase tracking-tight text-white leading-none">
            Case Studies
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
                The work, in our clients' words. Outcomes-first stories from the searches we've run.
              </h2>
            </div>

            {/* Grid List */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {data?.map((cs: any) => (
                <Link
                  key={cs.id}
                  to={`/case-studies/${cs.slug}`}
                  className="group flex flex-col overflow-hidden border border-border bg-card transition duration-300 hover:border-primary hover:shadow-lg"
                >
                  {cs.cover_url && (
                    <div className="aspect-[16/10] overflow-hidden">
                      <img
                        src={cs.cover_url}
                        alt=""
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                      {cs.client} {cs.industry && `· ${cs.industry}`}
                    </p>
                    <h3 className="mt-3 font-display text-xl font-bold leading-tight group-hover:text-primary">
                      {cs.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{cs.summary}</p>
                    <div className="mt-auto pt-6 flex items-center gap-2 text-sm font-medium text-primary">
                      Read case{" "}
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default CaseStudiesIndex;
