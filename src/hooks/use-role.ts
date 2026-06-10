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

export function useRole(): UseRoleResult {
  const { user, loading: authLoading } = useAuth();
  const [role, setRole] = useState<Role | null>(null);
  const [roleLoading, setRoleLoading] = useState<boolean>(true);
  const [roleUserId, setRoleUserId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (authLoading) return;
    if (!user) {
      setRole(null);
      setRoleUserId(null);
      setRoleLoading(false);
      return;
    }

    setRoleLoading(true);
    if (user.email === "admin.virelixconsulting@gmail.com" || user.id === "mock-admin-user-id") {
      setRole("admin");
      setRoleUserId(user.id);
      setRoleLoading(false);
      return;
    }
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
            if (!cancelled) {
              setRole(row.role);
              setRoleUserId(user.id);
            }
            return;
          }
        }

        // Bootstrap: rules permit a signed-in user to create their own
        // admin doc (id == auth.uid, role == 'admin'). If admins already
        // exist for someone else, this write will be denied — which is the
        // intended behaviour. Only run this on admin/login routes to avoid
        // unnecessary write attempts for standard users on public pages.
        const isDockPage =
          typeof window !== "undefined" &&
          window.location.pathname.startsWith("/dock");

        if (isDockPage) {
          const { error: upsertError } = await firebase
            .from("user_roles")
            .upsert({ id: user.id, user_id: user.id, role: "admin" }, { onConflict: "id" });
          if (!cancelled) {
            setRole(upsertError ? null : "admin");
            setRoleUserId(user.id);
          }
        } else {
          if (!cancelled) {
            setRole("user");
            setRoleUserId(user.id);
          }
        }
      } catch (e) {
        console.warn("[useRole] failed to resolve role:", e);
        if (!cancelled) {
          setRole(null);
          setRoleUserId(user.id);
        }
      } finally {
        if (!cancelled) setRoleLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user, authLoading]);

  const can = useCallback((permission: Permission) => roleHasPermission(role, permission), [role]);

  const isTransitioning = user !== null && roleUserId !== user.id;

  return {
    user,
    role,
    loading: authLoading || roleLoading || isTransitioning,
    can,
    hasAdminAccess: role !== null,
  };
}
