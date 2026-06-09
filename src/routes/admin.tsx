import { createFileRoute, Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useRole } from "@/hooks/use-role";
import {
  LayoutDashboard,
  Settings,
  Sparkles,
  Building2,
  Users,
  BookOpen,
  MessageSquare,
  Inbox,
  FileText,
  Quote,
  Activity,
  LayoutTemplate,
  Home,
  Search,
  Menu,
  X,
  Briefcase,
  ShieldCheck,
} from "lucide-react";
import { ErrorBoundary } from "@/components/error-boundary";
import { AnimatePresence, motion } from "framer-motion";
import { ROLE_LABELS, type Permission } from "@/lib/rbac";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

type Section = {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
  permission: Permission;
};

const sections: Section[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true, permission: "view:dashboard" },
  { to: "/admin/site-settings", label: "Site Settings", icon: Settings, permission: "manage:settings" },
  { to: "/admin/users", label: "Users & Roles", icon: ShieldCheck, permission: "manage:users" },
  { to: "/admin/homepage", label: "Homepage", icon: Home, permission: "manage:homepage" },
  { to: "/admin/seo", label: "Page SEO", icon: Search, permission: "manage:seo" },
  { to: "/admin/page-content", label: "Other Pages", icon: FileText, permission: "manage:pages" },
  { to: "/admin/pages", label: "Custom Pages", icon: LayoutTemplate, permission: "manage:pages" },
  { to: "/admin/services", label: "Services", icon: Sparkles, permission: "manage:content" },
  { to: "/admin/industries", label: "Industries", icon: Building2, permission: "manage:content" },
  { to: "/admin/team", label: "Team", icon: Users, permission: "manage:content" },
  { to: "/admin/case-studies", label: "Case Studies", icon: MessageSquare, permission: "manage:content" },
  { to: "/admin/insights", label: "Insights / Blog", icon: BookOpen, permission: "manage:content" },
  { to: "/admin/testimonials", label: "Testimonials", icon: Quote, permission: "manage:content" },
  { to: "/jobs", label: "Jobs", icon: Briefcase, permission: "manage:jobs" },
  { to: "/admin/submissions", label: "Contact Inbox", icon: Inbox, permission: "view:submissions" },
  { to: "/admin/diagnostics", label: "Diagnostics", icon: Activity, permission: "view:diagnostics" },
];

function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { role, loading, can, hasAdminAccess } = useRole();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (location.pathname.startsWith("/admin")) {
      sessionStorage.setItem("admin:last-route", location.pathname);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!loading && !hasAdminAccess) {
      navigate({ to: "/login" });
    }
  }, [hasAdminAccess, loading, navigate]);

  // Fallback: if verification takes more than 6s, give the user a way out.
  useEffect(() => {
    if (!loading) {
      setTimedOut(false);
      return;
    }
    const t = setTimeout(() => setTimedOut(true), 6000);
    return () => clearTimeout(t);
  }, [loading]);

  // Close mobile nav when route changes
  useEffect(() => {
    setMobileNavOpen(false);
  }, [location.pathname]);

  const visibleSections = useMemo(
    () => sections.filter((s) => can(s.permission)),
    [can],
  );

  if (loading) {
    return (
      <div className="container mx-auto flex h-[400px] flex-col items-center justify-center gap-4 px-4">
        <div className="text-sm font-semibold uppercase tracking-wider text-muted-foreground animate-pulse">
          Verifying access…
        </div>
        {timedOut && (
          <div className="flex flex-col items-center gap-2 text-center">
            <p className="text-xs text-muted-foreground">
              This is taking longer than usual.
            </p>
            <Link
              to="/login"
              className="text-xs font-semibold uppercase tracking-wider text-primary underline-offset-4 hover:underline"
            >
              Go to sign in
            </Link>
          </div>
        )}
      </div>
    );
  }

  if (!hasAdminAccess) {
    return null;
  }

  const currentSection =
    visibleSections.find(
      (s) => s.to === location.pathname || (s.to !== "/admin" && location.pathname.startsWith(s.to)),
    ) ?? visibleSections[0];

  return (
    <div className="container mx-auto grid gap-6 px-4 py-6 md:py-10 lg:grid-cols-[240px_1fr] lg:gap-8">
      {/* Mobile header */}
      <div className="flex items-center justify-between lg:hidden">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {role ? ROLE_LABELS[role] : "Admin"}
          </span>
          <span className="text-xs text-muted-foreground">·</span>
          <span className="text-sm font-medium">{currentSection?.label}</span>
        </div>
        <button
          onClick={() => setMobileNavOpen((v) => !v)}
          className="flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium"
          aria-label="Toggle admin menu"
        >
          {mobileNavOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          Menu
        </button>
      </div>

      {/* Sidebar */}
      <aside className="hidden h-fit border border-border bg-surface p-3 lg:block lg:sticky lg:top-20">
        <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Admin
        </p>
        {role && (
          <p className="px-3 pb-3 text-[10px] uppercase tracking-wider text-primary">
            {ROLE_LABELS[role]}
          </p>
        )}
        <nav className="flex flex-col gap-1">
          {visibleSections.map((s) => (
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

      {/* Mobile nav overlay */}
      <AnimatePresence>
        {mobileNavOpen && (
          <motion.aside
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden rounded-lg border border-border bg-surface p-3 lg:hidden"
          >
            <p className="px-3 pb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Admin
            </p>
            <nav className="flex flex-col gap-1">
              {visibleSections.map((s) => (
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
          </motion.aside>
        )}
      </AnimatePresence>

      <div className="min-w-0">
        <ErrorBoundary label="AdminLayout">
          <Outlet />
        </ErrorBoundary>
      </div>
    </div>
  );
}
