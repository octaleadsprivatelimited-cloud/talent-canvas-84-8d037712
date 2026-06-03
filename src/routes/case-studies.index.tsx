import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageHero } from "@/components/page-hero";
import { DynamicSeo } from "@/components/dynamic-seo";

export const Route = createFileRoute("/case-studies/")({
  head: () => ({
    meta: [
      { title: "Case Studies" },
      { name: "description", content: "How we've helped companies build leadership teams and ship outcomes." },
    ],
  }),
  component: CaseStudiesIndex,
});

function CaseStudiesIndex() {
  const { data } = useQuery({
    queryKey: ["case_studies"],
    queryFn: async () => {
      const { data } = await supabase.from("case_studies").select("*").eq("published", true).order("sort_order");
      return data ?? [];
    },
  });

  return (
    <>
      <DynamicSeo pageKey="case-studies" fallbackTitle="Case Studies" fallbackDescription="How we've helped companies build leadership teams and ship outcomes." />
      <PageHero eyebrow="Case studies" title="The work, in our clients' words." subtitle="Outcomes-first stories from the searches we've run." />
      <section className="container mx-auto px-4 py-20">
        <div className="grid gap-px bg-border md:grid-cols-2">
          {data?.map((cs) => (
            <Link key={cs.id} to="/case-studies/$slug" params={{ slug: cs.slug }} className="group flex flex-col gap-4 bg-background p-8 hover:bg-surface">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{cs.client} {cs.industry && `· ${cs.industry}`}</p>
              <h3 className="font-display text-2xl font-bold leading-tight">{cs.title}</h3>
              <p className="text-muted-foreground">{cs.summary}</p>
              <div className="mt-auto flex items-center gap-2 text-sm font-medium text-primary">Read case <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
