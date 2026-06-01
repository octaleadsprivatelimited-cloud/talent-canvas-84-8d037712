import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

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
    supabase.from("site_settings").select("*").limit(1).maybeSingle().then(({ data }) => {
      if (data) { setRow(data as Record<string, string>); setId(data.id); }
      else setRow({});
      setLoading(false);
    });
  }, []);

  const save = async () => {
    if (!row) return;
    const payload = { ...row };
    delete (payload as Record<string, unknown>).id;
    delete (payload as Record<string, unknown>).created_at;
    delete (payload as Record<string, unknown>).updated_at;
    const { error } = id
      ? await supabase.from("site_settings").update(payload).eq("id", id)
      : await supabase.from("site_settings").insert(payload);
    if (error) { toast.error(error.message); return; }
    toast.success("Site settings saved");
    qc.invalidateQueries({ queryKey: ["site_settings"] });
  };

  if (loading || !row) return <div className="text-muted-foreground">Loading…</div>;

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl font-bold">Site Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">Brand, contact, and theme that show up across the public site.</p>
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
