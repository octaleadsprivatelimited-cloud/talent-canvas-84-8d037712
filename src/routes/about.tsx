import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageHero } from "@/components/page-hero";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us" },
      { name: "description", content: "Our mission, values, and how we work with companies to build leadership teams." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { data: page } = useQuery({
    queryKey: ["page_content", "about"],
    queryFn: async () => {
      const { data } = await supabase.from("page_content").select("content").eq("page_key", "about").maybeSingle();
      return (data?.content as Record<string, unknown>) ?? {};
    },
  });

  const title = (page?.title as string) ?? "About us";
  const intro = (page?.intro as string) ?? "";
  const mission = (page?.mission as string) ?? "";
  const values = (page?.values as string[]) ?? [];

  return (
    <>
      <PageHero eyebrow="Our story" title={title} subtitle={intro} />
      <section className="container mx-auto grid gap-12 px-4 py-20 md:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Mission</p>
          <h2 className="mt-3 font-display text-3xl font-bold leading-tight">{mission}</h2>
        </div>
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">What we stand for</p>
          <ul className="space-y-3">
            {values.map((v, i) => (
              <li key={i} className="flex items-start gap-3 border-l-2 border-primary bg-surface p-4">
                <Check className="mt-0.5 h-5 w-5 text-primary" />
                <span className="font-medium">{v}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="border-t border-border bg-surface">
        <div className="container mx-auto grid gap-8 px-4 py-16 sm:grid-cols-4">
          {[
            { k: "Founded", v: "2008" },
            { k: "Placements", v: "1,800+" },
            { k: "Operating in", v: "India and USA" },
            { k: "Retention @ 18mo", v: "92%" },
          ].map((s) => (
            <div key={s.k}>
              <p className="font-display text-4xl font-bold">{s.v}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.k}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
