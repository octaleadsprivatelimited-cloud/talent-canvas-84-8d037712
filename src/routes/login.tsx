import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { firebase } from "@/integrations/firebase/client";
import { toast } from "sonner";
import { useRole } from "@/hooks/use-role";
import { AlertTriangle } from "lucide-react";

function LoginPage() {
  const [formSubmitting, setFormSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user, loading, hasAdminAccess } = useRole();
  const signingOutRef = useRef(false);

  // Handle automatic redirect based on auth & role status
  useEffect(() => {
    if (loading) return;

    if (user) {
      if (hasAdminAccess) {
        navigate("/dock");
      } else if (!signingOutRef.current) {
        signingOutRef.current = true;
        toast.error("Access denied. You do not have permission to view the admin area.");
        firebase.auth.signOut().finally(() => {
          signingOutRef.current = false;
        });
      }
    }
  }, [user, loading, hasAdminAccess, navigate]);

  const signInWithGoogle = async () => {
    setFormSubmitting(true);
    try {
      const res = await firebase.auth.signInWithPopupGoogle();
      if (res && "error" in res && res.error) {
        toast.error(res.error.message || "Failed to sign in with Google");
      } else if (res && "user" in res && res.user) {
        const loggedInUser = res.user;
        if (loggedInUser.email === "admin.virelixconsulting@gmail.com") {
          toast.success("Successfully signed in as Admin!");
          navigate("/dock");
        } else {
          toast.error(`Access denied. ${loggedInUser.email} is not authorized.`);
          await firebase.auth.signOut();
        }
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

        <div className="mt-10 rounded-2xl border border-border/60 bg-card/70 p-8 shadow-xl backdrop-blur flex flex-col items-center">
          <p className="text-xs text-center text-muted-foreground mb-6 leading-relaxed">
            Access to the Virelix admin panel is restricted. Please sign in with your authorized admin Google account (<strong className="text-foreground font-semibold">admin.virelixconsulting@gmail.com</strong>).
          </p>
          <Button
            type="button"
            onClick={signInWithGoogle}
            disabled={formSubmitting}
            className="w-full py-6 text-[11px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-3 cursor-pointer"
          >
            <svg className="h-4 w-4 shrink-0" aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
              <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
            </svg>
            {formSubmitting ? "Connecting…" : "Sign in with Google"}
          </Button>
        </div>
      </div>
    </main>
  );
}

export default LoginPage;
