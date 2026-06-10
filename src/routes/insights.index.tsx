import { Link } from "react-router-dom";
import { useFirebaseQuery } from "@/hooks/use-firebase-query";
import { firebase } from "@/integrations/firebase/client";
import { PageHero } from "@/components/page-hero";
import { DynamicSeo } from "@/components/dynamic-seo";

const DEFAULT_POSTS = [
  {
    id: "post-1",
    title: "Navigating the Executive Talent Search in 2026",
    slug: "navigating-executive-search-2026",
    category: "Executive Search",
    cover_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=70",
    excerpt: "Key changes in leadership hiring trends post hybrid-work stabilization, and how top organizations secure Tier-1 talent.",
    published_at: "2026-06-01T10:00:00Z",
  },
  {
    id: "post-2",
    title: "RPO vs. Contingent Recruiting: Which Model Fits Your Scale?",
    slug: "rpo-vs-contingent-recruiting",
    category: "Recruitment Strategy",
    cover_url: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=70",
    excerpt: "An operational comparison between embedded RPO and contingent placements for high-growth hiring.",
    published_at: "2026-06-02T12:00:00Z",
  },
  {
    id: "post-3",
    title: "USA-India Global Delivery: The Strategic Advantage",
    slug: "usa-india-global-delivery-advantage",
    category: "Workforce Solutions",
    cover_url: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=70",
    excerpt: "How leveraging global delivery hubs across North America and South Asia drives 24/7 sourcing efficiency.",
    published_at: "2026-06-03T09:00:00Z",
  },
];

function InsightsIndex() {
  const { data: dbData } = useFirebaseQuery(["posts"], async () => {
    const { data } = await firebase
      .from("posts")
      .select("*")
      .eq("published", true)
      .order("published_at", { ascending: false });
    return data ?? [];
  });

  const rawData = dbData ?? [];
  const data = rawData.length > 0 ? rawData : DEFAULT_POSTS;

  return (
    <>
      <DynamicSeo
        pageKey="insights"
        fallbackTitle="Insights & Research"
        fallbackDescription="Hiring research, compensation benchmarks, and operating playbooks."
      />
      <PageHero
        eyebrow="Insights"
        title="Hiring data, playbooks, and field notes."
        subtitle="What we're learning from 100+ active searches every quarter."
      />
      <section className="container mx-auto px-4 py-20">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
           {data?.map((p: any) => (
            <Link
              key={p.id}
              to={`/insights/${p.slug}`}
              className="group flex flex-col border border-border bg-background hover:bg-surface"
            >
              {p.cover_url && (
                <div className="aspect-[16/10] overflow-hidden">
                  <img src={p.cover_url} alt="" className="h-full w-full object-cover" />
                </div>
              )}
              <div className="flex flex-1 flex-col p-6">
                {p.category && (
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    {p.category}
                  </p>
                )}
                <h3 className="mt-2 font-display text-xl font-bold leading-tight group-hover:text-primary">
                  {p.title}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{p.excerpt}</p>
                {p.published_at && (
                  <p className="mt-auto pt-4 text-xs text-muted-foreground">
                    {new Date(p.published_at).toLocaleDateString(undefined, {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

export default InsightsIndex;
