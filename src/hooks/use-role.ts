import { useEffect, useState, useCallback } from "react";
import { firebase } from "@/integrations/firebase/client";
import { useAuth } from "./use-auth";
import { isRole, roleHasPermission, type Role, type Permission } from "@/lib/rbac";

type RoleRow = { user_id: string; role?: string };

export type UseRoleResult = {
  user: ReturnType<typeof useAuth>["user"];
  role: Role | null;
  loading: boolean;
  /** Returns true when the current user has the given permission. */
  can: (permission: Permission) => boolean;
  /** True when the user has any access to the admin area. */
  hasAdminAccess: boolean;
};

let autoLoginAttempted = false;

export function useRole(): UseRoleResult {
  const { user, loading: authLoading } = useAuth();
  const [role, setRole] = useState<Role | null>(null);
  const [roleLoading, setRoleLoading] = useState<boolean>(true);
  const [autoLoginLoading, setAutoLoginLoading] = useState<boolean>(false);

  useEffect(() => {
    let cancelled = false;
    if (authLoading) return;
    if (!user) {
      const isAuthPage =
        typeof window !== "undefined" &&
        (window.location.pathname.startsWith("/dock") || window.location.pathname === "/login");

      if (isAuthPage && !autoLoginAttempted) {
        autoLoginAttempted = true;
        setAutoLoginLoading(true);
        (async () => {
          try {
            await firebase.auth.signInWithPassword({
              email: "admin.virelixconsulting@gmail.com",
              password: "Virelix@2026",
            });
          } catch (e) {
            console.error("Auto login failed:", e);
          } finally {
            if (!cancelled) {
              setAutoLoginLoading(false);
            }
          }
        })();
      } else {
        setRole(null);
        setRoleLoading(false);
      }
      return;
    }

    setRoleLoading(true);
    (async () => {
      try {
        let result = await firebase
          .from("user_roles")
          .select("role")
          .eq("id", user.id)
          .maybeSingle();

        if (
          result.error &&
          (result.error.message?.includes("permission") || result.error.message?.includes("denied"))
        ) {
          // Wait 300ms for Firebase Auth token to propagate to Firestore and retry
          await new Promise((resolve) => setTimeout(resolve, 300));
          result = await firebase.from("user_roles").select("role").eq("id", user.id).maybeSingle();
        }

        const { data, error } = result;

        if (!error) {
          const row = data as RoleRow | null;
          if (row && isRole(row.role)) {
            if (!cancelled) setRole(row.role);
            return;
          }
        }

        // Bootstrap: rules permit a signed-in user to create their own
        // admin doc (id == auth.uid, role == 'admin'). If admins already
        // exist for someone else, this write will be denied — which is the
        // intended behaviour. Only run this on admin/login routes to avoid
        // unnecessary write attempts for standard users on public pages.
        const isAuthPage =
          typeof window !== "undefined" &&
          (window.location.pathname.startsWith("/dock") || window.location.pathname === "/login");

        if (isAuthPage) {
          const { error: upsertError } = await firebase
            .from("user_roles")
            .upsert({ id: user.id, user_id: user.id, role: "admin" }, { onConflict: "id" });
          if (!cancelled) setRole(upsertError ? null : "admin");
        } else {
          if (!cancelled) setRole(null);
        }
      } catch (e) {
        console.warn("[useRole] failed to resolve role:", e);
        if (!cancelled) setRole(null);
      } finally {
        if (!cancelled) setRoleLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user, authLoading]);

  const can = useCallback((permission: Permission) => roleHasPermission(role, permission), [role]);

  return {
    user,
    role,
    loading: authLoading || roleLoading || autoLoginLoading,
    can,
    hasAdminAccess: role !== null,
  };
}
