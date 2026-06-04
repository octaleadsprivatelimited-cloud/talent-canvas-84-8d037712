import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import * as Icons from "lucide-react";
import { supabase } from "@/integrations/firebase/client";
import { PageHero } from "@/components/page-hero";
import { DynamicSeo } from "@/components/dynamic-seo";

export const Route = createFileRoute("/industries_/")({
  head: () => ({
    meta: [
      { title: "Industries We Serve" },
      {
        name: "description",
        content:
          "Recruiting across tech, finance, healthcare, industrial, consumer, and professional services.",
      },
    ],
  }),
  component: IndustriesPage,
});

function IndustriesPage() {
  const { data } = useQuery({
    queryKey: ["industries"],
    queryFn: async () => {
      const { data } = await supabase
        .from("industries")
        .select("*")
        .eq("published", true)
        .order("sort_order");
      return data ?? [];
    },
  });
  const Lucide = Icons as unknown as Record<
    string,
    React.ComponentType<{ className?: string; strokeWidth?: number }>
  >;

  return (
    <>
      <DynamicSeo
        pageKey="industries"
        fallbackTitle="Industries We Serve"
        fallbackDescription="Recruiting across tech, finance, healthcare, industrial, consumer, and professional services."
      />
      <PageHero
        eyebrow="Industries"
        title="Sector expertise that compounds."
        subtitle="We don't generalize. Each practice is led by partners with decades inside the industry."
      />
      <section className="container mx-auto px-4 py-20">
        <div className="grid gap-px bg-border md:grid-cols-2 lg:grid-cols-3">
          {data?.map((ind: any) => {
            const Icon = (ind.icon && Lucide[ind.icon]) || Icons.Building2;
            return (
              <Link
                key={ind.id}
                to="/industries/$slug"
                params={{ slug: ind.slug }}
                className="flex flex-col gap-3 bg-background p-8 hover:bg-surface/50 transition group"
              >
                <div className="flex h-11 w-11 items-center justify-center border border-border group-hover:border-primary transition">
                  <Icon
                    className="h-5 w-5 text-muted-foreground group-hover:text-primary transition"
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="font-display text-xl font-bold group-hover:text-primary transition">
                  {ind.label}
                </h3>
                <p className="text-sm text-muted-foreground">{ind.description}</p>
                <span className="mt-6 text-xs font-semibold text-primary/80 group-hover:text-primary flex items-center gap-1 transition">
                  Explore Sector <Icons.ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
