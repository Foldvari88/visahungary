import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const OUTPUT_PATH = path.join(ROOT, "automation-output", "resend-automation-sequence.json");

const assessmentEvent = process.env.RESEND_ASSESSMENT_SEQUENCE_EVENT || "visa.assessment.sent";
const qualificationEvent =
  process.env.RESEND_QUALIFICATION_SEQUENCE_EVENT || "visa.qualification.completed";
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://visahungary.hu").replace(/\/$/, "");
const from = process.env.RESEND_FROM || "VisaHungary <hello@visahungary.hu>";
const replyTo = process.env.RESEND_REPLY_TO || "hello@visahungary.hu";

const sharedVariables = {
  leadToken: { var: "event.leadToken" },
  locale: { var: "event.locale" },
  primaryRouteId: { var: "event.primaryRouteId" },
  riskLevel: { var: "event.riskLevel" },
  siteUrl,
};

const assessmentVariables = {
  ...sharedVariables,
  confidenceBand: { var: "event.confidenceBand" },
  purpose: { var: "event.purpose" },
  nationality: { var: "event.nationality" },
  qualificationUrl: { var: "event.qualificationUrl" },
};

const qualificationVariables = {
  ...sharedVariables,
  leadCategory: { var: "event.leadCategory" },
  suggestedAction: { var: "event.suggestedAction" },
  estimatedValue: { var: "event.estimatedValue" },
  intentScore: { var: "event.intentScore" },
  urgencyScore: { var: "event.urgencyScore" },
  budgetScore: { var: "event.budgetScore" },
  conversionScore: { var: "event.conversionScore" },
  partnerFitScore: { var: "event.partnerFitScore" },
};

const unsubscribeLine = {
  en: "You can unsubscribe from VisaHungary updates here: {{{RESEND_UNSUBSCRIBE_URL}}}",
  zh: "你可以在这里取消订阅 VisaHungary 更新：{{{RESEND_UNSUBSCRIBE_URL}}}",
};

const disclaimer = {
  en: "This is preliminary information only, not legal advice. Your likely route may fit your answers, but final eligibility depends on current official rules, documents, deadlines, and authority review.",
  zh: "本邮件仅提供初步信息，不构成法律意见。该可能路线可能符合你的回答，但最终资格取决于最新官方规则、材料、期限和主管机关审核。",
};

