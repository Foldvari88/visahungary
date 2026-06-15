import { routeById } from "@/lib/route-catalog";
import type { Answers, EligibilityResult, ProcessPath } from "@/lib/types";

type ScoreMap = Map<string, number>;

function add(scores: ScoreMap, routeId: string, value: number) {
  scores.set(routeId, (scores.get(routeId) ?? 0) + value);
}

function answer(answers: Answers, id: string) {
  return answers[id];
}

function hasReady(value: unknown) {
  return value === "yes" || value === "contract" || value === "fund_250k" || value === "donation_1m";
}

function confidenceBand(score: number, highRisk: boolean) {
  if (highRisk || score < 50) return "needs_review" as const;
  if (score >= 75) return "strong" as const;
  return "likely" as const;
}

function resolveProcessPath(routeId: string | undefined, forceReview: boolean): ProcessPath {
  if (forceReview || !routeId) return "manual_review";
  return routeById.get(routeId)?.processPath ?? "manual_review";
}

export function calculateEligibility(answers: Answers): EligibilityResult {
  const scores: ScoreMap = new Map();
  const missingInfo: string[] = [];
  const disqualifiers: string[] = [];
  const riskFlags: string[] = [];

  const purpose = answer(answers, "purpose");
  const stay = answer(answers, "intendedStay");
  const visaFree = answer(answers, "visaFreeEntry");
  const location = answer(answers, "currentLocation");
  const currentPermit = answer(answers, "hasHungarianPermit");
  const euPermit = answer(answers, "hasEuPermit");

  if (purpose === "visit") {
    add(scores, "visa_free_short_stay", 40);
    add(scores, "schengen_c_visa", 40);
  }

  if (stay === "transit") add(scores, "airport_transit_a_visa", 80);

  if (stay === "short") {
    if (visaFree === "yes") add(scores, "visa_free_short_stay", 55);
    if (visaFree === "no") add(scores, "schengen_c_visa", 55);
    if (visaFree === "unknown") {
      add(scores, "schengen_c_visa", 30);
      missingInfo.push("Confirm whether the citizenship allows Schengen visa-free entry.");
    }
  }

  if (stay === "long" || stay === "switch") {
    add(scores, "employment_residence", purpose === "work" ? 20 : 0);
    add(scores, "study", purpose === "study" ? 20 : 0);
    add(scores, "family_reunification", purpose === "family" ? 20 : 0);
    add(scores, "guest_self_employment", purpose === "business" ? 20 : 0);
    add(scores, "white_card", purpose === "remote" ? 20 : 0);
    add(scores, "guest_investor_residence", purpose === "invest" ? 20 : 0);
  }

  if (stay === "permanent") {
    add(scores, "manual_review", 60);
    missingInfo.push("Long-term status depends on residence history and specialist review.");
  }

  const employer = answer(answers, "hasHungarianEmployer");
  if (purpose === "work" || employer) {
    add(scores, "employment_residence", 40);
    if (employer === "contract") add(scores, "employment_residence", 25);
    if (employer === "talks") {
      add(scores, "employment_residence", 10);
      missingInfo.push("Employment route usually needs a contract or preliminary agreement.");
    }
    if (employer === "no") {
      add(scores, "employment_residence", -30);
      missingInfo.push("A Hungarian employment route needs an employer or qualifying work setup.");
    }
    if (answer(answers, "highQualification") === "yes") {
      add(scores, "eu_blue_card", 55);
      add(scores, "hungarian_card", 50);
      add(scores, "employment_residence", 10);
    }
  }

  if (purpose === "study" || answer(answers, "hasAdmission")) {
    add(scores, "study", 40);
    const admission = answer(answers, "hasAdmission");
    if (admission === "yes") add(scores, "study", 30);
    if (admission === "pending") {
      add(scores, "study", 10);
      missingInfo.push("Study route usually needs admission or active student status.");
    }
    if (euPermit === "yes") add(scores, "study", 5);
  }

  if (purpose === "family" || answer(answers, "hasFamilySponsor")) {
    const sponsor = answer(answers, "hasFamilySponsor");
    add(scores, "family_reunification", 40);
    if (sponsor === "hungarian") add(scores, "family_reunification", 35);
    if (sponsor === "eea") {
      add(scores, "eea_family_card", 60);
      add(scores, "c_eea_family_visa", stay === "short" ? 35 : 0);
    }
    if (sponsor === "none") {
      add(scores, "family_reunification", -35);
      missingInfo.push("Family routes require a qualifying sponsor and relationship documents.");
    }
  }

  if (purpose === "business" || answer(answers, "businessStatus")) {
    add(scores, "guest_self_employment", 40);
    if (answer(answers, "businessStatus") === "existing_company") add(scores, "guest_self_employment", 30);
    if (answer(answers, "businessStatus") === "self_employed") add(scores, "guest_self_employment", 25);
    if (answer(answers, "businessStatus") === "idea") missingInfo.push("Business/self-employment route needs real activity and supporting documents.");
  }

  if (purpose === "remote" || answer(answers, "remoteWorkProfile")) {
    add(scores, "white_card", 45);
    const profile = answer(answers, "remoteWorkProfile");
    const income = Number(answer(answers, "monthlyNetIncomeEur") ?? 0);
    if (profile === "foreign_employer") add(scores, "white_card", 30);
    if (profile === "hungarian_clients") {
      add(scores, "white_card", -50);
      disqualifiers.push("White Card generally does not fit Hungarian work activity or Hungarian company ownership.");
    }
    if (income >= 3000) add(scores, "white_card", 20);
    if (income > 0 && income < 3000) {
      add(scores, "white_card", -15);
      missingInfo.push("White Card readiness may depend on verified monthly income around EUR 3,000 net.");
    }
  }

  if (purpose === "invest" || answer(answers, "investmentCapacity")) {
    const investment = answer(answers, "investmentCapacity");
    add(scores, "guest_investor_visa", 35);
    add(scores, "guest_investor_residence", 35);
    if (investment === "fund_250k" || investment === "donation_1m") {
      add(scores, location === "outside_eu" ? "guest_investor_visa" : "guest_investor_residence", 35);
    }
    if (investment === "not_ready") {
      add(scores, "guest_investor_visa", -25);
      add(scores, "guest_investor_residence", -25);
      missingInfo.push("Guest investor route requires documented qualifying investment and source of funds.");
    }
  }

  if (currentPermit === "yes") {
    add(scores, "employment_residence", 5);
    add(scores, "study", 5);
    add(scores, "family_reunification", 5);
    add(scores, "guest_self_employment", 5);
    add(scores, "white_card", 5);
  }

  if (location === "outside_eu" && stay !== "short" && stay !== "transit") {
    missingInfo.push("First applications often require consular submission or a D visa pickup path.");
  }

  for (const readinessId of ["housingReady", "financialProofReady", "insuranceReady"]) {
    const value = answer(answers, readinessId);
    if (hasReady(value)) {
      for (const routeId of scores.keys()) add(scores, routeId, 5);
    } else if (value === "no") {
      missingInfo.push(`Missing readiness item: ${readinessId}.`);
    }
  }

  if (answer(answers, "deadlineUrgency") === "urgent") {
    riskFlags.push("Very urgent deadline.");
  }

  if (answer(answers, "priorRefusalOrOverstay") === "yes") {
    riskFlags.push("Prior refusal, overstay, deportation, or entry-ban history.");
  }

  if (answer(answers, "priorRefusalOrOverstay") === "prefer_review") {
    riskFlags.push("User requested manual review.");
  }

  if (!scores.size) {
    add(scores, "manual_review", 55);
    missingInfo.push("Answers do not point clearly to one route.");
  }

  const highRisk = riskFlags.some((flag) => flag.includes("Prior") || flag.includes("manual review"));

  if (highRisk) add(scores, "manual_review", 90);

  const ranked = [...scores.entries()]
    .map(([routeId, score]) => ({ routeId, confidenceScore: Math.max(0, Math.min(100, score)) }))
    .sort((a, b) => b.confidenceScore - a.confidenceScore);

  const primary = ranked[0];
  const primaryRouteId = highRisk ? "manual_review" : primary?.routeId;
  const primaryScore = highRisk ? Math.max(65, primary?.confidenceScore ?? 65) : primary?.confidenceScore ?? 0;

  const riskLevel = highRisk ? "high" : riskFlags.length || missingInfo.length > 2 ? "medium" : "low";

  return {
    primaryRecommendation: primaryRouteId
      ? {
          routeId: primaryRouteId,
          confidenceScore: primaryScore,
          confidenceBand: confidenceBand(primaryScore, highRisk),
        }
      : null,
    secondaryOptions: ranked
      .filter((item) => item.routeId !== primaryRouteId)
      .slice(0, 3),
    disqualifiers,
    missingInfo: [...new Set(missingInfo)].slice(0, 6),
    riskFlags: [...new Set(riskFlags)],
    riskLevel,
    processPath: resolveProcessPath(primaryRouteId, highRisk),
  };
}
