import { useFirebaseQuery } from "@/hooks/use-firebase-query";
import { Check, Target, Compass, ShieldCheck, Award, Globe, Linkedin, Mail } from "lucide-react";
import { firebase } from "@/integrations/firebase/client";
import { PageHero } from "@/components/page-hero";
import { DynamicSeo } from "@/components/dynamic-seo";

const ABOUT_DEFAULTS = {
  title: "A global force in workforce consulting",
  intro:
    "Virelix Consulting was founded to bridge the gap between global enterprises and tier-one professional talent. Through a continuous USA-India delivery pipeline, we provide scale, speed, and exceptional execution across every engagement.",
  mission:
    "To make global hiring frictionless, compliant, and human-centric — empowering organizations to scale high-performing teams without borders.",
  values: [
    "Authentic Vetting: We screen candidates peer-to-peer, ensuring technical and cultural alignment before presentation.",
    "Global-Local Delivery: Headquartered in Delaware with operations in Hyderabad, driving round-the-clock sourcing efficiency.",
    "Regulatory Excellence: 100% compliant international payroll, immigration, and labor classification safeguards.",
    "Demographic Inclusivity: Leveraging unbiased, demographic-neutral pipelines to maximize opportunity for diverse talent.",
  ],
  operating_in: ["United States", "India"],
};

const DEFAULT_TEAM_MEMBERS = [
  {
    id: "team-1",
    name: "Alex Mercer",
    role_title: "Managing Director",
    bio: "15+ years experience in global executive talent acquisitions.",
    photo_url:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&h=500&q=80",
    published: true,
    sort_order: 1,
    email: "alex@virelixconsulting.com",
    linkedin: "https://linkedin.com/in/alex-mercer",
  },
  {
    id: "team-2",
    name: "Jessica Taylor",
    role_title: "Principal Tech Recruiter",
    bio: "Ex-Google staffing leader specializing in AI and cloud engineering talent.",
    photo_url:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&h=500&q=80",
    published: true,
    sort_order: 2,
    email: "jessica@virelixconsulting.com",
    linkedin: "https://linkedin.com/in/jessica-taylor",
  },
];

