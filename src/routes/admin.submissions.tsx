import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/submissions")({
  component: SubmissionsAdmin,
});

type Submission = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  subject: string | null;
  message: string;
  status: string;
  created_at: string;
};

function SubmissionsAdmin() {
  const [rows, setRows] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("contact_submissions").select("*").order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setRows((data as Submission[]) ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const setStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("contact_submissions").update({ status }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    load();
  };
  const remove = async (id: string) => {
    if (!confirm("Delete this submission?")) return;
    await supabase.from("contact_submissions").delete().eq("id", id);
    load();
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Contact Inbox</h1>
      <p className="mt-1 text-sm text-muted-foreground">Inquiries from the public contact form.</p>
      <div className="mt-6 space-y-3">
        {loading && <p className="text-muted-foreground">Loading…</p>}
        {!loading && rows.length === 0 && <p className="text-muted-foreground">No submissions yet.</p>}
        {rows.map((r) => (
          <div key={r.id} className="border border-border bg-background p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-display text-lg font-semibold">{r.name} <span className="text-sm font-normal text-muted-foreground">· {r.email}</span></p>
                <p className="text-xs text-muted-foreground">{[r.company, r.phone].filter(Boolean).join(" · ")} · {new Date(r.created_at).toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-2">
                <select value={r.status} onChange={(e) => setStatus(r.id, e.target.value)} className="border border-border bg-background px-2 py-1 text-xs">
                  <option value="new">New</option>
                  <option value="in_progress">In progress</option>
                  <option value="resolved">Resolved</option>
                </select>
                <Button variant="ghost" size="sm" onClick={() => remove(r.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </div>
            {r.subject && <p className="mt-3 text-sm font-medium">Subject: {r.subject}</p>}
            <p className="mt-2 whitespace-pre-line text-sm text-foreground/90">{r.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
