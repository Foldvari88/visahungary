import { NextResponse } from "next/server";
import { syncLeadToCrm, triggerResendAutomationEvent } from "@/lib/integrations";
import { scoreLeadQualification } from "@/lib/lead-qualification";
import { getLead, updateLead } from "@/lib/lead-store";
import { qualificationRequestSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = qualificationRequestSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid qualification request", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const existing = getLead(parsed.data.leadToken);
  if (!existing) {
    return NextResponse.json(
      { error: "Assessment expired. Please restart the calculator." },
      { status: 404 },
    );
  }

  const leadQualification = scoreLeadQualification(
    parsed.data.answers,
    existing.answers,
    existing.computed.riskLevel,
  );

  const updated = updateLead(parsed.data.leadToken, (lead) => ({
    ...lead,
    fullName: parsed.data.answers.fullName,
    phoneOrWhatsapp: parsed.data.answers.phoneOrWhatsapp,
    qualificationAnswers: parsed.data.answers,
    leadQualification,
    updatedAt: new Date().toISOString(),
    consent: {
      ...lead.consent,
      partnerContactAccepted: parsed.data.answers.partnerContactAccepted,
      partnerDataSharingAccepted: parsed.data.answers.partnerDataSharingAccepted,
    },
  }));

  if (!updated) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  try {
    await syncLeadToCrm(updated);
  } catch (error) {
    console.error(error);
  }

  try {
    await triggerResendAutomationEvent(
      updated,
      process.env.RESEND_QUALIFICATION_SEQUENCE_EVENT || "visa.qualification.completed",
      {
        leadToken: updated.leadToken,
        locale: updated.locale,
        primaryRouteId: updated.primaryRouteId,
        riskLevel: updated.computed.riskLevel,
        leadCategory: leadQualification.leadCategory,
        suggestedAction: leadQualification.suggestedAction,
        estimatedValue: leadQualification.estimatedValue,
        intentScore: leadQualification.intentScore,
        urgencyScore: leadQualification.urgencyScore,
        budgetScore: leadQualification.budgetScore,
        conversionScore: leadQualification.conversionScore,
        partnerFitScore: leadQualification.partnerFitScore,
        partnerContactAccepted: updated.consent.partnerContactAccepted,
        partnerDataSharingAccepted: updated.consent.partnerDataSharingAccepted,
      },
    );
  } catch (error) {
    console.error(error);
  }

  return NextResponse.json({
    status: "saved",
    leadQualification,
    message:
      leadQualification.suggestedAction === "offer_paid_document_precheck"
        ? "Your readiness check is saved. A document pre-check is the best next step."
        : leadQualification.suggestedAction === "manual_review"
          ? "Your readiness check is saved. Manual review is recommended."
          : "Your readiness check is saved.",
  });
}
