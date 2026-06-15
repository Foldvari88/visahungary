import type { Locale } from "@/lib/types";
import { getMdxBlogItems } from "@/lib/mdx-content";

export type ContentType = "blog" | "visa-guides" | "country-guides";
export type ContentStatus = "draft" | "review" | "published";
export type ContentRiskLevel = "low" | "medium" | "high";

export type ContentSource = {
  title: string;
  url: string;
};

export type ContentSection = {
  heading: string;
  body: string[];
  bullets?: string[];
};

export type ChecklistBlock = {
  type: "checklist";
  heading: string;
  items: string[];
};

export type FaqBlock = {
  type: "faq";
  heading: string;
  items: Array<{
    question: string;
    answer: string;
  }>;
};

export type ComparisonTableBlock = {
  type: "comparisonTable";
  heading: string;
  columns: string[];
  rows: string[][];
};

export type InfographicBlock = {
  type: "infographic";
  heading: string;
  src: string;
  alt: string;
  caption?: string;
};

export type ContentBlock =
  | ChecklistBlock
  | FaqBlock
  | ComparisonTableBlock
  | InfographicBlock;

export type ContentItem = {
  type: ContentType;
  slug: string;
  locale: Locale;
  title: string;
  description: string;
  keywords: string[];
  category: string;
  date: string;
  updatedAt: string;
  readingTime: string;
  heroLabel: string;
  intro: string;
  sections: ContentSection[];
  status?: ContentStatus;
  riskLevel?: ContentRiskLevel;
  sources?: ContentSource[];
  blocks?: ContentBlock[];
  image?: string;
  cta: {
    title: string;
    body: string;
    button: string;
  };
};