const templates = [
  {
    alias: "vh-assessment-ready-en",
    locale: "en",
    subject: "Your Hungary visa checklist is ready",
    ctaLabel: "Complete your readiness check",
    ctaUrl: "{{qualificationUrl}}",
    text: `Hello,

Your Hungary visa route assessment and checklist have been sent.

The next useful step is a short readiness check. It helps VisaHungary understand your timing, documents, budget, and whether manual review may be recommended before you act on the likely route.

Complete your readiness check: {{qualificationUrl}}

${disclaimer.en}

${unsubscribeLine.en}`,
  },
  {
    alias: "vh-assessment-ready-zh",
    locale: "zh",
    subject: "你的匈牙利签证清单已准备好",
    ctaLabel: "完成准备度检查",
    ctaUrl: "{{qualificationUrl}}",
    text: `你好，

你的匈牙利签证路线评估和清单已经发送。

下一步建议完成一个简短的准备度检查。它可以帮助 VisaHungary 了解你的时间安排、材料、预算，以及是否建议人工审核后再行动。

完成准备度检查：{{qualificationUrl}}

${disclaimer.zh}

${unsubscribeLine.zh}`,
  },
  {
    alias: "vh-readiness-reminder-en",
    locale: "en",
    subject: "Want a more accurate next step for Hungary?",
    ctaLabel: "Finish readiness check",
    ctaUrl: "{{qualificationUrl}}",
    text: `Hello,

The calculator gives a likely route, but the next step depends on documents, timing, current location, and risk flags.

The readiness check keeps this concise and helps us see whether self-service guidance, document pre-check, or manual review may fit your answers.

Finish readiness check: {{qualificationUrl}}

${disclaimer.en}

${unsubscribeLine.en}`,
  },
  {
    alias: "vh-readiness-reminder-zh",
    locale: "zh",
    subject: "想知道更准确的匈牙利下一步吗？",
    ctaLabel: "完成准备度检查",
    ctaUrl: "{{qualificationUrl}}",
    text: `你好，

计算器会给出可能路线，但下一步还取决于材料、时间、当前位置和风险提示。

准备度检查可以帮助我们判断你的情况更适合自助信息、材料预审，还是人工审核。

完成准备度检查：{{qualificationUrl}}

${disclaimer.zh}

${unsubscribeLine.zh}`,
  },
  {
    alias: "vh-manual-review-en",
    locale: "en",
    subject: "Your Hungary case may need manual review",
    ctaLabel: "Request human review",
    ctaUrl: "{{siteUrl}}/{{locale}}/qualification?leadToken={{leadToken}}&next=manual_review",
    text: `Hello,

Some Hungary visa or residence cases should be reviewed before the next step.

Prior refusals, overstay, urgent deadlines, missing documents, or unclear status can change which route may fit your answers. A human review can help reduce the chance of choosing the wrong process.

Request human review: {{siteUrl}}/{{locale}}/qualification?leadToken={{leadToken}}&next=manual_review

${disclaimer.en}

${unsubscribeLine.en}`,
  },
  {
    alias: "vh-manual-review-zh",
    locale: "zh",
    subject: "你的匈牙利情况可能需要人工审核",
    ctaLabel: "申请人工审核",
    ctaUrl: "{{siteUrl}}/{{locale}}/qualification?leadToken={{leadToken}}&next=manual_review",
    text: `你好，

有些匈牙利签证或居留情况，在进入下一步前更适合人工审核。

曾被拒签、逾期停留、期限紧急、材料缺失或身份不清，都可能影响哪条路线更适合你的回答。人工审核可以降低选错流程的风险。

申请人工审核：{{siteUrl}}/{{locale}}/qualification?leadToken={{leadToken}}&next=manual_review

${disclaimer.zh}

${unsubscribeLine.zh}`,
  },
  {
    alias: "vh-prep-guide-en",
    locale: "en",
    subject: "What to prepare before applying for Hungary",
    ctaLabel: "Complete readiness check",
    ctaUrl: "{{qualificationUrl}}",
    text: `Hello,

Most Hungary visa or residence routes depend on passport validity, a purpose document, accommodation, insurance, financial proof, and timing.

Your likely route may fit your answers, but readiness depends on whether those pieces are realistic for your situation.

Complete readiness check: {{qualificationUrl}}

${disclaimer.en}

${unsubscribeLine.en}`,
  },
  {
    alias: "vh-prep-guide-zh",
    locale: "zh",
    subject: "申请匈牙利前需要准备什么",
    ctaLabel: "完成准备度检查",
    ctaUrl: "{{qualificationUrl}}",
    text: `你好，

大多数匈牙利签证或居留路线都取决于护照有效期、目的证明、住宿、保险、资金证明和时间安排。

你的可能路线可能符合你的回答，但是否准备好，还取决于这些条件在你的具体情况下是否可行。

完成准备度检查：{{qualificationUrl}}

${disclaimer.zh}

${unsubscribeLine.zh}`,
  },
  {
    alias: "vh-paid-precheck-en",
    locale: "en",
    subject: "Your documents may be ready for a pre-check",
    ctaLabel: "Start document pre-check",
    ctaUrl: "{{siteUrl}}/{{locale}}/qualification?leadToken={{leadToken}}&next=document_precheck",
    text: `Hello,

Your readiness answers suggest a document readiness review may be a useful small paid step before a full consultation.

This is for checking whether your planned documents look complete enough for the likely route. Please do not email passport scans, bank statements, or sensitive documents at this stage.

Start document pre-check: {{siteUrl}}/{{locale}}/qualification?leadToken={{leadToken}}&next=document_precheck

${disclaimer.en}

${unsubscribeLine.en}`,
  },
  {
    alias: "vh-paid-precheck-zh",
    locale: "zh",
    subject: "你的材料可能适合先做预审",
    ctaLabel: "开始材料预审",
    ctaUrl: "{{siteUrl}}/{{locale}}/qualification?leadToken={{leadToken}}&next=document_precheck",
    text: `你好，

你的准备度回答显示，在完整咨询前，先做一次小额付费材料准备度审核可能有帮助。

这一步用于判断你计划准备的材料是否足以支持可能路线。现阶段请不要通过邮件发送护照扫描件、银行流水或敏感文件。

开始材料预审：{{siteUrl}}/{{locale}}/qualification?leadToken={{leadToken}}&next=document_precheck

${disclaimer.zh}

${unsubscribeLine.zh}`,
  },
  {
    alias: "vh-qualified-manual-review-en",
    locale: "en",
    subject: "Manual review is recommended for your Hungary case",
    ctaLabel: "Request manual review",
    ctaUrl: "{{siteUrl}}/{{locale}}/qualification?leadToken={{leadToken}}&next=manual_review",
    text: `Hello,

Your readiness answers indicate risk, missing information, or complexity.

Manual review may be recommended before you choose a route, book appointments, or spend money on documents.

Request manual review: {{siteUrl}}/{{locale}}/qualification?leadToken={{leadToken}}&next=manual_review

${disclaimer.en}

${unsubscribeLine.en}`,
  },
  {
    alias: "vh-qualified-manual-review-zh",
    locale: "zh",
    subject: "建议人工审核你的匈牙利情况",
    ctaLabel: "申请人工审核",
    ctaUrl: "{{siteUrl}}/{{locale}}/qualification?leadToken={{leadToken}}&next=manual_review",
    text: `你好，

你的准备度回答显示可能存在风险、信息缺口或复杂情况。

在选择路线、预约或投入材料成本前，建议先进行人工审核。

申请人工审核：{{siteUrl}}/{{locale}}/qualification?leadToken={{leadToken}}&next=manual_review

${disclaimer.zh}

${unsubscribeLine.zh}`,
  },
  {
    alias: "vh-inhouse-next-step-en",
    locale: "en",
    subject: "VisaHungary can help with your next step",
    ctaLabel: "Talk to VisaHungary",
    ctaUrl: "{{siteUrl}}/{{locale}}/qualification?leadToken={{leadToken}}&next=talk_to_visahungary",
    text: `Hello,

Your readiness answers look strong enough for direct follow-up.

VisaHungary can review the likely route, timing, and practical next step with you without treating the calculator result as a guarantee.

Talk to VisaHungary: {{siteUrl}}/{{locale}}/qualification?leadToken={{leadToken}}&next=talk_to_visahungary

${disclaimer.en}

${unsubscribeLine.en}`,
  },
  {
    alias: "vh-inhouse-next-step-zh",
    locale: "zh",
    subject: "VisaHungary 可以协助你的下一步",
    ctaLabel: "联系 VisaHungary",
    ctaUrl: "{{siteUrl}}/{{locale}}/qualification?leadToken={{leadToken}}&next=talk_to_visahungary",
    text: `你好，

你的准备度回答显示，这个情况可能适合直接跟进。

VisaHungary 可以和你一起查看可能路线、时间安排和实际下一步，但计算器结果不代表保证获签。

联系 VisaHungary：{{siteUrl}}/{{locale}}/qualification?leadToken={{leadToken}}&next=talk_to_visahungary

${disclaimer.zh}

${unsubscribeLine.zh}`,
  },
  {
    alias: "vh-partner-confirm-en",
    locale: "en",
    subject: "We may connect you with a suitable Hungary visa partner",
    ctaLabel: "Confirm partner contact",
    ctaUrl: "{{siteUrl}}/{{locale}}/qualification?leadToken={{leadToken}}&next=confirm_partner",
    text: `Hello,

Based on your answers, a trusted Hungary visa partner may be suitable for the next step.

This only applies if you consented to partner contact and minimum necessary data sharing. We keep this transparent and consent-based.

Confirm partner contact: {{siteUrl}}/{{locale}}/qualification?leadToken={{leadToken}}&next=confirm_partner

${disclaimer.en}

${unsubscribeLine.en}`,
  },
  {
    alias: "vh-partner-confirm-zh",
    locale: "zh",
    subject: "我们可能为你匹配合适的匈牙利签证合作伙伴",
    ctaLabel: "确认合作伙伴联系",
    ctaUrl: "{{siteUrl}}/{{locale}}/qualification?leadToken={{leadToken}}&next=confirm_partner",
    text: `你好，

根据你的回答，可信的匈牙利签证合作伙伴可能适合协助下一步。

这只会在你同意合作伙伴联系并同意共享必要最低信息时发生。我们会保持透明，并以同意为基础。

确认合作伙伴联系：{{siteUrl}}/{{locale}}/qualification?leadToken={{leadToken}}&next=confirm_partner

${disclaimer.zh}

${unsubscribeLine.zh}`,
  },
  {
    alias: "vh-preparation-checklist-en",
    locale: "en",
    subject: "Your Hungary visa preparation checklist",
    ctaLabel: "Review your readiness",
    ctaUrl: "{{siteUrl}}/{{locale}}/qualification?leadToken={{leadToken}}",
    text: `Hello,

Here is a calm preparation path: confirm your passport validity, purpose document, accommodation plan, insurance, financial proof, and timing.

When your situation becomes clearer, you can return to your readiness check and update the next step.

Review your readiness: {{siteUrl}}/{{locale}}/qualification?leadToken={{leadToken}}

${disclaimer.en}

${unsubscribeLine.en}`,
  },
  {
    alias: "vh-preparation-checklist-zh",
    locale: "zh",
    subject: "你的匈牙利签证准备清单",
    ctaLabel: "查看准备度",
    ctaUrl: "{{siteUrl}}/{{locale}}/qualification?leadToken={{leadToken}}",
    text: `你好，

可以先按这个顺序准备：确认护照有效期、目的证明、住宿安排、保险、资金证明和时间安排。

当你的情况更明确时，可以回到准备度检查，更新下一步。

查看准备度：{{siteUrl}}/{{locale}}/qualification?leadToken={{leadToken}}

${disclaimer.zh}

${unsubscribeLine.zh}`,
  },
];

