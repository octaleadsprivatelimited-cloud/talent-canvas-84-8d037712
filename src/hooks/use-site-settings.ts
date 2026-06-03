import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
};

export function useSiteSettings() {
  return useQuery({
    queryKey: ["site_settings"],
    queryFn: async () => {
      const { data } = await supabase.from("site_settings").select("*").limit(1).maybeSingle();
      return data as SiteSettings | null;
    },
    staleTime: 60_000,
  });
}