const enVisaGuides: ContentItem[] = [
  {
    type: "visa-guides",
    slug: "hungary-white-card-digital-nomad",
    locale: "en",
    title: "Hungary White Card for Digital Nomads: Requirements and Process",
    description:
      "Understand who the Hungary White Card may fit, what documents are usually needed, and when a different residence route should be reviewed.",
    keywords: [
      "Hungary White Card",
      "Hungary digital nomad visa",
      "Hungary remote work residence permit",
    ],
    category: "Remote work",
    date: "2026-06-01",
    updatedAt: "2026-06-01",
    readingTime: "6 min read",
    heroLabel: "Visa guide",
    intro:
      "The White Card is Hungary's remote-work residence route for third-country nationals who work for a foreign employer or foreign business while living in Hungary.",
    sections: [
      {
        heading: "Who this route may fit",
        body: [
          "The White Card may be relevant if your work is performed digitally, your income comes from outside Hungary, and you do not plan to work for a Hungarian employer or own a Hungarian company.",
        ],
        bullets: [
          "Foreign employer or foreign-company income",
          "Digital work activity",
          "No Hungarian employment activity",
          "Documentable monthly income and housing",
        ],
      },
      {
        heading: "Core documents to prepare",
        body: [
          "Typical documents include a valid passport, proof of foreign employment or business ownership, income evidence, Hungarian accommodation, health insurance, and documents showing that the work can be performed remotely.",
        ],
      },
      {
        heading: "When manual review is important",
        body: [
          "If you have Hungarian clients, ownership in a Hungarian company, uncertain income documentation, prior refusal, or an urgent deadline, the route should be reviewed before relying on it.",
        ],
      },
    ],
    cta: {
      title: "Not sure if the White Card fits your case?",
      body: "Use the calculator to check whether remote work, employment, business, or another route is more likely.",
      button: "Check my Hungary route",
    },
  },
  {
    type: "visa-guides",
    slug: "hungary-work-permit-residence-guide",
    locale: "en",
    title: "Hungary Work Residence Permit Guide for Non-EU Citizens",
    description:
      "A practical guide to Hungarian employment residence routes, job offers, documents, and when EU Blue Card or Hungarian Card may be relevant.",
    keywords: [
      "Hungary work permit",
      "Hungary work residence permit",
      "Hungary employment visa",
    ],
    category: "Work",
    date: "2026-06-01",
    updatedAt: "2026-06-01",
    readingTime: "7 min read",
    heroLabel: "Visa guide",
    intro:
      "For most non-EU citizens, long-term work in Hungary requires a residence permit connected to a real Hungarian employment purpose.",
    sections: [
      {
        heading: "The main work routes",
        body: [
          "A standard employment residence permit may fit a job with a Hungarian employer. Highly qualified roles may point toward an EU Blue Card or Hungarian Card. Transfers, postings, seasonal work, and guest worker cases may follow different paths.",
        ],
        bullets: [
          "Employment residence permit",
          "EU Blue Card",
          "Hungarian Card",
          "National Card",
          "ICT, posting, seasonal work, or guest worker routes",
        ],
      },
      {
        heading: "What employers usually need to support",
        body: [
          "The process usually depends on a contract or preliminary agreement, job details, salary, workplace facts, and documents showing that the employment purpose is genuine.",
        ],
      },
      {
        heading: "Submission path",
        body: [
          "Depending on nationality, current location, and existing status, the first step may be a consular submission, Enter Hungary, or an OIF process. Do not assume that every case can be filed from inside Hungary.",
        ],
      },
    ],
    cta: {
      title: "Which work route matches your job offer?",
      body: "Answer a few questions and receive your likely route and document checklist by email.",
      button: "Start the calculator",
    },
  },
  {
    type: "visa-guides",
    slug: "hungary-student-residence-permit",
    locale: "en",
    title: "Hungary Student Residence Permit: Documents, Work Rights and Process",
    description:
      "Learn when a Hungarian student residence permit may fit, what documents are normally needed, and what to check before applying.",
    keywords: [
      "Hungary student visa",
      "Hungary student residence permit",
      "study in Hungary visa",
    ],
    category: "Study",
    date: "2026-06-01",
    updatedAt: "2026-06-01",
    readingTime: "5 min read",
    heroLabel: "Visa guide",
    intro:
      "A student residence permit may fit if you have admission or active student status at a Hungarian educational institution.",
    sections: [
      {
        heading: "Core eligibility signals",
        body: [
          "The strongest signal is a Hungarian admission letter or active student status. Tuition payment, scholarship confirmation, language ability, accommodation, financial means, and insurance are also important.",
        ],
      },
      {
        heading: "Can students work in Hungary?",
        body: [
          "Student work is usually limited. The exact limit and conditions should be checked before planning employment or relying on work income for the application.",
        ],
      },
      {
        heading: "After studies",
        body: [
          "Some students may later consider a job-seeking or business-start route, but this depends on timing, status, and whether the next activity connects to completed studies.",
        ],
      },
    ],
    cta: {
      title: "Check if study is your best route",
      body: "The calculator compares study, work, family, and other residence paths based on your answers.",
      button: "Find my route",
    },
  },
  {
    type: "visa-guides",
    slug: "hungary-family-reunification-residence-permit",
    locale: "en",
    title: "Hungary Family Reunification Residence Permit Guide",
    description:
      "Understand the basics of joining a family member in Hungary, sponsor status, relationship documents, and risk points.",
    keywords: [
      "Hungary family reunification",
      "Hungary spouse residence permit",
      "Hungary family visa",
    ],
    category: "Family",
    date: "2026-06-01",
    updatedAt: "2026-06-01",
    readingTime: "6 min read",
    heroLabel: "Visa guide",
    intro:
      "Family reunification may be relevant when a qualifying sponsor in Hungary can support the application and the family relationship can be documented.",
    sections: [
      {
        heading: "Sponsor status matters",
        body: [
          "The sponsor may be a Hungarian citizen, residence permit holder, long-term resident, EEA citizen, or another qualifying person. The exact sponsor status affects the path and documents.",
        ],
      },
      {
        heading: "Documents usually needed",
        body: [
          "Typical documents include civil status records, proof of relationship, sponsor documents, accommodation, financial means, insurance, and translations or apostille where required.",
        ],
      },
      {
        heading: "When to be careful",
        body: [
          "Prior refusals, unclear relationship documentation, insufficient housing, or sponsor status restrictions should be checked before filing.",
        ],
      },
    ],
    cta: {
      title: "Is family reunification your route?",
      body: "Use the guided calculator to identify whether family, EEA family, work, or another route is likely.",
      button: "Check eligibility route",
    },
  },
  {
    type: "visa-guides",
    slug: "hungary-guest-investor-visa",
    locale: "en",
    title: "Hungary Guest Investor Visa and Residence Permit Overview",
    description:
      "A practical overview of Hungary's guest investor path, qualifying investment signals, documents, and compliance review.",
    keywords: [
      "Hungary guest investor visa",
      "Hungary investor residence permit",
      "Hungary golden visa",
    ],
    category: "Investment",
    date: "2026-06-01",
    updatedAt: "2026-06-01",
    readingTime: "6 min read",
    heroLabel: "Visa guide",
    intro:
      "The guest investor route is a premium residence path that requires qualifying investment documentation and source-of-funds review.",
    sections: [
      {
        heading: "Common qualifying signals",
        body: [
          "The knowledge base currently tracks investment options such as a EUR 250,000 real estate fund route or a EUR 1,000,000 higher education donation route, subject to current official rules.",
        ],
      },
      {
        heading: "Documents and compliance",
        body: [
          "Investor cases usually need strong identity, investment, banking, source-of-funds, tax, and compliance documentation. Timing and route sequencing should be reviewed before action.",
        ],
      },
      {
        heading: "Why manual review is usually needed",
        body: [
          "Investor cases are high-value and document-sensitive. A calculator can identify fit, but final planning should be reviewed before funds are committed.",
        ],
      },
    ],
    cta: {
      title: "Check whether the investor path fits",
      body: "Answer the investment and location questions to receive a preliminary route summary.",
      button: "Start investor pre-screening",
    },
  },
  {
    type: "visa-guides",
    slug: "hungary-schengen-c-visa",
    locale: "en",
    title: "Hungary Schengen C Visa Guide for Short Stays",
    description:
      "Understand when a short-stay Schengen C visa may be needed for Hungary, what documents are common, and what to prepare.",
    keywords: ["Hungary Schengen visa", "Hungary C visa", "Hungary tourist visa"],
    category: "Short stay",
    date: "2026-06-01",
    updatedAt: "2026-06-01",
    readingTime: "5 min read",
    heroLabel: "Visa guide",
    intro:
      "A Schengen C visa may be relevant for short visits to Hungary if your citizenship does not allow visa-free Schengen entry.",
    sections: [
      {
        heading: "Typical short-stay purposes",
        body: [
          "Tourism, family visits, business meetings, conferences, and short trips are usually assessed as short-stay purposes if the stay is within 90 days in a 180-day period.",
        ],
      },
      {
        heading: "Common documents",
        body: [
          "Typical documents include passport, photo, travel insurance, accommodation, financial means, purpose proof, itinerary, and return or onward travel evidence.",
        ],
      },
      {
        heading: "When C visa is not enough",
        body: [
          "If the purpose involves long-term work, study, family residence, business operation, or remote work beyond short stay, a residence permit route may be needed instead.",
        ],
      },
    ],
    cta: {
      title: "Not sure if you need C visa or residence permit?",
      body: "Use the calculator to separate short-stay and 90+ day routes.",
      button: "Check my route",
    },
  },
];

