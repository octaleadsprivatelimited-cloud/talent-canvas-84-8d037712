import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Admin sign in — Virelix Consulting" }] }),
  component: LoginPage,
});

function LoginPage() {
  const [loading, setLoading] = useState(false);

  // If already signed in, verify admin role and route accordingly
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (cancelled || !data.user) return;
      const { data: roleRow } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (cancelled) return;
      if (roleRow) {
        window.location.href = "/admin";
      } else {
        await supabase.auth.signOut();
        toast.error("This account is not authorized. Admin access only.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

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
          Restricted area. Only authorized Virelix administrators can sign in.
          Use your approved Google account to continue.
        </p>

        <div className="mt-10 border border-slate-200 bg-white p-8">
          <Button
            onClick={signInWithGoogle}
            disabled={loading}
            className="w-full rounded-none bg-slate-900 py-6 text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-slate-800"
          >
            {loading ? "Redirecting…" : "Continue with Google"}
          </Button>
          <p className="mt-6 text-center text-[10px] uppercase tracking-[0.3em] text-slate-400">
            Need access? Contact your Virelix administrator.
          </p>
        </div>
      </div>
    </main>
  );
}
