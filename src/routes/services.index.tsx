import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import * as Icons from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageHero } from "@/components/page-hero";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: "Services — Executive Search, RPO & Talent Advisory" },
      { name: "description", content: "Executive search, contract staffing, RPO, and talent advisory services for high-growth companies." },
      { property: "og:title", content: "Our Services" },
      { property: "og:description", content: "Executive search, contract staffing, RPO and talent advisory." },
    ],
  }),
  component: ServicesPage,
});

function getIcon(name?: string | null) {
  const Lucide = (Icons as unknown as Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>>);
  const Icon = (name && Lucide[name]) || Icons.Sparkles;
  return Icon;
}

function ServicesPage() {
  const { data } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data } = await supabase.from("services").select("*").eq("published", true).order("sort_order");
      return data ?? [];
    },
  });

  return (
    <>
      <PageHero
        eyebrow="What we do"
        title="Recruiting services built for companies that ship."
        subtitle="Four practice areas. One standard: senior talent, vetted hard, hired fast."
      />
      <section className="container mx-auto px-4 py-20">
        <div className="grid gap-px bg-border md:grid-cols-2">
          {data?.map((s) => {
            const Icon = getIcon(s.icon);
            return (
              <Link
                key={s.id}
                to="/services/$slug"
                params={{ slug: s.slug }}
                className="group flex flex-col gap-4 bg-background p-8 transition-colors hover:bg-surface"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center border border-border">
                    <Icon className="h-5 w-5" strokeWidth={1.5} />
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                </div>
                <h3 className="font-display text-2xl font-bold">{s.title}</h3>
                <p className="text-muted-foreground">{s.summary}</p>
                {s.features && s.features.length > 0 && (
                  <ul className="mt-2 space-y-2">
                    {s.features.slice(0, 4).map((f: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check className="mt-0.5 h-4 w-4 text-primary" /> {f}
                      </li>
                    ))}
                  </ul>
                )}
              </Link>
            );
          })}
        </div>
        <div className="mt-12 flex justify-center">
          <Button size="lg" asChild>
            <Link to="/contact">Talk to a partner <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>
    </>
  );
}