const enCountryGuides: ContentItem[] = [
  {
    type: "country-guides",
    slug: "hungary-visa-for-indian-citizens",
    locale: "en",
    title: "Hungary Visa and Residence Routes for Indian Citizens",
    description:
      "A guide for Indian citizens considering Hungary for work, study, family, business, remote work, investment, or short stays.",
    keywords: ["Hungary visa for Indians", "Hungary work permit for Indians", "Hungary student visa India"],
    category: "India",
    date: "2026-06-01",
    updatedAt: "2026-06-01",
    readingTime: "6 min read",
    heroLabel: "Country guide",
    intro:
      "Indian citizens often need to compare short-stay Schengen routes with long-term Hungarian residence permits depending on the purpose and duration.",
    sections: [
      {
        heading: "Most common routes",
        body: [
          "For Indian applicants, frequent routes include Schengen C visa, employment residence permit, student residence permit, family reunification, White Card, and business or investor paths.",
        ],
      },
      {
        heading: "Key documents to think about early",
        body: [
          "Accommodation, financial means, insurance, purpose documents, civil status documents, education records, and translations or apostille may need time to prepare.",
        ],
      },
      {
        heading: "Why route selection matters",
        body: [
          "A short-stay visa and a residence permit solve different problems. The wrong route can create timing issues, refusal risk, or a need to restart from abroad.",
        ],
      },
    ],
    cta: {
      title: "Check your Hungary route as an Indian citizen",
      body: "The calculator asks purpose, stay length, work/study/family details, and readiness questions.",
      button: "Start the route check",
    },
  },
  {
    type: "country-guides",
    slug: "hungary-visa-for-chinese-citizens",
    locale: "en",
    title: "Hungary Visa and Residence Routes for Chinese Citizens",
    description:
      "A practical guide for Chinese citizens planning to visit, study, work, invest, or live in Hungary.",
    keywords: ["Hungary visa for Chinese citizens", "Hungary residence permit China", "Hungary visa China"],
    category: "China",
    date: "2026-06-01",
    updatedAt: "2026-06-01",
    readingTime: "6 min read",
    heroLabel: "Country guide",
    intro:
      "Chinese citizens planning Hungary should first separate short Schengen travel from long-term residence routes such as work, study, family, business, remote work, or investment.",
    sections: [
      {
        heading: "Short stay or residence?",
        body: [
          "A short visit usually points toward a Schengen C visa. Work, study, family residence, business operation, remote work, and investment usually require a residence route.",
        ],
      },
      {
        heading: "Common document themes",
        body: [
          "Applicants should prepare identity documents, purpose evidence, financial proof, housing, insurance, and where relevant, family, education, employment, or investment documents.",
        ],
      },
      {
        heading: "Chinese-language support",
        body: [
          "The calculator supports Chinese interface text so users can understand route logic before requesting a detailed English or Chinese follow-up.",
        ],
      },
    ],
    cta: {
      title: "Find your Hungary route in Chinese or English",
      body: "Use the bilingual calculator and receive the full result by email.",
      button: "Open the calculator",
    },
  },
  {
    type: "country-guides",
    slug: "hungary-visa-for-turkish-citizens",
    locale: "en",
    title: "Hungary Visa and Residence Routes for Turkish Citizens",
    description:
      "Learn how Turkish citizens can think about Hungary Schengen visits, work, study, family, business, and residence routes.",
    keywords: ["Hungary visa for Turkish citizens", "Hungary residence permit Turkey", "Hungary work permit Turkish"],
    category: "Turkey",
    date: "2026-06-01",
    updatedAt: "2026-06-01",
    readingTime: "5 min read",
    heroLabel: "Country guide",
    intro:
      "Turkish citizens may need a short-stay Schengen visa for visits or a Hungarian residence route for longer stays and specific purposes.",
    sections: [
      {
        heading: "Typical route split",
        body: [
          "Tourism, business meetings, and family visits may fall under short-stay Schengen rules. Employment, study, family reunification, self-employment, and long-term relocation usually require a residence permit route.",
        ],
      },
      {
        heading: "Submission and timing",
        body: [
          "The right submission path depends on current location, visa-free status, existing permits, and the chosen route. Appointment timing should be checked early.",
        ],
      },
    ],
    cta: {
      title: "Check your likely route from Turkey to Hungary",
      body: "Answer a few questions and get a tailored route summary by email.",
      button: "Start route check",
    },
  },
  {
    type: "country-guides",
    slug: "hungary-visa-for-uae-residents",
    locale: "en",
    title: "Hungary Visa and Residence Routes for UAE Residents",
    description:
      "A route-planning guide for UAE residents considering short travel, work, study, investment, remote work, or relocation to Hungary.",
    keywords: ["Hungary visa UAE residents", "Hungary residence permit Dubai", "Hungary Schengen visa UAE"],
    category: "UAE",
    date: "2026-06-01",
    updatedAt: "2026-06-01",
    readingTime: "5 min read",
    heroLabel: "Country guide",
    intro:
      "UAE residence alone does not decide the Hungarian route. Citizenship, travel purpose, stay length, and documents are usually more important.",
    sections: [
      {
        heading: "Citizenship and purpose first",
        body: [
          "A UAE resident may hold many different citizenships, so the first step is to check citizenship, visa-free status, purpose, and intended stay length.",
        ],
      },
      {
        heading: "Popular routes",
        body: [
          "Short-stay Schengen visa, White Card, guest investor route, business/self-employment, work, study, and family routes may all be relevant depending on facts.",
        ],
      },
    ],
    cta: {
      title: "Check your Hungary route from the UAE",
      body: "The calculator starts with citizenship and purpose so it can route the case correctly.",
      button: "Use the calculator",
    },
  },
];

