
CREATE POLICY "Admins manage hero-media"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'hero-media' AND public.has_role(auth.uid(), 'admin'))
WITH CHECK (bucket_id = 'hero-media' AND public.has_role(auth.uid(), 'admin'));
