import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { Pencil, Plus, Trash2, ExternalLink } from "lucide-react";
import { supabaseAny } from "@/lib/supabase-any";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { LAYOUTS, getLayout, type LayoutId, type LayoutContent } from "@/lib/page-layouts";

export const Route = createFileRoute("/admin/pages")({
  component: AdminPages,
});

type PageRow = {
  id: string;
  slug: string;
  title: string;
  layout: LayoutId;
  content: LayoutContent;
  seo_description: string | null;
  published: boolean;
  sort_order: number;
};

type Draft = {
  id: string;
  slug: string;
  title: string;
  layout: LayoutId;
  content: LayoutContent;
  seo_description: string;
  published: boolean;
  sort_order: number;
  // raw JSON text for fields of type "json" so users can edit freely
  jsonRaw: Record<string, string>;
};

function emptyDraft(layout: LayoutId = "hero-features"): Draft {
  const meta = getLayout(layout);
  const jsonRaw: Record<string, string> = {};
  for (const f of meta.fields) {
    if (f.type === "json") jsonRaw[f.key] = JSON.stringify(meta.sample[f.key] ?? [], null, 2);
  }
  return {
    id: "",
    slug: "",
    title: "",
    layout,
    content: { ...meta.sample },
    seo_description: "",
    published: true,
    sort_order: 0,
    jsonRaw,
  };
}

function toDraft(row: PageRow): Draft {
  const meta = getLayout(row.layout);
  const jsonRaw: Record<string, string> = {};
  for (const f of meta.fields) {
    if (f.type === "json") {
      jsonRaw[f.key] = JSON.stringify(row.content?.[f.key] ?? [], null, 2);
    }
  }
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    layout: row.layout,
    content: { ...row.content },
    seo_description: row.seo_description ?? "",
    published: row.published,
    sort_order: row.sort_order ?? 0,
    jsonRaw,
  };
}