const enBlog: ContentItem[] = [
  {
    type: "blog",
    slug: "can-i-apply-from-inside-hungary",
    locale: "en",
    title: "Can I Apply for a Hungarian Residence Permit from Inside Hungary?",
    description:
      "Learn why domestic submission depends on visa-free status, current residence status, route type, and timing.",
    keywords: ["apply residence permit inside Hungary", "Enter Hungary application", "Hungary OIF"],
    category: "Process",
    date: "2026-06-01",
    updatedAt: "2026-06-01",
    readingTime: "4 min read",
    heroLabel: "Blog",
    intro:
      "Many applicants want to apply from inside Hungary, but domestic submission is not always available. The answer depends on the facts.",
    sections: [
      {
        heading: "The key questions",
        body: [
          "Domestic submission often depends on whether the applicant is legally in Hungary, whether they entered visa-free, whether they already hold a Hungarian permit, and whether the selected route allows local filing.",
        ],
      },
      {
        heading: "When consular submission may be safer",
        body: [
          "If the applicant is visa-required, outside Hungary, missing a valid status, or applying for a route that usually starts abroad, consular submission may be required.",
        ],
      },
    ],
    cta: {
      title: "Check your submission path",
      body: "The calculator checks location, visa-free status, current permits, and purpose.",
      button: "Check my route",
    },
  },
  {
    type: "blog",
    slug: "hungary-accommodation-proof-residence-permit",
    locale: "en",
    title: "Accommodation Proof for a Hungarian Residence Permit",
    description:
      "Understand common housing documents for Hungarian visa and residence permit applications.",
    keywords: ["Hungary accommodation proof", "Hungary residence permit housing", "Hungary visa documents"],
    category: "Documents",
    date: "2026-06-01",
    updatedAt: "2026-06-01",
    readingTime: "4 min read",
    heroLabel: "Blog",
    intro:
      "Accommodation proof is one of the common document categories in Hungarian residence permit cases.",
    sections: [
      {
        heading: "Common forms of proof",
        body: [
          "Depending on the case, accommodation may be supported by a lease agreement, ownership proof, host statement, dormitory proof, hotel booking, employer accommodation proof, or family accommodation documents.",
        ],
      },
      {
        heading: "Why details matter",
        body: [
          "A document may need to show address, parties, duration, and permission to stay. Requirements vary by route and authority practice.",
        ],
      },
    ],
    cta: {
      title: "Get your route-specific checklist",
      body: "Use the calculator and receive the document checklist by email.",
      button: "Start calculator",
    },
  },
  {
    type: "blog",
    slug: "hungary-residence-permit-refused-what-next",
    locale: "en",
    title: "Hungary Residence Permit Refused: What Should You Check Next?",
    description:
      "A careful overview of next steps after refusal, including deadlines, facts, documents, and appeal risk.",
    keywords: ["Hungary residence permit refused", "Hungary visa refusal", "Hungary appeal visa"],
    category: "Risk",
    date: "2026-06-01",
    updatedAt: "2026-06-01",
    readingTime: "5 min read",
    heroLabel: "Blog",
    intro:
      "A refusal should be reviewed carefully before submitting a new application or appeal. Timing and facts matter.",
    sections: [
      {
        heading: "Start with the decision",
        body: [
          "The refusal decision, delivery date, reason, deadline, and available remedy should be checked first. Do not rely on general online information when a deadline is running.",
        ],
      },
      {
        heading: "Common issue categories",
        body: [
          "Problems may involve purpose evidence, financial means, accommodation, insurance, prior stay history, inconsistent facts, missing documents, or authority doubts about the purpose.",
        ],
      },
      {
        heading: "Manual review is strongly recommended",
        body: [
          "Prior refusal or overstay is a high-risk signal in the calculator and should usually be handled through individual review.",
        ],
      },
    ],
    cta: {
      title: "Have a high-risk case?",
      body: "Use the calculator to structure the facts, then book a review if refusal or overstay is involved.",
      button: "Start careful pre-screening",
    },
  },
];

