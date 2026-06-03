import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabaseAny } from "@/lib/supabase-any";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/page-content")({
  component: PageContentAdmin,
});

const PAGES = [
  { key: "home", label: "Home Page", schema: ["hero_eyebrow", "hero_title", "hero_subtitle"] },
  { key: "about", label: "About Page", schema: ["title", "intro", "mission", "values (array)", "operating_in (array)"] },
  { key: "contact", label: "Contact Page", schema: ["title", "subtitle"] },
];

function PageContentAdmin() {
  const [active, setActive] = useState(PAGES[0].key);
  const [json, setJson] = useState("");
  const [loading, setLoading] = useState(true);

  // Dedicated "Operating in" editor state (about page only)
  const [countries, setCountries] = useState<string[]>([]);
  const [newCountry, setNewCountry] = useState("");

  useEffect(() => {
    setLoading(true);
    supabaseAny.from("page_content").select("content").eq("page_key", active).maybeSingle().then(({ data }: { data: { content: Record<string, unknown> } | null }) => {
      const content = (data?.content ?? {}) as Record<string, unknown>;
      setJson(JSON.stringify(content, null, 2));
      if (active === "about") {
        const oi = content.operating_in;
        setCountries(Array.isArray(oi) ? (oi as string[]) : typeof oi === "string" && oi ? [oi as string] : []);
      }
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

  const saveCountries = async (next: string[]) => {
    let content: Record<string, unknown> = {};
    try { content = JSON.parse(json) as Record<string, unknown>; } catch { /* ignore */ }
    content.operating_in = next;
    const { error } = await supabaseAny.from("page_content").upsert({ page_key: "about", content }, { onConflict: "page_key" });
    if (error) { toast.error(error.message); return; }
    setJson(JSON.stringify(content, null, 2));
    setCountries(next);
    toast.success("Operating regions updated");
  };

  const addCountry = () => {
    const v = newCountry.trim();
    if (!v) return;
    if (countries.includes(v)) { toast.error("Already added"); return; }
    const next = [...countries, v];
    setNewCountry("");
    saveCountries(next);
  };

  const removeCountry = (v: string) => saveCountries(countries.filter((c) => c !== v));

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

      {active === "about" && (
        <div className="mt-8 rounded-lg border border-border bg-surface/40 p-5">
          <Label className="text-base font-semibold">Operating in — Countries / Regions</Label>
          <p className="mt-1 text-xs text-muted-foreground">Shown in the About stats. Add one country or region at a time.</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {countries.length === 0 && <span className="text-sm text-muted-foreground">None yet — defaults to “India and USA”.</span>}
            {countries.map((c) => (
              <span key={c} className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-sm">
                {c}
                <button onClick={() => removeCountry(c)} aria-label={`Remove ${c}`} className="text-muted-foreground hover:text-foreground">
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          </div>

          <div className="mt-4 flex gap-2">
            <Input
              value={newCountry}
              onChange={(e) => setNewCountry(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCountry(); } }}
              placeholder="e.g. United Kingdom"
            />
            <Button onClick={addCountry}>Add</Button>
          </div>
        </div>
      )}

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
