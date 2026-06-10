import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { firebase } from "@/integrations/firebase/client";
import { toast } from "sonner";
import { useRole } from "@/hooks/use-role";
import { AlertTriangle, Lock, Mail, Chrome } from "lucide-react";

function LoginPage() {
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activePortal, setActivePortal] = useState<"candidate" | "admin">("candidate");
  const navigate = useNavigate();
  const { user, loading, role, hasAdminAccess } = useRole();

  // Handle automatic redirect based on auth & role status
  useEffect(() => {
    if (loading) return;

    if (user) {
      console.log(`User authenticated: ${user.email}`);
      console.log(`Retrieved role: ${role}`);
      console.log(`Redirecting to: ${hasAdminAccess ? "/dock" : "/candidate-dashboard"}`);
      if (hasAdminAccess) {
        navigate("/dock");
      } else {
        navigate("/dashboard");
      }
    }
  }, [user, loading, role, hasAdminAccess, navigate]);

  const signInWithGoogle = async () => {
    setFormSubmitting(true);
    try {
      const res = await firebase.auth.signInWithPopupGoogle();
      if (res && "error" in res && res.error) {
        let msg = res.error.message || "Failed to sign in with Google";
        if (res.error.code === "auth/admin-restricted-operation") {
          msg = "Account registration is restricted. Please enable new user sign-up or Google provider in your Firebase Console (Authentication -> Settings -> User actions).";
        }
        toast.error(msg, { duration: 6000 });
      } else if (res && "user" in res && res.user) {
        const loggedInUser = res.user;
        if (loggedInUser.email === "admin.virelixconsulting@gmail.com") {
          toast.success("Successfully signed in as Admin!");
          navigate("/dock");
        } else {
          toast.success("Successfully signed in!");
          navigate("/dashboard");
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Authentication failed";
      toast.error(msg);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handlePasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }
    setFormSubmitting(true);
    try {
      const { data, error } = await firebase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        toast.error(error.message || "Invalid credentials");
      } else if (data?.user) {
        toast.success("Successfully signed in as Admin!");
        // Redirection is handled by the useEffect redirect watcher
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sign in failed");
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
            Sign In Portal
          </span>
        </div>

        <h1 className="font-display text-4xl font-medium leading-[1.05] tracking-tight md:text-5xl mb-8">
          Welcome to <span className="text-gradient italic">Virelix</span>
        </h1>

        {!firebase.isInitialized && (
          <div className="mb-6 rounded-2xl border border-destructive/30 bg-destructive/5 p-5 backdrop-blur-sm">
            <div className="flex items-start gap-3 text-destructive">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-red-600 dark:text-red-400">
                  Firebase is not initialized
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  The Firebase configuration is missing or invalid. Testing will run in mock mode.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-border/60 bg-card/70 p-8 shadow-xl backdrop-blur flex flex-col items-center">
          {/* Toggle Tabs */}
          <div className="flex border-b border-border/60 mb-8 w-full">
            <button
              onClick={() => setActivePortal("candidate")}
              className={`flex-1 pb-3 text-[11px] font-bold uppercase tracking-[0.2em] border-b-2 transition-all cursor-pointer ${
                activePortal === "candidate"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Candidate Portal
            </button>
            <button
              onClick={() => setActivePortal("admin")}
              className={`flex-1 pb-3 text-[11px] font-bold uppercase tracking-[0.2em] border-b-2 transition-all cursor-pointer ${
                activePortal === "admin"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Admin Login
            </button>
          </div>

          {activePortal === "candidate" ? (
            /* Candidate Portal View */
            <div className="w-full flex flex-col items-center">
              <p className="text-xs text-center text-muted-foreground mb-8 leading-relaxed">
                Connect your Google account to submit applications, save jobs, and manage your placement profile.
              </p>
              <Button
                type="button"
                onClick={signInWithGoogle}
                disabled={formSubmitting}
                className="w-full py-6 text-[11px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-3 cursor-pointer"
              >
                <Chrome className="h-4 w-4 shrink-0" />
                {formSubmitting ? "Connecting…" : "Sign in with Google"}
              </Button>
            </div>
          ) : (
            /* Admin Login View */
            <form onSubmit={handlePasswordSignIn} className="w-full space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin.virelixconsulting@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={formSubmitting}
                className="w-full py-6 mt-6 text-[11px] font-bold uppercase tracking-[0.3em] cursor-pointer"
              >
                {formSubmitting ? "Signing in…" : "Access Admin Panel"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}

export default LoginPage;
