import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { firebase } from "@/integrations/firebase/client";
import { useRole } from "@/hooks/use-role";
import { ROLES, ROLE_LABELS, ROLE_DESCRIPTIONS, isRole, type Role } from "@/lib/rbac";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useState } from "react";
import { Trash2, UserPlus } from "lucide-react";

export const Route = createFileRoute("/dock/users")({
  component: UsersAdmin,
});

type UserRoleRow = {
  id: string; // = firebase uid
  user_id?: string;
  role?: string;
  email?: string;
  created_at?: string;
};

function UsersAdmin() {
  const qc = useQueryClient();
  const { user: me, role: myRole, loading: meLoading } = useRole();

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["user_roles", "all"],
    queryFn: async () => {
      const { data } = await firebase.from("user_roles").select("*").execute();
      return (data ?? []) as UserRoleRow[];
    },
  });

  const updateRole = useMutation({
    mutationFn: async ({ id, role }: { id: string; role: Role }) => {
      await firebase.from("user_roles").upsert({ id, user_id: id, role }, { onConflict: "id" });
    },
    onSuccess: () => {
      toast.success("Role updated");
      qc.invalidateQueries({ queryKey: ["user_roles"] });
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : "Failed to update role"),
  });

  const removeRow = useMutation({
    mutationFn: async (id: string) => {
      await firebase.from("user_roles").delete().eq("id", id);
    },
    onSuccess: () => {
      toast.success("Access revoked");
      qc.invalidateQueries({ queryKey: ["user_roles"] });
    },
  });

  const [newUid, setNewUid] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<Role>("editor");

  const addUser = useMutation({
    mutationFn: async () => {
      const uid = newUid.trim();
      if (!uid) throw new Error("Firebase UID is required");
      await firebase
        .from("user_roles")
        .upsert(
          { id: uid, user_id: uid, role: newRole, email: newEmail.trim() || null },
          { onConflict: "id" },
        );
    },
    onSuccess: () => {
      toast.success("User added");
      setNewUid("");
      setNewEmail("");
      qc.invalidateQueries({ queryKey: ["user_roles"] });
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : "Failed to add user"),
  });

  if (meLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;

  if (myRole !== "admin") {
    return (
      <div className="rounded-md border border-border bg-surface p-6">
        <h1 className="font-display text-2xl font-bold">Users & Roles</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Only administrators can manage user roles.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-bold">Users & Roles</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Grant access to the admin panel by assigning a role to a Firebase user.
        </p>
      </header>

      {/* Role reference */}
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {ROLES.map((r) => (
          <div key={r} className="rounded-md border border-border bg-surface p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {r}
            </p>
            <p className="mt-1 text-sm font-medium">{ROLE_LABELS[r]}</p>
            <p className="mt-2 text-xs text-muted-foreground">{ROLE_DESCRIPTIONS[r]}</p>
          </div>
        ))}
      </section>

      {/* Add user */}
      <section className="rounded-md border border-border bg-surface p-5">
        <h2 className="font-display text-lg font-semibold">Grant access</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Get the user's Firebase UID from the Firebase Auth console, then assign a role.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_180px_auto]">
          <Input
            placeholder="Firebase UID"
            value={newUid}
            onChange={(e) => setNewUid(e.target.value)}
          />
          <Input
            placeholder="Email (optional, for reference)"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
          <Select value={newRole} onValueChange={(v) => setNewRole(v as Role)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ROLES.map((r) => (
                <SelectItem key={r} value={r}>
                  {ROLE_LABELS[r]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => addUser.mutate()} disabled={addUser.isPending} className="gap-2">
            <UserPlus className="h-4 w-4" />
            Add
          </Button>
        </div>
      </section>

      {/* List */}
      <section className="rounded-md border border-border bg-surface">
        <div className="border-b border-border px-5 py-3">
          <h2 className="font-display text-lg font-semibold">Members</h2>
        </div>
        {isLoading ? (
          <p className="px-5 py-6 text-sm text-muted-foreground">Loading…</p>
        ) : rows.length === 0 ? (
          <p className="px-5 py-6 text-sm text-muted-foreground">No users yet.</p>
        ) : (
          <div className="divide-y divide-border">
            {rows.map((row) => {
              const current = isRole(row.role) ? row.role : null;
              const isMe = me?.id === row.id;
              return (
                <div
                  key={row.id}
                  className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {row.email || "(no email on record)"}
                      {isMe && (
                        <span className="ml-2 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                          You
                        </span>
                      )}
                    </p>
                    <p className="mt-0.5 truncate font-mono text-[11px] text-muted-foreground">
                      {row.id}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select
                      value={current ?? ""}
                      onValueChange={(v) => isRole(v) && updateRole.mutate({ id: row.id, role: v })}
                      disabled={isMe && current === "admin"}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Pick role" />
                      </SelectTrigger>
                      <SelectContent>
                        {ROLES.map((r) => (
                          <SelectItem key={r} value={r}>
                            {ROLE_LABELS[r]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Revoke access"
                      disabled={isMe}
                      onClick={() => {
                        if (confirm("Revoke this user's admin access?")) {
                          removeRow.mutate(row.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
