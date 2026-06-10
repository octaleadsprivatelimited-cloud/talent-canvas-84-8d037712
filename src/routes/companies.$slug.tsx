import { createFileRoute, Link } from "@tanstack/react-router";
import { useFirebaseQuery } from "@/hooks/use-firebase-query";
import { Building2, Globe, MapPin } from "lucide-react";
import { firebase } from "@/integrations/firebase/client";
import { JobCard, type JobCardData } from "@/components/jobs/job-card";

export const Route = createFileRoute("/companies/$slug")({
  component: CompanyDetail,
});

function CompanyDetail() {
  const { slug } = Route.useParams();
  const { data: company } = useFirebaseQuery(["company", slug], async () => {
    const { data, error } = await firebase
      .from("companies")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw error;
    return data;
  });

  const { data: jobs } = useFirebaseQuery(
    ["company-jobs", company?.id],
    async () => {
      const { data, error } = await firebase
        .from("jobs")
        .select(
          "id,slug,title,location,work_mode,job_type,salary_min,salary_max,salary_currency,featured,created_at,companies(name,slug,logo_url,industry)",
        )
        .eq("company_id", company!.id)
        .eq("status", "published");
      if (error) throw error;
      return data as unknown as JobCardData[];
    },
    { enabled: !!company?.id },
  );

  if (!company) return <div className="container mx-auto px-4 py-10">Loading…</div>;

  return (
    <div className="container mx-auto max-w-5xl px-4 py-10">
      <div className="rounded-2xl border border-border bg-gradient-subtle p-8">
        <div className="flex flex-wrap items-start gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-card shadow-sm">
            <Building2 className="h-7 w-7 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <h1 className="font-display text-3xl font-bold">{company.name}</h1>
            {company.tagline && <p className="mt-1 text-muted-foreground">{company.tagline}</p>}
            <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
              {company.industry && <span>{company.industry}</span>}
              {company.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {company.location}
                </span>
              )}
              {company.website && (
                <a href={company.website} className="flex items-center gap-1 hover:text-primary">
                  <Globe className="h-4 w-4" />
                  Website
                </a>
              )}
            </div>
          </div>
        </div>
        {company.about && <p className="mt-6 text-foreground/90">{company.about}</p>}
      </div>

      <h2 className="mt-10 font-display text-2xl font-bold">Open roles ({jobs?.length ?? 0})</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {jobs?.map((j) => (
          <JobCard key={j.id} job={j} />
        ))}
      </div>
      {jobs && jobs.length === 0 && (
        <p className="mt-4 text-muted-foreground">
          No open roles right now.{" "}
          <Link to="/jobs" className="text-primary underline">
            Browse all jobs
          </Link>
        </p>
      )}
    </div>
  );
}
