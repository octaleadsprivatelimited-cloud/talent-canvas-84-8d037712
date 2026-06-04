import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";
import { supabase } from "@/integrations/firebase/client";
import { PageHero } from "@/components/page-hero";
import { DynamicSeo } from "@/components/dynamic-seo";

export const Route = createFileRoute("/case-studies/")({
  head: () => ({
    meta: [
      { title: "Case Studies" },
      {
        name: "description",
        content: "How we've helped companies build leadership teams and ship outcomes.",
      },
    ],
  }),
  component: CaseStudiesIndex,
});

function CaseStudiesIndex() {
  const { data } = useQuery({
    queryKey: ["case_studies"],
    queryFn: async () => {
      const { data } = await supabase
        .from("case_studies")
        .select("*")
        .eq("published", true)
        .order("sort_order");
      return data ?? [];
    },
  });

  return (
    <>
      <DynamicSeo
        pageKey="case-studies"
        fallbackTitle="Case Studies"
        fallbackDescription="How we've helped companies build leadership teams and ship outcomes."
      />
      <PageHero
        eyebrow="Case studies"
        title="The work, in our clients' words."
        subtitle="Outcomes-first stories from the searches we've run."
      />
      <section className="container mx-auto px-4 py-20">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {data?.map((cs: any) => (
            <Link
              key={cs.id}
              to="/case-studies/$slug"
              params={{ slug: cs.slug }}
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
      </section>
    </>
  );
}