function sendEmailStep(key, templateAlias, variables) {
  const template = templates.find((item) => item.alias === templateAlias);
  if (!template) throw new Error(`Unknown template alias: ${templateAlias}`);

  return {
    key,
    type: "send_email",
    config: {
      template: {
        id: templateAlias,
        variables,
      },
      from,
      reply_to: replyTo,
      subject: template.subject,
    },
  };
}

function localeFlowSteps(locale) {
  const suffix = locale;
  const assessmentReady = `vh-assessment-ready-${locale}`;
  const reminder = `vh-readiness-reminder-${locale}`;
  const manualReview = `vh-manual-review-${locale}`;
  const prepGuide = `vh-prep-guide-${locale}`;

  return [
    sendEmailStep(`assessment_ready_${suffix}`, assessmentReady, assessmentVariables),
    {
      key: `wait_qualification_1d_${suffix}`,
      type: "wait_for_event",
      config: { eventName: qualificationEvent, timeout: "1 day" },
    },
    sendEmailStep(`readiness_reminder_${suffix}`, reminder, assessmentVariables),
    {
      key: `wait_qualification_2d_${suffix}`,
      type: "wait_for_event",
      config: { eventName: qualificationEvent, timeout: "2 days" },
    },
    {
      key: `check_risk_${suffix}`,
      type: "condition",
      config: {
        type: "or",
        rules: [
          { type: "rule", field: "event.riskLevel", operator: "eq", value: "high" },
          {
            type: "rule",
            field: "event.confidenceBand",
            operator: "eq",
            value: "needs_review",
          },
        ],
      },
    },
    sendEmailStep(`manual_review_${suffix}`, manualReview, assessmentVariables),
    sendEmailStep(`prep_guide_${suffix}`, prepGuide, assessmentVariables),
  ];
}

