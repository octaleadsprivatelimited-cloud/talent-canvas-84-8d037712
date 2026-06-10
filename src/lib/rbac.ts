// Role-based access control definitions for the Virelix admin panel.
// Roles live in Firestore collection `user_roles`, with the document ID
// equal to the user's Firebase UID, and a `role` field holding one of
// the values below.

export const ROLES = ["admin", "editor", "recruiter", "employer", "candidate", "user"] as const;
export type Role = (typeof ROLES)[number];

export const ROLE_LABELS: Record<Role, string> = {
  admin: "Administrator",
  editor: "Content Editor",
  recruiter: "Recruiter",
  employer: "Employer",
  candidate: "Candidate",
  user: "User",
};

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  admin: "Full access including user role management and site settings.",
  editor: "Manage marketing content: pages, services, insights, team, etc.",
  recruiter: "Manage jobs and review applicants and contact submissions.",
  employer: "Manage company profiles and post jobs from their company.",
  candidate: "Submit applications and manage profile.",
  user: "Standard user account.",
};

// Granular permission keys. Use string union so unknown keys are a type error.
export type Permission =
  | "view:dashboard"
  | "manage:users"
  | "manage:settings"
  | "manage:homepage"
  | "manage:seo"
  | "manage:pages"
  | "manage:content" // services, industries, team, case studies, insights, testimonials
  | "manage:jobs"
  | "manage:companies"
  | "view:submissions"
  | "view:diagnostics";

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: [
    "view:dashboard",
    "manage:users",
    "manage:settings",
    "manage:homepage",
    "manage:seo",
    "manage:pages",
    "manage:content",
    "manage:jobs",
    "manage:companies",
    "view:submissions",
    "view:diagnostics",
  ],
  editor: ["view:dashboard", "manage:homepage", "manage:seo", "manage:pages", "manage:content"],
  recruiter: ["view:dashboard", "manage:jobs", "view:submissions"],
  employer: ["view:dashboard", "manage:companies", "manage:jobs"],
  candidate: [],
  user: [],
};

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && (ROLES as readonly string[]).includes(value);
}

export function permissionsFor(role: Role | null | undefined): Permission[] {
  if (!role) return [];
  return ROLE_PERMISSIONS[role] ?? [];
}

export function roleHasPermission(role: Role | null | undefined, permission: Permission): boolean {
  if (!role) return false;
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}
