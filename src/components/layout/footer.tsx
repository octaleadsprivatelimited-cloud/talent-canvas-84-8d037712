import { Link } from "react-router-dom";
import { Briefcase, Linkedin, Twitter, Instagram, ChevronDown, Globe } from "lucide-react";
import { useState } from "react";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { cn } from "@/lib/utils";

export function Footer() {
  const { data: site } = useSiteSettings();
  const brand = site?.brand_name ?? "Virelix Consulting";

  return (
    <footer className="w-full bg-muted/10 border-t border-border text-foreground pt-12 pb-8">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid gap-8 text-left md:grid-cols-4 md:gap-10">
          <div className="flex flex-col items-start text-left">
            <Link to="/" className="flex items-center gap-2 font-display text-base font-bold text-foreground">
              <div className="flex h-7 w-7 items-center justify-center rounded-none bg-primary text-primary-foreground">
                <Briefcase className="h-3.5 w-3.5" strokeWidth={2.5} />
              </div>
              <span>{brand}</span>
            </Link>
            <p className="mt-4 max-w-xs text-xs text-muted-foreground leading-relaxed">
              {site?.footer_about ??
                "A global recruiting agency placing senior talent across tech, finance, healthcare, and industrial sectors."}
            </p>
            <div className="mt-4 flex gap-4">
              {site?.social_linkedin && (
                <a
                  href={site.social_linkedin}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              )}
              {site?.social_twitter && (
                <a
                  href={site.social_twitter}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="h-4 w-4" />
                </a>
              )}
              {site?.social_instagram && (
                <a
                  href={site.social_instagram}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
          <FooterCol
            title="What We Do"
            links={[
              { to: "/services", label: "All Services" },
              { to: "/services/executive-search", label: "Executive Search" },
              { to: "/services/it-recruitment", label: "IT & Tech Recruitment" },
              { to: "/services/rpo-workforce-solutions", label: "RPO & Workforce Solutions" },
              { to: "/services/consulting-training", label: "Consulting & Training" },
            ]}
          />
          <FooterCol
            title="Company"
            links={[
              { to: "/who-we-are", label: "Who We Are" },
              { to: "/team", label: "Team" },
              { to: "/case-studies", label: "Case Studies" },
              { to: "/insights", label: "Insights" },
              { to: "/contact", label: "Contact" },
            ]}
          />
          <FooterCol
            title="Legal"
            links={[
              { to: "/privacy", label: "Privacy" },
              { to: "/terms", label: "Terms" },
            ]}
          >
            {site?.contact_email && (
              <p className="mt-3 text-xs text-muted-foreground">{site.contact_email}</p>
            )}
            {site?.contact_phone && (
              <p className="text-xs text-muted-foreground">{site.contact_phone}</p>
            )}
            {site?.address && <p className="text-xs text-muted-foreground leading-relaxed">{site.address}</p>}
          </FooterCol>
        </div>

        <div className="mt-12 pt-6 border-t border-border/80 flex flex-col md:flex-row md:items-center md:justify-between gap-6 text-[11px] text-muted-foreground">
          {/* Left Location Selector */}
          <div className="flex items-center gap-2 hover:text-foreground cursor-pointer transition-colors self-start">
            <Globe className="h-3.5 w-3.5" />
            <span>English (United States)</span>
          </div>
          
          {/* Right horizontal list */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span>© {brand} {new Date().getFullYear()}</span>
            <Link to="/contact" className="hover:underline">Contact Us</Link>
            <Link to="/privacy" className="hover:underline">Privacy</Link>
            <Link to="/terms" className="hover:underline">Terms of Use</Link>
            <a
              href="https://www.octaleads.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Developed by Octaleads Pvt Ltd
            </a>
            <span className="hidden sm:inline">Built for hiring teams worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
  children,
}: {
  title: string;
  links: { to: string; label: string }[];
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col border-b border-border/40 md:border-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-3 text-left md:hidden"
      >
        <h4 className="text-sm font-semibold">{title}</h4>
        <ChevronDown
          className={cn("h-4 w-4 transition-transform duration-300", open && "rotate-180")}
        />
      </button>
      <h4 className="mb-4 hidden text-sm font-semibold text-foreground md:block">{title}</h4>
      <div
        className={cn(
          "grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out md:grid-rows-[1fr] md:overflow-visible",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="min-h-0">
          <ul className="space-y-2.5 pb-3 md:pb-0">
            {links.map((l, i) => (
              <li key={i}>
                <Link
                  to={l.to}
                  className="inline-block text-xs text-muted-foreground hover:underline hover:text-foreground py-0.5"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          {children}
        </div>
      </div>
    </div>
  );
}