const additionalCountryGuides: ContentItem[] = [
  {
    type: "country-guides",
    slug: "hungary-visa-for-kazakhstan-citizens",
    locale: "en",
    title: "Hungary Visa and Residence Routes for Kazakhstan Citizens",
    description:
      "A practical route guide for Kazakhstan citizens considering Hungary for short stays, work, study, business, remote work, family, or investment.",
    keywords: [
      "Hungary visa for Kazakhstan citizens",
      "Hungary residence permit Kazakhstan",
      "Hungary work permit Kazakhstan",
    ],
    category: "Kazakhstan",
    date: "2026-06-01",
    updatedAt: "2026-06-01",
    readingTime: "5 min read",
    heroLabel: "Country guide",
    intro:
      "Kazakhstan citizens planning Hungary should first identify whether the purpose is short-stay Schengen travel or a 90+ day Hungarian residence route.",
    sections: [
      {
        heading: "Common paths to compare",
        body: [
          "Frequent paths include Schengen C visa, employment residence permit, student residence permit, family reunification, White Card, self-employment, and investor routes.",
        ],
      },
      {
        heading: "Documents that often drive the case",
        body: [
          "Purpose documents, accommodation, financial means, insurance, education or work records, and civil status documents should be checked early. Some documents may need official translation or legalization.",
        ],
      },
      {
        heading: "When to request review",
        body: [
          "Manual review is recommended if there was a prior refusal, Schengen overstay, urgent deadline, uncertain employer documents, or unclear source of funds.",
        ],
      },
    ],
    cta: {
      title: "Check your Hungary route from Kazakhstan",
      body: "Answer a few questions and receive a route-specific checklist by email.",
      button: "Start route check",
    },
  },
  {
    type: "country-guides",
    slug: "hungary-visa-for-filipino-citizens",
    locale: "en",
    title: "Hungary Visa and Residence Routes for Filipino Citizens",
    description:
      "A guide for Filipino citizens comparing Hungary Schengen visa, work, study, family, remote work, and residence permit routes.",
    keywords: [
      "Hungary visa for Filipino citizens",
      "Hungary work permit Philippines",
      "Hungary residence permit Filipino",
    ],
    category: "Philippines",
    date: "2026-06-01",
    updatedAt: "2026-06-01",
    readingTime: "6 min read",
    heroLabel: "Country guide",
    intro:
      "For Filipino citizens, the right Hungary route depends on purpose, stay length, job or school documents, family sponsor status, and current location.",
    sections: [
      {
        heading: "Short stay versus residence",
        body: [
          "Tourism, meetings, or family visits may fall under Schengen short-stay rules. Employment, study, family reunification, business activity, and long-term relocation usually require a residence permit route.",
        ],
      },
      {
        heading: "Work-related cases",
        body: [
          "If the purpose is work, the employer, contract, salary, role, accommodation, and insurance documents are central. Different work categories may apply depending on the facts.",
        ],
      },
      {
        heading: "How the calculator helps",
        body: [
          "The calculator separates work, study, family, short-stay, and other routes, then sends a tailored checklist by email.",
        ],
      },
    ],
    cta: {
      title: "Find your route from the Philippines to Hungary",
      body: "Use the guided pre-screening flow before collecting documents.",
      button: "Check my route",
    },
  },
  {
    type: "country-guides",
    slug: "hungary-visa-for-vietnamese-citizens",
    locale: "en",
    title: "Hungary Visa and Residence Routes for Vietnamese Citizens",
    description:
      "A route-planning guide for Vietnamese citizens considering Hungary for work, study, business, family, short visits, or remote work.",
    keywords: [
      "Hungary visa for Vietnamese citizens",
      "Hungary residence permit Vietnam",
      "Hungary work permit Vietnam",
    ],
    category: "Vietnam",
    date: "2026-06-01",
    updatedAt: "2026-06-01",
    readingTime: "5 min read",
    heroLabel: "Country guide",
    intro:
      "Vietnamese applicants should first clarify whether they need a short-stay visa or a Hungarian residence permit tied to a specific purpose.",
    sections: [
      {
        heading: "Most relevant route categories",
        body: [
          "Depending on the case, relevant categories may include Schengen C visa, employment, guest worker, study, family reunification, business/self-employment, and White Card remote work.",
        ],
      },
      {
        heading: "Plan documents early",
        body: [
          "Document preparation can take time. Employment contracts, school admission, family records, housing, financial means, insurance, and translations should be planned before deadlines become urgent.",
        ],
      },
      {
        heading: "Avoid choosing the wrong path",
        body: [
          "A short-stay route is not a substitute for long-term work or study residence. Choosing the wrong category can create refusal or timing risk.",
        ],
      },
    ],
    cta: {
      title: "Check your Hungary route as a Vietnamese citizen",
      body: "Answer the route questions and receive your likely path by email.",
      button: "Start the calculator",
    },
  },
  {
    type: "country-guides",
    slug: "hungary-visa-for-serbian-citizens",
    locale: "en",
    title: "Hungary Visa and Residence Routes for Serbian Citizens",
    description:
      "A Hungary route guide for Serbian citizens considering short stays, employment, study, family, business, remote work, or long-term residence.",
    keywords: [
      "Hungary visa for Serbian citizens",
      "Hungary residence permit Serbia",
      "Hungary work permit Serbia",
    ],
    category: "Serbia",
    date: "2026-06-01",
    updatedAt: "2026-06-01",
    readingTime: "5 min read",
    heroLabel: "Country guide",
    intro:
      "Serbian citizens may have different short-stay travel considerations from long-term Hungarian residence permit requirements.",
    sections: [
      {
        heading: "Short stay does not equal residence",
        body: [
          "Even where short travel is easier, long-term employment, study, business, or family residence still requires selecting the correct Hungarian route and preparing purpose-specific documents.",
        ],
      },
      {
        heading: "Popular long-term routes",
        body: [
          "Employment, qualified work, study, family reunification, self-employment, and White Card routes may be relevant depending on the user’s facts.",
        ],
      },
      {
        heading: "Timing and filing location",
        body: [
          "The correct filing path depends on current location, lawful status, existing permits, and the selected route. The calculator flags when manual review may be needed.",
        ],
      },
    ],
    cta: {
      title: "Check your Serbia to Hungary route",
      body: "Use the guided flow to separate short-stay and residence options.",
      button: "Find my route",
    },
  },
  {
    type: "country-guides",
    slug: "hungary-visa-for-russian-and-cis-citizens",
    locale: "en",
    title: "Hungary Visa and Residence Routes for Russian and CIS Citizens",
    description:
      "A practical overview for Russian and CIS citizens comparing Hungary short-stay, work, study, family, remote work, business, and investment routes.",
    keywords: [
      "Hungary visa for Russian citizens",
      "Hungary residence permit CIS",
      "Hungary visa for CIS citizens",
    ],
    category: "Russia / CIS",
    date: "2026-06-01",
    updatedAt: "2026-06-01",
    readingTime: "6 min read",
    heroLabel: "Country guide",
    intro:
      "Russian and CIS applicants often need careful route selection because citizenship, current residence, source of funds, purpose documents, and risk history can all affect the path.",
    sections: [
      {
        heading: "Routes to compare",
        body: [
          "Potential categories may include Schengen C visa, employment residence permit, Hungarian Card, EU Blue Card, study, family reunification, White Card, self-employment, and guest investor routes.",
        ],
      },
      {
        heading: "Risk and compliance checks",
        body: [
          "Prior refusals, overstay, sanctions exposure, source-of-funds questions, urgent travel, or unclear residence status should be reviewed before relying on a simple route answer.",
        ],
      },
      {
        heading: "Use the calculator as pre-screening",
        body: [
          "The calculator can organize the facts and suggest a likely direction, but complex CIS cases often benefit from manual review before filing.",
        ],
      },
    ],
    cta: {
      title: "Check your Hungary route from Russia or CIS",
      body: "Start with purpose, stay length, current location, and key documents.",
      button: "Start pre-screening",
    },
  },
];

