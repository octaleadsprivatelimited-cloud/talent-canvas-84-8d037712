import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/page-hero";
import { DynamicSeo } from "@/components/dynamic-seo";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service" },
      { name: "description", content: "Terms governing the use of our website and services." },
    ],
  }),
  component: () => (
    <>
      <DynamicSeo
        pageKey="terms"
        fallbackTitle="Terms of Service"
        fallbackDescription="Terms governing the use of our website and services."
      />
      <PageHero eyebrow="Legal" title="Terms of Service" subtitle="Last updated: June 2026" />
      <section className="container mx-auto max-w-3xl space-y-6 px-4 py-16 text-foreground/90">
        <p>
          By using this website you agree to these terms. The content on this site is for
          informational purposes only and does not constitute a contract for services.
        </p>
        <h2 className="font-display text-2xl font-bold">Engagements</h2>
        <p>
          All recruiting engagements are governed by a separate signed agreement that details scope,
          fees, and guarantees.
        </p>
        <h2 className="font-display text-2xl font-bold">Intellectual property</h2>
        <p>
          All content, logos, and trademarks on this site are owned by us or used with permission.
          Do not republish without written consent.
        </p>
        <h2 className="font-display text-2xl font-bold">Liability</h2>
        <p>
          We provide the website "as is" without warranty. We are not liable for indirect or
          consequential damages from your use of this site.
        </p>
      </section>
    </>
  ),
});
