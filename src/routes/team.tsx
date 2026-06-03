import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Linkedin, Mail } from "lucide-react";
import { supabase } from "@/integrations/firebase/client";
import { PageHero } from "@/components/page-hero";
import { DynamicSeo } from "@/components/dynamic-seo";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "Our Team" },
      { name: "description", content: "Meet the partners and consultants behind our practice." },
    ],
  }),
  component: TeamPage,
});

function TeamPage() {
  const { data } = useQuery({
    queryKey: ["team_members"],
    queryFn: async () => {
      const { data } = await supabase
        .from("team_members")
        .select("*")
        .eq("published", true)
        .order("sort_order");
      return data ?? [];
    },
  });

  return (
    <>
      <DynamicSeo
        pageKey="team"
        fallbackTitle="Our Team"
        fallbackDescription="Meet the partners and consultants behind our practice."
      />
      <PageHero
        eyebrow="Our team"
        title="Partners and consultants you'll actually talk to."
        subtitle="No layered account management. The person on your first call leads your search."
      />
      <section className="container mx-auto px-4 py-20">
        <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
          {data?.map((m) => (
            <div key={m.id} className="bg-background p-6">
              <div className="aspect-[4/5] w-full overflow-hidden bg-surface">
                {m.photo_url ? (
                  <img src={m.photo_url} alt={m.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center font-display text-5xl text-muted-foreground">
                    {m.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                )}
              </div>
              <h3 className="mt-4 font-display text-xl font-bold">{m.name}</h3>
              <p className="text-sm text-primary">{m.role_title}</p>
              {m.bio && <p className="mt-2 text-sm text-muted-foreground">{m.bio}</p>}
              <div className="mt-3 flex gap-3">
                {m.email && (
                  <a
                    href={`mailto:${m.email}`}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Mail className="h-4 w-4" />
                  </a>
                )}
                {m.linkedin && (
                  <a href={m.linkedin} className="text-muted-foreground hover:text-foreground">
                    <Linkedin className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
