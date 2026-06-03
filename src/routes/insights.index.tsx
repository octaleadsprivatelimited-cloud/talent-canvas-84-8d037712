import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/firebase/client";
import { PageHero } from "@/components/page-hero";
import { DynamicSeo } from "@/components/dynamic-seo";

export const Route = createFileRoute("/insights/")({
  head: () => ({
    meta: [
      { title: "Insights & Research" },
      {
        name: "description",
        content: "Hiring research, compensation benchmarks, and operating playbooks.",
      },
    ],
  }),
  component: InsightsIndex,
});

function InsightsIndex() {
  const { data } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data } = await supabase
        .from("posts")
        .select("*")
        .eq("published", true)
        .order("published_at", { ascending: false });
      return data ?? [];
    },
  });

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
          {data?.map((p) => (
            <Link
              key={p.id}
              to="/insights/$slug"
              params={{ slug: p.slug }}
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
