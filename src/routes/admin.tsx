import { createFileRoute, Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Loader2, LayoutDashboard, Settings, Sparkles, Building2, Users, BookOpen, MessageSquare, Inbox, FileText, Quote, Activity } from "lucide-react";
import { useIsAdmin } from "@/hooks/use-is-admin";
import { supabase } from "@/integrations/supabase/client";
import { ErrorBoundary } from "@/components/error-boundary";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

const sections: { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean }[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/site-settings", label: "Site Settings", icon: Settings },
  { to: "/admin/page-content", label: "Page Content", icon: FileText },
  { to: "/admin/services", label: "Services", icon: Sparkles },
  { to: "/admin/industries", label: "Industries", icon: Building2 },
  { to: "/admin/team", label: "Team", icon: Users },
  { to: "/admin/case-studies", label: "Case Studies", icon: MessageSquare },
  { to: "/admin/insights", label: "Insights / Blog", icon: BookOpen },
  { to: "/admin/testimonials", label: "Testimonials", icon: Quote },
  { to: "/admin/submissions", label: "Contact Inbox", icon: Inbox },
  { to: "/admin/diagnostics", label: "Diagnostics", icon: Activity },
];

function AdminLayout() {
  const { isAdmin, loading, user } = useIsAdmin();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/login", search: { redirect: location.href } });
    }
  }, [loading, user, location.href, navigate]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (location.pathname.startsWith("/admin")) {
      sessionStorage.setItem("admin:last-route", location.pathname);
    }
  }, [location.pathname]);

  if (loading) {
    return <div className="flex h-[60vh] items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  if (!user) {
    return <div className="container mx-auto px-4 py-20 text-center">Please <Link to="/login" className="text-primary underline">sign in</Link> to access the admin panel.</div>;
  }

  if (!isAdmin) {
    return <NotAdmin userId={user.id} />;
  }

  return (
    <div className="container mx-auto grid gap-8 px-4 py-10 lg:grid-cols-[240px_1fr]">
      <aside className="h-fit border border-border bg-surface p-3 lg:sticky lg:top-20">
        <p className="px-3 pb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Admin</p>
        <nav className="flex flex-col gap-1">
          {sections.map((s) => (
            <Link
              key={s.to}
              to={s.to}
              className="flex items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-background"
              activeProps={{ className: "bg-background font-semibold text-primary" }}
              activeOptions={{ exact: s.exact ?? false }}
            >
              <s.icon className="h-4 w-4" /> {s.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="min-w-0">
        <ErrorBoundary label="AdminLayout">
          <Outlet />
        </ErrorBoundary>
      </div>
    </div>
  );
}

function NotAdmin({ userId }: { userId: string }) {
  const promote = async () => {
    const { data, error } = await supabase.rpc("promote_to_admin_if_first", { _user_id: userId });
    if (error) { alert(error.message); return; }
    if (data) { window.location.reload(); }
    else { alert("An admin already exists. Ask an existing admin to grant you the role."); }
  };
  return (
    <div className="container mx-auto max-w-lg px-4 py-20 text-center">
      <h1 className="font-display text-3xl font-bold">Admin access required</h1>
      <p className="mt-3 text-muted-foreground">Your account doesn't have the admin role yet.</p>
      <button onClick={promote} className="mt-6 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
        Claim first-admin (only works if no admin exists)
      </button>
      <p className="mt-3 text-xs text-muted-foreground">If an admin already exists, ask them to add you in the Users section.</p>
    </div>
  );
}