const additionalBlog: ContentItem[] = [
  {
    type: "blog",
    slug: "hungary-white-card-income-requirement-explained",
    locale: "en",
    title: "Hungary White Card Income Requirement Explained",
    description:
      "Understand why income proof matters for the Hungary White Card and what applicants should prepare before applying.",
    keywords: [
      "Hungary White Card income requirement",
      "Hungary digital nomad income",
      "White Card Hungary documents",
    ],
    category: "Remote work",
    date: "2026-06-01",
    updatedAt: "2026-06-01",
    readingTime: "4 min read",
    heroLabel: "Blog",
    intro:
      "Income is one of the most important readiness signals for a Hungary White Card pre-screening.",
    sections: [
      {
        heading: "Why income proof matters",
        body: [
          "The White Card is built around foreign remote work. Authorities need to see that the applicant can support themselves while staying in Hungary and that the income source is outside Hungary.",
        ],
      },
      {
        heading: "Documents that may support income",
        body: [
          "Depending on the case, applicants may prepare bank statements, employer confirmations, contracts, invoices, company documents, tax records, or other income evidence.",
        ],
      },
      {
        heading: "When the route may not fit",
        body: [
          "If the income comes from Hungarian work, Hungarian clients, or a Hungarian company, another route may need to be reviewed.",
        ],
      },
    ],
    cta: {
      title: "Check if White Card fits your income profile",
      body: "Use the calculator to compare remote work with employment or business routes.",
      button: "Check my route",
    },
  },
  {
    type: "blog",
    slug: "can-i-work-in-hungary-with-student-residence-permit",
    locale: "en",
    title: "Can I Work in Hungary with a Student Residence Permit?",
    description:
      "A practical overview of student work considerations for Hungarian student residence permit holders.",
    keywords: [
      "work in Hungary with student permit",
      "Hungary student residence permit work",
      "Hungary student work rules",
    ],
    category: "Study",
    date: "2026-06-01",
    updatedAt: "2026-06-01",
    readingTime: "4 min read",
    heroLabel: "Blog",
    intro:
      "Students often ask whether they can work in Hungary. The answer depends on status, timing, hours, and the exact activity.",
    sections: [
      {
        heading: "Student work is usually limited",
        body: [
          "Student residence may allow limited work, but it is not the same as a full employment residence route. Applicants should check the current rule before relying on work income.",
        ],
      },
      {
        heading: "When a work route may be needed",
        body: [
          "If the main purpose becomes employment, or the work exceeds student limits, an employment-related residence route may need to be reviewed.",
        ],
      },
    ],
    cta: {
      title: "Study route or work route?",
      body: "Answer a few questions and get a tailored route suggestion by email.",
      button: "Start calculator",
    },
  },
  {
    type: "blog",
    slug: "hungary-schengen-visa-vs-residence-permit",
    locale: "en",
    title: "Hungary Schengen Visa vs Residence Permit: Which One Do You Need?",
    description:
      "Learn the difference between short-stay Schengen C visa and 90+ day Hungarian residence permit routes.",
    keywords: [
      "Hungary Schengen visa vs residence permit",
      "Hungary C visa or residence permit",
      "Hungary 90 days visa",
    ],
    category: "Route selection",
    date: "2026-06-01",
    updatedAt: "2026-06-01",
    readingTime: "5 min read",
    heroLabel: "Blog",
    intro:
      "Many applicants call every status a visa, but Hungarian immigration planning starts by separating short stays from residence routes.",
    sections: [
      {
        heading: "Short-stay Schengen route",
        body: [
          "Tourism, family visits, business meetings, conferences, and similar short stays may fit the Schengen short-stay framework if the trip is within 90 days in a 180-day period.",
        ],
      },
      {
        heading: "Residence permit route",
        body: [
          "Work, study, family reunification, business operation, remote work, investment, research, and other 90+ day purposes usually require a residence permit route.",
        ],
      },
      {
        heading: "Why the distinction matters",
        body: [
          "Choosing a short-stay route for a long-term purpose can create refusal, overstay, or restart risk.",
        ],
      },
    ],
    cta: {
      title: "Not sure which side you are on?",
      body: "Use the calculator to separate short-stay and residence options.",
      button: "Find my route",
    },
  },
  {
    type: "blog",
    slug: "hungary-work-permit-document-checklist",
    locale: "en",
    title: "Hungary Work Permit Document Checklist for Non-EU Applicants",
    description:
      "A practical checklist overview for non-EU applicants preparing a Hungarian employment residence case.",
    keywords: [
      "Hungary work permit documents",
      "Hungary employment residence checklist",
      "Hungary work visa documents",
    ],
    category: "Documents",
    date: "2026-06-01",
    updatedAt: "2026-06-01",
    readingTime: "5 min read",
    heroLabel: "Blog",
    intro:
      "A Hungarian work residence case usually depends on both personal documents and employer-side documents.",
    sections: [
      {
        heading: "Applicant-side documents",
        body: [
          "Common applicant documents include passport, photo, accommodation, financial means where relevant, insurance, and documents about current status and prior travel history.",
        ],
      },
      {
        heading: "Employer-side documents",
        body: [
          "The employer usually needs to support the case with contract or preliminary agreement, role details, salary, workplace facts, and other employment-purpose evidence.",
        ],
      },
      {
        heading: "Route-specific extras",
        body: [
          "EU Blue Card, Hungarian Card, National Card, guest worker, seasonal, ICT, and posting routes can require different additional documents.",
        ],
      },
    ],
    cta: {
      title: "Get a route-specific checklist",
      body: "The calculator sends a checklist matched to your likely work route.",
      button: "Start work route check",
    },
  },
  {
    type: "blog",
    slug: "hungary-family-reunification-sponsor-requirements",
    locale: "en",
    title: "Hungary Family Reunification: Sponsor Status and Documents",
    description:
      "Understand why sponsor status, relationship proof, housing, and financial support matter in Hungarian family reunification cases.",
    keywords: [
      "Hungary family reunification sponsor",
      "Hungary spouse permit documents",
      "Hungary family residence documents",
    ],
    category: "Family",
    date: "2026-06-01",
    updatedAt: "2026-06-01",
    readingTime: "5 min read",
    heroLabel: "Blog",
    intro:
      "Family reunification is not only about the applicant. The sponsor’s status and supporting documents can decide the route.",
    sections: [
      {
        heading: "Sponsor status comes first",
        body: [
          "The sponsor may be a Hungarian citizen, residence permit holder, long-term resident, EEA citizen, or another qualifying person. The exact status affects the route.",
        ],
      },
      {
        heading: "Relationship proof",
        body: [
          "Marriage, birth, partnership, custody, or other civil status documents may be needed and often require translation or legalization.",
        ],
      },
      {
        heading: "Housing and support",
        body: [
          "Accommodation, financial support, and insurance are common readiness points for family-based cases.",
        ],
      },
    ],
    cta: {
      title: "Check whether family reunification fits",
      body: "Use the calculator to identify sponsor and document gaps early.",
      button: "Check family route",
    },
  },
  {
    type: "blog",
    slug: "apostille-translation-hungary-residence-permit-documents",
    locale: "en",
    title: "Apostille and Translation for Hungarian Residence Permit Documents",
    description:
      "Learn which foreign documents may need apostille, legalization, or certified Hungarian translation.",
    keywords: [
      "apostille Hungary residence permit",
      "Hungarian translation visa documents",
      "legalization documents Hungary visa",
    ],
    category: "Documents",
    date: "2026-06-01",
    updatedAt: "2026-06-01",
    readingTime: "4 min read",
    heroLabel: "Blog",
    intro:
      "Foreign documents can take the longest to prepare, especially when legalization and translation are needed.",
    sections: [
      {
        heading: "Documents often affected",
        body: [
          "Birth certificates, marriage certificates, divorce decisions, diplomas, criminal records, company extracts, and bank or investment records may need extra formalities.",
        ],
      },
      {
        heading: "Plan before deadlines",
        body: [
          "Apostille, diplomatic legalization, and certified Hungarian translation can create timing risk if left until the end.",
        ],
      },
    ],
    cta: {
      title: "Find your document category",
      body: "Use the calculator to identify which document checklist may apply.",
      button: "Get checklist",
    },
  },
];

