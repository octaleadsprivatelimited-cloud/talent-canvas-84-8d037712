import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/page-hero";
import { DynamicSeo } from "@/components/dynamic-seo";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy" },
      { name: "description", content: "How we collect, use, and protect data." },
    ],
  }),
  component: () => (
    <>
      <DynamicSeo
        pageKey="privacy"
        fallbackTitle="Privacy Policy"
        fallbackDescription="How we collect, use, and protect data."
      />
      <PageHero eyebrow="Legal" title="Privacy Policy" subtitle="Last updated: June 2026" />
      <section className="container mx-auto max-w-3xl space-y-6 px-4 py-16 text-foreground/90">
        <p>
          We collect only the data we need to deliver our recruiting services: contact details you
          submit, the roles you discuss with us, and the candidate information you share with our
          consultants.
        </p>
        <h2 className="font-display text-2xl font-bold">What we collect</h2>
        <p>
          Name, email, phone, company, the contents of messages you send us, and standard web
          analytics (pages viewed, referrer, device).
        </p>
        <h2 className="font-display text-2xl font-bold">How we use it</h2>
        <p>
          To respond to inquiries, deliver our search and staffing services, and improve our site.
          We do not sell personal data.
        </p>
        <h2 className="font-display text-2xl font-bold">Your rights</h2>
        <p>
          You can request access, correction, or deletion of your personal data at any time by
          emailing us.
        </p>
        <h2 className="font-display text-2xl font-bold">Contact</h2>
        <p>Questions? Reach us via the contact page.</p>
      </section>
    </>
  ),
});
