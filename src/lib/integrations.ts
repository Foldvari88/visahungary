import { routeById } from "@/lib/route-catalog";
import type { LeadRecord, Locale } from "@/lib/types";

type ResendEventPayload = Record<string, string | number | boolean | null | undefined>;

export async function syncLeadToCrm(lead: LeadRecord) {
  const endpoint = process.env.CRM_WEBHOOK_URL;
  const payload = {
    email: lead.email,
    locale: lead.locale,
    purpose: lead.answers.purpose,
    nationality: lead.answers.nationality,
    intendedStay: lead.answers.intendedStay,
    primaryRouteId: lead.primaryRouteId,
    secondaryRouteIds: lead.secondaryRouteIds,
    riskFlags: lead.riskFlags,
    riskLevel: lead.computed.riskLevel,
    confidenceBand: lead.computed.primaryRecommendation?.confidenceBand,
    qualificationAnswers: lead.qualificationAnswers,
    leadQualification: lead.leadQualification,
    sourcePage: lead.sourcePage,
    answers: lead.answers,
    consent: lead.consent,
  };

  if (!endpoint) {
    return { id: `mock-crm-${lead.id}`, synced: true, payload };
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`CRM sync failed: ${response.status}`);
  }

  return { id: `crm-${lead.id}`, synced: true, payload };
}

function canTriggerSequence(lead: LeadRecord) {
  if (!lead.email) return false;
  if (process.env.RESEND_SEQUENCE_REQUIRE_MARKETING_CONSENT === "false") return true;
  return lead.consent.marketingAccepted === true;
}

function sanitizeEventPayload(payload: ResendEventPayload) {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined && value !== null),
  );
}

export async function triggerResendAutomationEvent(
  lead: LeadRecord,
  event: string,
  payload: ResendEventPayload,
) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!canTriggerSequence(lead)) {
    return { triggered: false, reason: "missing_email_or_marketing_consent" };
  }

  if (!apiKey) {
    console.log("Mock Resend automation event", {
      event,
      email: lead.email,
      payload: sanitizeEventPayload(payload),
    });
    return { triggered: true, event, mock: true };
  }

  const response = await fetch("https://api.resend.com/events/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      event,
      email: lead.email,
      payload: sanitizeEventPayload(payload),
    }),
  });

  const data = (await response.json().catch(() => null)) as
    | { object?: string; event?: string; error?: { message?: string } }
    | null;

  if (!response.ok) {
    throw new Error(data?.error?.message ?? `Resend event failed: ${response.status}`);
  }

  return { triggered: true, event: data?.event ?? event };
}

function processLabel(path: string, locale: Locale) {
  const labels = {
    en: {
      no_application: "No prior application / border compliance",
      consulate: "Consular submission",
      enter_hungary_oif: "Enter Hungary / OIF",
      mixed: "Consulate or Enter Hungary / OIF depending on status",
      manual_review: "Manual review recommended",
    },
    zh: {
      no_application: "无需预先申请 / 入境合规",
      consulate: "领事馆递交",
      enter_hungary_oif: "Enter Hungary / OIF",
      mixed: "视身份而定：领事馆或 Enter Hungary / OIF",
      manual_review: "建议人工审核",
    },
  } as const;

  return labels[locale][path as keyof (typeof labels)["en"]] ?? path;
}

function getSiteUrl() {
  const configured =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");

  return (configured || "http://localhost:3000").replace(/\/$/, "");
}

