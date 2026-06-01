import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHero } from "@/components/page-hero";

export const Route = createFileRoute("/insights/$slug")({
  component: InsightDetail,
  notFoundComponent: () => <div className="container mx-auto px-4 py-20 text-center">Article not found.</div>,
  errorComponent: ({ error }) => <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">{error.message}</div>,
});

function InsightDetail() {
  const { slug } = Route.useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["post", slug],
    queryFn: async () => {
      const { data } = await supabase.from("posts").select("*").eq("slug", slug).eq("published", true).maybeSingle();
      return data;
    },
  });
  if (!isLoading && !data) throw notFound();
  if (!data) return null;

  return (
    <>
      <PageHero eyebrow={data.category ?? "Insights"} title={data.title} subtitle={data.excerpt ?? undefined} />
      <article className="container mx-auto max-w-3xl px-4 py-16">
        {data.cover_url && <img src={data.cover_url} alt="" className="mb-10 aspect-[16/9] w-full object-cover" />}
        {data.published_at && <p className="mb-8 text-sm text-muted-foreground">{new Date(data.published_at).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}</p>}
        <div className="prose prose-lg max-w-none whitespace-pre-line text-foreground/90">{data.body}</div>
        <div className="mt-12 border-t border-border pt-6">
          <Link to="/insights" className="text-sm text-muted-foreground hover:text-foreground">← All insights</Link>
        </div>
      </article>
    </>
  );
}
