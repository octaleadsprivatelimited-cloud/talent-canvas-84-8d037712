import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/admin/crud-page";

export const Route = createFileRoute("/admin/industries")({
  component: () => (
    <CrudPage
      title="Industries"
      description="Sectors served, shown on the homepage and /industries."
      table="industries"
      queryKey="industries"
      fields={[
        { key: "label", label: "Label", required: true },
        { key: "slug", label: "Slug", required: true },
        { key: "icon", label: "Icon (lucide name)", placeholder: "Cpu" },
        { key: "description", label: "Description", type: "textarea", rows: 3 },
        { key: "sort_order", label: "Sort order", type: "number" },
        { key: "published", label: "Published", type: "boolean" },
      ]}
      listColumns={[
        { key: "sort_order", label: "#" },
        { key: "label", label: "Label" },
        { key: "slug", label: "Slug" },
        { key: "published", label: "Live", render: (r) => (r.published ? "✓" : "—") },
      ]}
    />
  ),
});
