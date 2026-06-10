import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { firebase } from "@/integrations/firebase/client";
import { toast } from "sonner";
import { isRole } from "@/lib/rbac";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Admin sign in — Virelix Consulting" }] }),
  component: LoginPage,
});

async function routeAfterAuth(userId: string, navigate: ReturnType<typeof useNavigate>) {
  try {
    const { data: roleRow, error: roleErr } = await firebase
      .from("user_roles")
      .select("role")
      .eq("id", userId)
      .maybeSingle();

    if (!roleErr && roleRow && isRole(roleRow.role)) {
      navigate({ to: "/admin" });
      return;
    }

    // Try to bootstrap as first admin (succeeds only if user_roles is completely empty)
    const { error: upsertError } = await firebase
      .from("user_roles")
      .upsert({ id: userId, user_id: userId, role: "admin" }, { onConflict: "id" });

    if (!upsertError) {
      toast.success("First administrator account registered!");
      navigate({ to: "/admin" });
    } else {
      toast.error("Access denied. You do not have permission to view the admin area.");
      await firebase.auth.signOut();
    }
  } catch (e) {
    console.warn("[login] role check failed:", e);
    toast.error("Could not verify your access. Please try again.");
    await firebase.auth.signOut();
  }
}

function LoginPage() {
  const [loading, setLoading] = useState(false);
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

  const submitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Enter email and password");
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await firebase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data.user) await routeAfterAuth(data.user.id, navigate);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Authentication failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

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
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full py-6 text-[11px] font-bold uppercase tracking-[0.3em]"
            >
              {loading ? "Signing in…" : "Sign in"}
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
