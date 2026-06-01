
-- =========================================================
-- SITE SETTINGS (single row)
-- =========================================================
CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_name text NOT NULL DEFAULT 'Acme Talent',
  tagline text,
  logo_url text,
  contact_email text,
  contact_phone text,
  address text,
  social_linkedin text,
  social_twitter text,
  social_instagram text,
  primary_color text,
  accent_color text,
  footer_about text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "site_settings public read" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "site_settings admin write" ON public.site_settings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER site_settings_touch BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- =========================================================
-- PAGE CONTENT (key/value JSONB per page section)
-- =========================================================
CREATE TABLE public.page_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key text NOT NULL UNIQUE,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.page_content TO anon, authenticated;
GRANT ALL ON public.page_content TO service_role;
ALTER TABLE public.page_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "page_content public read" ON public.page_content FOR SELECT USING (true);
CREATE POLICY "page_content admin write" ON public.page_content FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER page_content_touch BEFORE UPDATE ON public.page_content FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- =========================================================
-- SERVICES
-- =========================================================
CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  icon text,
  summary text,
  body text,
  features text[] DEFAULT '{}',
  sort_order int NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.services TO anon, authenticated;
GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "services public read" ON public.services FOR SELECT USING (published OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "services admin write" ON public.services FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER services_touch BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- =========================================================
-- INDUSTRIES
-- =========================================================
CREATE TABLE public.industries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  label text NOT NULL,
  icon text,
  description text,
  sort_order int NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.industries TO anon, authenticated;
GRANT ALL ON public.industries TO service_role;
ALTER TABLE public.industries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "industries public read" ON public.industries FOR SELECT USING (published OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "industries admin write" ON public.industries FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER industries_touch BEFORE UPDATE ON public.industries FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- =========================================================
-- TEAM MEMBERS
-- =========================================================
CREATE TABLE public.team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role_title text NOT NULL,
  photo_url text,
  bio text,
  email text,
  linkedin text,
  sort_order int NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.team_members TO anon, authenticated;
GRANT ALL ON public.team_members TO service_role;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "team public read" ON public.team_members FOR SELECT USING (published OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "team admin write" ON public.team_members FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER team_touch BEFORE UPDATE ON public.team_members FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- =========================================================
-- CASE STUDIES
-- =========================================================
CREATE TABLE public.case_studies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  client text NOT NULL,
  title text NOT NULL,
  summary text,
  body text,
  cover_url text,
  industry text,
  results jsonb DEFAULT '[]'::jsonb,
  published boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.case_studies TO anon, authenticated;
GRANT ALL ON public.case_studies TO service_role;
ALTER TABLE public.case_studies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "case_studies public read" ON public.case_studies FOR SELECT USING (published OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "case_studies admin write" ON public.case_studies FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER case_studies_touch BEFORE UPDATE ON public.case_studies FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- =========================================================
-- POSTS (Insights)
-- =========================================================
CREATE TABLE public.posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  excerpt text,
  body text,
  cover_url text,
  category text,
  author_id uuid,
  published boolean NOT NULL DEFAULT true,
  published_at timestamptz DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.posts TO anon, authenticated;
GRANT ALL ON public.posts TO service_role;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "posts public read" ON public.posts FOR SELECT USING (published OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "posts admin write" ON public.posts FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER posts_touch BEFORE UPDATE ON public.posts FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- =========================================================
-- TESTIMONIALS
-- =========================================================
CREATE TABLE public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote text NOT NULL,
  author_name text NOT NULL,
  author_role text,
  company text,
  rating int DEFAULT 5,
  photo_url text,
  sort_order int NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.testimonials TO anon, authenticated;
GRANT ALL ON public.testimonials TO service_role;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "testimonials public read" ON public.testimonials FOR SELECT USING (published OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "testimonials admin write" ON public.testimonials FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER testimonials_touch BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- =========================================================
-- CONTACT SUBMISSIONS
-- =========================================================
CREATE TABLE public.contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  company text,
  phone text,
  subject text,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_submissions TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.contact_submissions TO authenticated;
GRANT ALL ON public.contact_submissions TO service_role;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "contact_submissions anyone insert" ON public.contact_submissions FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "contact_submissions admin read" ON public.contact_submissions FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "contact_submissions admin update" ON public.contact_submissions FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "contact_submissions admin delete" ON public.contact_submissions FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- =========================================================
-- Bootstrap first admin (only works if no admin exists yet)
-- =========================================================
CREATE OR REPLACE FUNCTION public.promote_to_admin_if_first(_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  has_any_admin boolean;
BEGIN
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') INTO has_any_admin;
  IF has_any_admin THEN
    RETURN false;
  END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (_user_id, 'admin')
  ON CONFLICT DO NOTHING;
  RETURN true;
END;
$$;
GRANT EXECUTE ON FUNCTION public.promote_to_admin_if_first(uuid) TO authenticated;

-- =========================================================
-- Seed default content
-- =========================================================
INSERT INTO public.site_settings (brand_name, tagline, contact_email, contact_phone, address, social_linkedin, footer_about)
VALUES ('Acme Talent', 'The talent partner for companies that can''t afford to miss.', 'hello@acmetalent.com', '+1 (555) 010-2200', '350 Fifth Avenue, New York, NY', 'https://linkedin.com', 'A global recruiting agency placing senior talent across tech, finance, healthcare, and industrial sectors.');

INSERT INTO public.page_content (page_key, content) VALUES
('home', '{"hero_eyebrow":"Global Recruiting Agency","hero_title":"We find the people who move markets.","hero_subtitle":"Executive search and embedded recruiting teams for high-growth companies. 1,800+ placements across 65 countries."}'),
('about', '{"title":"About Acme Talent","intro":"Since 2008, we''ve helped 600+ companies build leadership teams that ship.","mission":"To match exceptional people to companies where they''ll do their best work.","values":["Honest assessment","Deep specialization","Long-term partnership","Diverse pipelines"]}'),
('contact', '{"title":"Let''s talk about your next hire","subtitle":"Tell us what you''re building. We''ll respond within one business day."}');

INSERT INTO public.services (slug, title, icon, summary, body, features, sort_order) VALUES
('executive-search','Executive Search','Crown','C-suite and VP-level placements with rigorous vetting and reference depth.','We run discreet, retained searches for board, C-suite, and VP roles. Every engagement includes market mapping, leadership assessment, and references from peers, reports, and managers.','{"Retained engagements","Market mapping","Leadership assessment","360 references"}',1),
('contract-staffing','Contract Staffing','Users','Specialist contractors and fractional leaders, ready in 7–14 days.','From fractional CTOs to specialist engineers, we deploy proven contractors fast. All contractors are vetted, insured, and managed through a single point of contact.','{"7–14 day deployment","Vetted specialists","Compliance handled","Fractional leaders"}',2),
('rpo-embedded','RPO & Embedded Teams','Layers','Embedded recruiters who scale your hiring without scaling your fixed cost.','Our embedded recruiting teams plug into your ATS and brand, hiring 20–200+ people per year against your roadmap. Pay monthly, scale up or down.','{"Embedded sourcers & recruiters","Your ATS, your brand","Monthly flex","Quarterly hiring reviews"}',3),
('talent-advisory','Talent Advisory','Compass','Org design, compensation benchmarking, and hiring strategy reviews.','We help founders and CHROs make smarter org decisions: leveling frameworks, comp benchmarking, hiring forecasts, and DEI audits.','{"Org design","Comp benchmarking","Hiring forecasts","DEI audits"}',4);

INSERT INTO public.industries (slug, label, icon, description, sort_order) VALUES
('tech-saas','Tech & SaaS','Cpu','Engineering, product, and GTM leadership for venture-backed software companies.',1),
('financial','Financial Services','Landmark','Investment, risk, and operations talent for banks, funds, and fintechs.',2),
('healthcare','Healthcare & Life Sciences','HeartPulse','Clinical, regulatory, and commercial leadership across pharma, biotech, and care.',3),
('industrial','Industrial & Energy','Factory','Operations, engineering, and supply-chain leaders for industrial transformation.',4),
('consumer','Consumer & Retail','ShoppingBag','Brand, merchandising, and digital leadership for consumer companies.',5),
('professional','Professional Services','Briefcase','Partner-level hires for consulting, legal, and professional services firms.',6);

INSERT INTO public.team_members (name, role_title, bio, sort_order) VALUES
('Sarah Chen','Managing Partner','Sarah leads our technology and SaaS practice. 15+ years placing CTOs, VPs of Engineering, and founding teams.',1),
('Marcus Webb','Partner, Financial Services','Marcus partners with banks, hedge funds, and fintechs on senior risk, trading, and ops hires.',2),
('Aisha Patel','Head of Healthcare Practice','Aisha leads searches for biotech and pharma leadership, with a focus on clinical and regulatory talent.',3),
('Daniel Ortega','Head of Talent Advisory','Daniel runs our advisory practice: comp benchmarking, leveling, and hiring forecasts.',4);

INSERT INTO public.case_studies (slug, client, title, summary, body, industry, results, sort_order) VALUES
('nimbus-labs-series-c','Nimbus Labs','Built a complete engineering leadership team in 90 days','After Nimbus closed their Series C, we stood up their entire eng leadership bench — VPE, Head of Platform, and Head of Security — in under a quarter.','We started with a market map of 240+ candidates, ran structured assessments, and presented a shortlist of 9. All three roles were closed within 90 days and all hires were still in seat 18 months later.','Tech & SaaS','[{"label":"Hires closed","value":"3 leadership"},{"label":"Time to close","value":"90 days"},{"label":"Retention @ 18mo","value":"100%"}]',1),
('helix-health-fractional-cmo','Helix Health','Fractional CMO drove regulatory approval in 6 months','Helix needed an interim Chief Medical Officer to guide a key FDA filing. We placed a fractional CMO within 14 days who saw the filing through to approval.','Our network of fractional medical officers made it possible to find a perfect-fit CMO with prior FDA submission experience in under two weeks.','Healthcare','[{"label":"Time to deploy","value":"14 days"},{"label":"FDA outcome","value":"Approved"}]',2);

INSERT INTO public.posts (slug, title, excerpt, body, category, published_at) VALUES
('2026-tech-hiring-outlook','The 2026 Tech Hiring Outlook','What hiring leaders are budgeting for in the year ahead — and where the talent supply is tightest.','Across 400+ tech companies we surveyed, hiring volume is expected to climb 18% YoY, with the sharpest demand in AI infrastructure, security, and applied research…','Insights', now() - interval '3 days'),
('building-diverse-shortlists','Building Diverse Shortlists That Actually Convert','Five practical tactics our partners use to ensure underrepresented candidates make it past the first round.','Diversity sourcing is only the first step. The real lift happens in interview design, panel composition, and scorecards…','Diversity', now() - interval '12 days'),
('comp-benchmarks-q1','Comp Benchmarks: Q1 2026 Update','Updated cash and equity benchmarks for engineering, product, and GTM leadership across US, EU, and APAC.','Median total comp for VP Engineering in the US is now $480k cash + 0.4% equity at Series C…','Compensation', now() - interval '20 days');

INSERT INTO public.testimonials (quote, author_name, author_role, company, rating, sort_order) VALUES
('Acme is the only search firm we trust with our C-suite. They get our culture and their shortlists are sharp.','Elena Park','CEO','Nimbus Labs',5,1),
('We closed our Head of Platform in 6 weeks. The candidate quality was just on another level.','Daniel Ortiz','VP Engineering','Helix Health',5,2),
('Their embedded team hired 40 engineers for us in a year — without us building an internal recruiting function.','Mira Singh','COO','Atlas Robotics',5,3);
