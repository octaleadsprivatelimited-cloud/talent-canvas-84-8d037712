-- 1) Tighten applications candidate update guard
CREATE OR REPLACE FUNCTION public.applications_guard_candidate_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF public.has_role(auth.uid(), 'admin') THEN
    RETURN NEW;
  END IF;

  -- Candidates may only mutate cover_letter and resume_url.
  IF NEW.id IS DISTINCT FROM OLD.id
     OR NEW.candidate_id IS DISTINCT FROM OLD.candidate_id
     OR NEW.job_id IS DISTINCT FROM OLD.job_id
     OR NEW.status IS DISTINCT FROM OLD.status
     OR NEW.created_at IS DISTINCT FROM OLD.created_at THEN
    RAISE EXCEPTION 'Candidates can only update cover_letter and resume_url';
  END IF;

  RETURN NEW;
END;
$$;

-- Ensure the trigger exists and points at the guard
DROP TRIGGER IF EXISTS applications_guard_candidate_update_trg ON public.applications;
CREATE TRIGGER applications_guard_candidate_update_trg
  BEFORE UPDATE ON public.applications
  FOR EACH ROW
  EXECUTE FUNCTION public.applications_guard_candidate_update();

-- 2) Revoke EXECUTE from PUBLIC/anon on SECURITY DEFINER helpers
REVOKE ALL ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.promote_to_admin_if_first(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.promote_to_admin_if_first(uuid) TO authenticated, service_role;

-- Trigger-only functions: callable only by the database itself
REVOKE ALL ON FUNCTION public.touch_updated_at() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.touch_updated_at() TO service_role;

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;

REVOKE ALL ON FUNCTION public.applications_guard_candidate_update() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.applications_guard_candidate_update() TO service_role;

REVOKE ALL ON FUNCTION public.companies_guard_owner_insert() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.companies_guard_owner_insert() TO service_role;

REVOKE ALL ON FUNCTION public.companies_guard_owner_update() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.companies_guard_owner_update() TO service_role;