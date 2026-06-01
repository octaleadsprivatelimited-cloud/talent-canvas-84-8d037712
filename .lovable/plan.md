## Goal

Build the standard pages a recruiting agency website needs, and make every one of them editable from a secure Admin Panel — no code changes required for content updates.

## Public pages to create

1. **/services** — overview of all services + per-service detail cards
2. **/services/$slug** — individual service page (Executive Search, Contract Staffing, RPO, Talent Advisory)
3. **/industries** — sectors we serve
4. **/about** — company story, mission, values, stats
5. **/team** — leadership & consultants grid
6. **/case-studies** — client success stories listing
7. **/case-studies/$slug** — individual case study
8. **/insights** — blog/articles listing
9. **/insights/$slug** — article detail
10. **/contact** — contact form (saves to DB + emails admin) + offices
11. **/privacy** & **/terms** — legal pages
12. Update **header** + **footer** with full nav

## Admin panel (`/admin/*`)

Role-gated (only users with `admin` role). Sidebar layout with these sections:

- **Dashboard** — counts of pages, posts, contact submissions, jobs
- **Site Settings** — brand name, logo URL, tagline, primary/accent colors, social links, contact email/phone
- **Pages** — edit hero/sections for Home, About, Services overview, Contact (title, subtitle, body copy, CTA labels)
- **Services** — CRUD list of services (icon, title, slug, description, features, ordering)
- **Industries** — CRUD list (icon, label, description)
- **Team Members** — CRUD (name, role, photo, bio, order)
- **Case Studies** — CRUD with rich content
- **Insights / Blog** — CRUD posts (title, slug, excerpt, body, cover, publish state)
- **Testimonials** — CRUD (quote, name, role, rating)
- **Contact Submissions** — read-only inbox, mark resolved
- **Users & Roles** — promote a user to admin

## Database (new tables, all RLS-protected)

- `site_settings` (single row) — brand, colors, social, contact
- `page_content` (key/value JSONB by `page_key`) — for Home, About, Services overview, Contact page sections
- `services` — slug, title, icon, summary, body, features[], order, published
- `industries` — slug, icon, label, description, order
- `team_members` — name, role, photo_url, bio, order, published
- `case_studies` — slug, client, title, summary, body, cover_url, results, published
- `posts` (insights/blog) — slug, title, excerpt, body, cover_url, author_id, published_at
- `testimonials` — quote, name, role, company, rating, order, published
- `contact_submissions` — name, email, company, message, status, created_at

**Access rules:** public can SELECT only `published = true` rows. Only admins (via `has_role(uid, 'admin')`) can INSERT/UPDATE/DELETE. Contact submissions: anyone can INSERT, only admins can read.

## How content flows

- Each public page reads its content from these tables (with sensible fallback defaults so the site never looks empty).
- Admin edits → instant update on the public site (TanStack Query invalidation on save).
- Bootstrap migration seeds the current hard-coded content into the new tables so nothing visually regresses.

## Tech notes

- New routes follow TanStack flat-file convention (`services.index.tsx`, `services.$slug.tsx`, `_admin.tsx` layout + `_admin.dashboard.tsx`, etc.).
- Admin layout uses a `beforeLoad` guard calling `has_role(uid,'admin')` via a server fn; non-admins are redirected to `/`.
- A "Promote me to admin" one-shot button on Dashboard (only when zero admins exist) bootstraps the first admin.
- Forms use shadcn `Form` + `react-hook-form` + `zod`.
- Rich-text fields use a simple markdown textarea (keeps scope tight; can swap to a WYSIWYG later).

## Scope clarification

This is a large slice — I'll deliver it in **one batch** but it touches ~25+ files and 9 new tables. Approve the plan and I'll:
1. Run the migration (you'll see and approve the SQL).
2. Build all public pages with the new data layer.
3. Build the full admin panel.
4. Seed the initial content so the site looks complete on first load.

Anything you want to **add, remove, or trim** before I start? (e.g., skip blog, skip case studies, skip rich-text and use plain text only, etc.)