import { Link } from "react-router-dom";
import { useFirebaseQuery } from "@/hooks/use-firebase-query";
import * as Icons from "lucide-react";
import { firebase } from "@/integrations/firebase/client";
import { PageHero } from "@/components/page-hero";
import { DynamicSeo } from "@/components/dynamic-seo";

const DEFAULT_INDUSTRIES = [
  {
    id: "ind-1",
    label: "Technology & Software Engineering",
    slug: "technology-software",
    description: "AI, cloud infrastructure, enterprise software, and engineering roles.",
    icon: "Cpu",
  },
  {
    id: "ind-2",
    label: "Healthcare & Life Sciences",
    slug: "healthcare-lifesciences",
    description: "Medical devices, biotech, pharmaceuticals, and healthcare providers.",
    icon: "Heart",
  },
  {
    id: "ind-3",
    label: "Financial Services & FinTech",
    slug: "financial-services",
    description: "Quantitative trading, asset management, risk compliance, banking operations, and financial engineering.",
    icon: "Wallet",
  },
  {
    id: "ind-4",
    label: "Logistics & Supply Chain",
    slug: "logistics-supply-chain",
    description: "Global supply chains, logistics operations, warehouse management systems, and procurement.",
    icon: "Truck",
  },
  {
    id: "ind-5",
    label: "Retail & E-Commerce",
    slug: "retail-ecommerce",
    description: "Omnichannel retail, e-commerce platforms, and consumer goods distribution.",
    icon: "ShoppingBag",
  },
  {
    id: "ind-6",
    label: "Professional Services",
    slug: "professional-services",
    description: "Management consulting, corporate legal advisory, and business operations.",
    icon: "Building2",
  },
];

