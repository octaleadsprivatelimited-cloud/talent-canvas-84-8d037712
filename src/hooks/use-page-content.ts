import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type PageContent = Record<string, unknown>;

/**
 * Reads the JSON content for a given page_key from `page_content`.
 * Caller passes `defaults` — anything missing in the DB row falls back
 * to the default. This keeps the public site working even when admins
 * haven't filled in every field.
 */
export function usePageContent<T extends PageContent>(pageKey: string, defaults: T) {
  const q = useQuery({
    queryKey: ["page_content", pageKey],
    queryFn: async () => {
      const { data } = await supabase
        .from("page_content")
        .select("content")
        .eq("page_key", pageKey)
        .maybeSingle();
      return (data?.content ?? {}) as PageContent;
    },
    staleTime: 30_000,
  });

  // Shallow merge: DB values win, but missing keys fall back to defaults
  const merged = { ...defaults, ...(q.data ?? {}) } as T;
  return { ...q, data: merged };
}
