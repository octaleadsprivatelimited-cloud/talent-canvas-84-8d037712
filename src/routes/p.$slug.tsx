import { useParams } from "react-router-dom";
import { useFirebaseQuery } from "@/hooks/use-firebase-query";
import { firebase } from "@/integrations/firebase/client";
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

function CustomPageView() {
  const { slug } = useParams();
  const { data, isLoading, error } = useFirebaseQuery(["custom_page", slug], async () => {
    const { data, error } = await firebase
      .from("custom_pages")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) throw notFound();
    return data as CustomPage;
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

export default CustomPageView;