function localeFlowConnections(locale) {
  const suffix = locale;
  return [
    { from: `assessment_ready_${suffix}`, to: `wait_qualification_1d_${suffix}`, type: "default" },
    {
      from: `wait_qualification_1d_${suffix}`,
      to: `readiness_reminder_${suffix}`,
      type: "timeout",
    },
    {
      from: `readiness_reminder_${suffix}`,
      to: `wait_qualification_2d_${suffix}`,
      type: "default",
    },
    { from: `wait_qualification_2d_${suffix}`, to: `check_risk_${suffix}`, type: "timeout" },
    { from: `check_risk_${suffix}`, to: `manual_review_${suffix}`, type: "condition_met" },
    { from: `check_risk_${suffix}`, to: `prep_guide_${suffix}`, type: "condition_not_met" },
  ];
}

function qualificationBranchSteps(locale) {
  const suffix = locale;
  return [
    {
      key: `check_precheck_${suffix}`,
      type: "condition",
      config: {
        type: "rule",
        field: "event.suggestedAction",
        operator: "eq",
        value: "offer_paid_document_precheck",
      },
    },
    sendEmailStep(`paid_precheck_${suffix}`, `vh-paid-precheck-${locale}`, qualificationVariables),
    {
      key: `check_manual_${suffix}`,
      type: "condition",
      config: {
        type: "rule",
        field: "event.suggestedAction",
        operator: "eq",
        value: "manual_review",
      },
    },
    sendEmailStep(
      `qualified_manual_review_${suffix}`,
      `vh-qualified-manual-review-${locale}`,
      qualificationVariables,
    ),
    {
      key: `check_inhouse_${suffix}`,
      type: "condition",
      config: {
        type: "rule",
        field: "event.suggestedAction",
        operator: "eq",
        value: "handle_inhouse",
      },
    },
    sendEmailStep(`inhouse_next_step_${suffix}`, `vh-inhouse-next-step-${locale}`, qualificationVariables),
    {
      key: `check_partner_${suffix}`,
      type: "condition",
      config: {
        type: "rule",
        field: "event.suggestedAction",
        operator: "eq",
        value: "route_to_partner",
      },
    },
    {
      key: `check_partner_consent_${suffix}`,
      type: "condition",
      config: {
        type: "and",
        rules: [
          {
            type: "rule",
            field: "event.partnerContactAccepted",
            operator: "eq",
            value: true,
          },
          {
            type: "rule",
            field: "event.partnerDataSharingAccepted",
            operator: "eq",
            value: true,
          },
        ],
      },
    },
    sendEmailStep(`partner_confirm_${suffix}`, `vh-partner-confirm-${locale}`, qualificationVariables),
    {
      key: `check_nurture_${suffix}`,
      type: "condition",
      config: {
        type: "or",
        rules: [
          {
            type: "rule",
            field: "event.suggestedAction",
            operator: "eq",
            value: "nurture_sequence",
          },
          {
            type: "rule",
            field: "event.suggestedAction",
            operator: "eq",
            value: "self_service_content",
          },
        ],
      },
    },
    sendEmailStep(
      `preparation_checklist_${suffix}`,
      `vh-preparation-checklist-${locale}`,
      qualificationVariables,
    ),
  ];
}

