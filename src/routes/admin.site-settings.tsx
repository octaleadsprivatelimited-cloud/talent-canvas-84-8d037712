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

  useEffect(() => {
    supabaseAny.from("site_settings").select("*").limit(1).maybeSingle().then(({ data }: { data: Record<string, string> | null }) => {
      if (data) { setRow(data); setId(data.id); }
      else setRow({ home_theme: "editorial" });
      setLoading(false);
    });
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

  const pickTheme = async (key: ThemeKey) => {
    if (!row) return;
    const next = { ...row, home_theme: key };
    setRow(next);
    if (await persist(next)) toast.success(`Theme set to ${THEMES.find((t) => t.key === key)?.name}`);
  };

  if (loading || !row) return <div className="text-muted-foreground">Loading…</div>;

  const activeTheme = (row.home_theme as ThemeKey) || "editorial";

  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-3xl font-bold">Site Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">Brand, contact, and the home page theme that visitors see.</p>

      {/* ============= HOME THEME PICKER ============= */}
      <section className="mt-8 rounded-lg border border-border bg-surface/40 p-5">
        <div className="flex items-baseline justify-between gap-4">
          <div>
            <Label className="text-base font-semibold">Home Page Theme</Label>
            <p className="mt-1 text-xs text-muted-foreground">Pick a design — it applies to the home page hero instantly. All themes are fully responsive.</p>
          </div>
          <span className="text-xs text-muted-foreground">Selected: <span className="font-semibold text-foreground">{THEMES.find((t) => t.key === activeTheme)?.name}</span></span>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {THEMES.map((t) => {
            const isActive = activeTheme === t.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => pickTheme(t.key)}
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
                </div>
                <div className="p-3">
                  <p className="font-display text-sm font-bold">{t.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{t.tagline}</p>
                </div>
              </button>
            );
          })}
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
