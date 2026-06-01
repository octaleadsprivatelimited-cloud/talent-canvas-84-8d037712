import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Check } from "lucide-react";
import * as Icons from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageHero } from "@/components/page-hero";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/services/$slug")({
  component: ServiceDetail,
  errorComponent: ({ error }) => <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">{error.message}</div>,
  notFoundComponent: () => <div className="container mx-auto px-4 py-20 text-center">Service not found.</div>,
});

function ServiceDetail() {
  const { slug } = Route.useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["service", slug],
    queryFn: async () => {
      const { data } = await supabase.from("services").select("*").eq("slug", slug).eq("published", true).maybeSingle();
      return data;
    },
  });

  if (!isLoading && !data) throw notFound();
  if (!data) return null;

  const Lucide = Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>;
  const Icon = (data.icon && Lucide[data.icon]) || Icons.Sparkles;

  return (
    <>
      <PageHero eyebrow="Service" title={data.title} subtitle={data.summary ?? undefined} />
      <section className="container mx-auto grid gap-12 px-4 py-16 lg:grid-cols-[2fr_1fr]">
        <div>
          <div className="mb-6 flex h-14 w-14 items-center justify-center border border-border">
            <Icon className="h-6 w-6" />
          </div>
          <div className="prose prose-lg max-w-none whitespace-pre-line text-foreground/90">
            {data.body}
          </div>
          {data.features && data.features.length > 0 && (
            <div className="mt-10">
              <h3 className="mb-4 font-display text-xl font-semibold">What's included</h3>
              <ul className="grid gap-3 sm:grid-cols-2">
                {data.features.map((f: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 border border-border p-4">
                    <Check className="mt-0.5 h-4 w-4 text-primary" /> <span className="text-sm">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <aside className="h-fit border border-border bg-surface p-6">
          <h4 className="font-display text-lg font-bold">Start a conversation</h4>
          <p className="mt-2 text-sm text-muted-foreground">Tell us about the role. We'll respond within one business day with next steps.</p>
          <Button asChild className="mt-5 w-full">
            <Link to="/contact">Book an intro call <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
          <Link to="/services" className="mt-4 block text-center text-xs text-muted-foreground hover:text-foreground">← All services</Link>
        </aside>
      </section>
    </>
  );
}
