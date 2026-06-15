export type Locale = "en" | "zh";

export type QuestionType =
  | "single_choice"
  | "text"
  | "email"
  | "country"
  | "number"
  | "boolean";

export type AnswerValue = string | number | boolean | null;

export type Answers = Record<string, AnswerValue>;

export type AnswerOption = {
  id: string;
  label: Record<Locale, string>;
  description?: Record<Locale, string>;
  icon: string;
  value: string | number | boolean;
};

export type Question = {
  id: string;
  stage: "goal" | "context" | "route_details" | "readiness" | "gate";
  type: QuestionType;
  title: Record<Locale, string>;
  description?: Record<Locale, string>;
  options?: AnswerOption[];
  required: boolean;
  showIf?: (answers: Answers) => boolean;
  placeholder?: Record<Locale, string>;
};

export type ProcessPath =
  | "no_application"
  | "consulate"
  | "enter_hungary_oif"
  | "mixed"
  | "manual_review";

export type VisaRoute = {
  id: string;
  sourceSection: string;
  category:
    | "short_stay"
    | "work"
    | "study"
    | "family"
    | "business"
    | "remote_work"
    | "investment"
    | "medical"
    | "research"
    | "official"
    | "long_term"
    | "eea";
  name: Record<Locale, string>;
  summary: Record<Locale, string>;
  processPath: ProcessPath;
  baseDocuments: Record<Locale, string[]>;
  extraDocuments: Record<Locale, string[]>;
};

export type ConfidenceBand = "strong" | "likely" | "needs_review";
export type RiskLevel = "low" | "medium" | "high";

export type QualificationAnswers = {
  fullName: string;
  moveTimeline: "within_30_days" | "one_to_three_months" | "three_plus_months" | "just_researching";
  hasDocumentedBasis: boolean;
  hasValidPassport: boolean;
  budgetRange: "free_only" | "under_100" | "100_300" | "300_plus" | "employer_or_sponsor_pays";
  wantsExpertHelp: boolean;
  wouldPayForDocumentReview: boolean;
  preferredContactChannel: "email" | "whatsapp" | "phone";
  phoneOrWhatsapp?: string;
  preferredContactTime: "today" | "this_week" | "next_week" | "email_first";
  partnerContactAccepted: boolean;
  partnerDataSharingAccepted: boolean;
};

export type LeadQualificationResult = {
  intentScore: number;
  urgencyScore: number;
  budgetScore: number;
  seriousnessScore: number;
  conversionScore: number;
  partnerFitScore: number;
  leadCategory:
    | "hot_inhouse"
    | "hot_partner"
    | "employer_lead"
    | "student_lead"
    | "family_lead"
    | "low_budget"
    | "researching"
    | "risky_case";
  suggestedAction:
    | "handle_inhouse"
    | "offer_paid_document_precheck"
    | "route_to_partner"
    | "manual_review"
    | "nurture_sequence"
    | "self_service_content";
  estimatedValue: "low" | "medium" | "high" | "premium";
};

export type EligibilityResult = {
  primaryRecommendation: {
    routeId: string;
    confidenceScore: number;
    confidenceBand: ConfidenceBand;
  } | null;
  secondaryOptions: Array<{
    routeId: string;
    confidenceScore: number;
  }>;
  disqualifiers: string[];
  missingInfo: string[];
  riskFlags: string[];
  riskLevel: RiskLevel;
  processPath: ProcessPath;
};

export type LeadRecord = {
  id: string;
  leadToken: string;
  email?: string;
  fullName?: string;
  phoneOrWhatsapp?: string;
  locale: Locale;
  sourcePage: string;
  createdAt: string;
  updatedAt: string;
  answers: Answers;
  qualificationAnswers?: QualificationAnswers;
  leadQualification?: LeadQualificationResult;
  computed: EligibilityResult;
  primaryRouteId?: string;
  secondaryRouteIds: string[];
  riskFlags: string[];
  consent: {
    privacyAccepted: boolean;
    profilingAccepted: boolean;
    marketingAccepted?: boolean;
    partnerContactAccepted?: boolean;
    partnerDataSharingAccepted?: boolean;
  };
  delivery: {
    resultEmailSentAt?: string;
    resultEmailProviderId?: string;
    crmSyncedAt?: string;
    crmRecordId?: string;
  };
};