const zhItems: ContentItem[] = [
  {
    type: "country-guides",
    slug: "hungary-visa-for-chinese-citizens",
    locale: "zh",
    title: "中国公民申请匈牙利签证和居留路径指南",
    description: "面向中国公民的匈牙利短期签证、工作、学习、家庭、远程工作和投资居留路径概览。",
    keywords: ["匈牙利签证", "匈牙利居留许可", "中国公民匈牙利签证"],
    category: "中国",
    date: "2026-06-01",
    updatedAt: "2026-06-01",
    readingTime: "5分钟阅读",
    heroLabel: "国家指南",
    intro:
      "计划前往匈牙利时，第一步通常是区分短期申根访问和90天以上的居留路径。",
    sections: [
      {
        heading: "先确认停留时间和目的",
        body: [
          "旅游、探亲或短期商务通常属于短期申根路径。工作、学习、家庭团聚、创业、远程工作和投资通常需要考虑居留许可。",
        ],
      },
      {
        heading: "常见材料方向",
        body: [
          "通常需要护照、照片、住宿证明、资金证明、保险，以及与目的相关的录取、雇佣、家庭或投资文件。",
        ],
      },
    ],
    cta: {
      title: "用中文检查你的匈牙利路径",
      body: "回答几个问题，我们会通过邮件发送可能路径和材料清单。",
      button: "开始评估",
    },
  },
  {
    type: "visa-guides",
    slug: "hungary-white-card-digital-nomad",
    locale: "zh",
    title: "匈牙利白卡：数字游民和远程工作居留指南",
    description: "了解匈牙利白卡适合哪些远程工作者、常见材料和需要人工审核的情况。",
    keywords: ["匈牙利白卡", "匈牙利数字游民签证", "匈牙利远程工作居留"],
    category: "远程工作",
    date: "2026-06-01",
    updatedAt: "2026-06-01",
    readingTime: "5分钟阅读",
    heroLabel: "签证指南",
    intro:
      "匈牙利白卡通常面向为境外雇主或境外公司远程工作的第三国公民。",
    sections: [
      {
        heading: "可能适合的人群",
        body: [
          "如果你的收入来自境外，工作可通过数字技术远程完成，并且不计划为匈牙利雇主工作，白卡可能是需要评估的路径。",
        ],
      },
      {
        heading: "常见材料",
        body: [
          "通常包括护照、境外雇佣或公司证明、收入证明、住宿证明、医疗保险和远程工作说明。",
        ],
      },
    ],
    cta: {
      title: "不确定白卡是否适合你？",
      body: "使用计算器比较远程工作、雇佣、创业或其他路径。",
      button: "检查我的路径",
    },
  },
];

