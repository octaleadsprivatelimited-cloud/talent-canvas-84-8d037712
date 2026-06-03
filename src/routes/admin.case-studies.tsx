import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/admin/crud-page";

export const Route = createFileRoute("/admin/case-studies")({
  component: () => (
    <CrudPage
      title="Case Studies"
      description="Client success stories on /case-studies."
      table="case_studies"
      queryKey="case_studies"
      fields={[
        { key: "client", label: "Client name", required: true },
        { key: "title", label: "Title", required: true },
        { key: "slug", label: "Slug", required: true },
        { key: "industry", label: "Industry" },
        { key: "cover_url", label: "Cover image URL", type: "url" },
        { key: "summary", label: "Summary", type: "textarea", rows: 2 },
        { key: "body", label: "Body", type: "textarea", rows: 10 },
        {
          key: "results",
          label: "Results (JSON array)",
          type: "json",
          rows: 6,
          placeholder: '[{"label":"Hires","value":"3"}]',
        },
        { key: "sort_order", label: "Sort order", type: "number" },
        { key: "published", label: "Published", type: "boolean" },
      ]}
      listColumns={[
        { key: "sort_order", label: "#" },
        { key: "client", label: "Client" },
        { key: "title", label: "Title" },
        { key: "published", label: "Live", render: (r) => (r.published ? "✓" : "—") },
      ]}
    />
  ),
});
