import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const BASE_URL = "https://talent-canvas-84.lovable.app";
const FIREBASE_PROJECT_ID = "virelixconsulting";
const FIREBASE_API_KEY = "AIzaSyBueUkcslJoo8w4aYrhg4O8pH-vhy8FpUs";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

// Static, always-indexed routes
const STATIC_ENTRIES: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/who-we-are", changefreq: "monthly", priority: "0.8" },
  { path: "/team", changefreq: "monthly", priority: "0.7" },
  { path: "/contact", changefreq: "monthly", priority: "0.7" },
  { path: "/services", changefreq: "weekly", priority: "0.9" },
  { path: "/industries", changefreq: "weekly", priority: "0.9" },
  { path: "/jobs", changefreq: "daily", priority: "0.9" },
  { path: "/companies", changefreq: "weekly", priority: "0.8" },
  { path: "/insights", changefreq: "weekly", priority: "0.8" },
  { path: "/case-studies", changefreq: "weekly", priority: "0.8" },
  { path: "/privacy", changefreq: "yearly", priority: "0.3" },
  { path: "/terms", changefreq: "yearly", priority: "0.3" },
];

interface FirestoreDoc {
  name: string;
  fields?: Record<
    string,
    { stringValue?: string; timestampValue?: string; booleanValue?: boolean }
  >;
  updateTime?: string;
}

async function listSlugs(collection: string, prefix: string): Promise<SitemapEntry[]> {
  try {
    const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/${collection}?pageSize=300&key=${FIREBASE_API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = (await res.json()) as { documents?: FirestoreDoc[] };
    if (!data.documents) return [];
    return data.documents
      .map((d) => {
        const slug = d.fields?.slug?.stringValue;
        const published = d.fields?.published?.booleanValue;
        if (!slug) return null;
        if (published === false) return null;
        return {
          path: `${prefix}/${slug}`,
          lastmod:
            (d.updateTime ?? d.fields?.updated_at?.timestampValue ?? "").slice(0, 10) || undefined,
          changefreq: "weekly",
          priority: "0.6",
        } as SitemapEntry;
      })
      .filter((e): e is SitemapEntry => e !== null);
  } catch {
    return [];
  }
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const dynamic = (
          await Promise.all([
            listSlugs("jobs", "/jobs"),
            listSlugs("companies", "/companies"),
            listSlugs("services", "/services"),
            listSlugs("industries", "/industries"),
            listSlugs("case_studies", "/case-studies"),
            listSlugs("posts", "/insights"),
            listSlugs("custom_pages", "/p"),
          ])
        ).flat();

        const entries = [...STATIC_ENTRIES, ...dynamic];

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600, s-maxage=3600",
          },
        });
      },
    },
  },
});