function qualificationBranchConnections(locale) {
  const suffix = locale;
  return [
    { from: `check_precheck_${suffix}`, to: `paid_precheck_${suffix}`, type: "condition_met" },
    { from: `check_precheck_${suffix}`, to: `check_manual_${suffix}`, type: "condition_not_met" },
    {
      from: `check_manual_${suffix}`,
      to: `qualified_manual_review_${suffix}`,
      type: "condition_met",
    },
    { from: `check_manual_${suffix}`, to: `check_inhouse_${suffix}`, type: "condition_not_met" },
    { from: `check_inhouse_${suffix}`, to: `inhouse_next_step_${suffix}`, type: "condition_met" },
    { from: `check_inhouse_${suffix}`, to: `check_partner_${suffix}`, type: "condition_not_met" },
    {
      from: `check_partner_${suffix}`,
      to: `check_partner_consent_${suffix}`,
      type: "condition_met",
    },
    { from: `check_partner_${suffix}`, to: `check_nurture_${suffix}`, type: "condition_not_met" },
    {
      from: `check_partner_consent_${suffix}`,
      to: `partner_confirm_${suffix}`,
      type: "condition_met",
    },
    {
      from: `check_nurture_${suffix}`,
      to: `preparation_checklist_${suffix}`,
      type: "condition_met",
    },
  ];
}

