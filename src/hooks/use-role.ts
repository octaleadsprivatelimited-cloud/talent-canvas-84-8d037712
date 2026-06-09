import { useEffect, useState, useCallback } from "react";
import { firebase } from "@/integrations/firebase/client";
import { useAuth } from "./use-auth";
import { isRole, roleHasPermission, type Role, type Permission } from "@/lib/rbac";

type RoleRow = { id: string; role?: string };

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

  useEffect(() => {
    let cancelled = false;
    if (authLoading) return;
    if (!user) {
      setRole(null);
      setRoleLoading(false);
      return;
    }

    setRoleLoading(true);
    (async () => {
      try {
        const { data } = await firebase
          .from("user_roles")
          .select("role")
          .eq("id", user.id)
          .maybeSingle();
        const row = data as RoleRow | null;

        if (row && isRole(row.role)) {
          if (!cancelled) setRole(row.role);
        } else {
          // Bootstrap: if no roles exist at all, the very first signed-in user
          // becomes an admin. Otherwise leave them with no role.
          const { data: any } = await firebase
            .from("user_roles")
            .select("id")
            .limit(1);
          const allRoles = (any as { id: string }[] | null) ?? [];
          if (allRoles.length === 0) {
            await firebase
              .from("user_roles")
              .upsert(
                { id: user.id, user_id: user.id, role: "admin" },
                { onConflict: "id" },
              );
            if (!cancelled) setRole("admin");
          } else if (!cancelled) {
            setRole(null);
          }
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

  const can = useCallback(
    (permission: Permission) => roleHasPermission(role, permission),
    [role],
  );

  return {
    user,
    role,
    loading: authLoading || roleLoading,
    can,
    hasAdminAccess: role !== null,
  };
}
