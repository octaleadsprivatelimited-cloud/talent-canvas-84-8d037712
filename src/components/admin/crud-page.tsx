import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
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
  title,
  description,
  table,
  queryKey,
  fields,
  orderBy = "sort_order",
  asc = true,
  listColumns,
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

  const reload = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabaseAny
      .from(table)
      .select("*")
      .order(orderBy, { ascending: asc });
    if (error) toast.error(error.message);
    setRows((data as T[]) ?? []);
    setLoading(false);
    qc.invalidateQueries({ queryKey: [queryKey] });
  }, [table, orderBy, asc, qc, queryKey]);

  useEffect(() => {
    reload();
  }, [reload]);

  const openNew = () => {
    setEditing({ id: "" } as T);
    setOpen(true);
  };
  const openEdit = (row: T) => {
    setEditing({ ...row });
    setOpen(true);
  };

  const save = async () => {
    if (!editing) return;
    const payload: Record<string, unknown> = {};
    for (const f of fields) {
      const v = (editing as Record<string, unknown>)[f.key];
      if (f.type === "number") payload[f.key] = v === "" || v == null ? null : Number(v);
      else if (f.type === "array")
        payload[f.key] =
          typeof v === "string"
            ? v
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
            : (v ?? []);
      else if (f.type === "json") {
        try {
          payload[f.key] = typeof v === "string" ? JSON.parse(v || "null") : v;
        } catch {
          toast.error(`${f.label} must be valid JSON`);
          return;
        }
      } else payload[f.key] = v ?? null;
    }
    const isNew = !editing.id;
    const { error } = isNew
      ? await supabaseAny.from(table).insert(payload)
      : await supabaseAny.from(table).update(payload).eq("id", editing.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(isNew ? "Created" : "Saved");
    setOpen(false);
    setEditing(null);
    reload();
  };

  const remove = async (row: T) => {
    if (!confirm("Delete this item?")) return;
    const { error } = await supabaseAny.from(table).delete().eq("id", row.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Deleted");
    reload();
  };

  const [seeding, setSeeding] = useState(false);

  const handleSeedDefaultData = async () => {
    setSeeding(true);
    try {
      let defaultData: Record<string, unknown>[] = [];
      if (table === "services") {
        defaultData = [
          {
            id: "service-1",
            slug: "executive-search",
            title: "Executive Search & Leadership Hiring",
            summary:
              "Retained search for C-suite, VP, and Director roles led by senior consultants with deep sector expertise.",
            icon: "target",
            published: true,
            sort_order: 1,
            features: [
              "Retained search practice",
              "Sector specialists",
              "C-level placement portfolio",
            ],
          },
          {
            id: "service-2",
            slug: "it-recruitment",
            title: "IT & Non-IT Recruitment",
            summary:
              "Specialist hiring across technology, engineering, finance, sales, operations, and support functions.",
            icon: "cpu",
            published: true,
            sort_order: 2,
            features: ["Tech talent network", "Contingent placement", "Multi-country delivery"],
          },
          {
            id: "service-3",
            slug: "rpo-workforce-solutions",
            title: "RPO & Workforce Solutions",
            summary:
              "Embedded recruiters and end-to-end hiring operations that scale with your business.",
            icon: "briefcase",
            published: true,
            sort_order: 3,
            features: [
              "Scale on-demand",
              "Dedicated recruiter model",
              "ATS configuration & metrics",
            ],
          },
          {
            id: "service-4",
            slug: "consulting-training",
            title: "Consulting & Professional Training",
            summary:
              "Workforce planning, talent mapping, business consulting, and career development programs.",
            icon: "trending-up",
            published: true,
            sort_order: 4,
            features: ["Org design consulting", "Training bootcamps", "Salary benchmarking"],
          },
        ];
      } else if (table === "jobs") {
        defaultData = [
          {
            id: "job-1",
            title: "Senior Cloud Infrastructure Architect",
            slug: "senior-cloud-infra-architect",
            company_id: "company-1",
            location: "Remote (USA / India)",
            type: "Full-Time",
            salary: "$160,000 - $190,000",
            description: "Responsible for scaling secure architectures on cloud platforms.",
            published: true,
            featured: true,
          },
          {
            id: "job-2",
            title: "Lead Technical Recruiter",
            slug: "lead-tech-recruiter",
            company_id: "company-2",
            location: "Delaware, USA",
            type: "Full-Time",
            salary: "$110,000 - $130,000",
            description: "Scale core workforce logistics and operations personnel recruiting.",
            published: true,
            featured: true,
          },
        ];
      } else if (table === "companies") {
        defaultData = [
          {
            id: "company-1",
            name: "Virelix Tech Corp",
            slug: "vix-tech",
            description:
              "Leading technology infrastructure and digital platform development agency.",
            website: "https://virelix.com",
          },
          {
            id: "company-2",
            name: "Delaware Supply Chain",
            slug: "del-supply",
            description: "National logistics, shipping, and storage operations operator.",
            website: "https://delaware-supply.com",
          },
        ];
      } else if (table === "testimonials") {
        defaultData = [
          {
            id: "test-1",
            name: "Sarah Jenkins",
            role: "VP of People at TechSphere",
            content:
              "Virelix Consulting transformed our engineering recruitment. We filled three VP roles in less than a month.",
            rating: 5,
          },
          {
            id: "test-2",
            name: "David Chen",
            role: "CEO at Delaware Supply Chain",
            content:
              "Their recruitment process is lightning-fast and quality-focused. Highly recommended for executive searches.",
            rating: 5,
          },
        ];
      } else if (table === "industries") {
        defaultData = [
          {
            id: "ind-1",
            label: "Technology & Software Engineering",
            slug: "technology-software",
            description: "AI, cloud infrastructure, enterprise software, and engineering roles.",
            icon: "cpu",
            published: true,
            sort_order: 1,
          },
          {
            id: "ind-2",
            label: "Healthcare & Life Sciences",
            slug: "healthcare-lifesciences",
            description: "Medical devices, biotech, pharmaceuticals, and healthcare providers.",
            icon: "heart",
            published: true,
            sort_order: 2,
          },
        ];
      } else if (table === "team_members") {
        defaultData = [
          {
            id: "team-1",
            name: "Alex Mercer",
            role: "Managing Director",
            bio: "15+ years experience in global executive talent acquisitions.",
          },
          {
            id: "team-2",
            name: "Jessica Taylor",
            role: "Principal Tech Recruiter",
            bio: "Ex-Google staffing leader specializing in AI and cloud engineering talent.",
          },
        ];
      } else if (table === "case_studies") {
        defaultData = [
          {
            id: "case-1",
            title: "Scaling a Unicorn Startup Engineering Team",
            slug: "scaling-unicorn-startup",
            challenge: "Filling 45 key engineering vacancies in 90 days.",
            solution: "Implemented embedded RPO delivery model and global talent sourcers.",
            results: "Reduced time-to-hire by 40% and filled all open slots on time.",
            published: true,
          },
        ];
      } else if (table === "posts") {
        defaultData = [
          {
            id: "post-1",
            title: "Navigating the Executive Talent Search in 2026",
            slug: "navigating-executive-search-2026",
            summary: "Key changes in leadership hiring trends post hybrid-work stabilization.",
            content:
              "Deep analysis of executive candidate motivations and compensation package dynamics.",
            published: true,
            created_at: new Date().toISOString(),
          },
        ];
      }

      if (defaultData.length === 0) {
        toast.error(`No default data template found for table: ${table}`);
        return;
      }

      for (const item of defaultData) {
        await supabaseAny.from(table).upsert(item);
      }
      toast.success(`Successfully initialized ${title} with default demo data!`);
      reload();
    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(`Failed to seed default data: ${msg}`);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">{title}</h1>
          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        </div>
        <Button onClick={openNew}>
          <Plus className="mr-1 h-4 w-4" /> New
        </Button>
      </div>

      <div className="overflow-x-auto border border-border">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              {listColumns.map((c) => (
                <th key={String(c.key)} className="px-4 py-3">
                  {c.label}
                </th>
              ))}
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td
                  colSpan={listColumns.length + 1}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  Loading…
                </td>
              </tr>
            )}
            {!loading && rows && rows.length === 0 && (
              <tr>
                <td
                  colSpan={listColumns.length + 1}
                  className="px-4 py-12 text-center text-muted-foreground"
                >
                  <p className="mb-4">No items yet.</p>
                  <Button onClick={handleSeedDefaultData} disabled={seeding}>
                    {seeding ? "Seeding..." : `Initialize ${title} with Demo Data`}
                  </Button>
                </td>
              </tr>
            )}
            {rows?.map((r) => (
              <tr key={r.id} className="border-t border-border">
                {listColumns.map((c) => (
                  <td key={String(c.key)} className="px-4 py-3 align-top">
                    {c.render
                      ? c.render(r)
                      : String((r as Record<string, unknown>)[c.key as string] ?? "")}
                  </td>
                ))}
                <td className="px-4 py-3 text-right">
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
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing?.id ? "Edit" : "Create"} {title.slice(0, -1)}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {fields.map((f) => {
              const val = (editing as Record<string, unknown> | null)?.[f.key];
              const setVal = (v: unknown) =>
                setEditing((prev) => ({ ...(prev as T), [f.key]: v }) as T);
              return (
                <div key={f.key} className="space-y-1.5">
                  <Label>
                    {f.label}
                    {f.required && " *"}
                  </Label>
                  {f.type === "boolean" ? (
                    <div className="pt-1">
                      <Switch checked={!!val} onCheckedChange={setVal} />
                    </div>
                  ) : f.type === "textarea" || f.type === "json" ? (
                    <Textarea
                      rows={f.rows ?? 5}
                      placeholder={f.placeholder}
                      value={
                        f.type === "json"
                          ? typeof val === "string"
                            ? val
                            : JSON.stringify(val ?? null, null, 2)
                          : ((val as string) ?? "")
                      }
                      onChange={(e) => setVal(e.target.value)}
                    />
                  ) : f.type === "array" ? (
                    <Input
                      placeholder={f.placeholder ?? "comma, separated, values"}
                      value={
                        Array.isArray(val) ? (val as string[]).join(", ") : ((val as string) ?? "")
                      }
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
