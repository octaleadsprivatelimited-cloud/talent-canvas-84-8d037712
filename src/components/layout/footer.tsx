import { Link } from "@tanstack/react-router";
import { Briefcase, Linkedin, Twitter, Instagram } from "lucide-react";
import { useSiteSettings } from "@/hooks/use-site-settings";

export function Footer() {
  const { data: site } = useSiteSettings();
  const brand = site?.brand_name ?? "Virelix Consulting";

  return (
    <footer className="border-t border-border bg-surface">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-2 font-display text-base font-bold">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-hero">
                <Briefcase className="h-3.5 w-3.5 text-primary-foreground" strokeWidth={2.5} />
              </div>
              {brand}
            </Link>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              {site?.footer_about ?? "A global recruiting agency placing senior talent across tech, finance, healthcare, and industrial sectors."}
            </p>
            <div className="mt-4 flex gap-3">
              {site?.social_linkedin && <a href={site.social_linkedin} className="text-muted-foreground hover:text-foreground" aria-label="LinkedIn"><Linkedin className="h-4 w-4" /></a>}
              {site?.social_twitter && <a href={site.social_twitter} className="text-muted-foreground hover:text-foreground" aria-label="Twitter"><Twitter className="h-4 w-4" /></a>}
              {site?.social_instagram && <a href={site.social_instagram} className="text-muted-foreground hover:text-foreground" aria-label="Instagram"><Instagram className="h-4 w-4" /></a>}
            </div>
          </div>
          <FooterCol title="Services" links={[
            { to: "/services", label: "All Services" },
            { to: "/services/executive-search", label: "Executive Search" },
            { to: "/services/contract-staffing", label: "Contract Staffing" },
            { to: "/services/rpo-embedded", label: "RPO & Embedded" },
          ]} />
          <FooterCol title="Company" links={[
            { to: "/about", label: "About" },
            { to: "/team", label: "Team" },
            { to: "/case-studies", label: "Case Studies" },
            { to: "/insights", label: "Insights" },
            { to: "/contact", label: "Contact" },
          ]} />
          <FooterCol title="Legal" links={[
            { to: "/privacy", label: "Privacy" },
            { to: "/terms", label: "Terms" },
          ]}>
            {site?.contact_email && <p className="mt-3 text-sm text-muted-foreground">{site.contact_email}</p>}
            {site?.contact_phone && <p className="text-sm text-muted-foreground">{site.contact_phone}</p>}
            {site?.address && <p className="text-sm text-muted-foreground">{site.address}</p>}
          </FooterCol>
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} {brand}. All rights reserved.</p>
          <p>Built with care for hiring teams worldwide.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links, children }: { title: string; links: { to: string; label: string }[]; children?: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-3 text-sm font-semibold">{title}</h4>
      <ul className="space-y-2">
        {links.map((l, i) => (
          <li key={i}>
            <Link to={l.to} className="text-sm text-muted-foreground hover:text-foreground">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
      {children}
    </div>
  );
}
