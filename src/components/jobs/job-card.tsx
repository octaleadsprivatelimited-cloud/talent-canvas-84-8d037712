import { Link } from "@tanstack/react-router";
import { MapPin, Briefcase, DollarSign, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export type JobCardData = {
  id: string;
  slug: string;
  title: string;
  location: string | null;
  work_mode: string;
  job_type: string;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string | null;
  featured: boolean;
  created_at: string;
  companies: {
    name: string;
    slug: string;
    logo_url: string | null;
    industry: string | null;
  } | null;
};

function formatSalary(min: number | null, max: number | null, ccy: string | null) {
  if (!min && !max) return null;
  const fmt = (n: number) => `${(n / 1000).toFixed(0)}k`;
  const c = ccy === "USD" ? "$" : (ccy ?? "$");
  if (min && max) return `${c}${fmt(min)} – ${c}${fmt(max)}`;
  return `${c}${fmt(min ?? max ?? 0)}+`;
}

function timeAgo(iso: string) {
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (d <= 0) return "today";
  if (d === 1) return "1 day ago";
  if (d < 30) return `${d} days ago`;
  const m = Math.floor(d / 30);
  return `${m}mo ago`;
}

export function JobCard({ job }: { job: JobCardData }) {
  const salary = formatSalary(job.salary_min, job.salary_max, job.salary_currency);
  return (
    <Link to="/jobs/$slug" params={{ slug: job.slug }} className="block group">
      <Card className="relative h-full p-5 transition-all hover:border-primary/40 hover:shadow-elevated">
        {job.featured && (
          <Badge className="absolute right-4 top-4 bg-accent text-accent-foreground hover:bg-accent">
            Featured
          </Badge>
        )}
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            {job.companies?.logo_url ? (
              <img src={job.companies.logo_url} alt="" className="h-full w-full rounded-lg object-cover" />
            ) : (
              <Building2 className="h-5 w-5" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-1 font-display text-base font-semibold transition-colors group-hover:text-primary">
              {job.title}
            </h3>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {job.companies?.name ?? "Company"}
            </p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
          {job.location && (
            <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{job.location}</span>
          )}
          <span className="flex items-center gap-1.5 capitalize"><Briefcase className="h-3.5 w-3.5" />{job.job_type.replace("_", " ")}</span>
          {salary && (
            <span className="flex items-center gap-1.5"><DollarSign className="h-3.5 w-3.5" />{salary}</span>
          )}
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
          <Badge variant="secondary" className="capitalize">{job.work_mode}</Badge>
          <span className="text-xs text-muted-foreground">{timeAgo(job.created_at)}</span>
        </div>
      </Card>
    </Link>
  );
}
