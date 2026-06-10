import { CrudPage } from "@/components/admin/crud-page";

export function ServicesView() {
  return (
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
  );
}

export function IndustriesView() {
  return (
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
        { key: "detail_content", label: "Detail Layout Config (JSON)", type: "json", rows: 10 },
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
  );
}

export function TeamView() {
  return (
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
  );
}

export function CaseStudiesView() {
  return (
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
  );
}

export function InsightsView() {
  return (
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
  );
}

export function TestimonialsView() {
  return (
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
  );
}

export function JobsView() {
  return (
    <CrudPage
      title="Job Listings"
      description="Manage open roles shown on /jobs."
      table="jobs"
      queryKey="jobs"
      orderBy="created_at"
      asc={false}
      fields={[
        { key: "title", label: "Job Title", required: true },
        { key: "slug", label: "Slug", required: true, placeholder: "senior-cloud-infra-architect" },
        { key: "company_id", label: "Company ID", required: true, placeholder: "company-1" },
        { key: "location", label: "Location", placeholder: "Remote (USA / India)" },
        { key: "job_type", label: "Job Type (e.g. full_time)", placeholder: "full_time" },
        { key: "work_mode", label: "Work Mode (e.g. remote)", placeholder: "remote" },
        { key: "salary_min", label: "Salary Min / Lower Bound", placeholder: "160,000" },
        { key: "salary_max", label: "Salary Max / Upper Bound", placeholder: "190,000" },
        { key: "salary_currency", label: "Salary Currency", placeholder: "USD" },
        { key: "skills", label: "Skills (comma-separated)", type: "array" },
        { key: "description", label: "Job Description", type: "textarea", rows: 10 },
        { key: "status", label: "Status (published / draft)", placeholder: "published" },
        { key: "featured", label: "Featured", type: "boolean" },
        { key: "published", label: "Published (Live)", type: "boolean" },
      ]}
      listColumns={[
        { key: "title", label: "Title" },
        { key: "location", label: "Location" },
        { key: "status", label: "Status" },
        { key: "published", label: "Live", render: (r) => (r.published ? "✓" : "—") },
      ]}
    />
  );
}