const mdxBlogItems = getMdxBlogItems();
const mdxBlogKeys = new Set(
  mdxBlogItems.map((item) => `${item.locale}:${item.slug}`),
);
const legacyBlogFallbackItems = [...enBlog, ...additionalBlog].filter(
  (item) => !mdxBlogKeys.has(`${item.locale}:${item.slug}`),
);

export const contentItems = [
  ...enVisaGuides,
  ...enCountryGuides,
  ...additionalCountryGuides,
  ...mdxBlogItems,
  ...legacyBlogFallbackItems,
  ...zhItems,
];

export function getContentItems(locale: Locale, type?: ContentType) {
  return contentItems
    .filter((item) => item.locale === locale && (!type || item.type === type))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getContentItem(locale: Locale, type: ContentType, slug: string) {
  return contentItems.find(
    (item) => item.locale === locale && item.type === type && item.slug === slug,
  );
}

export function getFeaturedContent(locale: Locale) {
  const local = getContentItems(locale);
  return {
    visaGuides: local.filter((item) => item.type === "visa-guides").slice(0, 6),
    countryGuides: local.filter((item) => item.type === "country-guides").slice(0, 4),
    blog: local.filter((item) => item.type === "blog").slice(0, 3),
  };
}

export function contentTypeLabel(type: ContentType) {
  return {
    blog: "Blog",
    "visa-guides": "Visa guides",
    "country-guides": "Country guides",
  }[type];
}
