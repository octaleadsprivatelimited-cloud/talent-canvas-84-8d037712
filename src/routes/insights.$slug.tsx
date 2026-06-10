import { Link, useParams } from "react-router-dom";
import { useFirebaseQuery } from "@/hooks/use-firebase-query";
import { firebase } from "@/integrations/firebase/client";
import { PageHero } from "@/components/page-hero";

const DEFAULT_POSTS = [
  {
    id: "post-1",
    title: "Navigating the Executive Talent Search in 2026",
    slug: "navigating-executive-search-2026",
    category: "Executive Search",
    cover_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=70",
    excerpt: "Key changes in leadership hiring trends post hybrid-work stabilization, and how top organizations secure Tier-1 talent.",
    body: `### The Evolution of Executive Recruitment
As we move through 2026, the landscape of executive search has fundamentally transformed. Hybrid-work models have stabilized, but candidate expectations around autonomy, equity, and strategic impact have reached new heights. Standard recruiting approaches no longer yield Tier-1 leaders.

### Cultural Alignment Over Credentials
While technical capabilities and previous portfolios are important, our placements show that cultural alignment and adaptive intelligence are the primary drivers of executive longevity. Organizations must look beyond resumes to evaluate leadership style under pressure.

### Decisive Executive Search Playbook
1. **Accelerate Decision Timelines**: Top executive talent is often considering multiple options. Excessive delays in your interview loop will cause candidates to drop out.
2. **Offer Real Autonomy**: Executives want ownership of their strategic mandates.
3. **Engage Expert Search Partners**: Engage specialized recruiters who maintain ongoing relationships with passive executive networks.`,
    published_at: "2026-06-01T10:00:00Z",
  },
  {
    id: "post-2",
    title: "RPO vs. Contingent Recruiting: Which Model Fits Your Scale?",
    slug: "rpo-vs-contingent-recruiting",
    category: "Recruitment Strategy",
    cover_url: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=70",
    excerpt: "An operational comparison between embedded RPO and contingent placements for high-growth hiring.",
    body: `### Choosing Your Hiring Vehicle
Scaling companies often face a dilemma: should they engage traditional contingent search agencies or invest in an embedded Recruitment Process Outsourcing (RPO) solution? The answer depends entirely on your target scale, budget, and internal capability.

### The Contingent Model: Tactical Speed
Contingent recruiting is transaction-focused. You pay a percentage of the candidate's salary only when they are successfully placed. This is ideal for sporadic hires or highly specialized roles where you need instant support without ongoing commitment.

### The Embedded RPO Model: Strategic Scale
An RPO partner embeds directly into your organization, functioning as your internal talent acquisition department. They configure ATS systems, build candidate pipelines, manage employer branding, and coordinate interview processes. This model excels when you need to hire 15+ employees over a defined period, dropping cost-per-hire by up to 50% compared to contingent agencies.`,
    published_at: "2026-06-02T12:00:00Z",
  },
  {
    id: "post-3",
    title: "USA-India Global Delivery: The Strategic Advantage",
    slug: "usa-india-global-delivery-advantage",
    category: "Workforce Solutions",
    cover_url: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=70",
    excerpt: "How leveraging global delivery hubs across North America and South Asia drives 24/7 sourcing efficiency.",
    body: `### Sourcing Around the Clock
In today's fast-moving business climate, speed is the ultimate competitive advantage. By establishing global delivery hubs in both the USA (Delaware) and India (Hyderabad), Virelix Consulting implements a continuous 24/7 sourcing cycle.

### How Global Delivery Works
1. **USA Leadership**: Client alignment, executive search qualification, and final hiring metrics are managed by our local USA partners.
2. **Offshore Sourcing Excellence**: Our team in India handles initial search list preparation, resume screening, and scheduling overnight.
3. **Continuous Cycle**: When the US team begins their day, they receive qualified shortlists and candidate profiles vetted overnight.

### Key Outcomes
This model reduces search cycle times by 30-40%. Additionally, it allows our clients to access highly technical talent globally, resolving domestic staffing deficits in areas like AI, cloud engineering, and clinical research.`,
    published_at: "2026-06-03T09:00:00Z",
  },
];

function InsightDetail() {
  const { slug } = useParams();
  const { data: dbData, isLoading } = useFirebaseQuery(["post", slug], async () => {
    const { data } = await firebase
      .from("posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();
    return data;
  });

  const data = dbData ?? DEFAULT_POSTS.find((p) => p.slug === slug) ?? null;

  if (isLoading)
    return (
      <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">Loading…</div>
    );
  if (!data) {
    return (
      <div className="flex-1 flex items-center justify-center py-20 bg-background text-foreground">
        <div className="text-center">
          <h1 className="text-4xl font-bold">404 - Insight Not Found</h1>
          <p className="mt-2 text-muted-foreground">The insight page you are looking for does not exist.</p>
          <Link to="/insights" className="mt-4 inline-block text-primary underline">Back to Insights</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHero
        eyebrow={data.category ?? "Insights"}
        title={data.title}
        subtitle={data.excerpt ?? undefined}
      />
      <article className="container mx-auto max-w-3xl px-4 py-16">
        {data.cover_url && (
          <img src={data.cover_url} alt="" className="mb-10 aspect-[16/9] w-full object-cover" />
        )}
        {data.published_at && (
          <p className="mb-8 text-sm text-muted-foreground">
            {new Date(data.published_at).toLocaleDateString(undefined, {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        )}
        <div className="prose prose-lg max-w-none whitespace-pre-line text-foreground/90">
          {data.body}
        </div>
        <div className="mt-12 border-t border-border pt-6">
          <Link to="/insights" className="text-sm text-muted-foreground hover:text-foreground">
            ← All insights
          </Link>
        </div>
      </article>
    </>
  );
}

export default InsightDetail;
