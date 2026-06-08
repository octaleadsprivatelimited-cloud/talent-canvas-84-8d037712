import { Link } from "@tanstack/react-router";
import { Briefcase, Menu, X, Mail } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useIsAdmin } from "@/hooks/use-is-admin";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { supabase } from "@/integrations/firebase/client";
import { AnimatePresence, motion } from "framer-motion";

const navItems = [
  { to: "/services", label: "Services" },
  { to: "/industries", label: "Industries" },
  { to: "/case-studies", label: "Case Studies" },
  { to: "/who-we-are", label: "Who We Are" },
  { to: "/insights", label: "Insights" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const { user } = useAuth();
  const { isAdmin } = useIsAdmin();
  const { data: site } = useSiteSettings();
  const [open, setOpen] = useState(false);

  const brand = site?.brand_name ?? "Virelix Consulting";
  const logoUrl = site?.logo_url;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/50 glass">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link
          to="/"
          className="group flex items-center gap-2.5 font-display text-lg font-semibold tracking-tight"
        >
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={`${brand} logo`}
              className="h-9 w-9 rounded-xl object-contain transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-hero shadow-glow transition-transform duration-300 group-hover:scale-105">
              <Briefcase className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
            </div>
          )}
          <span className="text-gradient">{brand}</span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground flex items-center gap-1.5"
              activeProps={{ className: "text-foreground" }}
            >
              {item.to === "/contact" && <Mail className="h-3.5 w-3.5 text-accent" />}
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
            <Button variant="outline" size="sm" onClick={() => supabase.auth.signOut()}>
              Sign out
            </Button>
          ) : (
            <Button size="sm" asChild className="gap-2">
              <Link to="/contact">
                <Mail className="h-3.5 w-3.5" />
                Hire with us
              </Link>
            </Button>
          )}
        </div>

        <button
          className="lg:hidden relative p-2 text-foreground/80 hover:text-foreground focus:outline-none"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <motion.div
            animate={{ rotate: open ? 90 : 0, scale: open ? 0.9 : 1 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </motion.div>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 right-0 top-full border-b border-border bg-background/95 backdrop-blur-md lg:hidden overflow-hidden"
          >
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={{
                open: {
                  transition: {
                    staggerChildren: 0.05,
                    delayChildren: 0.05
                  }
                },
                closed: {
                  transition: {
                    staggerChildren: 0.03,
                    staggerDirection: -1
                  }
                }
              }}
              className="container mx-auto flex flex-col gap-1 px-4 py-3"
            >
              {navItems.map((item) => (
                <motion.div
                  key={item.to}
                  variants={{
                    open: {
                      opacity: 1,
                      y: 0,
                      transition: { type: "spring", stiffness: 300, damping: 24 }
                    },
                    closed: {
                      opacity: 0,
                      y: 10,
                      transition: { duration: 0.15 }
                    }
                  }}
                >
                  <Link
                    to={item.to}
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                    onClick={() => setOpen(false)}
                  >
                    {item.to === "/contact" && <Mail className="h-4 w-4 text-accent" />}
                    <span>{item.label}</span>
                  </Link>
                </motion.div>
              ))}
              <motion.div
                variants={{
                  open: {
                    opacity: 1,
                    y: 0,
                    transition: { type: "spring", stiffness: 300, damping: 24 }
                  },
                  closed: {
                    opacity: 0,
                    y: 10,
                    transition: { duration: 0.15 }
                  }
                }}
                className="mt-2 flex flex-col gap-2 border-t border-border pt-3"
              >
                {isAdmin && (
                  <Button variant="outline" asChild onClick={() => setOpen(false)}>
                    <Link to="/admin">Admin</Link>
                  </Button>
                )}
                {user ? (
                  <Button variant="ghost" onClick={() => supabase.auth.signOut()}>
                    Sign out
                  </Button>
                ) : (
                  <Button asChild className="gap-2" onClick={() => setOpen(false)}>
                    <Link to="/contact">
                      <Mail className="h-4 w-4" />
                      Hire with us
                    </Link>
                  </Button>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
