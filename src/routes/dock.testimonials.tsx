import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/admin/crud-page";

export const Route = createFileRoute("/dock/testimonials")({
  component: () => (
    <CrudPage
      title="Testimonials"
      description="Client quotes shown across the site."
      table="testimonials"
      queryKey="testimonials"
      fields={[
        { key: "quote", label: "Quote", type: "textarea", rows: 4, required: true },
        { key: "author_name", label: "Author name", required: true },
        { key: "author_role", label: "Author role" },
        { key: "company", label: "Company" },
        { key: "rating", label: "Rating (1–5)", type: "number" },
        { key: "photo_url", label: "Photo URL", type: "url" },
        { key: "sort_order", label: "Sort order", type: "number" },
        { key: "published", label: "Published", type: "boolean" },
      ]}
      listColumns={[
        { key: "sort_order", label: "#" },
        { key: "author_name", label: "Author" },
        { key: "company", label: "Company" },
        { key: "rating", label: "★" },
        { key: "published", label: "Live", render: (r) => (r.published ? "✓" : "—") },
      ]}
    />
  ),
});
