import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/admin/crud-page";

export const Route = createFileRoute("/admin/insights")({
  component: () => (
    <CrudPage
      title="Insights"
      description="Blog / research articles on /insights."
      table="posts"
      queryKey="posts"
      orderBy="published_at"
      asc={false}
      fields={[
        { key: "title", label: "Title", required: true },
        { key: "slug", label: "Slug", required: true },
        { key: "category", label: "Category" },
        { key: "cover_url", label: "Cover image URL", type: "url" },
        { key: "excerpt", label: "Excerpt", type: "textarea", rows: 2 },
        { key: "body", label: "Body (markdown / plain)", type: "textarea", rows: 14 },
        {
          key: "published_at",
          label: "Published at (ISO datetime)",
          placeholder: "2026-06-01T10:00:00Z",
        },
        { key: "published", label: "Published", type: "boolean" },
      ]}
      listColumns={[
        { key: "title", label: "Title" },
        { key: "category", label: "Category" },
        {
          key: "published_at",
          label: "Date",
          render: (r) =>
            r.published_at ? new Date(r.published_at as string).toLocaleDateString() : "—",
        },
        { key: "published", label: "Live", render: (r) => (r.published ? "✓" : "—") },
      ]}
    />
  ),
});
