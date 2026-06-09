import { createFileRoute, Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useIsAdmin } from "@/hooks/use-is-admin";
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
} from "lucide-react";
import { ErrorBoundary } from "@/components/error-boundary";
import { AnimatePresence, motion } from "framer-motion";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

const sections: { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean }[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/site-settings", label: "Site Settings", icon: Settings },
  { to: "/admin/homepage", label: "Homepage", icon: Home },
  { to: "/admin/seo", label: "Page SEO", icon: Search },
  { to: "/admin/page-content", label: "Other Pages", icon: FileText },
  { to: "/admin/pages", label: "Custom Pages", icon: LayoutTemplate },
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
  const navigate = useNavigate();
  const { isAdmin, loading } = useIsAdmin();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (location.pathname.startsWith("/admin")) {
      sessionStorage.setItem("admin:last-route", location.pathname);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!loading && isAdmin === false) {
      navigate({ to: "/login" });
    }
  }, [isAdmin, loading, navigate]);

  // Close mobile nav when route changes
  useEffect(() => {
    setMobileNavOpen(false);
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="container mx-auto flex h-[400px] items-center justify-center px-4">
        <div className="text-sm font-semibold uppercase tracking-wider text-muted-foreground animate-pulse">
          Verifying administrator status…
        </div>
      </div>
    );
  }

  if (isAdmin === false) {
    return null;
  }

  const currentSection = sections.find(
    (s) => s.to === location.pathname || (s.to !== "/admin" && location.pathname.startsWith(s.to))
  ) ?? sections[0];

  return (
    <div className="container mx-auto grid gap-6 px-4 py-6 md:py-10 lg:grid-cols-[240px_1fr] lg:gap-8">
      {/* Mobile header */}
      <div className="flex items-center justify-between lg:hidden">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Admin
          </span>
          <span className="text-xs text-muted-foreground">·</span>
          <span className="text-sm font-medium">{currentSection.label}</span>
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
        <p className="px-3 pb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Admin
        </p>
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
