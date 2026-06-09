
-- 1. Guard verified column on companies: only admins may change it
CREATE OR REPLACE FUNCTION public.companies_guard_owner_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public.has_role(auth.uid(), 'admin') THEN
    RETURN NEW;
  END IF;
  IF NEW.verified IS DISTINCT FROM OLD.verified THEN
    RAISE EXCEPTION 'Only admins can change the verified flag';
  END IF;
  IF NEW.featured IS DISTINCT FROM OLD.featured THEN
    RAISE EXCEPTION 'Only admins can change the featured flag';
  END IF;
  IF NEW.owner_id IS DISTINCT FROM OLD.owner_id THEN
    RAISE EXCEPTION 'Owners cannot reassign companies';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS companies_guard_owner_update ON public.companies;
CREATE TRIGGER companies_guard_owner_update
BEFORE UPDATE ON public.companies
FOR EACH ROW EXECUTE FUNCTION public.companies_guard_owner_update();

-- Also prevent owners from inserting an already-verified or featured row
CREATE OR REPLACE FUNCTION public.companies_guard_owner_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public.has_role(auth.uid(), 'admin') THEN
    RETURN NEW;
  END IF;
  IF NEW.verified IS TRUE THEN
    NEW.verified := false;
  END IF;
  IF NEW.featured IS TRUE THEN
    NEW.featured := false;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS companies_guard_owner_insert ON public.companies;
CREATE TRIGGER companies_guard_owner_insert
BEFORE INSERT ON public.companies
FOR EACH ROW EXECUTE FUNCTION public.companies_guard_owner_insert();

-- 2. Public read policy for hero-media storage bucket
DROP POLICY IF EXISTS "Public read hero-media" ON storage.objects;
CREATE POLICY "Public read hero-media"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'hero-media');
