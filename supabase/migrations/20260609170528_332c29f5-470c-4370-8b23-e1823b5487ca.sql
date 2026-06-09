
-- 1. Applications: ensure guard trigger is attached BEFORE UPDATE
DROP TRIGGER IF EXISTS applications_guard_candidate_update_trg ON public.applications;
CREATE TRIGGER applications_guard_candidate_update_trg
BEFORE UPDATE ON public.applications
FOR EACH ROW EXECUTE FUNCTION public.applications_guard_candidate_update();

-- 2. Companies: restrict public read to verified rows
DROP POLICY IF EXISTS "Companies public read" ON public.companies;
CREATE POLICY "Companies public read"
ON public.companies
FOR SELECT
TO anon, authenticated
USING (verified = true);

-- 3. Site settings: revoke sensitive columns from anon
REVOKE SELECT (contact_email, contact_phone) ON public.site_settings FROM anon;
REVOKE SELECT (contact_email, contact_phone) ON public.site_settings FROM PUBLIC;

-- 4. Team members: revoke email column from anon
REVOKE SELECT (email) ON public.team_members FROM anon;
REVOKE SELECT (email) ON public.team_members FROM PUBLIC;