function qualificationUrl(lead: LeadRecord, locale: Locale) {
  return `${getSiteUrl()}/${locale}/qualification?leadToken=${encodeURIComponent(lead.leadToken)}`;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function listItems(items: string[]) {
  return items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
}

export function buildResultEmail(lead: LeadRecord, locale: Locale) {
  const route = lead.primaryRouteId ? routeById.get(lead.primaryRouteId) : null;
  const secondary = lead.secondaryRouteIds
    .map((routeId) => routeById.get(routeId))
    .filter(Boolean)
    .slice(0, 2);

  const subject =
    locale === "zh" ? "你的匈牙利签证路径评估" : "Your Hungary visa route assessment";

  const disclaimer =
    locale === "zh"
      ? "本评估仅用于初步信息参考，不构成法律建议。最终资格取决于最新官方规定、材料、期限和主管机关审核。"
      : "This assessment is preliminary information only and is not legal advice. Final eligibility depends on current official rules, documents, deadlines, and authority review.";

  const greeting = locale === "zh" ? "你好，" : "Hello,";
  const routeTitle = route?.name[locale] ?? (locale === "zh" ? "建议人工审核" : "Manual review recommended");
  const routeSummary = route?.summary[locale] ?? "";
  const docs = route ? [...route.baseDocuments[locale], ...route.extraDocuments[locale]] : [];
  const readinessHref = qualificationUrl(lead, locale);

  const body =
    locale === "zh"
      ? `${greeting}

你的初步评估结果如下：

最可能的路径：${routeTitle}
${routeSummary}

办理路径：${processLabel(lead.computed.processPath, locale)}
匹配度：${lead.computed.primaryRecommendation?.confidenceBand ?? "needs_review"}
风险等级：${lead.computed.riskLevel}

材料清单：
${docs.map((item) => `- ${item}`).join("\n")}

${lead.computed.missingInfo.length ? `需要补充确认：\n${lead.computed.missingInfo.map((item) => `- ${item}`).join("\n")}\n` : ""}
${lead.computed.riskFlags.length ? `风险提示：\n${lead.computed.riskFlags.map((item) => `- ${item}`).join("\n")}\n` : ""}

${secondary.length ? `其他可能路径：${secondary.map((item) => item?.name[locale]).join(", ")}\n` : ""}
${disclaimer}

Next step: complete your readiness check
${readinessHref}`
      : `${greeting}

Your preliminary assessment is ready:

Likely route: ${routeTitle}
${routeSummary}

Likely process path: ${processLabel(lead.computed.processPath, locale)}
Confidence: ${lead.computed.primaryRecommendation?.confidenceBand ?? "needs_review"}
Risk level: ${lead.computed.riskLevel}

Document checklist:
${docs.map((item) => `- ${item}`).join("\n")}

${lead.computed.missingInfo.length ? `Information to confirm:\n${lead.computed.missingInfo.map((item) => `- ${item}`).join("\n")}\n` : ""}
${lead.computed.riskFlags.length ? `Risk notes:\n${lead.computed.riskFlags.map((item) => `- ${item}`).join("\n")}\n` : ""}

${secondary.length ? `Other possible routes: ${secondary.map((item) => item?.name[locale]).join(", ")}\n` : ""}
${disclaimer}

Next step: complete your readiness check
${readinessHref}`;

  const html = `
<!doctype html>
<html>
  <body style="margin:0;background:#f8f2e7;font-family:Arial,sans-serif;color:#173c32;">
    <div style="max-width:640px;margin:0 auto;padding:28px 18px;">
      <div style="background:#fffaf1;border:1px solid #e5dccd;border-radius:8px;padding:24px;">
        <p style="margin:0 0 14px;color:#9a7425;font-weight:700;">VisaHungary assessment</p>
        <h1 style="margin:0 0 12px;font-size:28px;line-height:1.1;">${escapeHtml(routeTitle)}</h1>
        <p style="margin:0 0 18px;line-height:1.55;">${escapeHtml(routeSummary)}</p>
        <p style="margin:0 0 8px;"><strong>Likely process:</strong> ${escapeHtml(processLabel(lead.computed.processPath, locale))}</p>
        <p style="margin:0 0 8px;"><strong>Confidence:</strong> ${escapeHtml(lead.computed.primaryRecommendation?.confidenceBand ?? "needs_review")}</p>
        <p style="margin:0 0 18px;"><strong>Risk level:</strong> ${escapeHtml(lead.computed.riskLevel)}</p>
        <h2 style="font-size:18px;margin:22px 0 8px;">Document checklist</h2>
        <ul style="padding-left:20px;line-height:1.55;">${listItems(docs)}</ul>
        ${
          lead.computed.missingInfo.length
            ? `<h2 style="font-size:18px;margin:22px 0 8px;">Information to confirm</h2><ul style="padding-left:20px;line-height:1.55;">${listItems(lead.computed.missingInfo)}</ul>`
            : ""
        }
        ${
          lead.computed.riskFlags.length
            ? `<h2 style="font-size:18px;margin:22px 0 8px;">Risk notes</h2><ul style="padding-left:20px;line-height:1.55;">${listItems(lead.computed.riskFlags)}</ul>`
            : ""
        }
        <p style="margin:22px 0;line-height:1.55;color:#536058;">${escapeHtml(disclaimer)}</p>
        <div style="border-top:1px solid #e5dccd;margin-top:22px;padding-top:22px;">
          <h2 style="font-size:20px;margin:0 0 8px;">Want a more accurate next step?</h2>
          <p style="margin:0 0 16px;line-height:1.55;color:#536058;">Answer a few readiness questions about timing, documents, budget, and preferred contact. This helps us decide whether your case needs self-service guidance, document pre-check, or human review.</p>
          <a href="${escapeHtml(readinessHref)}" style="display:inline-block;background:#174437;color:#fffaf1;text-decoration:none;border-radius:8px;padding:13px 18px;font-weight:700;">Complete your readiness check</a>
        </div>
      </div>
    </div>
  </body>
</html>`;

  return { subject, body, html, qualificationUrl: readinessHref };
}

export async function sendResultEmail(lead: LeadRecord, locale: Locale) {
  const email = buildResultEmail(lead, locale);
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM || "VisaHungary <onboarding@resend.dev>";
  const replyTo = process.env.RESEND_REPLY_TO;
  const bcc = process.env.RESEND_INTERNAL_BCC;

  if (!apiKey) {
    console.log("Mock VisaHungary result email", {
      to: lead.email,
      subject: email.subject,
      body: email.body,
      html: email.html,
    });
    return { id: `mock-email-${lead.id}`, sent: true };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `result-${lead.id}-${locale}`,
    },
    body: JSON.stringify({
      from,
      to: lead.email,
      ...(replyTo ? { reply_to: replyTo } : {}),
      ...(bcc ? { bcc } : {}),
      subject: email.subject,
      text: email.body,
      html: email.html,
      tags: [
        { name: "source", value: "calculator" },
        { name: "locale", value: locale },
        { name: "route", value: lead.primaryRouteId ?? "manual_review" },
      ],
    }),
  });

  const payload = (await response.json().catch(() => null)) as
    | { id?: string; error?: { message?: string } }
    | null;

  if (!response.ok) {
    throw new Error(payload?.error?.message ?? `Resend email send failed: ${response.status}`);
  }

  return { id: payload?.id ?? `resend-email-${lead.id}`, sent: true };
}
