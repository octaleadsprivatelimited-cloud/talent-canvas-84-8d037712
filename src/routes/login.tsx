import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { firebase } from "@/integrations/firebase/client";
import { toast } from "sonner";
import { useRole } from "@/hooks/use-role";
import { AlertTriangle } from "lucide-react";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formSubmitting, setFormSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user, loading, hasAdminAccess } = useRole();
  const signingOutRef = useRef(false);

  // Handle automatic redirect based on auth & role status
  useEffect(() => {
    if (loading) return;

    if (user) {
      if (hasAdminAccess) {
        navigate({ to: "/dock" });
      } else if (!signingOutRef.current) {
        signingOutRef.current = true;
        toast.error("Access denied. You do not have permission to view the admin area.");
        firebase.auth.signOut().finally(() => {
          signingOutRef.current = false;
        });
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
        // Navigate immediately — don't wait for the reactive useEffect
        navigate({ to: "/dock" });
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

        {!firebase.isInitialized && (
          <div className="mt-6 rounded-2xl border border-destructive/30 bg-destructive/5 p-5 backdrop-blur-sm">
            <div className="flex items-start gap-3 text-destructive">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-red-600 dark:text-red-400">
                  Firebase is not initialized
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  The Firebase configuration is missing or invalid. If you recently deployed to
                  Vercel, please make sure you have added all required environment variables in your
                  Vercel Project Settings:
                </p>
                <ul className="mt-2 list-inside list-disc text-[11px] font-mono text-muted-foreground space-y-0.5">
                  <li>VITE_FIREBASE_API_KEY</li>
                  <li>VITE_FIREBASE_PROJECT_ID</li>
                  <li>VITE_FIREBASE_AUTH_DOMAIN</li>
                  <li>VITE_FIREBASE_STORAGE_BUCKET</li>
                  <li>VITE_FIREBASE_MESSAGING_SENDER_ID</li>
                  <li>VITE_FIREBASE_APP_ID</li>
                </ul>
                <p className="mt-2 text-xs text-muted-foreground">
                  After setting them, you must trigger a new deployment for Vercel to load the
                  environment variables.
                </p>
              </div>
            </div>
          </div>
        )}

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
                disabled={formSubmitting || !firebase.isInitialized}
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
                disabled={formSubmitting || !firebase.isInitialized}
              />
            </div>
            <Button
              type="submit"
              disabled={formSubmitting || !firebase.isInitialized}
              className="w-full py-6 text-[11px] font-bold uppercase tracking-[0.3em]"
            >
              {formSubmitting ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default LoginPage;
