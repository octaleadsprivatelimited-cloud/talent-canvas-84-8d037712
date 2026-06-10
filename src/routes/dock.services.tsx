import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/admin/crud-page";

export const Route = createFileRoute("/dock/services")({
  component: () => (
    <CrudPage
      title="Services"
      description="Service practice areas shown on the homepage and /services."
      table="services"
      queryKey="services"
      fields={[
        { key: "title", label: "Title", required: true },
        { key: "slug", label: "Slug", required: true, placeholder: "executive-search" },
        { key: "icon", label: "Icon (lucide name)", placeholder: "Crown" },
        { key: "image_url", label: "Service Image" },
        { key: "summary", label: "Summary", type: "textarea", rows: 2 },
        { key: "body", label: "Body", type: "textarea", rows: 8 },
        { key: "features", label: "Features (comma-separated)", type: "array" },
        { key: "sort_order", label: "Sort order", type: "number" },
        { key: "published", label: "Published", type: "boolean" },
      ]}
      listColumns={[
        { key: "sort_order", label: "#" },
        { key: "title", label: "Title" },
        { key: "slug", label: "Slug" },
        { key: "published", label: "Live", render: (r) => (r.published ? "✓" : "—") },
      ]}
    />
  ),
});
