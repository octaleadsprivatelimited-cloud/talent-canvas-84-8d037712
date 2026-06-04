import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { 
  ArrowRight, 
  ArrowLeft, 
  Building2, 
  FolderClosed, 
  ShieldCheck, 
  CheckCircle2, 
  Cpu, 
  Heart, 
  Wallet, 
  Truck 
} from "lucide-react";
import { supabase } from "@/integrations/firebase/client";
import { Button } from "@/components/ui/button";
import { DynamicSeo } from "@/components/dynamic-seo";

export const Route = createFileRoute("/industries_/")({
  head: () => ({
    meta: [
      { title: "Industries We Serve" },
      {
        name: "description",
        content:
          "Recruiting across tech, finance, healthcare, industrial, consumer, and professional services.",
      },
    ],
  }),
  component: IndustriesPage,
});

function IndustriesPage() {
  const [activeCategory, setActiveCategory] = useState<"ALL" | "TECH" | "FINANCE" | "HEALTH">("ALL");

  const { data } = useQuery({
    queryKey: ["industries"],
    queryFn: async () => {
      const { data } = await supabase
        .from("industries")
        .select("*")
        .eq("published", true)
        .order("sort_order");
      return data ?? [];
    },
  });

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "cpu": return Cpu;
      case "heart": return Heart;
      case "wallet": return Wallet;
      case "truck": return Truck;
      default: return Building2;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F3EF] pb-24">
      <DynamicSeo
        pageKey="industries"
        fallbackTitle="Industries We Serve"
        fallbackDescription="Recruiting across tech, finance, healthcare, industrial, consumer, and professional services."
      />

      {/* Premium Header Layout */}
      <header className="container mx-auto px-4 pt-16 pb-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-2xl">
            <h1 className="font-display text-4xl font-extrabold tracking-tight text-[#2E1310] md:text-5xl lg:text-[3.5rem] leading-[1.1]">
              Start simple.
              <br />
              Scale when you're ready
            </h1>
            <p className="mt-4 text-[#605553] text-lg">
              From a single practice to a complete global workflow, at your own pace.
            </p>
          </div>
          <div>
            <Button
              asChild
              className="rounded-full bg-[#0D0C0A] text-white hover:bg-zinc-800 px-6 py-5 text-sm font-semibold inline-flex items-center gap-2"
            >
              <Link to="/contact">
                Start creating <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Bento Grid Layout Section */}
      <section className="container mx-auto px-4 py-4">
        <div className="grid gap-6 md:grid-cols-3 md:grid-rows-[auto_auto]">
          
          {/* Box 1 (Left - Tall): Interactive Sector Selector */}
          <div className="md:row-span-2 bg-[#E4E1DA] rounded-3xl p-8 flex flex-col justify-between border border-[#D5D2C9]/60 shadow-sm min-h-[600px]">
            <div className="space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#605553]">
                Practice Areas
              </span>
              <h2 className="font-display text-3xl font-extrabold tracking-tight text-[#2E1310]">
                Every sector, ready to scale
              </h2>
              <p className="text-sm text-[#605553] leading-relaxed">
                Every sector, ready to scale. Select a category below to explore our targeted recruitment pipelines and talent networks.
              </p>

              {/* Tabs Switcher */}
              <div className="flex flex-wrap gap-2 pt-2">
                {[
                  { key: "ALL", label: "ALL" },
                  { key: "TECH", label: "TECH" },
                  { key: "FINANCE", label: "FINANCE" },
                  { key: "HEALTH", label: "HEALTH" },
                ].map((tab) => {
                  const isActive = activeCategory === tab.key;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveCategory(tab.key as any)}
                      className={`px-4 py-2 rounded-full text-[10px] font-extrabold uppercase tracking-widest transition-all duration-300 ${
                        isActive
                          ? "bg-[#0D0C0A] text-white shadow-sm"
                          : "bg-[#D5D2C9]/60 text-[#605553] hover:bg-[#D5D2C9]"
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Inner Sector Cards Grid */}
            <div className="mt-8 bg-[#EAE8E3]/60 border border-[#D5D2C9]/50 rounded-2xl p-4 flex-1 flex flex-col justify-center">
              <div className="grid gap-3 grid-cols-2">
                
                {/* Tech Card */}
                {(activeCategory === "ALL" || activeCategory === "TECH") && (
                  <Link
                    to="/industries/$slug"
                    params={{ slug: data?.find((i: any) => i.slug.includes("tech"))?.slug || "technology-software" }}
                    className="relative aspect-square rounded-xl overflow-hidden group shadow-sm bg-zinc-800"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=400&h=300&q=80"
                      alt="Technology"
                      className="h-full w-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5">
                      <span className="inline-block text-[8px] font-bold tracking-widest bg-white/10 text-white backdrop-blur-md px-2 py-1 rounded uppercase">
                        Tech
                      </span>
                    </div>
                  </Link>
                )}

                {/* Finance Card */}
                {(activeCategory === "ALL" || activeCategory === "FINANCE") && (
                  <Link
                    to="/industries/$slug"
                    params={{ slug: data?.find((i: any) => i.slug.includes("finan"))?.slug || "financial-services" }}
                    className="relative aspect-square rounded-xl overflow-hidden group shadow-sm bg-zinc-800"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=400&h=300&q=80"
                      alt="Finance"
                      className="h-full w-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5">
                      <span className="inline-block text-[8px] font-bold tracking-widest bg-white/10 text-white backdrop-blur-md px-2 py-1 rounded uppercase">
                        Finance
                      </span>
                    </div>
                  </Link>
                )}

                {/* Health Card */}
                {(activeCategory === "ALL" || activeCategory === "HEALTH") && (
                  <Link
                    to="/industries/$slug"
                    params={{ slug: data?.find((i: any) => i.slug.includes("health"))?.slug || "healthcare-lifesciences" }}
                    className="relative aspect-square rounded-xl overflow-hidden group shadow-sm bg-zinc-800"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=400&h=300&q=80"
                      alt="Healthcare"
                      className="h-full w-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5">
                      <span className="inline-block text-[8px] font-bold tracking-widest bg-white/10 text-white backdrop-blur-md px-2 py-1 rounded uppercase">
                        Health
                      </span>
                    </div>
                  </Link>
                )}

                {/* Logistics Card (only in ALL mode) */}
                {activeCategory === "ALL" && (
                  <Link
                    to="/industries/$slug"
                    params={{ slug: data?.find((i: any) => i.slug.includes("logis"))?.slug || "logistics-supply-chain" }}
                    className="relative aspect-square rounded-xl overflow-hidden group shadow-sm bg-zinc-800"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=400&h=300&q=80"
                      alt="Logistics"
                      className="h-full w-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5">
                      <span className="inline-block text-[8px] font-bold tracking-widest bg-white/10 text-white backdrop-blur-md px-2 py-1 rounded uppercase">
                        Logistics
                      </span>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Box 2 (Top-Right - Wide): Platform Canvas */}
          <div className="md:col-span-2 bg-[#0C0B09] text-white rounded-3xl p-8 md:p-10 relative overflow-hidden flex flex-col justify-between border border-zinc-800/80 shadow-sm min-h-[300px]">
            <div className="grid md:grid-cols-12 gap-8 items-center h-full">
              <div className="md:col-span-6 space-y-4">
                <span className="inline-block text-[9px] font-bold uppercase tracking-[0.25em] bg-accent/15 text-accent px-3 py-1 rounded-full border border-accent/20">
                  Global Talent Canvas
                </span>
                <h3 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight leading-tight">
                  Your entire creative process on one node-based canvas
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  All your tools. All your workflows. One infinite, node-based canvas. Branch ideas, compare versions, work with your team, all in Spaces.
                </p>
                <div className="pt-2">
                  <Link
                    to="/industries/$slug"
                    params={{ slug: data?.find((i: any) => i.slug.includes("tech"))?.slug || "technology-software" }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:underline"
                  >
                    Explore Sector Solutions <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              {/* Node-based canvas visual representation */}
              <div className="md:col-span-6 relative h-48 md:h-full bg-zinc-950/40 rounded-2xl border border-zinc-900 overflow-hidden p-4 flex items-center justify-center">
                <div className="absolute inset-0 [background-image:radial-gradient(#1f1f1f_1px,transparent_1px)] [background-size:16px_16px] opacity-60" />
                
                {/* SVG connection lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 40,80 Q 120,40 180,80 T 320,120" fill="none" stroke="hsl(var(--accent))" strokeWidth="2" strokeDasharray="4 4" className="opacity-45" />
                  <path d="M 40,80 Q 120,140 220,100" fill="none" stroke="#2563eb" strokeWidth="2" />
                </svg>

                {/* Node 1: Candidate Profile Card */}
                <div className="absolute left-4 top-8 bg-zinc-900/95 border border-zinc-800 rounded-xl p-3 w-36 shadow-lg text-[9px] space-y-1.5 backdrop-blur-sm z-10">
                  <div className="flex items-center gap-1.5">
                    <img 
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80" 
                      alt="Sarah" 
                      className="h-5 w-5 rounded-full object-cover"
                    />
                    <div className="min-w-0">
                      <div className="font-semibold text-white truncate">Sarah Jenkins</div>
                      <div className="text-[7px] text-zinc-500 truncate">Lead ML Architect</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-[7px]">
                    <span className="text-[#FF007F] font-bold uppercase tracking-widest bg-[#FF007F]/10 px-1 rounded">98% Fit</span>
                    <span className="text-zinc-400 font-semibold">Shortlisted</span>
                  </div>
                </div>

                {/* Node 2: Offer Slotted Card */}
                <div className="absolute right-6 bottom-8 bg-zinc-900/95 border border-zinc-800 rounded-xl p-3 w-32 shadow-lg text-[9px] space-y-1 backdrop-blur-sm z-10 text-center">
                  <div className="text-[8px] text-accent font-bold uppercase tracking-wider">Interview Panel</div>
                  <div className="text-white font-semibold">Today 14:00 EST</div>
                  <div className="inline-block text-[7px] text-emerald-400 font-bold bg-emerald-950/40 border border-emerald-800/30 px-1.5 py-0.5 rounded-full mt-1">
                    Confirmed
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Box 3 (Bottom-Middle - Tall): Collaboration Folders */}
          <div className="bg-[#340E0C] text-[#F5E6E3] rounded-3xl p-8 relative overflow-hidden flex flex-col justify-between border border-[#4A1714] shadow-sm min-h-[320px]">
            <div className="space-y-3 z-10">
              <span className="inline-block text-[9px] font-bold uppercase tracking-[0.2em] text-[#FF9E9E]">
                Team Collaboration
              </span>
              <h3 className="font-display text-2xl font-extrabold tracking-tight leading-tight">
                One place, whole team
              </h3>
              <p className="text-xs text-[#CBB3B0] leading-relaxed">
                Organize brand assets, generated content, and workflows with Projects. Your team works together, your work stays compliant.
              </p>
            </div>

            {/* Floating Folders Graphic */}
            <div className="relative h-28 mt-4 overflow-hidden z-10">
              {/* Folder 1 */}
              <div className="absolute left-0 bottom-0 bg-white/5 border border-white/10 rounded-xl p-3 w-36 text-[9px] text-white shadow-lg space-y-2 backdrop-blur-sm hover:translate-y-[-4px] transition-transform duration-300">
                <div className="flex justify-between items-start">
                  <div className="font-semibold text-white">Talent Pools</div>
                  <FolderClosed className="h-3 w-3 text-red-300" />
                </div>
                <div className="flex gap-1">
                  <div className="h-6 w-6 rounded-md bg-zinc-800 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=40&h=40&q=80" alt="" className="object-cover h-full w-full" />
                  </div>
                  <div className="h-6 w-6 rounded-md bg-zinc-800 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=40&h=40&q=80" alt="" className="object-cover h-full w-full" />
                  </div>
                  <div className="h-6 w-6 rounded-md bg-zinc-800 overflow-hidden flex items-center justify-center text-[7px] font-bold bg-[#4A1714]">
                    +42
                  </div>
                </div>
              </div>

              {/* Folder 2 */}
              <div className="absolute right-4 bottom-2 bg-white/10 border border-white/20 rounded-xl p-3 w-36 text-[9px] text-white shadow-xl space-y-2 backdrop-blur-sm translate-x-4 hover:translate-y-[-4px] transition-transform duration-300">
                <div className="flex justify-between items-start">
                  <div className="font-semibold text-white">Compliance</div>
                  <ShieldCheck className="h-3 w-3 text-emerald-300" />
                </div>
                <div className="text-[8px] text-emerald-300 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-2.5 w-2.5" /> 100% E-Verified
                </div>
              </div>
            </div>
          </div>

          {/* Box 4 (Bottom-Right - Tall): Sourcing Workflow App */}
          <div className="bg-[#0C4A60] text-white rounded-3xl p-8 relative overflow-hidden flex flex-col justify-between border border-[#145C75] shadow-sm min-h-[320px] group">
            {/* Background Image with elegant overlay */}
            <div className="absolute inset-0 z-0 pointer-events-none">
              <img
                src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80"
                alt="recruitment"
                className="h-full w-full object-cover mix-blend-luminosity opacity-40 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C4A60] via-[#0C4A60]/85 to-transparent" />
            </div>

            <div className="space-y-3 z-10">
              <span className="inline-block text-[9px] font-bold uppercase tracking-[0.2em] text-cyan-300">
                Automated Workflows
              </span>
              <h3 className="font-display text-2xl font-extrabold tracking-tight leading-tight">
                Workflow in one click
              </h3>
              <p className="text-xs text-cyan-100/80 leading-relaxed">
                Save any complex on-brand workflow as an App. The next person runs it in one click.
              </p>
            </div>

            <div className="z-10 pt-4">
              <Link
                to="/contact"
                className="relative inline-flex w-full items-center justify-center border-[3px] border-[#FF007F] hover:bg-[#FF007F]/10 transition-colors text-white font-extrabold text-xs uppercase tracking-[0.25em] py-4 px-6 rounded-2xl shadow-[0_0_15px_rgba(255,0,127,0.25)]"
              >
                RUN APP
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Secondary Section: Complete Dynamic Sector Index */}
      <section className="container mx-auto px-4 mt-16">
        <div className="border-t border-[#D5D2C9]/60 pt-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <h2 className="font-display text-2xl font-bold text-[#2E1310]">
                All Sectors We Support
              </h2>
              <p className="text-sm text-[#605553] mt-1">
                Browse our comprehensive index of active hiring practices and recruitment solutions.
              </p>
            </div>
            <div className="text-[#605553] text-xs font-semibold">
              Showing {data?.length || 0} active practices
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data?.map((ind: any) => {
              const Icon = getIcon(ind.icon);
              return (
                <Link
                  key={ind.id}
                  to="/industries/$slug"
                  params={{ slug: ind.slug }}
                  className="flex items-center gap-4 bg-white/70 hover:bg-white border border-[#D5D2C9]/40 hover:border-[#D5D2C9] rounded-2xl p-5 transition shadow-sm group"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#E5E2DA] rounded-xl text-[#2E1310] group-hover:bg-[#2E1310] group-hover:text-white transition">
                    <Icon className="h-5 w-5" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#2E1310] truncate text-sm">
                      {ind.label}
                    </h3>
                    <p className="text-xs text-[#605553] truncate mt-0.5">
                      {ind.description}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[#605553]/50 group-hover:text-[#2E1310] group-hover:translate-x-0.5 transition shrink-0" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
