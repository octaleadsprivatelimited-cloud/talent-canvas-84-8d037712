import { useState } from "react";
import { useFirebaseQuery } from "@/hooks/use-firebase-query";
import { firebase } from "@/integrations/firebase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { seedDeployments } from "@/lib/github-seeder";
import {
  GitBranch,
  RefreshCw,
  ExternalLink,
  Cpu,
  Clock,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  Server,
} from "lucide-react";

export function DeploymentsAdmin() {
  const [syncing, setSyncing] = useState(false);

  const repo = import.meta.env.VITE_GITHUB_REPO || "octaleadsprivatelimited-cloud/talent-canvas-84-8d037712";

  const { data: deployments, isLoading, refetch } = useFirebaseQuery(
    "admin_deployments",
    async () => {
      const { data, error } = await firebase
        .from("deployments")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    }
  );

  const handleSync = async () => {
    setSyncing(true);
    const id = toast.loading("Syncing deployments from GitHub...");
    try {
      await seedDeployments();
      toast.success("Successfully synced deployments!", { id });
      refetch();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(`Sync failed: ${msg}`, { id });
    } finally {
      setSyncing(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case "failure":
      case "failed":
      case "error":
        return <XCircle className="h-4 w-4 text-rose-500" />;
      case "pending":
      case "queued":
      case "in_progress":
        return <RefreshCw className="h-4 w-4 text-amber-500 animate-spin" />;
      default:
        return <AlertCircle className="h-4 w-4 text-slate-400" />;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "success":
        return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20";
      case "failure":
      case "failed":
      case "error":
        return "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20";
      case "pending":
      case "queued":
      case "in_progress":
        return "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20";
      default:
        return "bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Deployments</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track recent build environments, git shas, and active deployment links from GitHub.
          </p>
        </div>
        <Button
          onClick={handleSync}
          disabled={syncing || isLoading}
          className="flex items-center gap-2 rounded-none bg-slate-900 px-6 py-5 text-[11px] font-bold uppercase tracking-[0.2em] text-white hover:bg-slate-800 disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${syncing ? "animate-spin" : ""}`} />
          {syncing ? "Syncing..." : "Sync from GitHub"}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex h-64 flex-col items-center justify-center gap-4 rounded-xl border border-border bg-card">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm font-medium text-muted-foreground">Loading deployments history...</p>
        </div>
      ) : deployments && deployments.length > 0 ? (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="px-6 py-4">Environment</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Commit / Ref</th>
                  <th className="px-6 py-4">Creator</th>
                  <th className="px-6 py-4">Deployment Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {deployments.map((dep: any) => {
                  const dateStr = dep.created_at
                    ? new Date(dep.created_at).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "—";

                  const shortSha = dep.sha ? dep.sha.substring(0, 7) : "—";
                  const commitUrl = dep.sha
                    ? `https://github.com/${repo}/commit/${dep.sha}`
                    : "#";

                  return (
                    <tr key={dep.id} className="hover:bg-muted/20 transition-colors">
                      {/* Environment */}
                      <td className="whitespace-nowrap px-6 py-4 font-medium">
                        <div className="flex items-center gap-2">
                          <Server className="h-4 w-4 text-muted-foreground/75" />
                          <span className="font-semibold">{dep.environment}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="whitespace-nowrap px-6 py-4">
                        <Badge
                          variant="outline"
                          className={`flex w-fit items-center gap-1.5 py-0.5 px-2.5 font-semibold capitalize ${getStatusBadgeClass(
                            dep.status
                          )}`}
                        >
                          {getStatusIcon(dep.status)}
                          {dep.status}
                        </Badge>
                      </td>

                      {/* Commit / SHA */}
                      <td className="whitespace-nowrap px-6 py-4 font-mono text-xs">
                        <div className="flex flex-col gap-0.5">
                          <a
                            href={commitUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-primary hover:underline font-semibold"
                          >
                            <GitBranch className="h-3 w-3" />
                            {shortSha}
                          </a>
                          <span className="text-[10px] text-muted-foreground truncate max-w-[120px]">
                            {dep.ref || "main"}
                          </span>
                        </div>
                      </td>

                      {/* Creator */}
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center gap-2">
                          {dep.creator_avatar ? (
                            <img
                              src={dep.creator_avatar}
                              alt={dep.creator_login}
                              className="h-6 w-6 rounded-full border border-border"
                            />
                          ) : (
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-muted-foreground border border-border">
                              <User className="h-3 w-3" />
                            </div>
                          )}
                          <span className="font-medium text-slate-700 dark:text-slate-300">
                            {dep.creator_login || "system"}
                          </span>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="whitespace-nowrap px-6 py-4 text-muted-foreground">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Clock className="h-3.5 w-3.5 opacity-75" />
                          {dateStr}
                        </div>
                      </td>

                      {/* Live Link Button */}
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        {dep.target_url ? (
                          <a
                            href={dep.target_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-primary hover:underline hover:text-primary/80"
                          >
                            Visit Live <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <span className="text-xs text-muted-foreground/50 italic">No URL</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center flex flex-col items-center justify-center">
          <Cpu className="h-12 w-12 text-muted-foreground/40 mb-3" />
          <h3 className="font-display text-lg font-semibold">No Deployments Seeded</h3>
          <p className="text-sm text-muted-foreground max-w-sm mt-1 mb-6">
            There are currently no deployments in the database. Fetch the recent deployments log from GitHub to start tracking builds.
          </p>
          <Button
            onClick={handleSync}
            disabled={syncing}
            className="rounded-none bg-slate-900 px-6 py-5 text-[11px] font-bold uppercase tracking-[0.2em] text-white hover:bg-slate-800 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 mr-2 ${syncing ? "animate-spin" : ""}`} />
            {syncing ? "Syncing..." : "Sync Deployments"}
          </Button>
        </div>
      )}
    </div>
  );
}
