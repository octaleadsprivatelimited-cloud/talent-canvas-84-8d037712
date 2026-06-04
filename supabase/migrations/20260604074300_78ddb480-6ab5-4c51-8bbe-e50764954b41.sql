
-- 1) profiles: restrict SELECT to owner + admin (was public true)
DROP POLICY IF EXISTS "Profiles public read" ON public.profiles;
CREATE POLICY "Profiles owner or admin read"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id OR public.has_role(auth.uid(), 'admin'::app_role));

-- Also let job posters see applicant profiles for their jobs
CREATE POLICY "Job posters read applicant profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.applications a
    JOIN public.jobs j ON j.id = a.job_id
    WHERE a.candidate_id = profiles.id AND j.posted_by = auth.uid()
  ));

-- 2) site_settings: hide contact_email and contact_phone from anon
REVOKE SELECT (contact_email, contact_phone) ON public.site_settings FROM anon;
REVOKE SELECT (contact_email, contact_phone) ON public.site_settings FROM PUBLIC;

-- 3) team_members: hide email from anon
REVOKE SELECT (email) ON public.team_members FROM anon;
REVOKE SELECT (email) ON public.team_members FROM PUBLIC;

-- 4) user_roles: admin-only INSERT/UPDATE/DELETE (prevent self-escalation)
CREATE POLICY "Admins insert roles"
  ON public.user_roles FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins update roles"
  ON public.user_roles FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins delete roles"
  ON public.user_roles FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins read all roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 5) applications: admin manage all
CREATE POLICY "Admins manage applications"
  ON public.applications FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- 6) Restrict SECURITY DEFINER has_role from anon/public; keep for authenticated
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;
