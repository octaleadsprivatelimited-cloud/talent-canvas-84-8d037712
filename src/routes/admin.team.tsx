import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/admin/crud-page";

export const Route = createFileRoute("/admin/team")({
  component: () => (
    <CrudPage
      title="Team Members"
      description="Partners and consultants on /team."
      table="team_members"
      queryKey="team_members"
      fields={[
        { key: "name", label: "Name", required: true },
        { key: "role_title", label: "Role / Title", required: true },
        { key: "photo_url", label: "Photo URL", type: "url" },
        { key: "bio", label: "Bio", type: "textarea", rows: 4 },
        { key: "email", label: "Email" },
        { key: "linkedin", label: "LinkedIn URL", type: "url" },
        { key: "sort_order", label: "Sort order", type: "number" },
        { key: "published", label: "Published", type: "boolean" },
      ]}
      listColumns={[
        { key: "sort_order", label: "#" },
        { key: "name", label: "Name" },
        { key: "role_title", label: "Role" },
        { key: "published", label: "Live", render: (r) => (r.published ? "✓" : "—") },
      ]}
    />
  ),
});
