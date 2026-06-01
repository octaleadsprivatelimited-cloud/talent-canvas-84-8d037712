import { Link } from "@tanstack/react-router";
import { Briefcase } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-2 font-display text-base font-bold">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-hero">
                <Briefcase className="h-3.5 w-3.5 text-primary-foreground" strokeWidth={2.5} />
              </div>
              Hireloop
            </Link>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              The modern hiring platform connecting ambitious talent with great companies.
            </p>
          </div>
          <FooterCol title="For Candidates" links={[
            { to: "/jobs", label: "Browse Jobs" },
            { to: "/companies", label: "Companies" },
            { to: "/signup", label: "Create Profile" },
          ]} />
          <FooterCol title="For Employers" links={[
            { to: "/signup", label: "Post a Job" },
            { to: "/companies", label: "Employer Directory" },
          ]} />
          <FooterCol title="Company" links={[
            { to: "/", label: "About" },
            { to: "/", label: "Privacy" },
            { to: "/", label: "Terms" },
          ]} />
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Hireloop. All rights reserved.</p>
          <p>Built with care for hiring teams worldwide.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { to: string; label: string }[] }) {
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
    </div>
  );
}
