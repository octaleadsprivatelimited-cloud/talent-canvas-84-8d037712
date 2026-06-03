import { createFileRoute } from "@tanstack/react-router";
import { Shield, ShieldAlert, UserCheck, KeyRound, Fingerprint } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useIsAdmin } from "@/hooks/use-is-admin";

export const Route = createFileRoute("/admin/diagnostics")({
  component: DiagnosticsPage,
});

function DiagnosticsPage() {
  const { user, session, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useIsAdmin();

  const loading = authLoading || adminLoading;

  const isAuthenticated = !!session && !!user;
  const userId = user?.id ?? "—";
  const role = isAdmin ? "admin" : isAuthenticated ? "candidate" : "—";

  const items = [
    {
      label: "Authenticated",
      value: isAuthenticated ? "Yes" : "No",
      icon: isAuthenticated ? UserCheck : ShieldAlert,
      color: isAuthenticated ? "text-emerald-500" : "text-rose-500",
      bg: isAuthenticated ? "bg-emerald-500/10" : "bg-rose-500/10",
    },
    {
      label: "User ID",
      value: userId,
      icon: Fingerprint,
      color: "text-primary",
      bg: "bg-primary/10",
      mono: true,
    },
    {
      label: "Role Claim",
      value: role,
      icon: KeyRound,
      color: isAdmin === true ? "text-amber-500" : "text-muted-foreground",
      bg: isAdmin === true ? "bg-amber-500/10" : "bg-muted",
    },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Diagnostics</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Authentication and role status for troubleshooting.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-5"
          >
            <div className="flex items-center gap-2">
              <span className={`inline-flex rounded-md p-1.5 ${item.bg}`}>
                <item.icon className={`h-4 w-4 ${item.color}`} />
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {item.label}
              </span>
            </div>
            <p
              className={`font-display text-xl font-semibold ${
                item.mono ? "font-mono text-base" : ""
              }`}
            >
              {loading ? (
                <span className="inline-block h-5 w-16 animate-pulse rounded bg-muted" />
              ) : (
                item.value
              )}
            </p>
          </div>
        ))}
      </div>

      {isAuthenticated && user && (
        <div className="mt-8 rounded-lg border border-border bg-surface p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Session Details
          </h2>
          <dl className="mt-4 grid gap-3 text-sm">
            <div className="flex justify-between border-b border-border pb-2">
              <dt className="text-muted-foreground">Email</dt>
              <dd className="font-medium">{user.email ?? "—"}</dd>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <dt className="text-muted-foreground">Provider</dt>
              <dd className="font-medium capitalize">
                {user.app_metadata?.provider ?? "—"}
              </dd>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <dt className="text-muted-foreground">Created</dt>
              <dd className="font-medium">
                {user.created_at
                  ? new Date(user.created_at).toLocaleString()
                  : "—"}
              </dd>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <dt className="text-muted-foreground">Last Sign In</dt>
              <dd className="font-medium">
                {user.last_sign_in_at
                  ? new Date(user.last_sign_in_at).toLocaleString()
                  : "—"}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Session Expires</dt>
              <dd className="font-medium">
                {session?.expires_at
                  ? new Date(session.expires_at * 1000).toLocaleString()
                  : "—"}
              </dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
}
