import { Link, useParams } from "react-router-dom";
import { useFirebaseQuery } from "@/hooks/use-firebase-query";
import { firebase } from "@/integrations/firebase/client";
import { PageHero } from "@/components/page-hero";
import { ArrowRight } from "lucide-react";
import { DEFAULT_CASE_STUDIES } from "@/lib/case-studies-data";
import { DynamicSeo } from "@/components/dynamic-seo";

function parseMarkdown(text: string | null) {
  if (!text) return null;
  return text.split("\n").map((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("### ")) {
      return (
        <h3 key={idx} className="text-xl font-bold mt-8 mb-4 text-foreground font-display">
          {trimmed.replace("### ", "")}
        </h3>
      );
    }
    if (trimmed.startsWith("## ")) {
      return (
        <h2 key={idx} className="text-2xl font-bold mt-10 mb-4 text-foreground font-display">
          {trimmed.replace("## ", "")}
        </h2>
      );
    }
    if (trimmed.startsWith("- ")) {
      return (
        <li key={idx} className="ml-5 list-disc text-base text-foreground/80 my-1">
          {trimmed.replace("- ", "")}
        </li>
      );
    }
    if (trimmed === "") {
      return <div key={idx} className="h-2" />;
    }
    return (
      <p key={idx} className="text-base text-foreground/85 leading-relaxed my-3">
        {line}
      </p>
    );
  });
}

function CaseStudyDetail() {
  const { slug } = useParams();
  const { data: dbData, isLoading } = useFirebaseQuery(["case_study", slug], async () => {
    const { data } = await firebase
      .from("case_studies")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();
    return data;
  });

  const data = dbData ?? DEFAULT_CASE_STUDIES.find((cs) => cs.slug === slug) ?? null;

  if (isLoading)
    return (
      <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">Loading…</div>
    );
  if (!data) {
    return (
      <div className="flex-1 flex items-center justify-center py-20 bg-background text-foreground">
        <div className="text-center">
          <h1 className="text-4xl font-bold">404 - Case Study Not Found</h1>
          <p className="mt-2 text-muted-foreground">The case study you are looking for does not exist.</p>
          <Link to="/case-studies" className="mt-4 inline-block text-primary underline">Back to Case Studies</Link>
        </div>
      </div>
    );
  }
  const results = (data.results as Array<{ label: string; value: string }>) ?? [];

  return (
    <main className="min-h-screen bg-background relative">
      <DynamicSeo
        pageKey={`case-study:${data.slug}`}
        fallbackTitle={`${data.title} | Case Studies — Virelix Consulting`}
        fallbackDescription={data.summary || undefined}
      />
      {/* Sub-header Bar (Breadcrumbs & CTA) */}
      <div className="bg-slate-900/90 dark:bg-slate-950 text-slate-300 py-3.5 px-6 md:px-12 flex justify-between items-center text-xs border-b border-slate-800">
        <div className="flex items-center gap-1.5 font-medium">
          <Link to="/" className="hover:text-white transition">
            Home
          </Link>
          <span className="text-slate-600">/</span>
          <Link to="/case-studies" className="hover:text-white transition">
            Case Studies
          </Link>
          <span className="text-slate-600">/</span>
          <span className="text-white font-semibold">{data.client}</span>
        </div>
        <Link
          to="/contact"
          className="bg-[#0070ad] hover:bg-[#005c8f] text-white font-semibold px-4 py-2 transition text-[10px] uppercase tracking-wider inline-flex items-center gap-1.5"
        >
          Get in touch <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Hero Banner Section */}
      <section className="relative w-full h-[280px] sm:h-[360px] md:h-[420px] overflow-hidden">
        {/* Banner Image */}
        <img
          src={
            data.cover_url ||
            "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1920&q=80"
          }
          alt={data.client}
          className="h-full w-full object-cover"
          decoding="async"
        />
        {/* Subtle Dark Overlay */}
        <div className="absolute inset-0 bg-slate-950/20 pointer-events-none" />
        {/* Floating Corporate Blue Title Card */}
        <div className="absolute left-6 md:left-12 bottom-0 w-[240px] sm:w-[320px] md:w-[420px] h-[65%] sm:h-[75%] bg-[#0070ad]/95 text-white p-6 md:p-10 flex items-end justify-start shadow-2xl z-20 border-t border-r border-white/10">
          <h1 className="font-display text-2xl sm:text-3xl md:text-5xl font-black uppercase tracking-tight text-white leading-none">
            {data.client}
          </h1>
        </div>
      </section>

      {/* Body Section */}
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

          {/* Rest of Page Layout */}
          <div className="grid gap-16 lg:grid-cols-[2fr_1fr]">
            <div>
              {/* Title & Summary */}
              <div className="mb-10">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground leading-snug">
                  {data.title}
                </h2>
                {data.summary && (
                  <p className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg">
                    {data.summary}
                  </p>
                )}
              </div>

              {/* Main Body */}
              <article className="prose prose-lg max-w-none text-foreground/90 font-sans">
                {parseMarkdown(data.body)}
              </article>
            </div>

            {/* Results Sidebar Panel */}
            <aside className="h-fit flex flex-col border border-[#005c8f] rounded-none overflow-hidden shadow-md">
              {results.map((r, i) => (
                <div key={i} className="bg-[#0076CE] p-5 border-b border-[#005c8f] text-white">
                  <p className="text-xs uppercase tracking-wider text-blue-100/90 font-medium">
                    {r.label}
                  </p>
                  <p className="mt-1 font-display text-2xl font-bold text-white">{r.value}</p>
                </div>
              ))}
              <div className="bg-white dark:bg-slate-900 p-5">
                <Link
                  to="/contact"
                  className="inline-flex w-full items-center justify-center gap-2 rounded bg-[#FDB913] hover:bg-[#E5A80F] text-black font-bold text-xs uppercase tracking-wider py-3.5 px-4 transition-all duration-200 shadow-sm"
                >
                  Start a similar search →
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}

export default CaseStudyDetail;