function WhoWeArePage() {
  const { data: dbPage } = useFirebaseQuery("page_content_about", async () => {
    const { data } = await firebase
      .from("page_content")
      .select("content")
      .eq("page_key", "about")
      .maybeSingle();
    return (data?.content as Record<string, unknown>) ?? {};
  });

  const { data: dbTeam } = useFirebaseQuery("team_members", async () => {
    const { data } = await firebase
      .from("team_members")
      .select("*")
      .eq("published", true)
      .order("sort_order");
    return data ?? [];
  });

  const page = dbPage && Object.keys(dbPage).length > 0 ? dbPage : ABOUT_DEFAULTS;
  const team = dbTeam && dbTeam.length > 0 ? dbTeam : DEFAULT_TEAM_MEMBERS;

  const title = (page?.title as string) ?? ABOUT_DEFAULTS.title;
  const intro = (page?.intro as string) ?? ABOUT_DEFAULTS.intro;
  const mission = (page?.mission as string) ?? ABOUT_DEFAULTS.mission;
  const values = (page?.values as string[]) ?? ABOUT_DEFAULTS.values;

  const operatingInRaw = page?.operating_in;
  const operatingIn = Array.isArray(operatingInRaw)
    ? (operatingInRaw as string[]).filter(Boolean).join(" and ")
    : typeof operatingInRaw === "string" && operatingInRaw.trim()
      ? operatingInRaw
      : "India and USA";

  return (
    <>
      <DynamicSeo
        pageKey="about"
        fallbackTitle="Who We Are"
        fallbackDescription="Our mission, values, and how we work with companies to build leadership teams."
      />
      <PageHero eyebrow="Our story" title={title} subtitle={intro} />

      {/* ============== MISSION & VISION CARDS ============== */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="bg-card border border-border p-8 md:p-10 relative overflow-hidden rounded-lg">
            <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 text-primary/5">
              <Target className="h-40 w-40" />
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Our Mission</p>
            <h3 className="mt-4 font-display text-2xl font-bold md:text-3xl leading-tight text-foreground">
              {mission || "To make global hiring frictionless, compliant, and human-centric."}
            </h3>
            <p className="mt-4 text-muted-foreground text-sm leading-relaxed">
              We believe that talent has no borders. Our mission is to dismantle the friction of
              international recruitment, allowing companies to scale rapidly while giving elite
              candidates global career pathways.
            </p>
          </div>

          <div className="bg-card border border-border p-8 md:p-10 relative overflow-hidden rounded-lg">
            <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 text-primary/5">
              <Compass className="h-40 w-40" />
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Our Vision</p>
            <h3 className="mt-4 font-display text-2xl font-bold md:text-3xl leading-tight text-foreground">
              To build the infrastructure for the future of global work.
            </h3>
            <p className="mt-4 text-muted-foreground text-sm leading-relaxed">
              We envision a future where high-performing organizations can assemble specialized
              teams in any market instantly, with fully unified compliance, high-fidelity candidate
              vetting, and zero administrative friction.
            </p>
          </div>
        </div>
      </section>

      {/* ============== CORE VALUES PILLARS ============== */}
      <section className="container mx-auto px-4 py-16 border-t border-border">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Our Values</p>
          <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
            The core principles guiding our practice.
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => {
            const parts = v.split(": ");
            const pillarTitle = parts[0];
            const pillarDesc = parts[1] || "";

            // Pick custom icons based on the value index
            const Icons = [Target, Globe, ShieldCheck, Award];
            const Icon = Icons[i % Icons.length];

            return (
              <div
                key={i}
                className="bg-card border border-border p-6 hover:border-primary transition duration-300 rounded-lg flex flex-col justify-between"
              >
                <div>
                  <div className="h-10 w-10 bg-primary/10 text-primary flex items-center justify-center rounded-sm">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h4 className="mt-6 font-display font-bold text-lg text-foreground">
                    {pillarTitle}
                  </h4>
                  <p className="mt-3 text-muted-foreground text-xs leading-relaxed">{pillarDesc}</p>
                </div>
                <span className="mt-6 text-[10px] font-bold text-muted-foreground/40 font-mono">
                  PILLAR 0{i + 1}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============== CHRONOLOGY / HISTORIC MILESTONES ============== */}
      <section className="bg-foreground text-background py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Chronology</p>
            <h2 className="mt-3 font-display text-3xl font-bold md:text-5xl text-background">
              A history of continuous growth.
            </h2>
            <p className="mt-4 text-background/60 text-sm">
              How we evolved from a regional boutique executive search firm in Delaware to a global
              workforce consultancy.
            </p>
          </div>

          <div className="mt-16 max-w-4xl mx-auto relative border-l border-background/20 pl-8 space-y-12">
            {[
              {
                year: "2008",
                title: "Founding & Executive Focus",
                desc: "Established in Wilmington, Delaware, providing specialized executive placement and board member sourcing for corporate clients in the Mid-Atlantic region.",
              },
              {
                year: "2014",
                title: "Global Infrastructure Expansion",
                desc: "Launched our offshore Delivery Operations center in Hyderabad, India, initiating overnight sourcing pipelines to drastically reduce search cycles.",
              },
              {
                year: "2019",
                title: "Embedded RPO Services launch",
                desc: "Introduced our signature embedded recruiter program, helping series-A/B high-growth startups scale their product engineering teams.",
              },
              {
                year: "2024",
                title: "Continuous 24/7 Operations model",
                desc: "Migrated to a continuous sourcing framework, combining automated matching algorithms with peer-level vetting across multi-country entities.",
              },
            ].map((milestone, idx) => (
              <div key={idx} className="relative group">
                {/* Timeline indicator dot */}
                <div className="absolute -left-[41px] top-1.5 h-6 w-6 rounded-full bg-foreground border border-background/20 group-hover:border-accent flex items-center justify-center transition duration-300">
                  <div className="h-2 w-2 rounded-full bg-accent" />
                </div>

                <div>
                  <span className="font-display text-xl font-bold text-accent">
                    {milestone.year}
                  </span>
                  <h4 className="mt-1 font-display text-lg font-bold text-background">
                    {milestone.title}
                  </h4>
                  <p className="mt-2 text-sm text-background/70 leading-relaxed max-w-2xl">
                    {milestone.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== LEADERSHIP TEAM GRID ============== */}
      <section className="container mx-auto px-4 py-20 md:py-28 border-t border-border">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Leadership</p>
          <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
            Meet our partners and directors.
          </h2>
          <p className="mt-4 text-muted-foreground text-sm">
            Our clients work directly with senior consultants who possess deep sector experience. No
            layered account management — just direct expertise.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 max-w-4xl mx-auto">
          {team?.map((m: any) => (
            <div
              key={m.id}
              className="bg-card border border-border p-6 rounded-lg flex flex-col md:flex-row gap-6 items-start md:items-center"
            >
              <div className="aspect-[4/5] w-32 shrink-0 overflow-hidden bg-surface rounded-md">
                {m.photo_url ? (
                  <img src={m.photo_url} alt={m.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center font-display text-3xl text-muted-foreground bg-primary/5">
                    {m.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-foreground">{m.name}</h3>
                <p className="text-sm font-semibold text-primary">{m.role_title}</p>
                {m.bio && (
                  <p className="mt-2 text-muted-foreground text-xs leading-relaxed">{m.bio}</p>
                )}
                <div className="mt-4 flex gap-3">
                  {m.email && (
                    <a
                      href={`mailto:${m.email}`}
                      className="text-muted-foreground hover:text-primary transition"
                    >
                      <Mail className="h-4 w-4" />
                    </a>
                  )}
                  {m.linkedin && (
                    <a
                      href={m.linkedin}
                      className="text-muted-foreground hover:text-primary transition"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============== KEY PERFORMANCE STATS ============== */}
      <section className="border-t border-border bg-surface">
        <div className="container mx-auto grid gap-8 px-4 py-16 sm:grid-cols-4">
          {[
            { k: "Founded", v: "2008" },
            { k: "Placements", v: "1,800+" },
            { k: "Operating in", v: operatingIn },
            { k: "Retention @ 18mo", v: "92%" },
          ].map((s) => (
            <div key={s.k}>
              <p className="font-display text-4xl font-bold">{s.v}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.k}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default WhoWeArePage;
