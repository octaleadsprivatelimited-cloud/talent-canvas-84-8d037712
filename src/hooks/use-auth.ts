import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/firebase/client";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: string, s: any) => {
      setSession(s as Session | null);
      setUser((s?.user ?? null) as User | null);
    });
    supabase.auth.getSession().then(({ data }: { data: any }) => {
      setSession((data.session ?? null) as Session | null);
      setUser((data.session?.user ?? null) as User | null);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  return { session, user, loading };
}