const blueprint = {
  generatedAt: new Date().toISOString(),
  notes: [
    "Create the templates with these aliases and publish them before enabling the automations.",
    "The application only sends these events when marketing consent is present, unless RESEND_SEQUENCE_REQUIRE_MARKETING_CONSENT=false.",
    "Every non-transactional template includes {{{RESEND_UNSUBSCRIBE_URL}}}.",
    "No template guarantees a visa outcome or requests sensitive documents by email.",
  ],
  customEvents: [
    {
      name: assessmentEvent,
      schema: {
        leadToken: "string",
        locale: "string",
        primaryRouteId: "string",
        riskLevel: "string",
        confidenceBand: "string",
        purpose: "string",
        nationality: "string",
        qualificationUrl: "string",
      },
    },
    {
      name: qualificationEvent,
      schema: {
        leadToken: "string",
        locale: "string",
        primaryRouteId: "string",
        riskLevel: "string",
        leadCategory: "string",
        suggestedAction: "string",
        estimatedValue: "string",
        intentScore: "number",
        urgencyScore: "number",
        budgetScore: "number",
        conversionScore: "number",
        partnerFitScore: "number",
        partnerContactAccepted: "boolean",
        partnerDataSharingAccepted: "boolean",
      },
    },
  ],
  templates,
  automations: [
    {
      name: "VisaHungary assessment readiness follow-up",
      status: "disabled",
      steps: [
        { key: "start", type: "trigger", config: { eventName: assessmentEvent } },
        {
          key: "is_zh",
          type: "condition",
          config: { type: "rule", field: "event.locale", operator: "eq", value: "zh" },
        },
        ...localeFlowSteps("zh"),
        ...localeFlowSteps("en"),
      ],
      connections: [
        { from: "start", to: "is_zh", type: "default" },
        { from: "is_zh", to: "assessment_ready_zh", type: "condition_met" },
        { from: "is_zh", to: "assessment_ready_en", type: "condition_not_met" },
        ...localeFlowConnections("zh"),
        ...localeFlowConnections("en"),
      ],
    },
    {
      name: "VisaHungary completed qualification routing",
      status: "disabled",
      steps: [
        { key: "start", type: "trigger", config: { eventName: qualificationEvent } },
        {
          key: "is_zh",
          type: "condition",
          config: { type: "rule", field: "event.locale", operator: "eq", value: "zh" },
        },
        ...qualificationBranchSteps("zh"),
        ...qualificationBranchSteps("en"),
      ],
      connections: [
        { from: "start", to: "is_zh", type: "default" },
        { from: "is_zh", to: "check_precheck_zh", type: "condition_met" },
        { from: "is_zh", to: "check_precheck_en", type: "condition_not_met" },
        ...qualificationBranchConnections("zh"),
        ...qualificationBranchConnections("en"),
      ],
    },
  ],
};

fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(blueprint, null, 2)}\n`);

console.log(`Wrote ${path.relative(ROOT, OUTPUT_PATH)}`);
