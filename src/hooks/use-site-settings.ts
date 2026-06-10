import { useFirebaseQuery } from "./use-firebase-query";
import { firebase } from "@/integrations/firebase/client";

export type SiteSettings = {
  id: string;
  brand_name: string;
  tagline: string | null;
  logo_url: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  address: string | null;
  social_linkedin: string | null;
  social_twitter: string | null;
  social_instagram: string | null;
  primary_color: string | null;
  accent_color: string | null;
  footer_about: string | null;
  home_theme: string | null;
  hero_video_url: string | null;
  hero_video_poster_url: string | null;
};

const CACHE_KEY = "site_settings_cache_v1";

function readCache(): SiteSettings | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as SiteSettings) : null;
  } catch {
    return null;
  }
}

function writeCache(data: SiteSettings | null) {
  if (typeof window === "undefined") return;
  try {
    if (data) localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

export function getCachedHomeTheme(): string | null {
  return readCache()?.home_theme ?? null;
}

export function useSiteSettings() {
  return useFirebaseQuery(
    "site_settings",
    async () => {
      const { data } = await firebase.from("site_settings").select("*").limit(1).maybeSingle();
      const result = (data as SiteSettings | null) ?? null;
      writeCache(result);
      return result;
    },
    {
      initialData: () => readCache() ?? undefined,
    },
  );
}
