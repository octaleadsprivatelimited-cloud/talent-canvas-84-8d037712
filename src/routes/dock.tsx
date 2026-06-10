import { Link, useNavigate } from "react-router-dom";
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

// View imports
import { AdminDashboard } from "@/components/admin/views/dashboard";
import { SiteSettingsAdmin } from "@/components/admin/views/site-settings";
import { UsersAdmin } from "@/components/admin/views/users";
import { HomepageAdmin } from "@/components/admin/views/homepage";
import { SeoAdmin } from "@/components/admin/views/seo";
import { PageContentAdmin } from "@/components/admin/views/page-content";
import { AdminPages } from "@/components/admin/views/pages";
import {
  ServicesView,
  IndustriesView,
  TeamView,
  CaseStudiesView,
  InsightsView,
  TestimonialsView,
} from "@/components/admin/views/crud-views";
import { SubmissionsAdmin } from "@/components/admin/views/submissions";
import { DiagnosticsPage } from "@/components/admin/views/diagnostics";

type Section = {
  key: string;
  label: string;
  icon: typeof LayoutDashboard;
  permission: Permission;
  to?: string; // Only for separate routes like /jobs
};

const sections: Section[] = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, permission: "view:dashboard" },
  { key: "site-settings", label: "Site Settings", icon: Settings, permission: "manage:settings" },
  { key: "users", label: "Users & Roles", icon: ShieldCheck, permission: "manage:users" },
  { key: "homepage", label: "Homepage", icon: Home, permission: "manage:homepage" },
  { key: "seo", label: "Page SEO", icon: Search, permission: "manage:seo" },
  { key: "page-content", label: "Other Pages", icon: FileText, permission: "manage:pages" },
  { key: "pages", label: "Custom Pages", icon: LayoutTemplate, permission: "manage:pages" },
  { key: "services", label: "Services", icon: Sparkles, permission: "manage:content" },
  { key: "industries", label: "Industries", icon: Building2, permission: "manage:content" },
  { key: "team", label: "Team", icon: Users, permission: "manage:content" },
  { key: "case-studies", label: "Case Studies", icon: MessageSquare, permission: "manage:content" },
  { key: "insights", label: "Insights / Blog", icon: BookOpen, permission: "manage:content" },
  { key: "testimonials", label: "Testimonials", icon: Quote, permission: "manage:content" },
  { key: "jobs", label: "Jobs", icon: Briefcase, permission: "manage:jobs", to: "/jobs" },
  { key: "submissions", label: "Contact Inbox", icon: Inbox, permission: "view:submissions" },
  { key: "diagnostics", label: "Diagnostics", icon: Activity, permission: "view:diagnostics" },
];

function AdminLayout() {
  const navigate = useNavigate();
  const { role, loading, can, hasAdminAccess } = useRole();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  // Initialize active tab from session storage or default to dashboard
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("dock:active-tab") || "dashboard";
    }
    return "dashboard";
  });

  // Persist active tab selection
  const handleTabChange = (key: string) => {
    setActiveTab(key);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("dock:active-tab", key);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("dock:last-route", "/dock");
    }
  }, []);

  useEffect(() => {
    if (!loading && !hasAdminAccess) {
      navigate("/dashboard");
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

  // Close mobile nav when tab changes
  useEffect(() => {
    setMobileNavOpen(false);
  }, [activeTab]);

  const visibleSections = useMemo(() => sections.filter((s) => can(s.permission)), [can]);

  if (loading) {
    return (
      <div className="container mx-auto flex h-[400px] flex-col items-center justify-center gap-4 px-4">
        <div className="text-sm font-semibold uppercase tracking-wider text-muted-foreground animate-pulse">
          Verifying access…
        </div>
        {timedOut && (
          <div className="flex flex-col items-center gap-2 text-center">
            <p className="text-xs text-muted-foreground">This is taking longer than usual.</p>
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
    visibleSections.find((s) => s.key === activeTab) ??
    visibleSections.find((s) => s.key === "dashboard") ??
    visibleSections[0];

  const renderView = () => {
    switch (activeTab) {
      case "dashboard":
        return <AdminDashboard setActiveTab={handleTabChange} />;
      case "site-settings":
        return <SiteSettingsAdmin />;
      case "users":
        return <UsersAdmin />;
      case "homepage":
        return <HomepageAdmin />;
      case "seo":
        return <SeoAdmin />;
      case "page-content":
        return <PageContentAdmin />;
      case "pages":
        return <AdminPages />;
      case "services":
        return <ServicesView />;
      case "industries":
        return <IndustriesView />;
      case "team":
        return <TeamView />;
      case "case-studies":
        return <CaseStudiesView />;
      case "insights":
        return <InsightsView />;
      case "testimonials":
        return <TestimonialsView />;
      case "submissions":
        return <SubmissionsAdmin />;
      case "diagnostics":
        return <DiagnosticsPage />;
      default:
        return <AdminDashboard setActiveTab={handleTabChange} />;
    }
  };

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
          {visibleSections.map((s) => {
            if (s.to) {
              return (
                <Link
                  key={s.key}
                  to={s.to}
                  className="flex items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-background"
                >
                  <s.icon className="h-4 w-4" /> {s.label}
                </Link>
              );
            }
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => handleTabChange(s.key)}
                className={`flex items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-background text-left w-full cursor-pointer ${
                  activeTab === s.key ? "bg-background font-semibold text-primary" : ""
                }`}
              >
                <s.icon className="h-4 w-4" /> {s.label}
              </button>
            );
          })}
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
              {visibleSections.map((s) => {
                if (s.to) {
                  return (
                    <Link
                      key={s.key}
                      to={s.to}
                      className="flex items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-background"
                    >
                      <s.icon className="h-4 w-4" /> {s.label}
                    </Link>
                  );
                }
                return (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => handleTabChange(s.key)}
                    className={`flex items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-background text-left w-full cursor-pointer ${
                      activeTab === s.key ? "bg-background font-semibold text-primary" : ""
                    }`}
                  >
                    <s.icon className="h-4 w-4" /> {s.label}
                  </button>
                );
              })}
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>

      <div className="min-w-0">
        <ErrorBoundary label="AdminLayout">{renderView()}</ErrorBoundary>
      </div>
    </div>
  );
}

export default AdminLayout;
