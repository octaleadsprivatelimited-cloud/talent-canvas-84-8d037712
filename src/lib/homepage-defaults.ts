export type Stat = { value: string; label: string };

export type HomepageContent = {
  // Services
  services_eyebrow: string;
  services_heading: string;
  services_heading_accent: string;
  services_intro: string;
  // Industries
  industries_eyebrow: string;
  industries_heading: string;
  industries_intro: string;
  industries_badge_value: string;
  industries_badge_label: string;
  // Process
  process_eyebrow: string;
  process_heading: string;
  process_heading_accent: string;
  why_heading: string;
  why_intro: string;
  why_bullets: string[];
  // Stats
  stats: Stat[];
  // Ribbon
  clients: string[];
  // Testimonials heading
  testimonials_eyebrow: string;
  testimonials_heading: string;
  // CTA
  cta_heading: string;
  cta_description: string;
  cta_primary_label: string;
  cta_primary_to: string;
  cta_secondary_label: string;
  cta_secondary_to: string;
};

export const HOMEPAGE_DEFAULTS: HomepageContent = {
  services_eyebrow: "What we do",
  services_heading: "Services built around how you",
  services_heading_accent: "actually hire.",
  services_intro:
    "Whether you're filling one critical seat or scaling by 10x, we plug in the right model for the moment — and stand behind the work.",

  industries_eyebrow: "Industries",
  industries_heading: "Deep specialization in the sectors shaping the next decade.",
  industries_intro:
    "Our consultants come from the industries they recruit for — that means real conversations with candidates and shortlists that land.",
  industries_badge_value: "USA + India",
  industries_badge_label: "Global delivery across two continents",

  process_eyebrow: "How we work",
  process_heading: "A search process measured in",
  process_heading_accent: "weeks, not quarters.",
  why_heading: "Why organizations choose us",
  why_intro:
    "A global delivery partner — combining quality, speed, and cost efficiency across every engagement.",
  why_bullets: [
    "USA headquartered",
    "Global talent network",
    "Industry-specific expertise",
    "Dedicated recruitment specialists",
  ],

  stats: [
    { value: "USA", label: "Delaware HQ" },
    { value: "2", label: "Continents — USA & India" },
    { value: "10+", label: "Industries served" },
    { value: "24/7", label: "Recruitment delivery" },
  ],

  clients: [
    "DELAWARE, USA",
    "GLOBAL DELIVERY",
    "USA + INDIA",
    "RPO",
    "EXECUTIVE SEARCH",
    "WORKFORCE SOLUTIONS",
  ],

  testimonials_eyebrow: "Client stories",
  testimonials_heading: "What it's like to work with us.",

  cta_heading: "Let's build your next high-performing team.",
  cta_description:
    "Share your hiring or workforce need — a consultant will respond within one business day with a tailored plan.",
  cta_primary_label: "Contact us",
  cta_primary_to: "/contact",
  cta_secondary_label: "Our services",
  cta_secondary_to: "/services",
};
