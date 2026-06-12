import React, { useState } from "react";
import { 
  Search, Phone, MapPin, Calendar, ArrowRight, Clock, Heart, Shield, Star, 
  User, Plus, Minus, Info, Users, Activity, FileText, ChevronDown, ChevronUp, 
  Share2, Award, Mail, ExternalLink, ShieldAlert, Target, Compass, Globe
} from "lucide-react";
import { useFirebaseQuery } from "@/hooks/use-firebase-query";
import { firebase } from "@/integrations/firebase/client";
import { DynamicSeo } from "@/components/dynamic-seo";

const ABOUT_DEFAULTS = {
  title: "A global force in workforce consulting",
  intro:
    "Virelix Consulting was founded to bridge the gap between global enterprises and tier-one professional talent. Through a continuous USA-India delivery pipeline, we provide scale, speed, and exceptional execution across every engagement.",
  mission:
    "To make global hiring frictionless, compliant, and human-centric — empowering organizations to scale high-performing teams without borders.",
  values: [
    "Authentic Vetting: We screen candidates peer-to-peer, ensuring technical and cultural alignment before presentation.",
    "Global-Local Delivery: Sourcing operations in Wilmington, Delaware and Hyderabad, India driving round-the-clock efficiency.",
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
    experience: "15+ Yrs Exp"
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
    experience: "10+ Yrs Exp"
  },
];

const VIR_FAQS = [
  {
    question: "How long does it take to present the first vetted candidate?",
    answer: "For standard roles, our global USA-India pipeline allows us to present fully-vetted, peer-screened candidates within 3 to 5 business days from kickoff."
  },
  {
    question: "Do you handle international payroll and visa compliance?",
    answer: "Yes, we handle all international payroll, independent contractor compliance, classification checks, local labor laws, and Employer of Record (EOR) services."
  },
  {
    question: "What industries and technical stacks do you specialize in?",
    answer: "We specialize in high-tech recruiting across AI/ML, Cloud Infrastructure, FinTech, DevOps, Cyber Security, and Executive Management positions."
  },
  {
    question: "How does the Embedded RPO model differ from contingent search?",
    answer: "Embedded RPO provides dedicated recruiters who work under your brand, integrate into your internal tools/Slack, and optimize your overall cost-per-hire. Contingent search is fee-on-placement."
  }
];

function WhoWeArePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  


  // Firebase queries
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

  const { data: site } = useFirebaseQuery("site_settings", async () => {
    const { data } = await firebase.from("site_settings").select("*").maybeSingle();
    return data;
  });

  const page = dbPage && Object.keys(dbPage).length > 0 ? dbPage : ABOUT_DEFAULTS;
  const rawTeam = dbTeam && dbTeam.length > 0 ? dbTeam : DEFAULT_TEAM_MEMBERS;
  
  const team = rawTeam.map((m: any) => ({
    id: m.id,
    name: m.name,
    role: m.role_title,
    bio: m.bio || "Senior talent advisor specializing in strategic hiring.",
    photo: m.photo_url || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&h=500&q=80",
    experience: m.experience || "10+ Yrs Exp",
    email: m.email,
    linkedin: m.linkedin
  }));

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
        fallbackTitle="Who We Are | Virelix Consulting"
        fallbackDescription="Our mission, values, and how we work with companies to build high-performing teams."
      />

      {/* ================= EDITORIAL HERO SECTION ================= */}
      <section className="bg-[#fcfbfa] pt-20 pb-16 border-b border-slate-200/60">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-12 items-center">
            {/* Left Description Column */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-[#c2593f] text-xs font-bold uppercase tracking-[0.2em]">Our Story</span>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#2b2b2b] leading-[1.15] tracking-tight">
                {title}
              </h1>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base max-w-2xl font-light">
                {intro}
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <a 
                  href="/contact"
                  className="px-6 py-3 rounded bg-[#c2593f] hover:bg-[#a64831] text-white text-xs font-bold tracking-wider uppercase shadow-md transition duration-200"
                >
                  Contact Us
                </a>
                <a 
                  href="#location-section"
                  className="px-6 py-3 border border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-bold tracking-wider uppercase transition duration-200"
                >
                  Our Offices
                </a>
              </div>
            </div>

            {/* Right Hero Visual Column */}
            <div className="lg:col-span-5 h-[350px] md:h-[450px] rounded-lg overflow-hidden shadow-lg border border-slate-100">
              <img 
                src="/our_story_illustration.png"
                alt="Virelix Workforce Consulting Sourcing Illustration"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= OVERLAPPING WORK TOGETHER SECTION (AS REQUESTED BY USER) ================= */}
      <section className="bg-[#f9f8f6] py-24 overflow-hidden border-b border-slate-200/60">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header row offset to the right */}
          <div className="flex justify-end mb-12">
            <div className="w-full lg:w-2/3 text-left">
              <h2 className="font-serif text-3xl md:text-5xl text-[#2b2b2b] tracking-tight">
                Here&apos;s how we can work together
              </h2>
            </div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Tall Portrait Image on Left */}
              <div className="lg:col-span-4 rounded-lg overflow-hidden shadow-lg h-[520px]">
                <img 
                  src="/illustration_men.png" 
                  alt="Workforce Collaboration Sourcing Illustration" 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Three Overlapping White Cards */}
              <div className="lg:col-span-8 lg:-ml-24 lg:mt-16 z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Card 1 */}
                <div className="bg-white p-0 rounded-lg shadow-md border border-slate-100 flex flex-col justify-between min-h-[380px] hover:translate-y-[-4px] transition duration-300 overflow-hidden">
                  <div className="aspect-[16/10] w-full overflow-hidden bg-slate-100">
                    <img 
                      src="https://images.unsplash.com/photo-1551836022-deb4988cc6c0?auto=format&fit=crop&w=400&h=250&q=80" 
                      alt="Work with our advisors"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6 flex flex-col justify-between flex-grow">
                    <div className="space-y-3">
                      <h3 className="font-serif text-base font-bold text-[#2b2b2b]">Work with our advisors</h3>
                      <p className="text-[11px] text-slate-500 leading-relaxed font-light">
                        When you work with our consultants, you get a personalized recruitment strategy and talent portfolio built around your unique hiring goals - backed by Virelix&apos;s peer-level screening expertise.
                      </p>
                    </div>
                    <a href="/contact" className="text-xs font-bold text-[#c2593f] hover:text-[#a64831] inline-flex items-center gap-1.5 pt-4 group">
                      Learn More 
                      <span className="group-hover:translate-x-1 transition-transform">&gt;</span>
                    </a>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="bg-white p-0 rounded-lg shadow-md border border-slate-100 flex flex-col justify-between min-h-[380px] hover:translate-y-[-4px] transition duration-300 overflow-hidden">
                  <div className="aspect-[16/10] w-full overflow-hidden bg-slate-100">
                    <img 
                      src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=400&h=250&q=80" 
                      alt="Scale with Embedded RPO"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6 flex flex-col justify-between flex-grow">
                    <div className="space-y-3">
                      <h3 className="font-serif text-base font-bold text-[#2b2b2b]">Scale with Embedded RPO</h3>
                      <p className="text-[11px] text-slate-500 leading-relaxed font-light">
                        An Embedded RPO recruitment model, which could complement your core HR division, offers dedicated sourcing agents, integrated ATS flows, and round-the-clock pipelines to scale rapidly.
                      </p>
                    </div>
                    <a href="/contact" className="text-xs font-bold text-[#c2593f] hover:text-[#a64831] inline-flex items-center gap-1.5 pt-4 group">
                      Learn More 
                      <span className="group-hover:translate-x-1 transition-transform">&gt;</span>
                    </a>
                  </div>
                </div>

                {/* Card 3 */}
                <div className="bg-white p-0 rounded-lg shadow-md border border-slate-100 flex flex-col justify-between min-h-[380px] hover:translate-y-[-4px] transition duration-300 overflow-hidden">
                  <div className="aspect-[16/10] w-full overflow-hidden bg-slate-100">
                    <img 
                      src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=400&h=250&q=80" 
                      alt="Expertise for compliance"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6 flex flex-col justify-between flex-grow">
                    <div className="space-y-3">
                      <h3 className="font-serif text-base font-bold text-[#2b2b2b]">Expertise for compliance</h3>
                      <p className="text-[11px] text-slate-500 leading-relaxed font-light">
                        Our international payroll and labor classification experts leverage experience and firm resources to deliver comprehensive strategies across international employment, taxation, and visa audits.
                      </p>
                    </div>
                    <a href="/contact" className="text-xs font-bold text-[#c2593f] hover:text-[#a64831] inline-flex items-center gap-1.5 pt-4 group">
                      Learn More 
                      <span className="group-hover:translate-x-1 transition-transform">&gt;</span>
                    </a>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= MISSION & VALUES SECTION ================= */}
      <section className="bg-white py-24 border-b border-slate-200/60">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-12 items-start">
            
            {/* Mission Left Card */}
            <div className="lg:col-span-5 bg-[#fcfbfa] border border-slate-200/60 p-10 rounded-lg space-y-6">
              <span className="text-[#c2593f] text-xs font-bold uppercase tracking-wider">Our Mission</span>
              <h3 className="font-serif text-2xl md:text-3xl text-[#2b2b2b] leading-snug">
                {mission}
              </h3>
              <p className="text-slate-500 text-xs leading-relaxed font-light">
                We believe that premium engineering talent has no geographic borders. Our mission is to dismantle administration hurdles, enabling companies to grow instantly.
              </p>
            </div>

            {/* Core Values Right List */}
            <div className="lg:col-span-7 space-y-8">
              <div>
                <span className="text-[#c2593f] text-xs font-bold uppercase tracking-wider">Core Pillars</span>
                <h3 className="font-serif text-2xl md:text-3xl text-[#2b2b2b] mt-2">
                  The principles guiding our practice
                </h3>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {values.map((v, i) => {
                  const parts = v.split(": ");
                  const pillarTitle = parts[0];
                  const pillarDesc = parts[1] || "";
                  return (
                    <div key={i} className="border-t border-slate-200 pt-4 space-y-2">
                      <span className="text-[#c2593f] font-serif text-xl font-bold">0{i + 1}</span>
                      <h4 className="font-bold text-slate-800 text-sm">{pillarTitle}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed font-light">
                        {pillarDesc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= TEAM GRID SECTION ================= */}
      <section className="bg-[#fcfbfa] py-24 border-b border-slate-200/60">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-12">
            <span className="text-[#c2593f] text-xs font-bold uppercase tracking-wider">Leadership</span>
            <h2 className="font-serif text-3xl md:text-4xl text-[#2b2b2b] mt-2">
              Meet our consultants &amp; partners
            </h2>
            <p className="text-slate-500 text-xs mt-2 max-w-xl font-light">
              We connect organizations with seasoned advisors who manage operations end-to-end.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 max-w-4xl">
            {team.map(m => (
              <div 
                key={m.id}
                className="bg-white border border-slate-200/80 rounded-lg overflow-hidden shadow-sm flex flex-col sm:flex-row hover:shadow-md transition duration-200"
              >
                {/* Photo */}
                <div className="aspect-[4/5] w-full sm:w-44 bg-slate-100 shrink-0">
                  <img 
                    src={m.photo} 
                    alt={m.name} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                
                {/* Info */}
                <div className="p-6 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#c2593f] bg-orange-50 px-2 py-0.5 rounded">
                      {m.experience}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-[#2b2b2b]">{m.name}</h3>
                    <p className="text-xs font-medium text-slate-500">{m.role}</p>
                    <p className="text-xs text-slate-400 leading-relaxed font-light pt-1">{m.bio}</p>
                  </div>
                  
                  <div className="flex gap-3 pt-4 border-t border-slate-100 mt-4">
                    {m.email && (
                      <a href={`mailto:${m.email}`} className="text-slate-400 hover:text-[#c2593f] transition">
                        <Mail className="h-4 w-4" />
                      </a>
                    )}
                    {m.linkedin && (
                      <a href={m.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-[#c2593f] transition text-xs font-bold inline-flex items-center gap-1">
                        <Share2 className="h-3.5 w-3.5" />
                        LinkedIn
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* ================= OFFICES & MAP SECTION ================= */}
      <section id="location-section" className="bg-white py-24 border-b border-slate-200/60">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <span className="text-[#c2593f] text-xs font-bold uppercase tracking-wider">Office Network</span>
            <h2 className="font-serif text-3xl md:text-4xl text-[#2b2b2b] mt-2">
              Our office locations
            </h2>
          </div>

          <div className="grid gap-8 lg:grid-cols-12 items-stretch">
            {/* Embedded Google Map */}
            <div className="lg:col-span-7 h-[380px] rounded-lg overflow-hidden shadow-inner border border-slate-200">
              <iframe 
                style={{ border: 0, width: "100%", height: "100%" }} 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.4842512808465!2d78.37346129999999!3d17.4365851!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb93e2b2f293b7%3A0xc3b83f0684cf05c6!2sFinancial%20District%2C%20Hyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1775040307452!5m2!1sen!2sin" 
                allowFullScreen={true}
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            {/* Address Details Card */}
            <div className="lg:col-span-5 bg-[#fcfbfa] border border-slate-200 p-8 rounded-lg flex flex-col justify-between">
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="font-serif text-xl font-bold text-[#2b2b2b]">Virelix Consulting Group</h3>
                  <p className="text-slate-500 text-xs leading-relaxed font-light whitespace-pre-line">
                    {site?.address || "Wilmington HQ: 1201 North Orange St, Wilmington, Delaware, USA\nHyderabad Ops: Financial District, Gachibowli, Hyderabad, Telangana, 500032"}
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <h4 className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Contact Info</h4>
                  
                  <div className="flex items-center gap-3">
                    <Phone className="h-4.5 w-4.5 text-[#c2593f] shrink-0" />
                    <a href={`tel:${site?.contact_phone || "04024342202"}`} className="text-xs font-bold text-[#2b2b2b] hover:text-[#c2593f] transition">
                      {site?.contact_phone || "+1 (302) 555-0199"}
                    </a>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="h-4.5 w-4.5 text-[#c2593f] shrink-0" />
                    <a href={`mailto:${site?.contact_email || "hello@virelixconsulting.com"}`} className="text-xs font-bold text-[#2b2b2b] hover:text-[#c2593f] transition">
                      {site?.contact_email || "hello@virelixconsulting.com"}
                    </a>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <a 
                  href="https://maps.google.com/?q=Financial+District+Gachibowli+Hyderabad" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-full py-3 bg-[#c2593f] hover:bg-[#a64831] text-white text-xs font-bold tracking-wider uppercase rounded text-center transition duration-200 flex items-center justify-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Get Directions
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FAQ SECTION ================= */}
      <section className="bg-[#f9f8f6] py-24 border-b border-slate-200/60">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center space-y-2 mb-16">
            <span className="text-[#c2593f] text-xs font-bold uppercase tracking-wider">Advisory Support</span>
            <h2 className="font-serif text-3xl md:text-4xl text-[#2b2b2b]">
              Frequently asked questions
            </h2>
          </div>

          <div className="space-y-4">
            {VIR_FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx} 
                  className="bg-white border border-slate-200/80 rounded-lg overflow-hidden shadow-sm transition"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left font-serif font-bold text-sm md:text-base text-[#2b2b2b] flex items-center justify-between gap-4 focus:outline-none"
                  >
                    <span className="flex items-start gap-3">
                      <span className="text-xs text-[#c2593f] font-mono mt-0.5">0{idx + 1}</span>
                      <span>{faq.question}</span>
                    </span>
                    {isOpen ? <Minus className="h-4 w-4 shrink-0 text-[#c2593f]" /> : <Plus className="h-4 w-4 shrink-0 text-slate-400" />}
                  </button>
                  {isOpen && (
                    <div className="p-5 pt-0 border-t border-slate-100 text-slate-500 text-xs md:text-sm leading-relaxed font-light">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>


    </>
  );
}

export default WhoWeArePage;
