import { Outlet } from "react-router-dom";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/sonner";
import { ThemeApplier } from "@/components/theme-applier";
import { useSmoothScroll } from "@/hooks/use-smooth-scroll";

export function RootLayout() {
  useSmoothScroll();
  return (
    <>
      <ThemeApplier />
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
      <Toaster />
    </>
  );
}
