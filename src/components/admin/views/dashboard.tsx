import { Link } from "@tanstack/react-router";
import { useQueries } from "@tanstack/react-query";
import { firebase } from "@/integrations/firebase/client";

const counters = [
  { key: "services", label: "Services", to: "services" },
  { key: "industries", label: "Industries", to: "industries" },
  { key: "team_members", label: "Team Members", to: "team" },
  { key: "case_studies", label: "Case Studies", to: "case-studies" },
  { key: "posts", label: "Insights", to: "insights" },
  { key: "testimonials", label: "Testimonials", to: "testimonials" },
  { key: "contact_submissions", label: "Inbox", to: "submissions" },
  { key: "jobs", label: "Jobs", to: "/jobs" },
] as const;

export function AdminDashboard({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const queries = useQueries({
    queries: counters.map((c) => ({
      queryKey: ["count", c.key],
      queryFn: async () => {
        const { count } = await firebase.from(c.key).select("*", { count: "exact", head: true });
        return count ?? 0;
      },
    })),
  });

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Manage every piece of content on the public site.
      </p>
      <div className="mt-8 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
        {counters.map((c, i) => {
          if (c.key === "jobs") {
            return (
              <Link key={c.key} to={c.to} className="bg-background p-5 hover:bg-surface block">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{c.label}</p>
                <p className="mt-2 font-display text-3xl font-bold">{queries[i].data ?? "—"}</p>
              </Link>
            );
          }
          return (
            <button
              key={c.key}
              type="button"
              onClick={() => setActiveTab(c.to)}
              className="bg-background p-5 hover:bg-surface block text-left w-full cursor-pointer"
            >
              <p className="text-xs uppercase tracking-wider text-muted-foreground">{c.label}</p>
              <p className="mt-2 font-display text-3xl font-bold">{queries[i].data ?? "—"}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
