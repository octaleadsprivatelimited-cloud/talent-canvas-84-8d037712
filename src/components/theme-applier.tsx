import { useEffect } from "react";
import { useSiteSettings } from "@/hooks/use-site-settings";
import type { ThemeKey } from "@/components/home-themes";

const VALID: ThemeKey[] = [
  "editorial",
  "mono",
  "aurora",
  "magazine",
  "noir",
  "cinema",
  "pulse",
  "terracotta",
  "glass",
  "brutalist",
];

function applyTheme(theme: string | null | undefined) {
  if (typeof document === "undefined") return;
  const t = (theme && VALID.includes(theme as ThemeKey) ? theme : "editorial") as ThemeKey;
  document.documentElement.setAttribute("data-theme", t);
}

/**
 * Reads the current saved theme from site_settings and applies it
 * globally as `<html data-theme="...">`. CSS in styles.css redefines
 * every semantic token per theme, so the whole site (header, footer,
 * jobs, companies, blog, CMS pages) re-skins automatically.
 *
 * Live-preview events from the admin Site Settings page take priority
 * while present, and clear when the page unmounts.
 */
export function ThemeApplier() {
  const { data: settings } = useSiteSettings();

  useEffect(() => {
    applyTheme(settings?.home_theme ?? "editorial");
  }, [settings?.home_theme]);

  useEffect(() => {
    function onPreview(e: Event) {
      const detail = (e as CustomEvent<{ theme: string | null }>).detail;
      if (detail?.theme) applyTheme(detail.theme);
      else applyTheme(settings?.home_theme ?? "editorial");
    }
    window.addEventListener("lovable:preview-theme", onPreview as EventListener);
    return () => window.removeEventListener("lovable:preview-theme", onPreview as EventListener);
  }, [settings?.home_theme]);

  return null;
}
