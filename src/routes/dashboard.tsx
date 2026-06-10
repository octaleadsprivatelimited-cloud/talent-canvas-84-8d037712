import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useFirebaseQuery } from "@/hooks/use-firebase-query";
import { firebase } from "@/integrations/firebase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LogOut,
  Briefcase,
  Calendar,
  Building2,
  User,
  Mail,
  FileText,
  CheckCircle,
  ExternalLink,
  Compass,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

export default function UserDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Fetch applications for this candidate
  const { data: applications, isLoading: appsLoading } = useFirebaseQuery(
    ["user_applications", user?.id || ""],
    async () => {
      if (!user) return [];
      const { data, error } = await firebase
        .from("applications")
        .select("*, jobs(*)")
        .eq("candidate_id", user.id);
      if (error) throw error;
      return data ?? [];
    },
    { enabled: !!user },
  );

  // Fetch some open jobs for recommendations
  const { data: recommendedJobs, isLoading: jobsLoading } = useFirebaseQuery(
    "recommended_jobs",
    async () => {
      const { data, error } = await firebase
        .from("jobs")
        .select("*, companies(*)")
        .limit(3);
      if (error) throw error;
      return data ?? [];
    },
  );

  const handleSignOut = async () => {
    try {
      await firebase.auth.signOut();
      toast.success("Successfully signed out");
      navigate("/");
    } catch (err) {
      toast.error("Failed to sign out");
    }
  };

  if (!user) return null;

  const getStatusColor = (status: string = "pending") => {
    switch (status.toLowerCase()) {
      case "accepted":
      case "hired":
        return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30";
      case "interviewing":
      case "scheduled":
        return "bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30";
      case "reviewed":
        return "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30";
      case "rejected":
        return "bg-destructive/15 text-destructive border-destructive/30";
      case "pending":
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 md:p-8 shadow-sm mb-10">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute right-0 top-0 h-[300px] w-[300px] rounded-full bg-primary/5 blur-3xl" />
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 shrink-0 rounded-2xl bg-primary/10 flex items-center justify-center overflow-hidden border border-primary/20">
                {user.user_metadata?.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt={user.user_metadata?.name || "Avatar"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-7 w-7 text-primary" />
                )}
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold md:text-3xl">
                  Hello, {user.user_metadata?.name || user.email?.split("@")[0] || "Candidate"}!
                </h1>
                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-4 w-4" />
                    {user.email}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1.5 font-medium text-primary capitalize">
                    Candidate Profile
                  </span>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={handleSignOut}
              className="self-start md:self-auto gap-2 border-border/80 hover:bg-destructive/5 hover:text-destructive cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          
          {/* Applications list */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold tracking-tight">
                My Applications ({applications?.length ?? 0})
              </h2>
              <Link to="/jobs" className="text-xs font-semibold uppercase tracking-wider text-primary hover:underline flex items-center gap-1">
                Browse More Jobs <Compass className="h-3.5 w-3.5" />
              </Link>
            </div>

            {appsLoading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="h-28 w-full animate-pulse rounded-2xl border border-border bg-card/50" />
                ))}
              </div>
            ) : applications && applications.length > 0 ? (
              <div className="space-y-4">
                {applications.map((app: any) => {
                  const job = app.jobs;
                  const company = job?.companies;
                  const appliedDate = app.created_at || app.createdAt
                    ? new Date(app.created_at || app.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Recently";

                  return (
                    <div
                      key={app.id}
                      className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 transition duration-300 hover:shadow-md hover:border-border/80"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex gap-3.5 items-start">
                          <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground border border-border/60">
                            <Building2 className="h-5 w-5" />
                          </div>
                          <div>
                            {job ? (
                              <Link
                                to={`/jobs/${job.slug}`}
                                className="font-display text-base font-semibold group-hover:text-primary transition-colors flex items-center gap-1"
                              >
                                {job.title}
                                <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </Link>
                            ) : (
                              <span className="font-display text-base font-semibold">Unknown Job Position</span>
                            )}
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {company?.name || "Company Details Pending"}
                            </p>
                            
                            <div className="mt-2.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Calendar className="h-3.5 w-3.5" />
                              Applied: {appliedDate}
                            </div>
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t border-border/40 sm:border-t-0 pt-3 sm:pt-0 gap-2">
                          <Badge variant="outline" className={`capitalize py-0.5 px-2.5 font-medium ${getStatusColor(app.status)}`}>
                            {app.status || "Applied"}
                          </Badge>
                          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold hidden sm:inline">
                            Status
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border bg-card/40 p-12 text-center flex flex-col items-center justify-center">
                <FileText className="h-10 w-10 text-muted-foreground/60 mb-3" />
                <h3 className="font-display text-base font-semibold">No Applications Yet</h3>
                <p className="text-xs text-muted-foreground max-w-xs mt-1">
                  You haven't submitted any job applications yet. Visit the jobs board to find your next opportunity.
                </p>
                <Button asChild size="sm" className="mt-5 rounded-full cursor-pointer">
                  <Link to="/jobs">
                    Explore Jobs <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar: Recommended jobs & Profile statistics */}
          <div className="space-y-6">
            <h2 className="font-display text-xl font-bold tracking-tight">
              Recommended Jobs
            </h2>

            {jobsLoading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="h-24 w-full animate-pulse rounded-2xl border border-border bg-card/50" />
                ))}
              </div>
            ) : recommendedJobs && recommendedJobs.length > 0 ? (
              <div className="space-y-4">
                {recommendedJobs.map((j: any) => (
                  <div
                    key={j.id}
                    className="rounded-2xl border border-border bg-card p-4 transition duration-300 hover:border-primary/40 flex flex-col justify-between"
                  >
                    <div>
                      <h3 className="font-display text-sm font-semibold truncate">
                        {j.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {j.companies?.name}
                      </p>
                      <div className="mt-2.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Briefcase className="h-3 w-3 shrink-0" />
                        <span className="capitalize">{j.job_type.replace("_", " ")}</span>
                        <span>·</span>
                        <span className="capitalize">{j.work_mode}</span>
                      </div>
                    </div>

                    <Link
                      to={`/jobs/${j.slug}`}
                      className="mt-4 text-xs font-bold uppercase tracking-wider text-primary hover:underline self-end flex items-center gap-1"
                    >
                      View Details <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-border bg-card p-5 text-center text-xs text-muted-foreground">
                No job recommendations available at this time.
              </div>
            )}
            
            {/* Quick stats box */}
            <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
              <h3 className="font-display text-sm font-bold">Portal Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-xs pb-2 border-b border-border/40">
                  <span className="text-muted-foreground">Verification status:</span>
                  <span className="font-medium text-emerald-600 flex items-center gap-1">
                    <CheckCircle className="h-3.5 w-3.5 fill-emerald-100" /> Active
                  </span>
                </div>
                <div className="flex justify-between text-xs pb-2 border-b border-border/40">
                  <span className="text-muted-foreground">Account provider:</span>
                  <span className="font-medium capitalize">{user.app_metadata?.provider || "Google"}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Application limit:</span>
                  <span className="font-medium text-foreground">Unlimited</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

// React dependency for hook usage on redirect
import { useEffect } from "react";
