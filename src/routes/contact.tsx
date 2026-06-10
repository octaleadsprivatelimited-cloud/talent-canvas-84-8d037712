import { useFirebaseQuery, useFirebaseMutation } from "@/hooks/use-firebase-query";
import { useState } from "react";
import { z } from "zod";
import { Mail, MapPin, Phone } from "lucide-react";
import { firebase } from "@/integrations/firebase/client";
import { PageHero } from "@/components/page-hero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DynamicSeo } from "@/components/dynamic-seo";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(255),
  company: z.string().trim().max(200).optional(),
  phone: z.string().trim().max(40).optional(),
  subject: z.string().trim().max(200).optional(),
  message: z.string().trim().min(10).max(4000),
});

function ContactPage() {
  const { data: page } = useFirebaseQuery("page_content_contact", async () => {
    const { data } = await firebase
      .from("page_content")
      .select("content")
      .eq("page_key", "contact")
      .maybeSingle();
    return (data?.content as Record<string, string>) ?? {};
  });
  const { data: site } = useFirebaseQuery("site_settings", async () => {
    const { data } = await firebase.from("site_settings").select("*").maybeSingle();
    return data;
  });

  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [lastSubmit, setLastSubmit] = useState(0);

  const submit = useFirebaseMutation<typeof form>({
    mutationFn: async (payload) => {
      // Rate-limit: 30 seconds between submissions
      const now = Date.now();
      if (now - lastSubmit < 30_000) {
        throw new Error("Please wait before submitting again.");
      }
      const parsed = schema.parse(payload);
      const { error } = await firebase.from("contact_submissions").insert({
        ...parsed,
        createdAt: new Date().toISOString(),
        source: "website_contact_form",
      });
      if (error) throw error;
      setLastSubmit(now);
    },
    onSuccess: () => {
      toast.success("Thanks — we'll be in touch within one business day.");
      setForm({ name: "", email: "", company: "", phone: "", subject: "", message: "" });
    },
    onError: (e) => toast.error(e.message || "Could not send. Please try again."),
  });

  return (
    <>
      <DynamicSeo
        pageKey="contact"
        fallbackTitle="Contact Us"
        fallbackDescription="Tell us about your hiring need. We respond within one business day."
      />
      <PageHero
        eyebrow="Contact"
        title={page?.title ?? "Let's talk about your next hire"}
        subtitle={
          page?.subtitle ?? "Tell us what you're building. We'll respond within one business day."
        }
        bgImage="/contact-bg.jpg"
      />
      <section className="container mx-auto grid gap-12 px-4 py-16 lg:grid-cols-[2fr_1fr]">
        <form
          className="space-y-5 border border-border p-8"
          onSubmit={(e) => {
            e.preventDefault();
            submit.mutate(form);
          }}
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Your name *">
              <Input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </Field>
            <Field label="Work email *">
              <Input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </Field>
            <Field label="Company">
              <Input
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
              />
            </Field>
            <Field label="Phone">
              <Input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </Field>
          </div>
          <Field label="Subject">
            <Input
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              placeholder="e.g. VP Engineering search"
            />
          </Field>
          <Field label="Tell us about the role *">
            <Textarea
              required
              rows={6}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Role, location, timeline, comp band, anything we should know…"
            />
          </Field>
          <Button type="submit" size="lg" disabled={submit.isPending}>
            {submit.isPending ? "Sending…" : "Send message"}
          </Button>
        </form>
        <aside className="space-y-6">
          <div className="border border-border bg-surface p-6">
            <h4 className="font-display text-lg font-bold">Direct contact</h4>
            <div className="mt-4 space-y-3 text-sm">
              {site?.contact_email && (
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />{" "}
                  <a href={`mailto:${site.contact_email}`} className="hover:underline">
                    {site.contact_email}
                  </a>
                </p>
              )}
              {site?.contact_phone && (
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" /> {site.contact_phone}
                </p>
              )}
              {site?.address && (
                <p className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 text-primary" /> {site.address}
                </p>
              )}
            </div>
          </div>
          <div className="border-l-2 border-primary bg-surface p-6 text-sm text-muted-foreground">
            We work with companies hiring senior leadership and specialist talent. Typical
            engagement starts at 1–2 roles.
          </div>
        </aside>
      </section>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </Label>
      {children}
    </div>
  );
}

export default ContactPage;
