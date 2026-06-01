import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Search, MapPin, ArrowRight, Briefcase, Users, Building2, Globe } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { JobCard, type JobCardData } from "@/components/jobs/job-card";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hireloop — Find your next role" },
      { name: "description", content: "Browse thousands of jobs from leading companies. Apply in one click." },
    ],
  }),
  component: Index,
});

const stats = [
  { icon: Briefcase, value: "12,400+", label: "Open jobs" },
  { icon: Building2, value: "3,200+", label: "Companies" },
  { icon: Users, value: "180k+", label: "Candidates" },
  { icon: Globe, value: "65", label: "Countries" },
];

function Index() {
  const [q, setQ] = useState("");
  const [loc, setLoc] = useState("");

  const { data: featuredJobs } = useQuery({
    queryKey: ["jobs", "featured"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("id,slug,title,location,work_mode,job_type,salary_min,salary_max,salary_currency,featured,created_at,companies(name,slug,logo_url,industry)")
        .eq("status", "published")
        .eq("featured", true)
        .order("created_at", { ascending: false })
        .limit(6);
      if (error) throw error;
      return data as unknown as JobCardData[];
    },
  });

  const { data: companies } = useQuery({
    queryKey: ["companies", "featured"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("companies")
        .select("id,name,slug,logo_url,industry")
        .eq("featured", true)
        .limit(6);
      if (error) throw error;
      return data;
    },
  });

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (loc) params.set("location", loc);
    window.location.href = `/jobs?${params.toString()}`;
  };

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_50%)]" />
        <div className="container relative mx-auto px-4 py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-display text-4xl font-bold text-balance text-primary-foreground md:text-6xl">
              Find work that <span className="text-accent">moves you forward</span>
            </h1>
            <p className="mt-5 text-lg text-primary-foreground/80 md:text-xl">
              Curated roles from the world's most ambitious teams. Apply in one click.
            </p>

            <form onSubmit={search} className="mx-auto mt-10 flex max-w-2xl flex-col gap-2 rounded-2xl bg-surface-elevated p-2 shadow-elevated sm:flex-row">
              <div className="flex flex-1 items-center gap-2 px-3">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Job title or keyword" className="border-0 bg-transparent focus-visible:ring-0" />
              </div>
              <div className="hidden h-8 w-px bg-border sm:block" />
              <div className="flex flex-1 items-center gap-2 px-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <Input value={loc} onChange={(e) => setLoc(e.target.value)} placeholder="Location or remote" className="border-0 bg-transparent focus-visible:ring-0" />
              </div>
              <Button type="submit" size="lg" className="shrink-0">Search jobs</Button>
            </form>

            <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <s.icon className="mx-auto h-5 w-5 text-accent" />
                  <p className="mt-2 font-display text-2xl font-bold text-primary-foreground md:text-3xl">{s.value}</p>
                  <p className="text-xs text-primary-foreground/70">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured jobs */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold text-primary">Hand-picked</p>
            <h2 className="mt-1 font-display text-3xl font-bold md:text-4xl">Featured opportunities</h2>
          </div>
          <Button variant="ghost" asChild className="hidden sm:flex">
            <Link to="/jobs">View all <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {featuredJobs?.map((job) => <JobCard key={job.id} job={job} />)}
        </div>
      </section>

      {/* Top employers */}
      <section className="bg-surface py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-sm font-semibold text-primary">Top employers</p>
            <h2 className="mt-1 font-display text-3xl font-bold md:text-4xl">Companies hiring now</h2>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {companies?.map((c) => (
              <Link key={c.id} to="/companies/$slug" params={{ slug: c.slug }} className="group flex items-center gap-4 rounded-xl border border-border bg-card p-5 transition hover:border-primary/40 hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-semibold group-hover:text-primary">{c.name}</p>
                  <p className="text-sm text-muted-foreground">{c.industry}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="overflow-hidden rounded-3xl bg-gradient-hero p-10 md:p-16">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold text-primary-foreground md:text-4xl">
              Ready to make your next move?
            </h2>
            <p className="mt-4 text-primary-foreground/80">
              Create a free profile and let great companies discover you.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/signup">Create profile</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                <Link to="/jobs">Browse jobs</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
