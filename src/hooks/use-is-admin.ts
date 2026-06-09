import { useRole } from "./use-role";

/**
 * Back-compat shim. Prefer `useRole()` / `can()` for new code.
 * `isAdmin` is true only for the `admin` role; other roles can still have
 * limited access via `useRole().hasAdminAccess`.
 */
export function useIsAdmin() {
  const { user, role, loading } = useRole();
  return {
    user,
    isAdmin: loading ? null : role === "admin",
    loading,
  };
}
