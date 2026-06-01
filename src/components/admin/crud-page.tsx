import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabaseAny } from "@/lib/supabase-any";
import { toast } from "sonner";

export type FieldDef = {
  key: string;
  label: string;
  type?: "text" | "textarea" | "number" | "boolean" | "array" | "json" | "url" | "slug";
  placeholder?: string;
  rows?: number;
  required?: boolean;
};

type Row = Record<string, unknown> & { id: string };

export function CrudPage<T extends Row>({
  title, description, table, queryKey, fields, orderBy = "sort_order", asc = true, listColumns,
}: {
  title: string;
  description?: string;
  table: string;
  queryKey: string;
  fields: FieldDef[];
  orderBy?: string;
  asc?: boolean;
  listColumns: { key: keyof T | string; label: string; render?: (row: T) => React.ReactNode }[];
}) {
  const qc = useQueryClient();
  const [rows, setRows] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<T | null>(null);
  const [open, setOpen] = useState(false);

  const reload = async () => {
    setLoading(true);
    const { data, error } = await supabaseAny.from(table).select("*").order(orderBy, { ascending: asc });
    if (error) toast.error(error.message);
    setRows((data as T[]) ?? []);
    setLoading(false);
    qc.invalidateQueries({ queryKey: [queryKey] });
  };

  // initial load
  if (rows === null && loading) {
    reload();
  }

  const openNew = () => { setEditing({ id: "" } as T); setOpen(true); };
  const openEdit = (row: T) => { setEditing({ ...row }); setOpen(true); };

  const save = async () => {
    if (!editing) return;
    const payload: Record<string, unknown> = {};
    for (const f of fields) {
      const v = (editing as Record<string, unknown>)[f.key];
      if (f.type === "number") payload[f.key] = v === "" || v == null ? null : Number(v);
      else if (f.type === "array") payload[f.key] = typeof v === "string" ? v.split(",").map((s) => s.trim()).filter(Boolean) : v ?? [];
      else if (f.type === "json") {
        try { payload[f.key] = typeof v === "string" ? JSON.parse(v || "null") : v; }
        catch { toast.error(`${f.label} must be valid JSON`); return; }
      }
      else payload[f.key] = v ?? null;
    }
    const isNew = !editing.id;
    const { error } = isNew
      ? await supabaseAny.from(table).insert(payload)
      : await supabaseAny.from(table).update(payload).eq("id", editing.id);
    if (error) { toast.error(error.message); return; }
    toast.success(isNew ? "Created" : "Saved");
    setOpen(false);
    setEditing(null);
    reload();
  };

  const remove = async (row: T) => {
    if (!confirm("Delete this item?")) return;
    const { error } = await supabaseAny.from(table).delete().eq("id", row.id);
    if (error) { toast.error(error.message); return; }
    toast.success("Deleted");
    reload();
  };

  return (
    <div>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">{title}</h1>
          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        </div>
        <Button onClick={openNew}><Plus className="mr-1 h-4 w-4" /> New</Button>
      </div>

      <div className="overflow-x-auto border border-border">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              {listColumns.map((c) => <th key={String(c.key)} className="px-4 py-3">{c.label}</th>)}
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={listColumns.length + 1} className="px-4 py-8 text-center text-muted-foreground">Loading…</td></tr>}
            {!loading && rows && rows.length === 0 && <tr><td colSpan={listColumns.length + 1} className="px-4 py-8 text-center text-muted-foreground">No items yet.</td></tr>}
            {rows?.map((r) => (
              <tr key={r.id} className="border-t border-border">
                {listColumns.map((c) => (
                  <td key={String(c.key)} className="px-4 py-3 align-top">
                    {c.render ? c.render(r) : String((r as Record<string, unknown>)[c.key as string] ?? "")}
                  </td>
                ))}
                <td className="px-4 py-3 text-right">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(r)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="sm" onClick={() => remove(r)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          <DialogHeader><DialogTitle>{editing?.id ? "Edit" : "Create"} {title.slice(0, -1)}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            {fields.map((f) => {
              const val = (editing as Record<string, unknown> | null)?.[f.key];
              const setVal = (v: unknown) => setEditing((prev) => ({ ...(prev as T), [f.key]: v } as T));
              return (
                <div key={f.key} className="space-y-1.5">
                  <Label>{f.label}{f.required && " *"}</Label>
                  {f.type === "boolean" ? (
                    <div className="pt-1"><Switch checked={!!val} onCheckedChange={setVal} /></div>
                  ) : f.type === "textarea" || f.type === "json" ? (
                    <Textarea
                      rows={f.rows ?? 5}
                      placeholder={f.placeholder}
                      value={f.type === "json" ? (typeof val === "string" ? val : JSON.stringify(val ?? null, null, 2)) : (val as string ?? "")}
                      onChange={(e) => setVal(e.target.value)}
                    />
                  ) : f.type === "array" ? (
                    <Input
                      placeholder={f.placeholder ?? "comma, separated, values"}
                      value={Array.isArray(val) ? (val as string[]).join(", ") : (val as string ?? "")}
                      onChange={(e) => setVal(e.target.value)}
                    />
                  ) : (
                    <Input
                      type={f.type === "number" ? "number" : f.type === "url" ? "url" : "text"}
                      placeholder={f.placeholder}
                      value={(val as string | number | undefined) ?? ""}
                      onChange={(e) => setVal(e.target.value)}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
