import { Link } from "@tanstack/react-router";
import { Briefcase, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useIsAdmin } from "@/hooks/use-is-admin";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { supabase } from "@/integrations/supabase/client";

const navItems = [
  { to: "/services", label: "Services" },
  { to: "/industries", label: "Industries" },
  { to: "/case-studies", label: "Case Studies" },
  { to: "/about", label: "About" },
  { to: "/insights", label: "Insights" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const { user } = useAuth();
  const { isAdmin } = useIsAdmin();
  const { data: site } = useSiteSettings();
  const [open, setOpen] = useState(false);

  const brand = site?.brand_name ?? "Virelix Consulting";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold tracking-tight">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-hero">
            <Briefcase className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <span>{brand}</span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {isAdmin && (
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin">Admin</Link>
            </Button>
          )}
          {user ? (
            <Button variant="outline" size="sm" onClick={() => supabase.auth.signOut()}>Sign out</Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild><Link to="/login">Sign in</Link></Button>
              <Button size="sm" asChild><Link to="/contact">Hire with us</Link></Button>
            </>
          )}
        </div>

        <button className="lg:hidden" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <div className="container mx-auto flex flex-col gap-1 px-4 py-3">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-border pt-3">
              {isAdmin && (
                <Button variant="outline" asChild onClick={() => setOpen(false)}>
                  <Link to="/admin">Admin</Link>
                </Button>
              )}
              {user ? (
                <Button variant="ghost" onClick={() => supabase.auth.signOut()}>Sign out</Button>
              ) : (
                <>
                  <Button variant="outline" asChild onClick={() => setOpen(false)}>
                    <Link to="/login">Sign in</Link>
                  </Button>
                  <Button asChild onClick={() => setOpen(false)}>
                    <Link to="/contact">Hire with us</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
