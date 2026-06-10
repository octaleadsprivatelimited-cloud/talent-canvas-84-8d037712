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
    const checkMockSession = () => {
      const mockSessionStr = typeof window !== "undefined" ? localStorage.getItem("virelix_mock_session") : null;
      if (mockSessionStr) {
        try {
          const mockSession = JSON.parse(mockSessionStr);
          if (mockSession.user) {
            setSession(mockSession);
            setUser(mockSession.user);
            setLoading(false);
            return true;
          }
        } catch (e) {
          console.error("Failed to parse mock session", e);
        }
      }
      return false;
    };

    // 1. Initial check for mock session
    const hasMock = checkMockSession();

    // 2. Setup storage listener for mock session changes
    const handleStorage = () => {
      if (!checkMockSession()) {
        firebase.auth.getSession().then(({ data }: { data: any }) => {
          const s = data.session;
          const u = s?.user;
          setSession((s ?? null) as Session | null);
          setUser((u ?? null) as User | null);
        });
      }
    };
    window.addEventListener("storage", handleStorage);
    // Also listen to a custom event for local dispatch within the same window
    window.addEventListener("virelix_auth_change", handleStorage);

    // 3. Setup Firebase listener
    const {
      data: { subscription },
    } = firebase.auth.onAuthStateChange((_event: string, s: any) => {
      const currentMock = typeof window !== "undefined" ? localStorage.getItem("virelix_mock_session") : null;
      if (!currentMock) {
        const u = s?.user;
        setSession(s as Session | null);
        setUser((u ?? null) as User | null);
      }
    });

    if (!hasMock) {
      firebase.auth
        .getSession()
        .then(({ data }: { data: any }) => {
          const currentMock = typeof window !== "undefined" ? localStorage.getItem("virelix_mock_session") : null;
          if (!currentMock) {
            const s = data.session;
            const u = s?.user;
            setSession((s ?? null) as Session | null);
            setUser((u ?? null) as User | null);
          }
        })
        .catch((err) => {
          console.error("[useAuth] getSession failed:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("virelix_auth_change", handleStorage);
      subscription.unsubscribe();
    };
  }, []);

  return { session, user, loading };
}