function AdminPages() {
  const [rows, setRows] = useState<PageRow[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Draft | null>(null);

  const reload = async () => {
    setLoading(true);
    const { data, error } = await supabaseAny
      .from("custom_pages")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setRows((data as PageRow[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    reload();
  }, []);

  const openNew = () => {
    setDraft(emptyDraft());
    setOpen(true);
  };
  const openEdit = (row: PageRow) => {
    setDraft(toDraft(row));
    setOpen(true);
  };

  const switchLayout = (next: LayoutId) => {
    if (!draft) return;
    const meta = getLayout(next);
    const jsonRaw: Record<string, string> = {};
    const content: LayoutContent = {};
    for (const f of meta.fields) {
      const existing = draft.content[f.key];
      const value = existing !== undefined ? existing : meta.sample[f.key];
      content[f.key] = value;
      if (f.type === "json") jsonRaw[f.key] = JSON.stringify(value ?? [], null, 2);
    }
    setDraft({ ...draft, layout: next, content, jsonRaw });
  };

  const setField = (key: string, value: unknown) => {
    if (!draft) return;
    setDraft({ ...draft, content: { ...draft.content, [key]: value } });
  };
  const setJsonRaw = (key: string, raw: string) => {
    if (!draft) return;
    setDraft({ ...draft, jsonRaw: { ...draft.jsonRaw, [key]: raw } });
  };

  const save = async () => {
    if (!draft) return;
    if (!draft.title.trim() || !draft.slug.trim()) {
      toast.error("Title and slug are required.");
      return;
    }
    const meta = getLayout(draft.layout);
    const content: LayoutContent = { ...draft.content };
    for (const f of meta.fields) {
      if (f.type === "json") {
        const raw = draft.jsonRaw[f.key] ?? "";
        try {
          content[f.key] = raw.trim() === "" ? [] : JSON.parse(raw);
        } catch {
          toast.error(`${f.label} must be valid JSON`);
          return;
        }
      }
    }
    const payload = {
      slug: draft.slug.trim().toLowerCase(),
      title: draft.title.trim(),
      layout: draft.layout,
      content,
      seo_description: draft.seo_description.trim() || null,
      published: draft.published,
      sort_order: Number(draft.sort_order) || 0,
    };
    const { error } = draft.id
      ? await supabaseAny.from("custom_pages").update(payload).eq("id", draft.id)
      : await supabaseAny.from("custom_pages").insert(payload);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(draft.id ? "Page saved" : "Page created");
    setOpen(false);
    setDraft(null);
    reload();
  };

  const remove = async (row: PageRow) => {
    if (!confirm(`Delete page "${row.title}"?`)) return;
    const { error } = await supabaseAny.from("custom_pages").delete().eq("id", row.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Deleted");
    reload();
  };

  const layoutMeta = useMemo(() => (draft ? getLayout(draft.layout) : null), [draft]);

  return (
    <div>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Pages</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Build standalone pages on <code>/p/&lt;slug&gt;</code> using one of {LAYOUTS.length} designed layouts.
          </p>
        </div>
        <Button onClick={openNew}>
          <Plus className="mr-1 h-4 w-4" /> New page
        </Button>
      </div>

      <div className="overflow-x-auto border border-border">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Layout</th>
              <th className="px-4 py-3">Live</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  Loading…
                </td>
              </tr>
            )}
            {!loading && rows && rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  No pages yet. Create your first one.
                </td>
              </tr>
            )}
            {rows?.map((r) => (
              <tr key={r.id} className="border-t border-border">
                <td className="px-4 py-3 align-top">{r.sort_order}</td>
                <td className="px-4 py-3 align-top font-medium">{r.title}</td>
                <td className="px-4 py-3 align-top font-mono text-xs">/p/{r.slug}</td>
                <td className="px-4 py-3 align-top">{getLayout(r.layout).label}</td>
                <td className="px-4 py-3 align-top">{r.published ? "✓" : "—"}</td>
                <td className="px-4 py-3 text-right">
                  {r.published && (
                    <a
                      href={`/p/${r.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 px-2 text-xs text-primary hover:underline"
                    >
                      <ExternalLink className="h-3.5 w-3.5" /> View
                    </a>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => openEdit(r)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => remove(r)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{draft?.id ? "Edit page" : "New page"}</DialogTitle>
          </DialogHeader>

          {draft && layoutMeta && (
            <div className="space-y-6">
              {/* Layout picker */}
              <div>
                <Label className="mb-2 block">Layout</Label>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {LAYOUTS.map((l) => {
                    const active = draft.layout === l.id;
                    return (
                      <button
                        key={l.id}
                        type="button"
                        onClick={() => switchLayout(l.id)}
                        className={`border p-3 text-left transition ${
                          active
                            ? "border-primary bg-primary/5 ring-1 ring-primary"
                            : "border-border hover:bg-surface"
                        }`}
                      >
                        <p className="font-mono text-xs text-muted-foreground">{l.preview}</p>
                        <p className="mt-1 text-sm font-semibold">{l.label}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{l.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Page meta */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Title *</Label>
                  <Input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Slug *</Label>
                  <Input
                    value={draft.slug}
                    placeholder="about-us"
                    onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label>SEO description</Label>
                  <Textarea
                    rows={2}
                    value={draft.seo_description}
                    onChange={(e) => setDraft({ ...draft, seo_description: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Sort order</Label>
                  <Input
                    type="number"
                    value={draft.sort_order}
                    onChange={(e) => setDraft({ ...draft, sort_order: Number(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Published</Label>
                  <div className="pt-1">
                    <Switch
                      checked={draft.published}
                      onCheckedChange={(v) => setDraft({ ...draft, published: v })}
                    />
                  </div>
                </div>
              </div>

              {/* Layout-specific fields */}
              <div className="border-t border-border pt-5">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {layoutMeta.label} content
                </p>
                <div className="space-y-4">
                  {layoutMeta.fields.map((f) => {
                    const val = draft.content[f.key];
                    if (f.type === "json") {
                      return (
                        <div key={f.key} className="space-y-1.5">
                          <Label>{f.label}</Label>
                          <Textarea
                            rows={f.rows ?? 8}
                            className="font-mono text-xs"
                            value={draft.jsonRaw[f.key] ?? ""}
                            onChange={(e) => setJsonRaw(f.key, e.target.value)}
                          />
                          {f.help && <p className="text-xs text-muted-foreground">{f.help}</p>}
                        </div>
                      );
                    }
                    if (f.type === "textarea") {
                      return (
                        <div key={f.key} className="space-y-1.5">
                          <Label>{f.label}</Label>
                          <Textarea
                            rows={f.rows ?? 4}
                            placeholder={f.placeholder}
                            value={(val as string) ?? ""}
                            onChange={(e) => setField(f.key, e.target.value)}
                          />
                        </div>
                      );
                    }
                    return (
                      <div key={f.key} className="space-y-1.5">
                        <Label>{f.label}</Label>
                        <Input
                          type={f.type === "url" ? "url" : "text"}
                          placeholder={f.placeholder}
                          value={(val as string) ?? ""}
                          onChange={(e) => setField(f.key, e.target.value)}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
