import { NextResponse } from "next/server";
import {
  buildResultEmail,
  syncLeadToCrm,
  sendResultEmail,
  triggerResendAutomationEvent,
} from "@/lib/integrations";
import { getLead, updateLead } from "@/lib/lead-store";
import { sendResultRequestSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = sendResultRequestSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", issues: parsed.error.flatten() },
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

  const now = new Date().toISOString();
  const leadWithEmail = updateLead(parsed.data.leadToken, (lead) => ({
    ...lead,
    email: parsed.data.email,
    locale: parsed.data.preferredLanguage,
    updatedAt: now,
    consent: {
      ...lead.consent,
      privacyAccepted: parsed.data.consent.privacyAccepted,
      marketingAccepted: parsed.data.consent.marketingAccepted,
    },
  }));

  if (!leadWithEmail) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  let crmRecordId: string | undefined;
  try {
    const crm = await syncLeadToCrm(leadWithEmail);
    crmRecordId = crm.id;
  } catch (error) {
    console.error(error);
  }

  let emailProviderId: string | undefined;
  let status: "sent" | "queued" = "sent";

  try {
    const sent = await sendResultEmail(leadWithEmail, parsed.data.preferredLanguage);
    emailProviderId = sent.id;
  } catch (error) {
    console.error(error);
    status = "queued";
  }

  try {
    await triggerResendAutomationEvent(
      leadWithEmail,
      process.env.RESEND_ASSESSMENT_SEQUENCE_EVENT || "visa.assessment.sent",
      {
        leadToken: leadWithEmail.leadToken,
        locale: leadWithEmail.locale,
        primaryRouteId: leadWithEmail.primaryRouteId,
        riskLevel: leadWithEmail.computed.riskLevel,
        confidenceBand: leadWithEmail.computed.primaryRecommendation?.confidenceBand,
        purpose: String(leadWithEmail.answers.purpose ?? ""),
        nationality: String(leadWithEmail.answers.nationality ?? ""),
        qualificationUrl: buildResultEmail(leadWithEmail, parsed.data.preferredLanguage)
          .qualificationUrl,
      },
    );
  } catch (error) {
    console.error(error);
  }

  updateLead(parsed.data.leadToken, (lead) => ({
    ...lead,
    updatedAt: new Date().toISOString(),
    delivery: {
      ...lead.delivery,
      crmRecordId,
      crmSyncedAt: crmRecordId ? new Date().toISOString() : lead.delivery.crmSyncedAt,
      resultEmailProviderId: emailProviderId,
      resultEmailSentAt: emailProviderId
        ? new Date().toISOString()
        : lead.delivery.resultEmailSentAt,
    },
  }));

  const locale = parsed.data.preferredLanguage;
  const resultEmail = buildResultEmail(leadWithEmail, locale);

  return NextResponse.json({
    status,
    message:
      locale === "zh"
        ? status === "sent"
          ? "你的结果正在发送。"
          : "你的结果已进入发送队列。"
        : status === "sent"
          ? "Your result is on its way."
          : "Your result has been queued for delivery.",
    nextStepCta: {
      label: "Complete your readiness check",
      href: resultEmail.qualificationUrl,
    },
  });
}
