
-- 1) site_settings: restrict anon column access (hide contact_email, contact_phone)
REVOKE ALL ON public.site_settings FROM anon;
GRANT SELECT (
  id, brand_name, tagline, logo_url, address,
  social_linkedin, social_twitter, social_instagram,
  primary_color, accent_color, footer_about,
  created_at, updated_at, home_theme,
  hero_video_url, hero_video_poster_url
) ON public.site_settings TO anon;

-- 2) team_members: restrict anon column access (hide email)
REVOKE ALL ON public.team_members FROM anon;
GRANT SELECT (
  id, name, role_title, photo_url, bio, linkedin,
  sort_order, published, created_at, updated_at
) ON public.team_members TO anon;

-- 3) applications: prevent candidates from changing status
CREATE OR REPLACE FUNCTION public.applications_guard_candidate_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public.has_role(auth.uid(), 'admin') THEN
    RETURN NEW;
  END IF;
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    RAISE EXCEPTION 'Candidates cannot modify application status';
  END IF;
  IF NEW.candidate_id IS DISTINCT FROM OLD.candidate_id
     OR NEW.job_id IS DISTINCT FROM OLD.job_id THEN
    RAISE EXCEPTION 'Candidates cannot reassign applications';
  END IF;
  RETURN NEW;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.applications_guard_candidate_update() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS applications_guard_candidate_update ON public.applications;
CREATE TRIGGER applications_guard_candidate_update
BEFORE UPDATE ON public.applications
FOR EACH ROW EXECUTE FUNCTION public.applications_guard_candidate_update();

-- 4) hero-media storage policies (admin-only)
DROP POLICY IF EXISTS "hero-media admin read" ON storage.objects;
DROP POLICY IF EXISTS "hero-media admin write" ON storage.objects;
DROP POLICY IF EXISTS "hero-media admin update" ON storage.objects;
DROP POLICY IF EXISTS "hero-media admin delete" ON storage.objects;

CREATE POLICY "hero-media admin read" ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id = 'hero-media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "hero-media admin write" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'hero-media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "hero-media admin update" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'hero-media' AND public.has_role(auth.uid(), 'admin'))
WITH CHECK (bucket_id = 'hero-media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "hero-media admin delete" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'hero-media' AND public.has_role(auth.uid(), 'admin'));

-- 5) Lock down SECURITY DEFINER helpers from API callers
REVOKE EXECUTE ON FUNCTION public.promote_to_admin_if_first(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
-- has_role is referenced by RLS policies; keep it executable so policy evaluation works,
-- but restrict direct API exposure to authenticated callers only.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
