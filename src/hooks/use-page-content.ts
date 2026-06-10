import { useFirebaseQuery } from "./use-firebase-query";
import { firebase } from "@/integrations/firebase/client";

export type PageContent = Record<string, unknown>;

/**
 * Reads the JSON content for a given page_key from `page_content`.
 * Caller passes `defaults` — anything missing in the DB row falls back
 * to the default. This keeps the public site working even when admins
 * haven't filled in every field.
 */
export function usePageContent<T extends PageContent>(pageKey: string, defaults: T) {
  const q = useFirebaseQuery(["page_content", pageKey], async () => {
    const { data } = await firebase
      .from("page_content")
      .select("content")
      .eq("page_key", pageKey)
      .maybeSingle();
    return (data?.content ?? {}) as PageContent;
  });

  // Shallow merge: DB values win, but missing keys fall back to defaults
  const merged = { ...defaults, ...(q.data ?? {}) } as T;
  return { ...q, data: merged };
}
