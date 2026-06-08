import { useEffect, useState } from "react";
import { firebase } from "@/integrations/firebase/client";
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
    // Look up user_roles document by the user's UID as the document ID.
    // This aligns with Firestore rules that check exists(/user_roles/$(request.auth.uid)).
    firebase
      .from("user_roles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle()
      .then(async ({ data }: { data: any }) => {
        if (data && data.role === "admin") {
          setIsAdmin(true);
        } else {
          // If there are no role records at all in the database, auto-promote the first user.
          const { data: allRoles } = await firebase.from("user_roles").select("id").limit(1);
          if (allRoles && allRoles.length === 0) {
            // Insert with the user's UID as the document ID
            await firebase.from("user_roles").insert({
              id: user.id,
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
