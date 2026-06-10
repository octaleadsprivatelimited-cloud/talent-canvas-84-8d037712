import { Link } from "react-router-dom";
import { Briefcase, Linkedin, Twitter, Instagram, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { cn } from "@/lib/utils";

export function Footer() {
  const { data: site } = useSiteSettings();
  const brand = site?.brand_name ?? "Virelix Consulting";

  return (
    <footer
      className="relative border-t border-border bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url('/footer-bg.jpeg')` }}
    >
      <div className="absolute inset-0 bg-surface/60 backdrop-blur-[2px] z-0" />
      <div className="container relative mx-auto px-4 py-10 md:py-12 z-10">
        <div className="grid gap-4 text-left md:grid-cols-4 md:gap-10 md:text-left">
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <Link to="/" className="flex items-center gap-2 font-display text-base font-bold">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-hero">
                <Briefcase className="h-3.5 w-3.5 text-primary-foreground" strokeWidth={2.5} />
              </div>
              {brand}
            </Link>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              {site?.footer_about ??
                "A global recruiting agency placing senior talent across tech, finance, healthcare, and industrial sectors."}
            </p>
            <div className="mt-4 flex gap-3 justify-center md:justify-start">
              {site?.social_linkedin && (
                <a
                  href={site.social_linkedin}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              )}
              {site?.social_twitter && (
                <a
                  href={site.social_twitter}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="Twitter"
                >
                  <Twitter className="h-4 w-4" />
                </a>
              )}
              {site?.social_instagram && (
                <a
                  href={site.social_instagram}
                  className="text-muted-foreground hover:text-foreground"
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
              <p className="mt-3 text-sm text-muted-foreground">{site.contact_email}</p>
            )}
            {site?.contact_phone && (
              <p className="text-sm text-muted-foreground">{site.contact_phone}</p>
            )}
            {site?.address && <p className="text-sm text-muted-foreground">{site.address}</p>}
          </FooterCol>
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} {brand}. All rights reserved.
          </p>
          <p className="hidden sm:block">Built with care for hiring teams worldwide.</p>
          <p>
            Developed By{" "}
            <a
              href="https://www.octaleads.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              Octaleads Pvt Ltd.
            </a>
          </p>
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
      <h4 className="mb-3 hidden text-sm font-semibold md:block">{title}</h4>
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
                  className="inline-block text-sm text-muted-foreground hover:text-foreground py-0.5"
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
