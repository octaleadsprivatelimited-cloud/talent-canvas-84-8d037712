import { createFileRoute, Link } from "@tanstack/react-router";
import { useQueries } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

const counters = [
  { key: "services", label: "Services", to: "/admin/services" },
  { key: "industries", label: "Industries", to: "/admin/industries" },
  { key: "team_members", label: "Team Members", to: "/admin/team" },
  { key: "case_studies", label: "Case Studies", to: "/admin/case-studies" },
  { key: "posts", label: "Insights", to: "/admin/insights" },
  { key: "testimonials", label: "Testimonials", to: "/admin/testimonials" },
  { key: "contact_submissions", label: "Inbox", to: "/admin/submissions" },
  { key: "jobs", label: "Jobs", to: "/jobs" },
] as const;

function AdminDashboard() {
  const queries = useQueries({
    queries: counters.map((c) => ({
      queryKey: ["count", c.key],
      queryFn: async () => {
        const { count } = await supabase.from(c.key).select("*", { count: "exact", head: true });
        return count ?? 0;
      },
    })),
  });

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">Manage every piece of content on the public site.</p>
      <div className="mt-8 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
        {counters.map((c, i) => (
          <Link key={c.key} to={c.to} className="bg-background p-5 hover:bg-surface">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">{c.label}</p>
            <p className="mt-2 font-display text-3xl font-bold">{queries[i].data ?? "—"}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
