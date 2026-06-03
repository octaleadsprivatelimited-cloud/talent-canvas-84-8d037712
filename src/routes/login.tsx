import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Admin sign in — Virelix Consulting" }] }),
  component: LoginPage,
});

async function routeAfterAuth(userId: string, navigate: ReturnType<typeof useNavigate>) {
  const { data: roleRow } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (roleRow) {
    navigate({ to: "/admin" });
  } else {
    // First user can claim admin via the diagnostics/admin claim flow.
    navigate({ to: "/admin" });
  }
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
      const { data } = await supabase.auth.getSession();
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
    const res = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/login",
    });
    if (res.error) {
      toast.error("Google sign-in failed");
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
        const { data, error } = await supabase.auth.signUp({
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
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
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
    <main className="min-h-screen bg-[#fcfbf9] px-6 py-24 md:px-12">
      <div className="mx-auto flex max-w-md flex-col">
        <div className="mb-6 flex items-center gap-4">
          <span className="h-px w-8 bg-slate-900" />
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400">
            Admin access
          </span>
        </div>
        <h1
          className="text-4xl font-medium leading-[1.05] tracking-tight text-slate-900 md:text-5xl"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Sign in to <span className="italic text-slate-500">Virelix</span>
        </h1>
        <p className="mt-5 text-base leading-relaxed text-slate-500">
          Restricted area. Sign in with email & password, or use Google.
        </p>

        <div className="mt-10 border border-slate-200 bg-white p-8">
          <form onSubmit={submitEmail} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 rounded-none border-slate-300"
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 rounded-none border-slate-300"
                minLength={6}
                required
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-none bg-slate-900 py-6 text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-slate-800"
            >
              {loading ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}
            </Button>
            <button
              type="button"
              onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
              className="w-full text-center text-[10px] uppercase tracking-[0.3em] text-slate-500 hover:text-slate-900"
            >
              {mode === "signup" ? "Have an account? Sign in" : "No account? Create one"}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-slate-200" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-slate-400">or</span>
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          <Button
            onClick={signInWithGoogle}
            disabled={loading}
            variant="outline"
            className="w-full rounded-none border-slate-300 py-6 text-[11px] font-bold uppercase tracking-[0.3em]"
          >
            Continue with Google
          </Button>
        </div>
      </div>
    </main>
  );
}
