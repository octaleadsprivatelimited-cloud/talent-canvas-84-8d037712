import { Routes, Route } from "react-router-dom";
import { RootLayout } from "./routes/layout";

// Page imports
import Index from "./routes/index";
import WhoWeArePage from "./routes/who-we-are";
import TeamPage from "./routes/team";
import PrivacyPage from "./routes/privacy";
import TermsPage from "./routes/terms";
import LoginPage from "./routes/login";
import AdminLayout from "./routes/dock";
import ContactPage from "./routes/contact";
import CaseStudiesPage from "./routes/case-studies.index";
import CaseStudyDetail from "./routes/case-studies.$slug";
import CompaniesPage from "./routes/companies.index";
import CompanyDetail from "./routes/companies.$slug";
import InsightsPage from "./routes/insights.index";
import InsightDetail from "./routes/insights.$slug";
import JobsPage from "./routes/jobs.index";
import JobDetailsPage from "./routes/jobs.$slug";
import ServicesPage from "./routes/services.index";
import ServiceDetail from "./routes/services.$slug";
import IndustriesPage from "./routes/industries_.index";
import IndustryDetail from "./routes/industries_.$slug";
import CustomPage from "./routes/p.$slug";
import UserDashboardPage from "./routes/dashboard";

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<Index />} />
        <Route path="/who-we-are" element={<WhoWeArePage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dock" element={<AdminLayout />} />
        <Route path="/dashboard" element={<UserDashboardPage />} />
        <Route path="/contact" element={<ContactPage />} />

        <Route path="/case-studies" element={<CaseStudiesPage />} />
        <Route path="/case-studies/:slug" element={<CaseStudyDetail />} />

        <Route path="/companies" element={<CompaniesPage />} />
        <Route path="/companies/:slug" element={<CompanyDetail />} />

        <Route path="/insights" element={<InsightsPage />} />
        <Route path="/insights/:slug" element={<InsightDetail />} />

        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/jobs/:slug" element={<JobDetailsPage />} />

        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:slug" element={<ServiceDetail />} />

        <Route path="/industries" element={<IndustriesPage />} />
        <Route path="/industries/:slug" element={<IndustryDetail />} />

        <Route path="/p/:slug" element={<CustomPage />} />

        {/* Fallback 404 page */}
        <Route
          path="*"
          element={
            <div className="flex-1 flex items-center justify-center py-20">
              <div className="text-center">
                <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
                <p className="mt-2 text-muted-foreground">
                  The page you are looking for does not exist.
                </p>
              </div>
            </div>
          }
        />
      </Route>
    </Routes>
  );
}
