import { Link, useParams } from "react-router-dom";
import { useFirebaseQuery } from "@/hooks/use-firebase-query";
import { firebase } from "@/integrations/firebase/client";
import { PageHero } from "@/components/page-hero";

function InsightDetail() {
  const { slug } = useParams();
  const { data, isLoading } = useFirebaseQuery(["post", slug], async () => {
    const { data } = await firebase
      .from("posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();
    return data;
  });
  if (!isLoading && !data) throw notFound();
  if (!data) return null;

  return (
    <>
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
