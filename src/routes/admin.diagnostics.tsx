import { createFileRoute } from "@tanstack/react-router";
import { Shield, ShieldAlert, UserCheck, KeyRound, Fingerprint, Database } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useIsAdmin } from "@/hooks/use-is-admin";
import { useState } from "react";
import { supabase } from "@/integrations/firebase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/diagnostics")({
  component: DiagnosticsPage,
});

function DiagnosticsPage() {
  const [seeding, setSeeding] = useState(false);

  const handleSeed = async () => {
    setSeeding(true);
    try {
      // 1. Seed site_settings
      await supabase.from("site_settings").upsert({
        id: "global",
        company_name: "Virelix Consulting",
        contact_email: "info@virelix.com",
        theme: "mono",
      });

      // 2. Seed page_content
      const homepageDefaults = {
        services_eyebrow: "What we do",
        services_heading: "Services built around how you",
        services_heading_accent: "actually hire.",
        services_intro:
          "Whether you're filling one critical seat or scaling by 10x, we plug in the right model for the moment — and stand behind the work.",
        industries_eyebrow: "Industries",
        industries_heading: "Deep specialization in the sectors shaping the next decade.",
        industries_intro:
          "Our consultants come from the industries they recruit for — that means real conversations with candidates and shortlists that land.",
        industries_badge_value: "USA + India",
        industries_badge_label: "Global delivery across two continents",
        process_eyebrow: "How we work",
        process_heading: "A search process measured in",
        process_heading_accent: "weeks, not quarters.",
        why_heading: "Why organizations choose us",
        why_intro:
          "A global delivery partner — combining quality, speed, and cost efficiency across every engagement.",
        why_bullets: [
          "USA headquartered",
          "Global talent network",
          "Industry-specific expertise",
          "Dedicated recruitment specialists",
        ],
        stats: [
          { value: "USA", label: "Delaware HQ" },
          { value: "2", label: "Continents — USA & India" },
          { value: "10+", label: "Industries served" },
          { value: "24/7", label: "Recruitment delivery" },
        ],
        clients: [
          "DELAWARE, USA",
          "GLOBAL DELIVERY",
          "USA + INDIA",
          "RPO",
          "EXECUTIVE SEARCH",
          "WORKFORCE SOLUTIONS",
        ],
        testimonials_eyebrow: "Client stories",
        testimonials_heading: "What it's like to work with us.",
        cta_heading: "Let's build your next high-performing team.",
        cta_description:
          "Share your hiring or workforce need — a consultant will respond within one business day with a tailored plan.",
        cta_primary_label: "Contact us",
        cta_primary_to: "/contact",
        cta_secondary_label: "Our services",
        cta_secondary_to: "/services",
      };

      await supabase.from("page_content").upsert({
        id: "homepage",
        title: "Homepage Layout",
        content: JSON.stringify(homepageDefaults),
      });

      // 3. Seed services
      const services = [
        {
          id: "service-1",
          slug: "executive-search",
          title: "Executive Search & Leadership Hiring",
          summary:
            "Retained search for C-suite, VP, and Director roles led by senior consultants with deep sector expertise.",
          icon: "target",
          published: true,
          sort_order: 1,
          features: [
            "Retained search practice",
            "Sector specialists",
            "C-level placement portfolio",
          ],
        },
        {
          id: "service-2",
          slug: "it-recruitment",
          title: "IT & Non-IT Recruitment",
          summary:
            "Specialist hiring across technology, engineering, finance, sales, operations, and support functions.",
          icon: "cpu",
          published: true,
          sort_order: 2,
          features: ["Tech talent network", "Contingent placement", "Multi-country delivery"],
        },
        {
          id: "service-3",
          slug: "rpo-workforce-solutions",
          title: "RPO & Workforce Solutions",
          summary:
            "Embedded recruiters and end-to-end hiring operations that scale with your business.",
          icon: "briefcase",
          published: true,
          sort_order: 3,
          features: ["Scale on-demand", "Dedicated recruiter model", "ATS configuration & metrics"],
        },
        {
          id: "service-4",
          slug: "consulting-training",
          title: "Consulting & Professional Training",
          summary:
            "Workforce planning, talent mapping, business consulting, and career development programs.",
          icon: "trending-up",
          published: true,
          sort_order: 4,
          features: ["Org design consulting", "Training bootcamps", "Salary benchmarking"],
        },
      ];

      for (const svc of services) {
        await supabase.from("services").upsert(svc);
      }

      // 4. Seed companies
      const companies = [
        {
          id: "company-1",
          name: "Virelix Tech Corp",
          slug: "vix-tech",
          description: "Leading technology infrastructure and digital platform development agency.",
          website: "https://virelix.com",
        },
        {
          id: "company-2",
          name: "Delaware Supply Chain",
          slug: "del-supply",
          description: "National logistics, shipping, and storage operations operator.",
          website: "https://delaware-supply.com",
        },
      ];

      for (const comp of companies) {
        await supabase.from("companies").upsert(comp);
      }

      // 5. Seed jobs
      const jobs = [
        {
          id: "job-1",
          title: "Senior Cloud Infrastructure Architect",
          slug: "senior-cloud-infra-architect",
          company_id: "company-1",
          location: "Remote (USA / India)",
          type: "Full-Time",
          salary: "$160,000 - $190,000",
          description: "Responsible for scaling secure architectures on cloud platforms.",
          published: true,
          featured: true,
        },
        {
          id: "job-2",
          title: "Lead Technical Recruiter",
          slug: "lead-tech-recruiter",
          company_id: "company-2",
          location: "Delaware, USA",
          type: "Full-Time",
          salary: "$110,000 - $130,000",
          description: "Scale core workforce logistics and operations personnel recruiting.",
          published: true,
          featured: true,
        },
      ];

      for (const j of jobs) {
        await supabase.from("jobs").upsert(j);
      }

      // 6. Seed testimonials
      const testimonials = [
        {
          id: "test-1",
          name: "Sarah Jenkins",
          role: "VP of People at TechSphere",
          content:
            "Virelix Consulting transformed our engineering recruitment. We filled three VP roles in less than a month.",
          rating: 5,
        },
        {
          id: "test-2",
          name: "David Chen",
          role: "CEO at Delaware Supply Chain",
          content:
            "Their recruitment process is lightning-fast and quality-focused. Highly recommended for executive searches.",
          rating: 5,
        },
      ];

      for (const t of testimonials) {
        await supabase.from("testimonials").upsert(t);
      }

      // 7. Seed industries
      const industries = [
        {
          id: "ind-1",
          label: "Technology & Software Engineering",
          slug: "technology-software",
          description: "AI, cloud infrastructure, enterprise software, and engineering roles.",
          icon: "cpu",
          published: true,
          sort_order: 1,
        },
        {
          id: "ind-2",
          label: "Healthcare & Life Sciences",
          slug: "healthcare-lifesciences",
          description: "Medical devices, biotech, pharmaceuticals, and healthcare providers.",
          icon: "heart",
          published: true,
          sort_order: 2,
        },
      ];

      for (const ind of industries) {
        await supabase.from("industries").upsert(ind);
      }

      // 8. Seed team_members
      const team = [
        {
          id: "team-1",
          name: "Alex Mercer",
          role: "Managing Director",
          bio: "15+ years experience in global executive talent acquisitions.",
        },
        {
          id: "team-2",
          name: "Jessica Taylor",
          role: "Principal Tech Recruiter",
          bio: "Ex-Google staffing leader specializing in AI and cloud engineering talent.",
        },
      ];

      for (const tm of team) {
        await supabase.from("team_members").upsert(tm);
      }

      // 9. Seed case_studies
      const caseStudies = [
        {
          id: "case-1",
          title: "Scaling a Unicorn Startup Engineering Team",
          slug: "scaling-unicorn-startup",
          client: "Vix Tech Corp",
          industry: "Technology & Software",
          cover_url:
            "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=70",
          summary:
            "How we designed and executed an embedded RPO strategy to hire 45 software engineers in 90 days.",
          body: `### Background & Challenge
Vix Tech Corp, a fast-scaling tech platform, secured their Series B funding and needed to double their engineering team. They faced severe recruitment bottlenecking and high agency fees. The goal was to hire 45 high-caliber software engineers, including senior cloud architects and frontend leads, within 90 days.

### The Solution
We deployed an embedded Recruitment Process Outsourcing (RPO) team comprising three senior recruiters and two sourcers. Our team fully integrated into Vix Tech’s Slack, Jira, and ATS systems. We established a structured vetting pipeline, streamlined interview processes, and leveraged our global talent network across the USA and India.

### Results
Within 90 days, we successfully filled all 45 engineering positions. The embedded model allowed us to build a sustainable talent pipeline and reduce recruitment agency spend by over 60%. Time-to-hire dropped from 48 days to 26 days.`,
          results: [
            { label: "Hires Completed", value: "45" },
            { label: "Avg. Time to Hire", value: "26 Days" },
            { label: "Cost Savings", value: "62%" },
          ],
          sort_order: 1,
          published: true,
        },
        {
          id: "case-2",
          title: "C-Suite Recruiting for a National Logistics Leader",
          slug: "c-suite-logistics-recruiting",
          client: "Delaware Supply Chain",
          industry: "Logistics & Supply Chain",
          cover_url:
            "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=70",
          summary:
            "Placing a Chief Operating Officer (COO) and VP of Logistics within a tight 60-day schedule.",
          body: `### Background & Challenge
Delaware Supply Chain, a national logistics operator, faced a sudden vacancy in their Chief Operating Officer position during a period of rapid expansion. They needed an experienced operational leader who could oversee 12 distribution centers and manage a team of 400+ personnel.

### The Solution
We launched a target-focused executive search engagement. Our senior partners conducted extensive talent mapping across competing tier-one logistics and supply chain enterprises in North America. We identified 18 highly qualified passive candidates, conducting detailed competency-based assessments and cultural alignment evaluations.

### Results
We presented a shortlist of 4 qualified candidates within 25 days. The chosen candidate, a seasoned logistics VP, accepted the COO offer and started onboarding within 50 days of contract signing. We subsequently placed their new VP of Logistics, compounding their operational leadership.`,
          results: [
            { label: "Positions Placed", value: "2" },
            { label: "Search Duration", value: "42 Days" },
            { label: "Candidate Fit Rate", value: "100%" },
          ],
          sort_order: 2,
          published: true,
        },
        {
          id: "case-3",
          title: "Building the Future of Medical Devices",
          slug: "medical-device-engineering",
          client: "BioPulse Diagnostics",
          industry: "Healthcare & Life Sciences",
          cover_url:
            "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=1200&q=70",
          summary:
            "Sourcing and placing highly specialized hardware and embedded software engineers for clinical diagnostic tools.",
          body: `### Background & Challenge
BioPulse Diagnostics was developing a next-generation clinical diagnostic tool. They required a team of 6 specialist engineers with experience in FDA-regulated embedded software and microfluidics. These roles had been open for over six months due to the extreme scarcity of regional talent.

### The Solution
We initiated a global talent search utilizing our delivery hubs in both the USA and India. By searching globally, we identified candidates with the precise scientific credentials required. We managed the entire interview logistics, technical screen coordination, and immigration/relocation compliance.

### Results
All 6 engineering seats were filled within 75 days, with 4 US-based hires and 2 offshore senior systems developers. The product launch timeline remained on schedule, and BioPulse successfully completed its FDA submission.`,
          results: [
            { label: "Specialists Placed", value: "6" },
            { label: "Relocation Rate", value: "100%" },
            { label: "Retention (1 yr)", value: "95%" },
          ],
          sort_order: 3,
          published: true,
        },
      ];

      for (const cs of caseStudies) {
        await supabase.from("case_studies").upsert(cs);
      }

      // 10. Seed posts
      const posts = [
        {
          id: "post-1",
          title: "Navigating the Executive Talent Search in 2026",
          slug: "navigating-executive-search-2026",
          category: "Executive Search",
          cover_url:
            "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=70",
          excerpt:
            "Key changes in leadership hiring trends post hybrid-work stabilization, and how top organizations secure Tier-1 talent.",
          body: `### The Evolution of Executive Recruitment
As we move through 2026, the landscape of executive search has fundamentally transformed. Hybrid-work models have stabilized, but candidate expectations around autonomy, equity, and strategic impact have reached new heights. Standard recruiting approaches no longer yield Tier-1 leaders.

### Cultural Alignment Over Credentials
While technical capabilities and previous portfolios are important, our placements show that cultural alignment and adaptive intelligence are the primary drivers of executive longevity. Organizations must look beyond resumes to evaluate leadership style under pressure.

### Decisive Executive Search Playbook
1. **Accelerate Decision Timelines**: Top executive talent is often considering multiple options. Excessive delays in your interview loop will cause candidates to drop out.
2. **Offer Real Autonomy**: Executives want ownership of their strategic mandates.
3. **Leverage Expert Search Partners**: Engage specialized recruiters who maintain ongoing relationships with passive executive networks.`,
          published: true,
          published_at: "2026-06-01T10:00:00Z",
        },
        {
          id: "post-2",
          title: "RPO vs. Contingent Recruiting: Which Model Fits Your Scale?",
          slug: "rpo-vs-contingent-recruiting",
          category: "Recruitment Strategy",
          cover_url:
            "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=70",
          excerpt:
            "An operational comparison between embedded RPO and contingent placements for high-growth hiring.",
          body: `### Choosing Your Hiring Vehicle
Scaling companies often face a dilemma: should they engage traditional contingent search agencies or invest in an embedded Recruitment Process Outsourcing (RPO) solution? The answer depends entirely on your target scale, budget, and internal capability.

### The Contingent Model: Tactical Speed
Contingent recruiting is transaction-focused. You pay a percentage of the candidate's salary only when they are successfully placed. This is ideal for sporadic hires or highly specialized roles where you need instant support without ongoing commitment.

### The Embedded RPO Model: Strategic Scale
An RPO partner embeds directly into your organization, functioning as your internal talent acquisition department. They configure ATS systems, build candidate pipelines, manage employer branding, and coordinate interview processes. This model excels when you need to hire 15+ employees over a defined period, dropping cost-per-hire by up to 50% compared to contingent agencies.`,
          published: true,
          published_at: "2026-06-02T12:00:00Z",
        },
        {
          id: "post-3",
          title: "USA-India Global Delivery: The Strategic Advantage",
          slug: "usa-india-global-delivery-advantage",
          category: "Workforce Solutions",
          cover_url:
            "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=70",
          excerpt:
            "How leveraging global delivery hubs across North America and South Asia drives 24/7 sourcing efficiency.",
          body: `### Sourcing Around the Clock
In today's fast-moving business climate, speed is the ultimate competitive advantage. By establishing global delivery hubs in both the USA (Delaware) and India (Hyderabad), Virelix Consulting implements a continuous 24/7 sourcing cycle.

### How Global Delivery Works
1. **USA Leadership**: Client alignment, executive search qualification, and final hiring metrics are managed by our local USA partners.
2. **Offshore Sourcing Excellence**: Our team in India handles initial search list preparation, resume screening, and scheduling overnight.
3. **Continuous Cycle**: When the US team begins their day, they receive qualified shortlists and candidate profiles vetted overnight.

### Key Outcomes
This model reduces search cycle times by 30-40%. Additionally, it allows our clients to access highly technical talent globally, resolving domestic staffing deficits in areas like AI, cloud engineering, and clinical research.`,
          published: true,
          published_at: "2026-06-03T09:00:00Z",
        },
      ];

      for (const p of posts) {
        await supabase.from("posts").upsert(p);
      }

      toast.success("Successfully seeded database with all demo content!");
    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : String(err);
      toast.error("Failed to seed database: " + msg);
    } finally {
      setSeeding(false);
    }
  };

  const { user, session, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useIsAdmin();

  const loading = authLoading || adminLoading;

  const isAuthenticated = !!session && !!user;
  const userId = user?.id ?? "—";
  const role = isAdmin ? "admin" : isAuthenticated ? "candidate" : "—";

  const items = [
    {
      label: "Authenticated",
      value: isAuthenticated ? "Yes" : "No",
      icon: isAuthenticated ? UserCheck : ShieldAlert,
      color: isAuthenticated ? "text-emerald-500" : "text-rose-500",
      bg: isAuthenticated ? "bg-emerald-500/10" : "bg-rose-500/10",
    },
    {
      label: "User ID",
      value: userId,
      icon: Fingerprint,
      color: "text-primary",
      bg: "bg-primary/10",
      mono: true,
    },
    {
      label: "Role Claim",
      value: role,
      icon: KeyRound,
      color: isAdmin === true ? "text-amber-500" : "text-muted-foreground",
      bg: isAdmin === true ? "bg-amber-500/10" : "bg-muted",
    },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Diagnostics</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Authentication and role status for troubleshooting.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-5"
          >
            <div className="flex items-center gap-2">
              <span className={`inline-flex rounded-md p-1.5 ${item.bg}`}>
                <item.icon className={`h-4 w-4 ${item.color}`} />
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {item.label}
              </span>
            </div>
            <p
              className={`font-display text-xl font-semibold ${
                item.mono ? "font-mono text-base" : ""
              }`}
            >
              {loading ? (
                <span className="inline-block h-5 w-16 animate-pulse rounded bg-muted" />
              ) : (
                item.value
              )}
            </p>
          </div>
        ))}
      </div>

      {isAuthenticated && user && (
        <div className="mt-8 rounded-lg border border-border bg-surface p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Session Details
          </h2>
          <dl className="mt-4 grid gap-3 text-sm">
            <div className="flex justify-between border-b border-border pb-2">
              <dt className="text-muted-foreground">Email</dt>
              <dd className="font-medium">{user.email ?? "—"}</dd>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <dt className="text-muted-foreground">Provider</dt>
              <dd className="font-medium capitalize">{user.app_metadata?.provider ?? "—"}</dd>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <dt className="text-muted-foreground">Created</dt>
              <dd className="font-medium">
                {user.created_at ? new Date(user.created_at).toLocaleString() : "—"}
              </dd>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <dt className="text-muted-foreground">Last Sign In</dt>
              <dd className="font-medium">
                {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : "—"}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Session Expires</dt>
              <dd className="font-medium">
                {session?.expires_at ? new Date(session.expires_at * 1000).toLocaleString() : "—"}
              </dd>
            </div>
          </dl>
        </div>
      )}

      {isAuthenticated && (
        <div className="mt-8 rounded-lg border border-border bg-surface p-5">
          <div className="flex items-center gap-2">
            <span className="inline-flex rounded-md p-1.5 bg-amber-500/10">
              <Database className="h-4 w-4 text-amber-500" />
            </span>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Seed Demo Content
            </h2>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-slate-500">
            If your Firestore collections are empty, click the button below to populate initial demo
            data across 10 collections: services, jobs, companies, page contents, testimonials, and
            more.
          </p>
          <Button
            onClick={handleSeed}
            disabled={seeding}
            className="mt-6 rounded-none bg-slate-900 px-8 py-5 text-[11px] font-bold uppercase tracking-[0.25em] text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {seeding ? "Populating database..." : "Seed Firebase Database"}
          </Button>
        </div>
      )}
    </div>
  );
}
