ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS hero_video_url text,
  ADD COLUMN IF NOT EXISTS hero_video_poster_url text;