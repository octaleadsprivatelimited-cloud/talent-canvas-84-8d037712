import { useEffect, useState } from "react";
export type User = {
  id: string;
  email: string | null;
  app_metadata?: Record<string, any>;
  user_metadata?: Record<string, any>;
  created_at?: string;
  last_sign_in_at?: string;
};

export type Session = {
  access_token: string;
  expires_at?: number;
  user: User;
};
import { firebase } from "@/integrations/firebase/client";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const {
      data: { subscription },
    } = firebase.auth.onAuthStateChange((_event: string, s: any) => {
      setSession(s as Session | null);
      setUser((s?.user ?? null) as User | null);
    });
    firebase.auth
      .getSession()
      .then(({ data }: { data: any }) => {
        setSession((data.session ?? null) as Session | null);
        setUser((data.session?.user ?? null) as User | null);
      })
      .catch((err) => {
        console.error("[useAuth] getSession failed:", err);
      })
      .finally(() => {
        setLoading(false);
      });
    return () => subscription.unsubscribe();
  }, []);

  return { session, user, loading };
}
