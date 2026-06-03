import { createFileRoute, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RenderLayout, type LayoutId, type LayoutContent } from "@/lib/page-layouts";

type CustomPage = {
  id: string;
  slug: string;
  title: string;
  layout: LayoutId;
  content: LayoutContent;
  seo_description: string | null;
  published: boolean;
};

export const Route = createFileRoute("/p/$slug")({
  component: CustomPageView,
  notFoundComponent: () => (
    <div className="container mx-auto px-4 py-24 text-center">
      <h1 className="font-display text-3xl font-bold">Page not found</h1>
      <p className="mt-2 text-muted-foreground">The page you’re looking for doesn’t exist.</p>
    </div>
  ),
});

function CustomPageView() {
  const { slug } = Route.useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ["custom_page", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("custom_pages")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      if (error) throw new Error(error.message);
      if (!data) throw notFound();
      return data as CustomPage;
    },
    retry: false,
  });

  if (isLoading) {
    return <div className="container mx-auto px-4 py-24 text-muted-foreground">Loading…</div>;
  }
  if (error || !data) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-bold">Page not found</h1>
      </div>
    );
  }

  return <RenderLayout layout={data.layout} content={data.content ?? {}} />;
}
