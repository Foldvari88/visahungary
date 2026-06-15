import type {
  Answers,
  LeadQualificationResult,
  QualificationAnswers,
  RiskLevel,
} from "@/lib/types";

function clamp(score: number) {
  return Math.max(0, Math.min(100, score));
}

function purposeBonus(answers: Answers) {
  const purpose = String(answers.purpose ?? "");
  if (["work", "study", "family", "invest", "business", "remote"].includes(purpose)) {
    return 25;
  }
  return purpose ? 10 : 0;
}

function routeCategory(answers: Answers) {
  const purpose = String(answers.purpose ?? "");
  if (purpose.includes("work")) return "employer_lead";
  if (purpose.includes("study")) return "student_lead";
  if (purpose.includes("family")) return "family_lead";
  return null;
}

export function scoreLeadQualification(
  answers: QualificationAnswers,
  calculatorAnswers: Answers,
  riskLevel: RiskLevel,
): LeadQualificationResult {
  const intentScore = clamp(
    purposeBonus(calculatorAnswers) +
      (answers.hasDocumentedBasis ? 20 : 0) +
      (answers.moveTimeline === "within_30_days" || answers.moveTimeline === "one_to_three_months"
        ? 15
        : 0) +
      (answers.preferredContactChannel !== "email" && answers.phoneOrWhatsapp ? 10 : 0) +
      (answers.wantsExpertHelp ? 10 : 0) +
      (answers.wouldPayForDocumentReview ? 10 : 0) -
      (answers.moveTimeline === "just_researching" ? 20 : 0),
  );

  const urgencyScore = clamp(
    (answers.moveTimeline === "within_30_days" ? 30 : 0) +
      (answers.moveTimeline === "one_to_three_months" ? 15 : 0) +
      (String(calculatorAnswers.deadlineUrgency ?? "").includes("urgent") ? 20 : 0) +
      (String(calculatorAnswers.currentLocation ?? "").includes("hungary") ? 10 : 0),
  );

  const budgetScore = clamp(
    (answers.budgetRange === "300_plus" ? 30 : 0) +
      (answers.budgetRange === "100_300" ? 20 : 0) +
      (answers.budgetRange === "employer_or_sponsor_pays" ? 25 : 0) +
      (answers.wouldPayForDocumentReview ? 20 : 0) +
      (answers.wantsExpertHelp ? 10 : 0) -
      (answers.budgetRange === "free_only" ? 20 : 0),
  );

  const seriousnessScore = clamp(
    (answers.fullName.trim().split(/\s+/).length >= 2 ? 20 : 10) +
      (answers.phoneOrWhatsapp ? 20 : 0) +
      (answers.hasValidPassport ? 20 : 0) +
      (answers.hasDocumentedBasis ? 20 : 0) +
      (answers.preferredContactTime !== "email_first" ? 15 : 0),
  );

  const conversionScore = clamp(
    Math.round(intentScore * 0.35 + urgencyScore * 0.2 + budgetScore * 0.3 + seriousnessScore * 0.15),
  );

  const partnerFitScore = clamp(
    conversionScore +
      (answers.partnerContactAccepted && answers.partnerDataSharingAccepted ? 20 : -25) -
      (riskLevel === "high" ? 25 : 0),
  );

  const specificCategory = routeCategory(calculatorAnswers);
  const risky = riskLevel === "high";
  const leadCategory =
    risky
      ? "risky_case"
      : conversionScore >= 75
        ? "hot_inhouse"
        : partnerFitScore >= 70
          ? "hot_partner"
          : specificCategory ?? (budgetScore <= 20 ? "low_budget" : "researching");

  const suggestedAction =
    leadCategory === "risky_case"
      ? "manual_review"
      : conversionScore >= 80
        ? "handle_inhouse"
        : answers.wouldPayForDocumentReview
          ? "offer_paid_document_precheck"
          : leadCategory === "hot_partner"
            ? "route_to_partner"
            : budgetScore <= 20
              ? "self_service_content"
              : "nurture_sequence";

  const estimatedValue =
    conversionScore >= 85 || String(calculatorAnswers.purpose ?? "").includes("invest")
      ? "premium"
      : conversionScore >= 70
        ? "high"
        : conversionScore >= 45
          ? "medium"
          : "low";

  return {
    intentScore,
    urgencyScore,
    budgetScore,
    seriousnessScore,
    conversionScore,
    partnerFitScore,
    leadCategory,
    suggestedAction,
    estimatedValue,
  };
}
