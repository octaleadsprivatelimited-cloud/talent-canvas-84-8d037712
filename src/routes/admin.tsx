import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { useEffect } from "react";
import { LayoutDashboard, Settings, Sparkles, Building2, Users, BookOpen, MessageSquare, Inbox, FileText, Quote, Activity } from "lucide-react";
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
  const location = useLocation();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (location.pathname.startsWith("/admin")) {
      sessionStorage.setItem("admin:last-route", location.pathname);
    }
  }, [location.pathname]);

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

