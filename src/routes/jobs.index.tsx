import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { JobCard, type JobCardData } from "@/components/jobs/job-card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { DynamicSeo } from "@/components/dynamic-seo";

export const Route = createFileRoute("/jobs/")({
  head: () => ({ meta: [{ title: "Jobs — Hireloop" }, { name: "description", content: "Browse open roles." }] }),
  component: JobsPage,
});

function JobsPage() {
  const [q, setQ] = useState("");
  const { data, isLoading } = useQuery({
    queryKey: ["jobs", "all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("id,slug,title,location,work_mode,job_type,salary_min,salary_max,salary_currency,featured,created_at,companies(name,slug,logo_url,industry)")
        .eq("status", "published")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as unknown as JobCardData[];
    },
  });

  const filtered = data?.filter((j) =>
    !q || j.title.toLowerCase().includes(q.toLowerCase()) || j.companies?.name.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-10">
      <DynamicSeo pageKey="jobs" fallbackTitle="Jobs" fallbackDescription="Browse open roles." />
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold md:text-4xl">All open roles</h1>
        <p className="mt-2 text-muted-foreground">{data?.length ?? 0} jobs available right now</p>
      </div>
      <div className="mb-6 flex items-center gap-2 rounded-xl border border-border bg-card p-2">
        <Search className="ml-2 h-4 w-4 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by title or company" className="border-0 focus-visible:ring-0" />
      </div>
      {isLoading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered?.map((j) => <JobCard key={j.id} job={j} />)}
        </div>
      )}
    </div>
  );
}
