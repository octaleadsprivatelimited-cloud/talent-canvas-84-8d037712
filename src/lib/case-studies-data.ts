export const ILLUSTRATION_CYCLES = [
  "/executive_search_simple.png",
  "/it_recruitment_simple.png",
  "/rpo_simple.png",
  "/consulting_training_simple.png",
  "/global_expansion_simple.png",
  "/talent_analytics_simple.png",
  "/diversity_sourcing_simple.png",
  "/startup_scaling_simple.png",
  "/our_story_illustration.png",
  "/illustration_men.png"
];

export type CaseStudy = {
  id: string;
  title: string;
  slug: string;
  client: string;
  industry: string;
  cover_url: string;
  summary: string;
  body: string;
  results: { label: string; value: string }[];
};

export const DEFAULT_CASE_STUDIES: CaseStudy[] = [
  {
    id: "case-1",
    title: "Scaling a Unicorn Startup Engineering Team",
    slug: "scaling-unicorn-startup",
    client: "Vix Tech Corp",
    industry: "Technology & Software",
    cover_url: ILLUSTRATION_CYCLES[0],
    summary: "How we designed and executed an embedded RPO strategy to hire 45 software engineers in 90 days.",
    body: `### Background & Challenge
Vix Tech Corp, a fast-scaling tech platform, secured their Series B funding and needed to double their engineering team. They faced severe recruitment bottlenecking and high agency fees. The goal was to hire 45 high-caliber software engineers, including senior cloud architects and frontend leads, within 90 days.

### The Solution
We deployed an embedded Recruitment Process Outsourcing (RPO) team comprising three senior recruiters and two sourcers. Our team fully integrated into Vix Tech’s Slack, Jira, and ATS systems. We established a structured vetting pipeline, streamlined interview processes, and leveraged our global talent network across the USA and India.

### Results
Within 90 days, we successfully filled all 45 engineering positions. The embedded model allowed us to build a sustainable talent pipeline and reduce recruitment agency spend by over 60%. Time-to-hire dropped from 48 days to 26 days.`,
    results: [
      { label: "Hires Completed", value: "45" },
      { label: "Avg. Time to Hire", value: "26 Days" },
      { label: "Cost Savings", value: "62%" },
    ],
  },
  {
    id: "case-2",
    title: "C-Suite Recruiting for a National Logistics Leader",
    slug: "c-suite-logistics-recruiting",
    client: "Delaware Supply Chain",
    industry: "Logistics & Supply Chain",
    cover_url: ILLUSTRATION_CYCLES[1],
    summary: "Placing a Chief Operating Officer (COO) and VP of Logistics within a tight 60-day schedule.",
    body: `### Background & Challenge
Delaware Supply Chain, a national logistics operator, faced a sudden vacancy in their Chief Operating Officer position during a period of rapid expansion. They needed an experienced operational leader who could oversee 12 distribution centers and manage a team of 400+ personnel.

### The Solution
We launched a target-focused executive search engagement. Our senior partners conducted extensive talent mapping across competing tier-one logistics and supply chain enterprises in North America. We identified 18 highly qualified passive candidates, conducting detailed competency-based assessments and cultural alignment evaluations.

### Results
We presented a shortlist of 4 qualified candidates within 25 days. The chosen candidate, a seasoned logistics VP, accepted the COO offer and started onboarding within 50 days of contract signing. We subsequently placed their new VP of Logistics, compounding their operational leadership.`,
    results: [
      { label: "Positions Placed", value: "2" },
      { label: "Search Duration", value: "42 Days" },
      { label: "Candidate Fit Rate", value: "100%" },
    ],
  },
  {
    id: "case-3",
    title: "Building the Future of Medical Devices",
    slug: "medical-device-engineering",
    client: "BioPulse Diagnostics",
    industry: "Healthcare & Life Sciences",
    cover_url: ILLUSTRATION_CYCLES[2],
    summary: "Sourcing and placing highly specialized hardware and embedded software engineers for clinical diagnostic tools.",
    body: `### Background & Challenge
BioPulse Diagnostics was developing a next-generation clinical diagnostic tool. They required a team of 6 specialist engineers with experience in FDA-regulated embedded software and microfluidics. These roles had been open for over six months due to the extreme scarcity of regional talent.

### The Solution
We initiated a global talent search utilizing our delivery hubs in both the USA and India. By searching globally, we identified candidates with the precise scientific credentials required. We managed the entire interview logistics, technical screen coordination, and immigration/relocation compliance.

### Results
All 6 engineering seats were filled within 75 days, with 4 US-based hires and 2 offshore senior systems developers. The product launch timeline remained on schedule, and BioPulse successfully completed its FDA submission.`,
    results: [
      { label: "Specialists Placed", value: "6" },
      { label: "Relocation Rate", value: "100%" },
      { label: "Retention (1 yr)", value: "95%" },
    ],
  },
  {
    id: "case-4",
    title: "FinTech Compliance Hiring and Regulation Sourcing",
    slug: "fintech-compliance-hiring",
    client: "Nexus Capital Group",
    industry: "Financial Services",
    cover_url: ILLUSTRATION_CYCLES[3],
    summary: "Securing key risk compliance officers and financial engineers to align with international trading laws.",
    body: `### Background & Challenge
Nexus Capital faced strict new federal compliance mandates for their trading systems. They needed specialized risk analysis managers and quantitative programmers with background in blockchain ledgers and banking compliance protocols.

### The Solution
We deployed a targeted executive search and tech recruitment team to identify passive leaders in New York and London. Utilizing a specialized assessment framework, we vetted quantitative skillsets and understanding of cross-border compliance.

### Results
All critical roles were filled within 45 days, preventing operations disruption and securing validation for international trading logs.`,
    results: [
      { label: "Hires Secured", value: "8" },
      { label: "Compliance Score", value: "100%" },
      { label: "Placement Time", value: "38 Days" },
    ],
  },
  {
    id: "case-5",
    title: "Expanding E-Commerce Engineering Scale",
    slug: "ecommerce-engineering-scale",
    client: "CartFlow Solutions",
    industry: "Retail & E-Commerce",
    cover_url: ILLUSTRATION_CYCLES[4],
    summary: "Scaling cart-abandonment systems with contract-to-hire software engineering talent during peak holiday season.",
    body: `### Background & Challenge
CartFlow needed to scale up their cloud system reliability team to manage a 400% surge in shopping checkout traffic over the holiday period.

### The Solution
We leveraged our active database of contract engineers in the US and India, delivering a vetted team of SRE and database architects on a contract-to-hire basis.

### Results
The site maintained 100% uptime through Black Friday. Vix converted three key members to permanent roles after the season ended.`,
    results: [
      { label: "Contractors Placed", value: "12" },
      { label: "Holiday Uptime", value: "100%" },
      { label: "Conversion Rate", value: "75%" },
    ],
  },
  {
    id: "case-6",
    title: "Talent Mapping for AI Startup Seed Round",
    slug: "talent-mapping-ai-startup",
    client: "Aether AI Labs",
    industry: "Technology & Software",
    cover_url: ILLUSTRATION_CYCLES[5],
    summary: "Creating talent maps to hire core machine learning researchers and deep-learning engineers.",
    body: `### Background & Challenge
Aether AI received seed funding and needed specialized PhD-level machine learning researchers to build their core foundation model. 

### The Solution
We mapped the research labs and AI engineering structures across tier-one universities and tech firms, leading to highly personalized outreach.

### Results
Aether hired 4 core research scientists within 50 days, successfully shipping their prototype ahead of schedule.`,
    results: [
      { label: "Core Scientists", value: "4" },
      { label: "Mapping Completed", value: "12 Days" },
      { label: "Onboarding Rate", value: "100%" },
    ],
  },
  {
    id: "case-7",
    title: "Workforce Planning for Renewable Energy Plant",
    slug: "renewable-energy-workforce-planning",
    client: "Solaris Power Group",
    industry: "Engineering & Manufacturing",
    cover_url: ILLUSTRATION_CYCLES[6],
    summary: "Designing org design, salary benchmarking, and key operations hires for a new manufacturing facility.",
    body: `### Background & Challenge
Solaris was building a state-of-the-art battery facility and needed to plan their structural hiring phases and compensate correctly to attract local talent.

### The Solution
We ran localized salary benchmarking and consulting, advising Solaris on shift layouts and sourcing engineering managers and safety directors.

### Results
Solaris successfully launched operations with 35 managers in place, minimizing startup drag and ensuring immediate productivity.`,
    results: [
      { label: "Managers Placed", value: "35" },
      { label: "Salary Accuracy", value: "97%" },
      { label: "Startup Delay", value: "0 Days" },
    ],
  },
  {
    id: "case-8",
    title: "Offshore Development Hub Sourcing & Launch",
    slug: "offshore-development-hub-launch",
    client: "TrueStack Cloud LLC",
    industry: "Technology & Software",
    cover_url: ILLUSTRATION_CYCLES[7],
    summary: "Setting up a dedicated engineering offshore delivery hub in Hyderabad, India with full operations support.",
    body: `### Background & Challenge
TrueStack wanted to establish a dedicated offshore engineering center in India to support their primary product engineering teams in the USA.

### The Solution
We managed the entire process: local hiring strategy, talent sourcing, EOR payroll setup, and workplace provisioning in Hyderabad.

### Results
TrueStack successfully stood up a 25-person engineering team in Hyderabad, achieving continuous 24/7 product iteration cycles.`,
    results: [
      { label: "Offshore Employees", value: "25" },
      { label: "Setup Time", value: "60 Days" },
      { label: "Cost Efficiency", value: "55%" },
    ],
  },
  {
    id: "case-9",
    title: "Securing Medical Research Directors",
    slug: "medical-research-director-search",
    client: "Genovate Labs",
    industry: "Healthcare & Life Sciences",
    cover_url: ILLUSTRATION_CYCLES[8],
    summary: "Retained executive search to hire the Director of Clinical Oncology and laboratory specialists.",
    body: `### Background & Challenge
Genovate Labs required a renowned clinical oncologist to lead their pharmaceutical research center in Delaware.

### The Solution
We conducted a global scientific talent search, focusing on cancer research centers and industry leaders in the USA.

### Results
Placed a leading research scientist from a top university hospital, completing the search within 70 days.`,
    results: [
      { label: "Director Placed", value: "1" },
      { label: "Qualified Shortlist", value: "3" },
      { label: "Search Duration", value: "70 Days" },
    ],
  },
  {
    id: "case-10",
    title: "Diversity Recruitment Drive for Financial Tech",
    slug: "diversity-recruitment-financial-tech",
    client: "Apex Quant Solutions",
    industry: "Financial Services",
    cover_url: ILLUSTRATION_CYCLES[9],
    summary: "Implementing blind sourcing and gender-neutral talent pipelines to achieve corporate diversity goals.",
    body: `### Background & Challenge
Apex Quant wanted to improve diversity representation in their core quantitative research and coding departments.

### The Solution
We implemented structured blind screening and gender-neutral outreach protocols across our sourcing pipelines in the US and India.

### Results
We successfully placed 15 diverse engineers and analysts, increasing diversity representation by 35% in active groups.`,
    results: [
      { label: "Diverse Hires", value: "15" },
      { label: "Pipeline Shift", value: "+35%" },
      { label: "Retention Rate", value: "98%" },
    ],
  },
  {
    id: "case-11",
    title: "Logistics Fleet Operations Recruitment",
    slug: "logistics-fleet-operations-recruitment",
    client: "CargoRun Systems",
    industry: "Logistics & Supply Chain",
    cover_url: ILLUSTRATION_CYCLES[0],
    summary: "Sourcing regional transportation managers and logistics controllers across multiple US transit hubs.",
    body: `### Background & Challenge
CargoRun needed to expand their transit control teams to manage their growing freight transport fleet across the Midwest.

### The Solution
We deployed a contingent search, targeting transportation managers and logistics specialists from competitor freight groups.

### Results
Placed 10 regional fleet coordinators within 40 days, improving delivery routes and driver scheduling.`,
    results: [
      { label: "Coordinators Hired", value: "10" },
      { label: "Fill Time", value: "40 Days" },
      { label: "Onboarding Quality", value: "95%" },
    ],
  },
  {
    id: "case-12",
    title: "Hardware Engineering Sourcing for Automotive Leader",
    slug: "hardware-engineering-automotive-sourcing",
    client: "Veloce Motors",
    industry: "Engineering & Manufacturing",
    cover_url: ILLUSTRATION_CYCLES[1],
    summary: "Placing vehicle electronics designers and sensor integration engineers for electric vehicles.",
    body: `### Background & Challenge
Veloce needed hardware systems developers with electric vehicle sensor integration backgrounds to launch their new EV platform.

### The Solution
We mapped the electronics teams of leading automotive players, utilizing direct headhunting and technical screening checks.

### Results
Veloce hired 6 specialists within 65 days, meeting their product engineering deadlines.`,
    results: [
      { label: "Specialists Placed", value: "6" },
      { label: "Hiring Duration", value: "65 Days" },
      { label: "EV Platform Safety", value: "100%" },
    ],
  },
  {
    id: "case-13",
    title: "Upskilling and Reskilling Bootcamps for Global Bank",
    slug: "upskilling-reskilling-bootcamps-bank",
    client: "Universal Trust Corp",
    industry: "Financial Services",
    cover_url: ILLUSTRATION_CYCLES[2],
    summary: "Reskilling 120 traditional IT administrators into modern cloud and DevOps engineers.",
    body: `### Background & Challenge
Universal Trust needed to migrate their legacy core systems to the cloud but lacked internal DevOps capability.

### The Solution
We designed and delivered a customized reskilling bootcamp, training 120 internal admins on AWS, Kubernetes, and SRE protocols.

### Results
All 120 personnel graduated, allowing Universal to complete their cloud migration project internally and save millions.`,
    results: [
      { label: "Personnel Trained", value: "120" },
      { label: "Migration Savings", value: "$4.2M" },
      { label: "Test Pass Rate", value: "96%" },
    ],
  },
  {
    id: "case-14",
    title: "E-Commerce Supply Chain Optimization Search",
    slug: "ecommerce-supply-chain-optimization",
    client: "DirectDrop Retail",
    industry: "Retail & E-Commerce",
    cover_url: ILLUSTRATION_CYCLES[3],
    summary: "Securing supply chain consultants and operations analytics leads to optimize warehouse routes.",
    body: `### Background & Challenge
DirectDrop faced high shipping costs and long delivery queues. They needed operations specialists to optimize inventory distribution.

### The Solution
We mapped regional logistics leads and operations researchers using advanced retail data tracking filters.

### Results
Hired a Director of Logistics Sourcing who trimmed processing times and reduced warehouse delivery bottlenecks.`,
    results: [
      { label: "Directors Placed", value: "1" },
      { label: "Sourcing Speed", value: "28 Days" },
      { label: "Processing Savings", value: "18%" },
    ],
  },
  {
    id: "case-15",
    title: "Clinical Trial Project Management Hiring",
    slug: "clinical-trial-project-management-hiring",
    client: "OmniClin Research",
    industry: "Healthcare & Life Sciences",
    cover_url: ILLUSTRATION_CYCLES[4],
    summary: "Hiring certified clinical project managers and research coordinators for Phase III trials.",
    body: `### Background & Challenge
OmniClin needed certified clinical coordinators with oncology experience to run their Phase III drug testing trials.

### The Solution
We ran a dedicated search, screening candidate credentials for regulatory GCP compliance and clinical workflow management.

### Results
OmniClin hired 8 coordinators within 55 days, ensuring the trial program launched on schedule.`,
    results: [
      { label: "Trial Coordinators", value: "8" },
      { label: "GCP Compliance", value: "100%" },
      { label: "Trial Launch Delay", value: "0 Days" },
    ],
  },
  {
    id: "case-16",
    title: "Embedded SRE Hiring for SaaS Unicorn",
    slug: "embedded-sre-hiring-saas-unicorn",
    client: "DocuVault Tech",
    industry: "Technology & Software",
    cover_url: ILLUSTRATION_CYCLES[5],
    summary: "Hiring 15 cloud site reliability engineers globally using EOR hubs in North America and Asia.",
    body: `### Background & Challenge
DocuVault faced infrastructure stability issues and needed 15 SREs to run operations 24/7 without exceeding payroll budgets.

### The Solution
We sourced SRE candidates in the US and India, setting up local hub payroll structures via an embedded talent search.

### Results
DocuVault stood up a global operations rotation, reducing incident response times by 70%.`,
    results: [
      { label: "SREs Placed", value: "15" },
      { label: "Response Delay", value: "-70%" },
      { label: "Budget Efficiency", value: "48%" },
    ],
  },
  {
    id: "case-17",
    title: "Executive Search for Biotech VP",
    slug: "executive-search-biotech-vp",
    client: "Zeno Biologics",
    industry: "Healthcare & Life Sciences",
    cover_url: ILLUSTRATION_CYCLES[6],
    summary: "Hiring a VP of Regulatory Affairs to lead FDA pharmaceutical clearance programs.",
    body: `### Background & Challenge
Zeno Biologics needed a regulatory affairs leader who had successfully navigated the FDA approval process for new drug classes.

### The Solution
Our senior partners engaged in retained executive search, sourcing candidates from top tier pharmaceutical giants.

### Results
Placed a former FDA lead scientist as Zeno's new VP, securing their drug clearance timelines.`,
    results: [
      { label: "VP Placed", value: "1" },
      { label: "Search Timeline", value: "50 Days" },
      { label: "FDA Clearance Rate", value: "100%" },
    ],
  },
  {
    id: "case-18",
    title: "Embedded Recruiting for Legal Tech Scaling",
    slug: "embedded-recruiting-legal-tech-scaling",
    client: "LegalMind Systems",
    industry: "Technology & Software",
    cover_url: ILLUSTRATION_CYCLES[7],
    summary: "Deploying embedded recruiters to build legal sales and engineering teams from scratch.",
    body: `### Background & Challenge
LegalMind needed to rapidly scale up both their SaaS sales team and their engineering team after an investment round.

### The Solution
We deployed two embedded recruiters to build standard applicant screening flows, leading sourcing sprints for sales and software staff.

### Results
Filled 20 key positions in 75 days, establishing an optimized hiring playbook for internal HR coordinators.`,
    results: [
      { label: "Hires Completed", value: "20" },
      { label: "Cycle Speed Gain", value: "35%" },
      { label: "Cost-Per-Hire Reduction", value: "50%" },
    ],
  },
  {
    id: "case-19",
    title: "Financial Sourcing for Leading Hedge Fund",
    slug: "financial-sourcing-hedge-fund",
    client: "BlueCrest Capital",
    industry: "Financial Services",
    cover_url: ILLUSTRATION_CYCLES[8],
    summary: "Sourcing experienced algorithmic traders and portfolio directors under tight deadlines.",
    body: `### Background & Challenge
BlueCrest wanted to expand their quantitative trading desk, needing developers with C++ and statistical modeling expertise.

### The Solution
We leveraged our specialized quantitative candidate networks, conducting deep coding assessments and structural background reviews.

### Results
Placed 5 core quantitative traders, accelerating trading returns on new financial instruments.`,
    results: [
      { label: "Traders Placed", value: "5" },
      { label: "Search Duration", value: "34 Days" },
      { label: "First-Year Yield", value: "115%" },
    ],
  },
  {
    id: "case-20",
    title: "Aerospace Structural Engineers Sourcing",
    slug: "aerospace-structural-engineers-sourcing",
    client: "Orion Flight Systems",
    industry: "Engineering & Manufacturing",
    cover_url: ILLUSTRATION_CYCLES[9],
    summary: "Placing specialized rocket combustion engineers and hardware analysts under security compliance.",
    body: `### Background & Challenge
Orion needed government-cleared aerospace engineers to build structural systems for orbital flight platforms.

### The Solution
We targeted certified aerospace researchers, conducting security clearance mapping and structural engineering reviews.

### Results
Successfully placed 7 cleared combustion specialists, allowing Orion to complete launch preparation on schedule.`,
    results: [
      { label: "Engineers Hired", value: "7" },
      { label: "Security Clearance", value: "100%" },
      { label: "Milestone Score", value: "100%" },
    ],
  },
  {
    id: "case-21",
    title: "Upskilling Management Teams at E-Commerce Firm",
    slug: "upskilling-management-ecommerce",
    client: "Apex Cart Retail",
    industry: "Retail & E-Commerce",
    cover_url: ILLUSTRATION_CYCLES[0],
    summary: "Delivering customized team leadership and management bootcamps for retail managers.",
    body: `### Background & Challenge
Apex Cart had scaled up their warehouse and delivery management teams but lacked internal leadership development programs.

### The Solution
We designed and delivered management bootcamp structures, coaching 45 group managers on communication, operations metrics, and safety.

### Results
Improved staff retention rates by 22% and reduced shipping processing delays due to management coordination.`,
    results: [
      { label: "Managers Coached", value: "45" },
      { label: "Retention Change", value: "+22%" },
      { label: "Processing Speed Gain", value: "15%" },
    ],
  },
  {
    id: "case-22",
    title: "Executive Recruitment for Clinical Research Director",
    slug: "clinical-research-director-search-excellence",
    client: "Vanguard LifeLabs",
    industry: "Healthcare & Life Sciences",
    cover_url: ILLUSTRATION_CYCLES[1],
    summary: "Placing a Clinical Research Director for global vaccine testing studies.",
    body: `### Background & Challenge
Vanguard required an experienced research scientist with international vaccine testing compliance credentials.

### The Solution
We executed a global research search, mapping pharmaceutical and clinical development candidates.

### Results
Placed a leading vaccine scientist within 60 days, starting clinical trials on schedule.`,
    results: [
      { label: "Directors Placed", value: "1" },
      { label: "Sourcing Cycle", value: "60 Days" },
      { label: "Trial Status", value: "On-Time" },
    ],
  },
  {
    id: "case-23",
    title: "Scaling Fintech Frontend Engineering Teams",
    slug: "scaling-fintech-frontend-engineering",
    client: "PayGlide Technologies",
    industry: "Financial Services",
    cover_url: ILLUSTRATION_CYCLES[2],
    summary: "Hiring 12 React Native and iOS developers to build a mobile banking portal.",
    body: `### Background & Challenge
PayGlide needed to launch their consumer banking application, requiring React Native and iOS developers with fintech compliance background.

### The Solution
We ran a contingent search using our tech network in the US and India, screening candidates for coding excellence and security.

### Results
PayGlide hired 12 developers in 50 days, successfully publishing their application to the App Store.`,
    results: [
      { label: "Developers Hired", value: "12" },
      { label: "Onboarding Time", value: "18 Days" },
      { label: "App Store Rank", value: "Top 50" },
    ],
  },
  {
    id: "case-24",
    title: "Supply Chain Director Executive Search",
    slug: "supply-chain-director-executive-search",
    client: "Summit Logistics Inc",
    industry: "Logistics & Supply Chain",
    cover_url: ILLUSTRATION_CYCLES[3],
    summary: "Placing a Global Director of Logistics Sourcing to oversee global freight operations.",
    body: `### Background & Challenge
Summit Logistics faced severe route backlogs and rising carrier costs, needing a director to optimize overseas freight.

### The Solution
We performed a global executive search mapping transportation leaders, screening for route optimization modeling background.

### Results
Placed an experienced transportation VP, reducing freight routing budgets by 14% in the first quarter.`,
    results: [
      { label: "Director Placed", value: "1" },
      { label: "Budget Savings", value: "14%" },
      { label: "Carrier Speed Gain", value: "20%" },
    ],
  },
  {
    id: "case-25",
    title: "Database Administrators Sourcing for Logistics Leader",
    slug: "database-administrators-logistics-sourcing",
    client: "Alpha Cargo Corp",
    industry: "Logistics & Supply Chain",
    cover_url: ILLUSTRATION_CYCLES[4],
    summary: "Placing database administrators and cloud architects to manage warehouse data inventories.",
    body: `### Background & Challenge
Alpha Cargo needed specialists to overhaul their tracking database, which suffered performance issues during shipping peak hours.

### The Solution
We sourced experienced SQL/NoSQL architects with experience in high-throughput tracking models.

### Results
Alpha hired 4 database managers who rebuilt data indexing, eliminating database query delay during peak shipments.`,
    results: [
      { label: "Admins Placed", value: "4" },
      { label: "Database Delay", value: "0ms" },
      { label: "Sourcing Speed", value: "30 Days" },
    ],
  },
  {
    id: "case-26",
    title: "Embedded Recruiting for Industrial Scaling",
    slug: "embedded-recruiting-industrial-scaling",
    client: "ProBuild Manufacturing",
    industry: "Engineering & Manufacturing",
    cover_url: ILLUSTRATION_CYCLES[5],
    summary: "Deploying onsite and offshore recruiters to hire 85 technicians and systems managers.",
    body: `### Background & Challenge
ProBuild needed to expand production lines and hire 85 engineering technicians and team coordinators within a tight timeframe.

### The Solution
We deployed an embedded RPO team, managing database screening, regional interviews, and safety vetting.

### Results
Successfully hired 85 personnel in 80 days, scaling plant production by 40% while maintaining compliance standards.`,
    results: [
      { label: "Positions Filled", value: "85" },
      { label: "Recruitment Speed", value: "80 Days" },
      { label: "Plant Capacity", value: "+40%" },
    ],
  },
  {
    id: "case-27",
    title: "Clinical Safety Officers Search",
    slug: "clinical-safety-officers-search",
    client: "Veritas Pharma Group",
    industry: "Healthcare & Life Sciences",
    cover_url: ILLUSTRATION_CYCLES[6],
    summary: "Hiring pharmaceutical safety leads and regulatory reporting coordinators under tight guidelines.",
    body: `### Background & Challenge
Veritas required medical safety directors with experience reporting adverse drug outcomes to international regulatory boards.

### The Solution
We targeted medical scientists, screening credentials for pharmacovigilance and regulatory compliance.

### Results
Veritas hired 5 safety directors within 45 days, meeting international safety protocol requirements.`,
    results: [
      { label: "Safety Leads Hired", value: "5" },
      { label: "Placement Duration", value: "45 Days" },
      { label: "Safety Compliance", value: "100%" },
    ],
  },
  {
    id: "case-28",
    title: "Sourcing AI Researchers for Autonomous Driving",
    slug: "sourcing-ai-researchers-autonomous-driving",
    client: "Apex Auto Labs",
    industry: "Technology & Software",
    cover_url: ILLUSTRATION_CYCLES[7],
    summary: "Placing computer vision scientists and autonomous machine learning engineers.",
    body: `### Background & Challenge
Apex Auto needed specialists to design camera systems for autonomous driving systems, a highly competitive talent pool.

### The Solution
We launched an executive search mapping research scientists in top automotive research university labs globally.

### Results
Apex hired 3 computer vision scientists, allowing them to start vehicle safety trials on schedule.`,
    results: [
      { label: "Scientists Placed", value: "3" },
      { label: "Search Duration", value: "55 Days" },
      { label: "Sourcing Efficiency", value: "98%" },
    ],
  },
  {
    id: "case-29",
    title: "Retained Search for Legal Compliance Counsel",
    slug: "retained-search-legal-compliance-counsel",
    client: "Global Finance Group",
    industry: "Financial Services",
    cover_url: ILLUSTRATION_CYCLES[8],
    summary: "Executive search to hire Chief Legal Compliance Counsel for international asset managers.",
    body: `### Background & Challenge
Global Finance needed a legal leader to navigate international finance regulations and coordinate asset reporting.

### The Solution
We performed a retained executive search, sourcing legal partners from international corporate banking divisions.

### Results
Placed a chief legal counsel with extensive regulatory credentials within 75 days.`,
    results: [
      { label: "Counsel Hired", value: "1" },
      { label: "Qualified Shortlist", value: "3" },
      { label: "Fill Time", value: "75 Days" },
    ],
  },
  {
    id: "case-30",
    title: "Contract Sourcing for Cloud Migration Sprints",
    slug: "contract-sourcing-cloud-migration-sprints",
    client: "Metro Retail Solutions",
    industry: "Retail & E-Commerce",
    cover_url: ILLUSTRATION_CYCLES[9],
    summary: "Hiring 18 temporary AWS cloud engineers and migration specialists to move catalog systems.",
    body: `### Background & Challenge
Metro Retail needed to migrate their retail catalog system to AWS prior to peak season without disrupting operations.

### The Solution
We sourced 18 cloud migration engineers on 6-month contract terms, coordinating remote onboarding workflows.

### Results
Metro completed their cloud migration on schedule, reducing IT infrastructure costs by 20%.`,
    results: [
      { label: "Contractors Placed", value: "18" },
      { label: "Migration Duration", value: "90 Days" },
      { label: "IT Cost Reduction", value: "20%" },
    ],
  },
  {
    id: "case-31",
    title: "E-Commerce Director Executive Recruitment",
    slug: "ecommerce-director-executive-recruitment",
    client: "SwiftCart Group",
    industry: "Retail & E-Commerce",
    cover_url: ILLUSTRATION_CYCLES[0],
    summary: "Executive search to place a Director of Digital Sourcing and Online Operations.",
    body: `### Background & Challenge
SwiftCart needed an operations executive who had successfully scaled consumer digital stores to over $100M in annual sales.

### The Solution
We mapped digital store executives across top e-commerce players, evaluating operations metrics.

### Results
SwiftCart hired a former operations VP as their new Director, increasing store conversion by 12% in 90 days.`,
    results: [
      { label: "Director Hired", value: "1" },
      { label: "Store Conversion", value: "+12%" },
      { label: "Search Timeline", value: "48 Days" },
    ],
  },
  {
    id: "case-32",
    title: "Sourcing Cybersecurity Architects for HealthTech",
    slug: "sourcing-cybersecurity-architects-healthtech",
    client: "PulseHealth Solutions",
    industry: "Healthcare & Life Sciences",
    cover_url: ILLUSTRATION_CYCLES[1],
    summary: "Hiring cybersecurity leaders and data compliance officers to protect clinical health records.",
    body: `### Background & Challenge
PulseHealth needed to secure their patient portal cloud servers to ensure alignment with strict medical privacy laws.

### The Solution
We mapped certified cloud security specialists, screening for HIPAA compliance and system penetration testing backgrounds.

### Results
PulseHealth hired 4 cybersecurity architects, securing their patient platform and clearing auditing benchmarks.`,
    results: [
      { label: "Architects Placed", value: "4" },
      { label: "HIPAA Clearance", value: "100%" },
      { label: "Audit Pass Rate", value: "100%" },
    ],
  }
];
