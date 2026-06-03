import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Inbox, Mail, Phone, Building2, Clock, Trash2, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/submissions")({
  component: SubmissionsAdmin,
});

type SubStatus = "new" | "in_progress" | "resolved";

type Submission = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  subject: string | null;
  message: string;
  status: SubStatus;
  created_at: string;
};

const STATUS_META: Record<
  SubStatus,
  { label: string; className: string; dot: string }
> = {
  new: {
    label: "New",
    className:
      "border-primary/30 bg-primary/10 text-primary",
    dot: "bg-primary",
  },
  in_progress: {
    label: "In progress",
    className:
      "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
    dot: "bg-amber-500",
  },
  resolved: {
    label: "Resolved",
    className:
      "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    dot: "bg-emerald-500",
  },
};

function timeAgo(iso: string) {
  const d = new Date(iso).getTime();
  const diff = Math.max(0, Date.now() - d);
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

function SubmissionsAdmin() {
  const [rows, setRows] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | SubStatus>("all");
  const [q, setQ] = useState("");

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setRows((data as Submission[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const setStatus = async (id: string, status: SubStatus) => {
    const prev = rows;
    setRows((r) => r.map((x) => (x.id === id ? { ...x, status } : x)));
    const { error } = await supabase
      .from("contact_submissions")
      .update({ status })
      .eq("id", id);
    if (error) {
      toast.error(error.message);
      setRows(prev);
      return;
    }
    toast.success("Status updated");
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this submission?")) return;
    const { error } = await supabase.from("contact_submissions").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Deleted");
    setRows((r) => r.filter((x) => x.id !== id));
  };

  const counts = useMemo(() => {
    const c = { all: rows.length, new: 0, in_progress: 0, resolved: 0 };
    for (const r of rows) c[r.status] += 1;
    return c;
  }, [rows]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (filter !== "all" && r.status !== filter) return false;
      if (!term) return true;
      return (
        r.name.toLowerCase().includes(term) ||
        r.email.toLowerCase().includes(term) ||
        (r.subject ?? "").toLowerCase().includes(term) ||
        (r.company ?? "").toLowerCase().includes(term) ||
        r.message.toLowerCase().includes(term)
      );
    });
  }, [rows, filter, q]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">
            Contact Inbox
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Inquiries submitted from the public contact form.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-md border border-border bg-surface/40 px-3 py-1.5 text-xs text-muted-foreground">
          <Inbox className="h-3.5 w-3.5" />
          <span className="font-medium text-foreground">{counts.all}</span> total
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {(["new", "in_progress", "resolved"] as SubStatus[]).map((k) => {
          const meta = STATUS_META[k];
          const isActive = filter === k;
          return (
            <button
              key={k}
              type="button"
              onClick={() => setFilter(isActive ? "all" : k)}
              className={cn(
                "group rounded-lg border bg-surface/40 p-4 text-left transition hover:border-primary/50 hover:bg-surface/70",
                isActive ? "border-primary ring-2 ring-primary/30" : "border-border",
              )}
            >
              <div className="flex items-center gap-2">
                <span className={cn("h-2 w-2 rounded-full", meta.dot)} />
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {meta.label}
                </p>
              </div>
              <p className="mt-2 font-display text-2xl font-bold">
                {counts[k]}
              </p>
            </button>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface/40 p-3">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, email, subject…"
            className="pl-9"
          />
        </div>
        <Select value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="in_progress">In progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* List */}
      {loading ? (
        <div className="grid gap-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-lg border border-border bg-surface/40"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="border-dashed bg-surface/40">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Inbox className="h-6 w-6" />
            </div>
            <p className="mt-4 font-display text-lg font-semibold">
              No submissions
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {rows.length === 0
                ? "When a visitor sends a message, it will appear here."
                : "No messages match your filters."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {filtered.map((r) => {
            const meta = STATUS_META[r.status];
            return (
              <Card
                key={r.id}
                className="overflow-hidden border-border bg-background transition hover:border-primary/40 hover:shadow-sm"
              >
                <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3 space-y-0 pb-3">
                  <div className="min-w-0">
                    <CardTitle className="font-display text-lg">
                      {r.name}
                    </CardTitle>
                    <CardDescription className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                      <span className="inline-flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        <a
                          href={`mailto:${r.email}`}
                          className="hover:text-primary hover:underline"
                        >
                          {r.email}
                        </a>
                      </span>
                      {r.phone && (
                        <span className="inline-flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {r.phone}
                        </span>
                      )}
                      {r.company && (
                        <span className="inline-flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          {r.company}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {timeAgo(r.created_at)}
                      </span>
                    </CardDescription>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={cn("gap-1.5 font-medium", meta.className)}
                    >
                      <span className={cn("h-1.5 w-1.5 rounded-full", meta.dot)} />
                      {meta.label}
                    </Badge>
                    <Select
                      value={r.status}
                      onValueChange={(v) => setStatus(r.id, v as SubStatus)}
                    >
                      <SelectTrigger className="h-8 w-36 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="in_progress">In progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(r.id)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      aria-label="Delete submission"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-2 pt-0">
                  {r.subject && (
                    <p className="text-sm font-semibold text-foreground">
                      {r.subject}
                    </p>
                  )}
                  <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/85">
                    {r.message}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
