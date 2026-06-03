import { useEffect, useState } from "react";
import { supabase } from "@/integrations/firebase/client";
import { useAuth } from "./use-auth";

export function useIsAdmin() {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      setIsAdmin(false);
      return;
    }
    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle()
      .then(async ({ data }) => {
        if (data) {
          setIsAdmin(true);
        } else {
          // If there are no role records at all in the database, auto-promote the first user.
          const { data: allRoles } = await supabase.from("user_roles").select("id").limit(1);
          if (allRoles && allRoles.length === 0) {
            await supabase.from("user_roles").insert({
              user_id: user.id,
              role: "admin",
            });
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        }
      });
  }, [user, loading]);

  return { isAdmin, loading: loading || isAdmin === null, user };
}
