import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabaseAny } from "@/lib/supabase-any";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/seo")({
  component: SeoAdmin,
});

const PAGES = [
  { key: "home", label: "Home", path: "/" },
  { key: "about", label: "About", path: "/about" },
  { key: "services", label: "Services", path: "/services" },
  { key: "industries", label: "Industries", path: "/industries" },
  { key: "team", label: "Team", path: "/team" },
  { key: "case-studies", label: "Case Studies", path: "/case-studies" },
  { key: "insights", label: "Insights / Blog", path: "/insights" },
  { key: "jobs", label: "Jobs", path: "/jobs" },
  { key: "companies", label: "Companies", path: "/companies" },
  { key: "contact", label: "Contact", path: "/contact" },
  { key: "privacy", label: "Privacy", path: "/privacy" },
  { key: "terms", label: "Terms", path: "/terms" },
] as const;

type SeoRow = { title: string; description: string; og_image: string };
const EMPTY: SeoRow = { title: "", description: "", og_image: "" };

function SeoAdmin() {
  const qc = useQueryClient();
  const [active, setActive] = useState<(typeof PAGES)[number]["key"]>("home");
  const [row, setRow] = useState<SeoRow>(EMPTY);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const pageKey = `seo:${active}`;
    supabaseAny
      .from("page_content")
      .select("content")
      .eq("page_key", pageKey)
      .maybeSingle()
      .then(({ data }: { data: { content: Partial<SeoRow> } | null }) => {
        setRow({ ...EMPTY, ...(data?.content ?? {}) });
        setLoading(false);
      });
  }, [active]);

  const save = async () => {
    const pageKey = `seo:${active}`;
    const { error } = await supabaseAny
      .from("page_content")
      .upsert({ page_key: pageKey, content: row }, { onConflict: "page_key" });
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["page_content", pageKey] });
    toast.success("SEO updated");
  };

  const current = PAGES.find((p) => p.key === active)!;

  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-3xl font-bold">Page SEO</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Customize the browser tab title, search description, and social share image for every public page.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[200px_1fr]">
        <nav className="flex flex-col gap-1 border border-border bg-surface p-2">
          {PAGES.map((p) => (
            <button
              key={p.key}
              onClick={() => setActive(p.key)}
              className={`flex items-center justify-between rounded-sm px-3 py-2 text-left text-sm transition ${
                active === p.key ? "bg-background font-semibold text-primary" : "hover:bg-background"
              }`}
            >
              <span>{p.label}</span>
              <span className="text-xs text-muted-foreground">{p.path}</span>
            </button>
          ))}
        </nav>

        <div className="space-y-4">
          {loading ? (
            <p className="text-muted-foreground">Loading…</p>
          ) : (
            <>
              <div className="space-y-1.5">
                <Label>Page title (browser tab + search result)</Label>
                <Input
                  value={row.title}
                  onChange={(e) => setRow({ ...row, title: e.target.value })}
                  placeholder={`e.g. ${current.label} — Acme`}
                  maxLength={70}
                />
                <p className="text-xs text-muted-foreground">{row.title.length}/60 recommended</p>
              </div>

              <div className="space-y-1.5">
                <Label>Meta description</Label>
                <Textarea
                  rows={3}
                  value={row.description}
                  onChange={(e) => setRow({ ...row, description: e.target.value })}
                  placeholder="A short, compelling summary shown in search results."
                  maxLength={180}
                />
                <p className="text-xs text-muted-foreground">{row.description.length}/160 recommended</p>
              </div>

              <div className="space-y-1.5">
                <Label>Social share image URL (optional)</Label>
                <Input
                  value={row.og_image}
                  onChange={(e) => setRow({ ...row, og_image: e.target.value })}
                  placeholder="https://…/preview.jpg"
                />
              </div>

              <Button onClick={save}>Save SEO for {current.label}</Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
