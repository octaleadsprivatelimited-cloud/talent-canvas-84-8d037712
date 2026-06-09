import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { firebase } from "@/integrations/firebase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Admin sign in — Virelix Consulting" }] }),
  component: LoginPage,
});

async function routeAfterAuth(userId: string, navigate: ReturnType<typeof useNavigate>) {
  // Ensure an admin role record exists for this user, keyed by UID as the doc ID
  // (matches the Firestore rule used by useIsAdmin).
  try {
    const { data: roleRow } = await firebase
      .from("user_roles")
      .select("role")
      .eq("id", userId)
      .maybeSingle();
    if (!roleRow || (roleRow as { role?: string }).role !== "admin") {
      await firebase.from("user_roles").upsert(
        { id: userId, user_id: userId, role: "admin" },
        { onConflict: "id" },
      );
    }
  } catch (e) {
    console.warn("[login] user_roles sync skipped:", e);
  }
  navigate({ to: "/admin" });
}

function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await firebase.auth.getSession();
      const user = data.session?.user ?? null;
      if (cancelled || !user) return;
      await routeAfterAuth(user.id, navigate);
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const res = await firebase.auth.signInWithPopupGoogle();
      if (res.error) throw res.error;
      if (res.user) {
        await routeAfterAuth(res.user.uid, navigate);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Google sign-in failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const submitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Enter email and password");
      return;
    }
    setLoading(true);
    try {
      if (mode === "signup") {
        const { data, error } = await firebase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/login` },
        });
        if (error) throw error;
        if (data.session?.user) {
          await routeAfterAuth(data.session.user.id, navigate);
        } else {
          toast.success("Account created. Check your email to confirm, then sign in.");
          setMode("signin");
        }
      } else {
        const { data, error } = await firebase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (data.user) await routeAfterAuth(data.user.id, navigate);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Authentication failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background px-6 py-24 md:px-12">
      <div className="mx-auto flex max-w-md flex-col">
        <div className="mb-6 flex items-center gap-4">
          <span className="h-px w-8 bg-foreground" />
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/70">
            Admin access
          </span>
        </div>
        <h1 className="text-4xl font-medium leading-[1.05] tracking-tight text-foreground md:text-5xl">
          Sign in to <span className="italic text-muted-foreground">Virelix</span>
        </h1>
        <p className="mt-5 text-base leading-relaxed text-muted-foreground">
          Restricted area. Sign in with email & password, or use Google.
        </p>

        <div className="mt-10 border border-border bg-card p-8">
          <form onSubmit={submitEmail} className="space-y-4">
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
                className="mt-2 rounded-none border-border"
                required
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
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 rounded-none border-border"
                minLength={6}
                required
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-none bg-foreground text-background py-6 text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-foreground/90"
            >
              {loading ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}
            </Button>
            <button
              type="button"
              onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
              className="w-full text-center text-[10px] uppercase tracking-[0.3em] text-muted-foreground/70 hover:text-foreground"
            >
              {mode === "signup" ? "Have an account? Sign in" : "No account? Create one"}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/70">
              or
            </span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <Button
            onClick={signInWithGoogle}
            disabled={loading}
            variant="outline"
            className="w-full rounded-none border-border py-6 text-[11px] font-bold uppercase tracking-[0.3em]"
          >
            Continue with Google
          </Button>
        </div>
      </div>
    </main>
  );
}
