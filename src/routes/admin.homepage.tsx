import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { supabaseAny } from "@/lib/supabase-any";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { HOMEPAGE_DEFAULTS, type HomepageContent, type Stat } from "@/lib/homepage-defaults";

export const Route = createFileRoute("/admin/homepage")({
  component: HomepageAdmin,
});

const PAGE_KEY = "home";

function HomepageAdmin() {
  const qc = useQueryClient();
  const [content, setContent] = useState<HomepageContent>(HOMEPAGE_DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabaseAny
      .from("page_content")
      .select("content")
      .eq("page_key", PAGE_KEY)
      .maybeSingle()
      .then(({ data }: { data: { content: Partial<HomepageContent> } | null }) => {
        setContent({ ...HOMEPAGE_DEFAULTS, ...(data?.content ?? {}) });
        setLoading(false);
      });
  }, []);

  const save = async () => {
    setSaving(true);
    const { error } = await supabaseAny
      .from("page_content")
      .upsert({ page_key: PAGE_KEY, content }, { onConflict: "page_key" });
    setSaving(false);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["page_content", PAGE_KEY] });
    toast.success("Homepage saved");
  };

  const update = <K extends keyof HomepageContent>(key: K, value: HomepageContent[K]) =>
    setContent((c) => ({ ...c, [key]: value }));

  if (loading) return <div className="text-muted-foreground">Loading…</div>;

  return (
    <div className="max-w-4xl space-y-10">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Homepage</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Edit every piece of copy on the home page — no code required.
          </p>
        </div>
        <Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button>
      </header>

      {/* Services section */}
      <Section title="“Services” section">
        <Field label="Eyebrow" value={content.services_eyebrow} onChange={(v) => update("services_eyebrow", v)} />
        <Field label="Heading" value={content.services_heading} onChange={(v) => update("services_heading", v)} />
        <Field label="Highlighted phrase (gets accent color)" value={content.services_heading_accent} onChange={(v) => update("services_heading_accent", v)} />
        <Field label="Intro paragraph" rows={3} value={content.services_intro} onChange={(v) => update("services_intro", v)} />
      </Section>

      {/* Industries section */}
      <Section title="“Industries” section">
        <Field label="Eyebrow" value={content.industries_eyebrow} onChange={(v) => update("industries_eyebrow", v)} />
        <Field label="Heading" value={content.industries_heading} onChange={(v) => update("industries_heading", v)} />
        <Field label="Intro paragraph" rows={3} value={content.industries_intro} onChange={(v) => update("industries_intro", v)} />
        <Field label="Photo badge — big text" value={content.industries_badge_value} onChange={(v) => update("industries_badge_value", v)} />
        <Field label="Photo badge — small text" value={content.industries_badge_label} onChange={(v) => update("industries_badge_label", v)} />
      </Section>

      {/* Process section */}
      <Section title="“Process” section">
        <Field label="Eyebrow" value={content.process_eyebrow} onChange={(v) => update("process_eyebrow", v)} />
        <Field label="Heading" value={content.process_heading} onChange={(v) => update("process_heading", v)} />
        <Field label="Highlighted phrase" value={content.process_heading_accent} onChange={(v) => update("process_heading_accent", v)} />
        <Field label="“Why us” heading" value={content.why_heading} onChange={(v) => update("why_heading", v)} />
        <Field label="“Why us” intro" rows={2} value={content.why_intro} onChange={(v) => update("why_intro", v)} />
        <ListEditor
          label="“Why us” bullet list"
          items={content.why_bullets}
          onChange={(items) => update("why_bullets", items)}
          placeholder="e.g. USA headquartered"
        />
      </Section>

      {/* Stats */}
      <Section title="Stats strip">
        <StatsEditor items={content.stats} onChange={(items) => update("stats", items)} />
      </Section>

      {/* Client ribbon */}
      <Section title="Client / keyword ribbon">
        <p className="text-xs text-muted-foreground">Short uppercase phrases shown as a marquee strip.</p>
        <ListEditor
          label="Items"
          items={content.clients}
          onChange={(items) => update("clients", items)}
          placeholder="e.g. EXECUTIVE SEARCH"
        />
      </Section>

      {/* Testimonials heading (the cards themselves come from /admin/testimonials) */}
      <Section title="“Testimonials” section heading">
        <Field label="Eyebrow" value={content.testimonials_eyebrow} onChange={(v) => update("testimonials_eyebrow", v)} />
        <Field label="Heading" value={content.testimonials_heading} onChange={(v) => update("testimonials_heading", v)} />
        <p className="text-xs text-muted-foreground">
          The testimonial cards themselves are managed under{" "}
          <a href="/admin/testimonials" className="underline">Testimonials</a>.
        </p>
      </Section>

      {/* CTA */}
      <Section title="Final CTA banner">
        <Field label="Heading" rows={2} value={content.cta_heading} onChange={(v) => update("cta_heading", v)} />
        <Field label="Description" rows={2} value={content.cta_description} onChange={(v) => update("cta_description", v)} />
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Primary button — label" value={content.cta_primary_label} onChange={(v) => update("cta_primary_label", v)} />
          <Field label="Primary button — link" value={content.cta_primary_to} onChange={(v) => update("cta_primary_to", v)} />
          <Field label="Secondary button — label" value={content.cta_secondary_label} onChange={(v) => update("cta_secondary_label", v)} />
          <Field label="Secondary button — link" value={content.cta_secondary_to} onChange={(v) => update("cta_secondary_to", v)} />
        </div>
      </Section>

      <div className="sticky bottom-4 z-10 flex justify-end">
        <Button onClick={save} disabled={saving} size="lg" className="shadow-lg">
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4 rounded-lg border border-border bg-surface/40 p-5">
      <h2 className="font-display text-lg font-bold">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({
  label, value, onChange, rows,
}: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {rows ? (
        <Textarea rows={rows} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <Input value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}

function ListEditor({
  label, items, onChange, placeholder,
}: { label: string; items: string[]; onChange: (next: string[]) => void; placeholder?: string }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
            <Input
              value={item}
              placeholder={placeholder}
              onChange={(e) => {
                const next = [...items];
                next[i] = e.target.value;
                onChange(next);
              }}
            />
            <Button variant="ghost" size="icon" onClick={() => onChange(items.filter((_, j) => j !== i))}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}
      </div>
      <Button variant="outline" size="sm" onClick={() => onChange([...items, ""])}>
        <Plus className="mr-1 h-4 w-4" /> Add item
      </Button>
    </div>
  );
}

function StatsEditor({ items, onChange }: { items: Stat[]; onChange: (next: Stat[]) => void }) {
  return (
    <div className="space-y-2">
      {items.map((s, i) => (
        <div key={i} className="grid grid-cols-[1fr_2fr_auto] items-center gap-2">
          <Input
            value={s.value}
            placeholder="Big value"
            onChange={(e) => {
              const next = [...items];
              next[i] = { ...next[i], value: e.target.value };
              onChange(next);
            }}
          />
          <Input
            value={s.label}
            placeholder="Label below"
            onChange={(e) => {
              const next = [...items];
              next[i] = { ...next[i], label: e.target.value };
              onChange(next);
            }}
          />
          <Button variant="ghost" size="icon" onClick={() => onChange(items.filter((_, j) => j !== i))}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={() => onChange([...items, { value: "", label: "" }])}>
        <Plus className="mr-1 h-4 w-4" /> Add stat
      </Button>
    </div>
  );
}
