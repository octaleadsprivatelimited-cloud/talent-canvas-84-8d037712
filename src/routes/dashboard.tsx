import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Briefcase, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Hireloop" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { user, loading } = useAuth();

  const { data: applications } = useQuery({
    queryKey: ["my-applications", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("applications")
        .select("id,status,created_at,jobs(title,slug,companies(name))")
        .eq("candidate_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  if (loading) return <div className="container mx-auto px-4 py-10">Loading…</div>;
  if (!user) {
    if (typeof window !== "undefined") window.location.href = "/login";
    return null;
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-display text-3xl font-bold">Welcome back</h1>
      <p className="mt-1 text-muted-foreground">{user.email}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <Briefcase className="h-5 w-5 text-primary" />
          <p className="mt-3 font-display text-2xl font-bold">{applications?.length ?? 0}</p>
          <p className="text-sm text-muted-foreground">Applications</p>
        </Card>
      </div>

      <h2 className="mt-10 font-display text-xl font-bold">Your applications</h2>
      <div className="mt-4 space-y-3">
        {applications?.length === 0 && (
          <Card className="p-8 text-center">
            <FileText className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 text-muted-foreground">No applications yet. <Link to="/jobs" className="text-primary underline">Browse jobs</Link></p>
          </Card>
        )}
        {applications?.map((a: any) => (
          <Card key={a.id} className="flex items-center justify-between p-4">
            <div>
              <Link to="/jobs/$slug" params={{ slug: a.jobs?.slug ?? "" }} className="font-semibold hover:text-primary">
                {a.jobs?.title}
              </Link>
              <p className="text-sm text-muted-foreground">{a.jobs?.companies?.name}</p>
            </div>
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium capitalize">{a.status}</span>
          </Card>
        ))}
      </div>
    </div>
  );
}
