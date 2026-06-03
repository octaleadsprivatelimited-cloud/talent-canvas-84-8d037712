import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabaseAny } from "@/lib/supabase-any";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { THEMES, type ThemeKey } from "@/components/home-themes";
import { Check } from "lucide-react";

export const Route = createFileRoute("/admin/site-settings")({
  component: SiteSettingsAdmin,
});

const FIELDS: { key: string; label: string; type?: "textarea" }[] = [
  { key: "brand_name", label: "Brand name" },
  { key: "tagline", label: "Tagline" },
  { key: "logo_url", label: "Logo URL" },
  { key: "contact_email", label: "Contact email" },
  { key: "contact_phone", label: "Contact phone" },
  { key: "address", label: "Address" },
  { key: "social_linkedin", label: "LinkedIn URL" },
  { key: "social_twitter", label: "Twitter URL" },
  { key: "social_instagram", label: "Instagram URL" },
  { key: "primary_color", label: "Primary color (CSS)" },
  { key: "accent_color", label: "Accent color (CSS)" },
  { key: "footer_about", label: "Footer about text", type: "textarea" },
];

function SiteSettingsAdmin() {
  const qc = useQueryClient();
  const [row, setRow] = useState<Record<string, string> | null>(null);
  const [id, setId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [savedTheme, setSavedTheme] = useState<ThemeKey>("editorial");
  const [previewTheme, setPreviewTheme] = useState<ThemeKey>("editorial");

  useEffect(() => {
    supabaseAny.from("site_settings").select("*").limit(1).maybeSingle().then(({ data }: { data: Record<string, string> | null }) => {
      if (data) { setRow(data); setId(data.id); }
      else setRow({ home_theme: "editorial" });
      const t = ((data?.home_theme as ThemeKey) || "editorial");
      setSavedTheme(t);
      setPreviewTheme(t);
      setLoading(false);
    });
  }, []);

  // Apply live preview; restore saved theme when leaving the page
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("lovable:preview-theme", { detail: { theme: previewTheme } }));
  }, [previewTheme]);
  useEffect(() => {
    return () => {
      window.dispatchEvent(new CustomEvent("lovable:preview-theme", { detail: { theme: null } }));
    };
  }, []);

  const persist = async (next: Record<string, string>) => {
    const payload: Record<string, unknown> = { ...next };
    delete payload.id;
    delete payload.created_at;
    delete payload.updated_at;
    const { data, error } = id
      ? await supabaseAny.from("site_settings").update(payload).eq("id", id).select().maybeSingle()
      : await supabaseAny.from("site_settings").insert(payload).select().maybeSingle();
    if (error) { toast.error(error.message); return false; }
    if (data && !id) setId((data as { id: string }).id);
    qc.invalidateQueries({ queryKey: ["site_settings"] });
    return true;
  };

  const save = async () => {
    if (!row) return;
    if (await persist(row)) toast.success("Site settings saved");
  };

  const previewPick = (key: ThemeKey) => {
    setPreviewTheme(key);
  };

  const applyTheme = async () => {
    if (!row) return;
    const next = { ...row, home_theme: previewTheme };
    setRow(next);
    if (await persist(next)) {
      setSavedTheme(previewTheme);
      toast.success(`Theme set to ${THEMES.find((t) => t.key === previewTheme)?.name}`);
    }
  };

  const discardPreview = () => setPreviewTheme(savedTheme);

  if (loading || !row) return <div className="text-muted-foreground">Loading…</div>;

  const activeTheme = previewTheme;
  const isDirty = previewTheme !== savedTheme;

  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-3xl font-bold">Site Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">Brand, contact, and the home page theme that visitors see.</p>

      {/* ============= HOME THEME PICKER ============= */}
      <section className="mt-8 rounded-lg border border-border bg-surface/40 p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <Label className="text-base font-semibold">Site Theme</Label>
            <p className="mt-1 text-xs text-muted-foreground">
              Click a theme to <span className="font-semibold">preview it live across every page</span> — header, footer, hero, jobs, companies, blog, and custom pages. Save when you’re happy.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-muted-foreground">
              Live preview: <span className="font-semibold text-foreground">{THEMES.find((t) => t.key === activeTheme)?.name}</span>
            </span>
            {isDirty && (
              <span className="rounded-full bg-amber-500/15 px-2 py-0.5 font-semibold text-amber-700 dark:text-amber-300">
                Unsaved
              </span>
            )}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {THEMES.map((t) => {
            const isActive = activeTheme === t.key;
            const isSaved = savedTheme === t.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => previewPick(t.key)}
                className={`group relative overflow-hidden rounded-lg border text-left transition ${
                  isActive ? "border-primary ring-2 ring-primary/40" : "border-border hover:border-primary/60"
                }`}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                  <img
                    src={t.preview}
                    alt={`${t.name} preview`}
                    loading="lazy"
                    className="h-full w-full object-cover transition group-hover:scale-105"
                  />
                  {isActive && (
                    <div className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                  {isSaved && !isActive && (
                    <div className="absolute left-2 top-2 rounded-full bg-background/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-foreground shadow">
                      Saved
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="font-display text-sm font-bold">{t.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{t.tagline}</p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-border pt-4">
          <Button onClick={applyTheme} disabled={!isDirty}>
            {isDirty ? `Apply “${THEMES.find((t) => t.key === activeTheme)?.name}” site-wide` : "Theme applied"}
          </Button>
          <Button variant="outline" onClick={discardPreview} disabled={!isDirty}>
            Discard preview
          </Button>
          <p className="text-xs text-muted-foreground">
            Preview is local to your browser until you save.
          </p>
        </div>
      </section>

      {/* ============= OTHER FIELDS ============= */}
      <div className="mt-8 space-y-4">
        {FIELDS.map((f) => (
          <div key={f.key} className="space-y-1.5">
            <Label>{f.label}</Label>
            {f.type === "textarea" ? (
              <Textarea rows={3} value={row[f.key] ?? ""} onChange={(e) => setRow({ ...row, [f.key]: e.target.value })} />
            ) : (
              <Input value={row[f.key] ?? ""} onChange={(e) => setRow({ ...row, [f.key]: e.target.value })} />
            )}
          </div>
        ))}
        <Button onClick={save}>Save settings</Button>
      </div>
    </div>
  );
}
