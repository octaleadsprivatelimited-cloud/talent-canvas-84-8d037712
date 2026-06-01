import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabaseAny } from "@/lib/supabase-any";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/page-content")({
  component: PageContentAdmin,
});

const PAGES = [
  { key: "home", label: "Home Page", schema: ["hero_eyebrow", "hero_title", "hero_subtitle"] },
  { key: "about", label: "About Page", schema: ["title", "intro", "mission", "values (array)"] },
  { key: "contact", label: "Contact Page", schema: ["title", "subtitle"] },
];

function PageContentAdmin() {
  const [active, setActive] = useState(PAGES[0].key);
  const [json, setJson] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    supabaseAny.from("page_content").select("content").eq("page_key", active).maybeSingle().then(({ data }: { data: { content: unknown } | null }) => {
      setJson(JSON.stringify(data?.content ?? {}, null, 2));
      setLoading(false);
    });
  }, [active]);

  const save = async () => {
    let parsed: unknown;
    try { parsed = JSON.parse(json); } catch { toast.error("Invalid JSON"); return; }
    const { error } = await supabaseAny.from("page_content").upsert({ page_key: active, content: parsed }, { onConflict: "page_key" });
    if (error) { toast.error(error.message); return; }
    toast.success("Page content saved");
  };

  const current = PAGES.find((p) => p.key === active)!;

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl font-bold">Page Content</h1>
      <p className="mt-1 text-sm text-muted-foreground">Edit hero copy and section text for major pages. Stored as JSON for flexibility.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {PAGES.map((p) => (
          <button key={p.key} onClick={() => setActive(p.key)}
            className={`border px-3 py-1.5 text-sm ${active === p.key ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-surface"}`}>
            {p.label}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-2">
        <Label>Content (JSON) — recognized keys: {current.schema.join(", ")}</Label>
        {loading ? <p className="text-sm text-muted-foreground">Loading…</p> : (
          <Textarea rows={18} value={json} onChange={(e) => setJson(e.target.value)} className="font-mono text-sm" />
        )}
        <Button onClick={save} className="mt-3">Save {current.label}</Button>
      </div>
    </div>
  );
}
