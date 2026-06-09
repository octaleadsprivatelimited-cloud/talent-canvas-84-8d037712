DROP POLICY IF EXISTS "team public read" ON public.team_members;

CREATE POLICY "team public read non-pii"
  ON public.team_members
  FOR SELECT
  TO anon, authenticated
  USING (published OR has_role(auth.uid(), 'admin'::app_role));

REVOKE SELECT ON public.team_members FROM anon;
GRANT SELECT (
  id, name, role_title, bio, photo_url, linkedin,
  sort_order, published, created_at, updated_at
) ON public.team_members TO anon;

REVOKE SELECT ON public.team_members FROM authenticated;
GRANT SELECT (
  id, name, role_title, bio, photo_url, linkedin,
  sort_order, published, created_at, updated_at
) ON public.team_members TO authenticated;

GRANT ALL ON public.team_members TO service_role;