import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/firebase/client";
import { PageHero } from "@/components/page-hero";

export const Route = createFileRoute("/case-studies/$slug")({
  component: CaseStudyDetail,
  notFoundComponent: () => (
    <div className="container mx-auto px-4 py-20 text-center">Case study not found.</div>
  ),
  errorComponent: ({ error }) => (
    <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">
      {error.message}
    </div>
  ),
});

function CaseStudyDetail() {
  const { slug } = Route.useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["case_study", slug],
    queryFn: async () => {
      const { data } = await supabase
        .from("case_studies")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      return data;
    },
  });
  if (!isLoading && !data) throw notFound();
  if (!data) return null;
  const results = (data.results as Array<{ label: string; value: string }>) ?? [];

  return (
    <>
      <PageHero
        eyebrow={`${data.client}${data.industry ? ` · ${data.industry}` : ""}`}
        title={data.title}
        subtitle={data.summary ?? undefined}
      />
      <section className="container mx-auto grid gap-12 px-4 py-16 lg:grid-cols-[2fr_1fr]">
        <article className="prose prose-lg max-w-none whitespace-pre-line text-foreground/90">
          {data.body}
        </article>
        <aside className="h-fit space-y-px border border-border bg-border">
          {results.map((r, i) => (
            <div key={i} className="bg-surface p-5">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">{r.label}</p>
              <p className="mt-1 font-display text-2xl font-bold">{r.value}</p>
            </div>
          ))}
          <div className="bg-background p-5">
            <Link to="/contact" className="text-sm font-medium text-primary hover:underline">
              Start a similar search →
            </Link>
          </div>
        </aside>
      </section>
    </>
  );
}
