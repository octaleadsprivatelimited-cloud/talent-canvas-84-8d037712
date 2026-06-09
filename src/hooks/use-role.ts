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
        const { data, error } = await firebase
          .from("user_roles")
          .select("role")
          .eq("id", user.id)
          .maybeSingle();

        // If the read itself failed (permission-denied / network), do NOT
        // bootstrap — treat as "no role". Bootstrapping on a read error is
        // a role-escalation bug because every signed-in user would self-promote.
        if (error) {
          if (!cancelled) setRole(null);
          return;
        }

        const row = data as RoleRow | null;
        if (row && isRole(row.role)) {
          if (!cancelled) setRole(row.role);
          return;
        }

        // Bootstrap: only if the user_roles collection is verifiably empty.
        const { data: any, error: listError } = await firebase
          .from("user_roles")
          .select("id")
          .limit(1);
        if (listError) {
          if (!cancelled) setRole(null);
          return;
        }
        const allRoles = (any as { id: string }[] | null) ?? [];
        if (allRoles.length === 0) {
          const { error: upsertError } = await firebase
            .from("user_roles")
            .upsert(
              { id: user.id, user_id: user.id, role: "admin" },
              { onConflict: "id" },
            );
          // Only grant admin client-side if the write actually succeeded.
          if (!cancelled) setRole(upsertError ? null : "admin");
        } else if (!cancelled) {
          setRole(null);
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
