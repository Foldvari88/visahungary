import { NextResponse } from "next/server";
import { calculateEligibility } from "@/lib/eligibility";
import { createLead } from "@/lib/lead-store";
import { previewRequestSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = previewRequestSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const now = new Date().toISOString();
  const computed = calculateEligibility(parsed.data.answers);
  const id = crypto.randomUUID();
  const leadToken = crypto.randomUUID().replaceAll("-", "");

  createLead({
    id,
    leadToken,
    locale: parsed.data.locale,
    sourcePage: parsed.data.sourcePage,
    createdAt: now,
    updatedAt: now,
    answers: parsed.data.answers,
    computed,
    primaryRouteId: computed.primaryRecommendation?.routeId,
    secondaryRouteIds: computed.secondaryOptions.map((option) => option.routeId),
    riskFlags: computed.riskFlags,
    consent: {
      privacyAccepted: parsed.data.consent.privacyAccepted,
      profilingAccepted: parsed.data.consent.profilingAccepted,
    },
    delivery: {},
  });

  return NextResponse.json({
    leadToken,
    teaser: {
      title:
        parsed.data.locale === "zh"
          ? "你的评估已完成"
          : "Your assessment is ready",
      body:
        parsed.data.locale === "zh"
          ? "我们已找到可能适合你的路径、办理流程和材料清单。请输入邮箱接收完整结果。"
          : "We found your likely route, process path, and document checklist. Enter your email and we will send the full result.",
      confidenceBand: computed.primaryRecommendation?.confidenceBand ?? "needs_review",
      riskLevel: computed.riskLevel,
      missingCriticalAnswers: computed.missingInfo.slice(0, 3),
    },
  });
}
