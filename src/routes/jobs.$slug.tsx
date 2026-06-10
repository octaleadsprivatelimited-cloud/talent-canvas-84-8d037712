import { Link, useParams } from "react-router-dom";
import { useFirebaseQuery } from "@/hooks/use-firebase-query";
import { Building2, MapPin, Briefcase, DollarSign, ArrowLeft } from "lucide-react";
import { firebase } from "@/integrations/firebase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

function JobDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const { data: job, isLoading, error } = useFirebaseQuery(["job", slug], async () => {
    const { data, error } = await firebase
      .from("jobs")
      .select("*, companies(*)")
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw error;
    return data;
  });

  const apply = async () => {
    if (!user) {
      window.location.href = "/contact";
      return;
    }
    if (!job) return;
    const { error } = await firebase
      .from("applications")
      .insert({ job_id: job.id, candidate_id: user.id });
    if (error) toast.error(error.message);
    else toast.success("Application submitted!");
  };

  if (isLoading) return <div className="container mx-auto px-4 py-10">Loading…</div>;
  if (error || !job) {
    return (
      <div className="flex-1 flex items-center justify-center py-20 bg-background text-foreground">
        <div className="text-center">
          <h1 className="text-4xl font-bold">404 - Job Not Found</h1>
          <p className="mt-2 text-muted-foreground">The job listing you are looking for does not exist.</p>
          <Link to="/jobs" className="mt-4 inline-block text-primary underline">Back to All Jobs</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-10">
      <Link
        to="/jobs"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> All jobs
      </Link>
      <div className="rounded-2xl border border-border bg-card p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted">
            <Building2 className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <h1 className="font-display text-2xl font-bold md:text-3xl">{job.title}</h1>
            <Link
              to={`/companies/${job.companies?.slug ?? ""}`}
              className="mt-1 inline-block text-muted-foreground hover:text-primary"
            >
              {job.companies?.name}
            </Link>
          </div>
          {job.featured && <Badge className="bg-accent text-accent-foreground">Featured</Badge>}
        </div>
        <div className="mt-6 flex flex-wrap gap-3 text-sm text-muted-foreground">
          {job.location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {job.location}
            </span>
          )}
          <span className="flex items-center gap-1.5 capitalize">
            <Briefcase className="h-4 w-4" />
            {(job.job_type || "full_time").replace("_", " ")}
          </span>
          {(job.salary_min || job.salary_max) && (
            <span className="flex items-center gap-1.5">
              <DollarSign className="h-4 w-4" />
              {job.salary_min}–{job.salary_max} {job.salary_currency}
            </span>
          )}
          <Badge variant="secondary" className="capitalize">
            {job.work_mode || "remote"}
          </Badge>
        </div>
        <div className="mt-8 whitespace-pre-wrap text-foreground/90">{job.description}</div>
        {job.skills && job.skills.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {job.skills.map((s: string) => (
              <Badge key={s} variant="outline">
                {s}
              </Badge>
            ))}
          </div>
        )}
        <div className="mt-8 flex gap-3 border-t border-border pt-6">
          <Button size="lg" onClick={apply}>
            Apply now
          </Button>
        </div>
      </div>
    </div>
  );
}

export default JobDetail;
