import { useEffect } from "react";
import { usePageContent } from "@/hooks/use-page-content";
import { useSiteSettings } from "@/hooks/use-site-settings";

type SeoContent = {
  title?: string;
  description?: string;
  og_image?: string;
};

/**
 * Client-side SEO overrider. Each public route mounts this with its
 * page key; the admin can edit the title/description from /admin/seo
 * and the change is reflected live on the public site without code.
 *
 * Falls back to whatever the route's static head() already set.
 */
export function DynamicSeo({ pageKey, fallbackTitle, fallbackDescription }: {
  pageKey: string;
  fallbackTitle?: string;
  fallbackDescription?: string;
}) {
  const { data: settings } = useSiteSettings();
  const { data } = usePageContent<SeoContent>(`seo:${pageKey}`, {});

  useEffect(() => {
    if (typeof document === "undefined") return;
    const brand = settings?.brand_name ?? "";
    const title = data.title || fallbackTitle;
    const description = data.description || fallbackDescription;
    const ogImage = data.og_image;

    if (title) {
      const composed = brand && !title.includes(brand) ? `${title} — ${brand}` : title;
      document.title = composed;
      setMeta("property", "og:title", composed);
      setMeta("name", "twitter:title", composed);
    }
    if (description) {
      setMeta("name", "description", description);
      setMeta("property", "og:description", description);
      setMeta("name", "twitter:description", description);
    }
    if (ogImage) {
      setMeta("property", "og:image", ogImage);
      setMeta("name", "twitter:image", ogImage);
    }
  }, [data.title, data.description, data.og_image, fallbackTitle, fallbackDescription, settings?.brand_name]);

  return null;
}

function setMeta(attr: "name" | "property", key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
}