function IndustriesPage() {
  const { data: dbData } = useFirebaseQuery("industries", async () => {
    const { data } = await firebase
      .from("industries")
      .select("*")
      .eq("published", true)
      .order("sort_order");
    return (data ?? []).filter((i: any) => i && i.slug && i.published !== false);
  });

  const rawData = dbData ?? [];
  const mergedData = [...rawData];
  DEFAULT_INDUSTRIES.forEach((defInd) => {
    if (!mergedData.some((x: any) => x.slug === defInd.slug)) {
      mergedData.push(defInd);
    }
  });
  const displayedData = mergedData.slice(0, 5);

  const Lucide = Icons as unknown as Record<
    string,
    React.ComponentType<{ className?: string; strokeWidth?: number }>
  >;

  return (
    <main className="min-h-screen bg-background relative">
      <DynamicSeo
        pageKey="industries"
        fallbackTitle="Industries We Serve"
        fallbackDescription="Recruiting across tech, finance, healthcare, industrial, consumer, and professional services."
      />

      {/* Sub-header Bar (Breadcrumbs & CTA) */}
      <div className="bg-slate-900/90 dark:bg-slate-950 text-slate-300 py-3.5 px-6 md:px-12 flex justify-between items-center text-xs border-b border-slate-800">
        <div className="flex items-center gap-1.5 font-medium">
          <Link to="/" className="hover:text-white transition">
            Home
          </Link>
          <span className="text-slate-600">/</span>
          <span className="text-white font-semibold">Industries</span>
        </div>
        <Link
          to="/contact"
          className="bg-[#0070ad] hover:bg-[#005c8f] text-white font-bold px-4 py-2 transition text-[10px] uppercase tracking-wider inline-flex items-center gap-1.5"
        >
          Get in touch <Icons.ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Hero Banner Section */}
      <section className="relative w-full h-[280px] sm:h-[360px] md:h-[420px] overflow-hidden">
        {/* Generic High-Quality Industry/City Panoramic Image */}
        <img
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80"
          alt="Industries We Serve"
          className="h-full w-full object-cover"
          decoding="async"
        />
        {/* Subtle Dark Overlay */}
        <div className="absolute inset-0 bg-slate-950/20 pointer-events-none" />
        {/* Floating Corporate Blue Title Card */}
        <div className="absolute left-6 md:left-12 bottom-0 w-[240px] sm:w-[320px] md:w-[420px] h-[65%] sm:h-[75%] bg-[#0070ad]/95 text-white p-6 md:p-10 flex items-end justify-start shadow-2xl z-20 border-t border-r border-white/10">
          <h1 className="font-display text-2xl sm:text-3xl md:text-5xl font-black uppercase tracking-tight text-white leading-none">
            Industries
          </h1>
        </div>
      </section>

      {/* Content Section */}
      <section className="px-6 py-16 md:px-12 md:py-24 relative z-10">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[auto_1fr]">
          {/* Leftmost column - Social Sharing Icons (Desktop only) */}
          <div className="hidden lg:flex flex-col gap-4 pt-1 shrink-0">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-[#0077b5] hover:text-white hover:border-[#0077b5] transition-all duration-300 font-bold text-sm"
              aria-label="Share on LinkedIn"
            >
              in
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-[#1877f2] hover:text-white hover:border-[#1877f2] transition-all duration-300 font-bold text-sm"
              aria-label="Share on Facebook"
            >
              f
            </a>
          </div>

          {/* Rest of Page Content */}
          <div>
            {/* Header Text */}
            <div className="mb-16">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground leading-snug">
                Sector expertise that compounds. We don't generalize. Each practice is led by
                partners with decades inside the industry.
              </h2>
            </div>

            {/* Grid List */}
            <div className="grid gap-px bg-border dark:bg-slate-800 md:grid-cols-2 lg:grid-cols-3">
              {displayedData.map((ind: any) => {
                let iconKey = ind.icon || "";
                if (iconKey && iconKey.length > 0) {
                  iconKey = iconKey.charAt(0).toUpperCase() + iconKey.slice(1);
                }
                const Icon = Lucide[iconKey] || Icons.Building2;
                return (
                  <Link
                    key={ind.id || ind.slug}
                    to={`/industries/${ind.slug}`}
                    className="flex flex-col gap-3 bg-background p-8 hover:bg-surface/50 transition group"
                  >
                    <div className="flex h-11 w-11 items-center justify-center border border-border group-hover:border-primary transition">
                      <Icon
                        className="h-5 w-5 text-muted-foreground group-hover:text-primary transition"
                        strokeWidth={1.5}
                      />
                    </div>
                    <h3 className="font-display text-xl font-bold group-hover:text-primary transition text-foreground">
                      {ind.label}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{ind.description}</p>
                    <span className="mt-6 text-xs font-semibold text-[#0076CE] group-hover:text-[#005c8f] flex items-center gap-1 transition">
                      Explore Sector <Icons.ArrowRight className="h-3 w-3" />
                    </span>
                  </Link>
                );
              })}

              {/* 6th Card - Contact Us (hidden on mobile, visible on tablet and desktop) */}
              <div className="hidden md:flex flex-col justify-between bg-[#0076CE] p-8 text-white min-h-[300px] border border-transparent">
                <div className="flex flex-col gap-3">
                  <div className="flex h-11 w-11 items-center justify-center border border-white/20 bg-white/10">
                    <Icons.Mail className="h-5 w-5 text-[#FDB913]" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-display text-xl font-bold text-white leading-tight">
                    Need specialized talent for your sector?
                  </h3>
                  <p className="text-sm text-blue-100/90 leading-relaxed">
                    Virelix coordinates customized global sourcing pipelines for enterprises and high-growth firms. Contact us today to brief our industry specialists.
                  </p>
                </div>
                <Link
                  to="/contact"
                  className="inline-flex w-full items-center justify-center gap-2 bg-[#FDB913] hover:bg-[#E5A80F] text-black font-bold uppercase tracking-wider py-3.5 px-4 transition-all duration-200 text-xs shadow-sm rounded-none border-none"
                >
                  Contact Us <Icons.ArrowRight className="h-4 w-4 text-black" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default IndustriesPage;
