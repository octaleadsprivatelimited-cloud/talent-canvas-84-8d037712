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
      console.log(`[useRole] User authenticated: ${user.email}`);
      console.log(`[useRole] User UID: ${user.id}`);
      console.log(`[useRole] Retrieved role: admin (from hardcoded admin check)`);
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

        if (error) {
          console.warn(`[useRole] Error fetching role for ${user.email}:`, error);
          if (!cancelled) {
            setRole("candidate");
            setRoleUserId(user.id);
            console.log(`[useRole] User authenticated: ${user.email}`);
            console.log(`[useRole] User UID: ${user.id}`);
            console.log(`[useRole] Retrieved role: candidate (defaulted due to DB fetch error)`);
          }
          return;
        }

        const row = data as RoleRow | null;
        if (row && isRole(row.role)) {
          if (!cancelled) {
            setRole(row.role);
            setRoleUserId(user.id);
            console.log(`[useRole] User authenticated: ${user.email}`);
            console.log(`[useRole] User UID: ${user.id}`);
            console.log(`[useRole] Retrieved role: ${row.role} (from user_roles document)`);
          }
          return;
        }

        // Bootstrap or Default: rules permit a signed-in user to create their own
        // role doc. If accessing `/dock` pages, attempt admin bootstrap.
        const isDockPage =
          typeof window !== "undefined" &&
          window.location.pathname.startsWith("/dock");

        if (isDockPage) {
          console.log(`[useRole] No role found for user ${user.email} on admin page. Attempting admin bootstrap.`);
          const { error: upsertError } = await firebase
            .from("user_roles")
            .upsert({ id: user.id, user_id: user.id, role: "admin" }, { onConflict: "id" });
          if (!cancelled) {
            const finalRole = upsertError ? "candidate" : "admin";
            setRole(finalRole);
            setRoleUserId(user.id);
            console.log(`[useRole] User authenticated: ${user.email}`);
            console.log(`[useRole] User UID: ${user.id}`);
            console.log(`[useRole] Retrieved role: ${finalRole} (from admin bootstrap ${upsertError ? 'failed (falling back to candidate)' : 'success'})`);
          }
        } else {
          console.log(`[useRole] No role found for user ${user.email}. Setting and syncing default 'candidate' role.`);
          const { error: upsertError } = await firebase
            .from("user_roles")
            .upsert({ id: user.id, user_id: user.id, role: "candidate" }, { onConflict: "id" });
          if (!cancelled) {
            setRole("candidate");
            setRoleUserId(user.id);
            console.log(`[useRole] User authenticated: ${user.email}`);
            console.log(`[useRole] User UID: ${user.id}`);
            console.log(`[useRole] Retrieved role: candidate (created default candidate role document, sync status: ${upsertError ? 'failed' : 'success'})`);
          }
        }
      } catch (e) {
        console.warn("[useRole] failed to resolve role:", e);
        if (!cancelled) {
          setRole("candidate");
          setRoleUserId(user.id);
          console.log(`[useRole] User authenticated: ${user.email}`);
          console.log(`[useRole] User UID: ${user.id}`);
          console.log(`[useRole] Retrieved role: candidate (fallback on exception)`);
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

  const hasAdminAccess = role === "admin" || role === "editor" || role === "recruiter" || role === "employer";

  return {
    user,
    role,
    loading: authLoading || roleLoading || isTransitioning,
    can,
    hasAdminAccess,
  };
}
