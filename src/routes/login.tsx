import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { firebase } from "@/integrations/firebase/client";
import { toast } from "sonner";
import { useRole } from "@/hooks/use-role";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Admin sign in — Virelix Consulting" }] }),
  component: LoginPage,
});

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formSubmitting, setFormSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user, loading, hasAdminAccess } = useRole();

  // Handle automatic redirect based on auth & role status
  useEffect(() => {
    if (loading) return;

    if (user) {
      if (hasAdminAccess) {
        navigate({ to: "/admin" });
      } else {
        toast.error("Access denied. You do not have permission to view the admin area.");
        firebase.auth.signOut();
      }
    }
  }, [user, loading, hasAdminAccess, navigate]);

  const submitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Enter email and password");
      return;
    }
    setFormSubmitting(true);
    try {
      const { error } = await firebase.auth.signInWithPassword({ email, password });
      if (error) {
        toast.error(error.message || "Authentication failed");
      } else {
        toast.success("Successfully signed in!");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Authentication failed";
      toast.error(msg);
    } finally {
      setFormSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-background flex flex-col items-center justify-center">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-accent/10 blur-3xl" />
        </div>
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground animate-pulse">
            Verifying access…
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      {/* Backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
        <div className="mb-8 flex items-center gap-3">
          <span className="h-px w-10 bg-foreground/40" />
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground">
            Restricted · Admin
          </span>
        </div>

        <h1 className="font-display text-4xl font-medium leading-[1.05] tracking-tight md:text-5xl">
          Sign in to <span className="text-gradient italic">Virelix</span>
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          This area is for authorised team members only. If you need access, contact your
          administrator.
        </p>

        <div className="mt-10 rounded-2xl border border-border/60 bg-card/70 p-8 shadow-xl backdrop-blur">
          <form onSubmit={submitEmail} className="space-y-5">
            <div>
              <Label
                htmlFor="email"
                className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2"
                required
                disabled={formSubmitting}
              />
            </div>
            <div>
              <Label
                htmlFor="password"
                className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground"
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2"
                minLength={6}
                required
                disabled={formSubmitting}
              />
            </div>
            <Button
              type="submit"
              disabled={formSubmitting}
              className="w-full py-6 text-[11px] font-bold uppercase tracking-[0.3em]"
            >
              {formSubmitting ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Accounts are provisioned by administrators. Public sign-up is disabled.
        </p>
      </div>
    </main>
  );
}
