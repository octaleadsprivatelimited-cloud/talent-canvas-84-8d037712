import { Link, useParams } from "react-router-dom";
import { useFirebaseQuery } from "@/hooks/use-firebase-query";
import { firebase } from "@/integrations/firebase/client";
import { PageHero } from "@/components/page-hero";
import { DEFAULT_POSTS } from "@/lib/insights-data";
import { DynamicSeo } from "@/components/dynamic-seo";

function InsightDetail() {
  const { slug } = useParams();
  const { data: dbData, isLoading } = useFirebaseQuery(["post", slug], async () => {
    const { data } = await firebase
      .from("posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();
    return data;
  });

  const data = dbData ?? DEFAULT_POSTS.find((p) => p.slug === slug) ?? null;

  if (isLoading)
    return (
      <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">Loading…</div>
    );
  if (!data) {
    return (
      <div className="flex-1 flex items-center justify-center py-20 bg-background text-foreground">
        <div className="text-center">
          <h1 className="text-4xl font-bold">404 - Insight Not Found</h1>
          <p className="mt-2 text-muted-foreground">The insight page you are looking for does not exist.</p>
          <Link to="/insights" className="mt-4 inline-block text-primary underline">Back to Insights</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <DynamicSeo
        pageKey={`insight:${data.slug}`}
        fallbackTitle={`${data.title} | Insights — Virelix Consulting`}
        fallbackDescription={data.excerpt || undefined}
      />
      <PageHero
        eyebrow={data.category ?? "Insights"}
        title={data.title}
        subtitle={data.excerpt ?? undefined}
      />
      <article className="container mx-auto max-w-3xl px-4 py-16">
        {data.cover_url && (
          <img src={data.cover_url} alt="" className="mb-10 aspect-[16/9] w-full object-cover" />
        )}
        {data.published_at && (
          <p className="mb-8 text-sm text-muted-foreground">
            {new Date(data.published_at).toLocaleDateString(undefined, {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        )}
        <div className="prose prose-lg max-w-none whitespace-pre-line text-foreground/90">
          {data.body}
        </div>
        <div className="mt-12 border-t border-border pt-6">
          <Link to="/insights" className="text-sm text-muted-foreground hover:text-foreground">
            ← All insights
          </Link>
        </div>
      </article>
    </>
  );
}

export default InsightDetail;
