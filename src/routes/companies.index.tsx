import { Link } from "react-router-dom";
import { useFirebaseQuery } from "@/hooks/use-firebase-query";
import { Building2 } from "lucide-react";
import { firebase } from "@/integrations/firebase/client";
import { DynamicSeo } from "@/components/dynamic-seo";

function CompaniesPage() {
  const { data } = useFirebaseQuery(["companies", "all"], async () => {
    const { data, error } = await firebase
      .from("companies")
      .select("*")
      .order("featured", { ascending: false });
    if (error) throw error;
    return data;
  });

  return (
    <div className="container mx-auto px-4 py-10">
      <DynamicSeo
        pageKey="companies"
        fallbackTitle="Companies"
        fallbackDescription="Browse companies hiring through our network."
      />
      <h1 className="font-display text-3xl font-bold md:text-4xl">Companies hiring</h1>
      <p className="mt-2 text-muted-foreground">{data?.length ?? 0} companies in our network</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data?.map((c: any) => (
          <Link
            key={c.id}
            to={`/companies/${c.slug}`}
            className="group rounded-xl border border-border bg-card p-5 transition hover:border-primary/40 hover:shadow-md"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                <Building2 className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-semibold group-hover:text-primary">{c.name}</p>
                <p className="text-sm text-muted-foreground">
                  {c.industry} · {c.location}
                </p>
              </div>
            </div>
            {c.tagline && (
              <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{c.tagline}</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default CompaniesPage;
