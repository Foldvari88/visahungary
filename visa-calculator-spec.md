# VisaHungary Online Visa Eligibility Calculator Specification

Version: 2026-06-01
Source knowledge base: `C:\Users\foldv\Downloads\magyarorszagi_vizumok_tartozkodasi_engedelyek_tudasanyag.md`
Primary goal: lead-generating pre-screening calculator, lead qualification engine, and owned client intake channel for Hungarian visa and residence routes
Languages for MVP: English and Simplified Chinese

## 1. Product Goal

Build a premium, mobile-first online calculator that helps people who want to come to Hungary understand which visa, residence permit, or status route may fit their circumstances. The product should feel like a high-end guided application flow rather than a static form.

The calculator must not provide legal advice or final eligibility confirmation. It gives a structured pre-screening result based on user answers and routes high-risk or unclear cases to manual review.

### Success Criteria

- A user can complete the flow in 3-6 minutes on mobile.
- The first screen is the calculator experience itself, not a marketing landing page.
- The user receives a strong sense of progress and personalization before the email gate.
- The exact recommended visa/residence route is not revealed until the user submits an email address.
- The system stores the lead in CRM and sends the full result by email.
- The system internally scores lead quality, urgency, budget, complexity, conversion potential, and partner fit.
- High-value leads can be routed to in-house handling, partner handling, nurturing, or paid document pre-check upsell.
- Every result maps back to a route in the source knowledge base.
- English and Chinese copy fit comfortably in mobile UI containers.

## 2. Audience

Primary users:

- Non-Hungarian citizens who want to visit, study, work, invest, join family, start a business, or live remotely in Hungary.
- Users who do not know the difference between a visa, D visa, residence permit, EEA registration, and long-term residence status.
- Users who may be anxious about eligibility, documentation, deadlines, prior refusal, or where to submit.

Business audience:

- VisaHungary operators who need a qualified lead with enough information to follow up.
- Consultants who need a structured case summary before the first call.

## 3. Positioning And UX Principles

### Product Promise

English:

> Find your likely Hungary visa route in a few minutes.

Chinese:

> 几分钟内找到适合你的匈牙利签证或居留路径。

### Experience Principles

- Mobile first: the smallest viewport is the primary design target.
- High trust: use clear disclaimers, confidence bands, and manual review for risky cases.
- Premium but practical: restrained visual design, strong spacing, polished microinteractions, no decorative clutter.
- Conversational flow: one decision per screen where possible.
- Progressive disclosure: ask only relevant follow-up questions.
- Lead-generating: create value before the email gate, then send the full result by email.

## 4. Recommended Technical Stack

- Next.js App Router with TypeScript.
- Tailwind CSS for styling.
- A component library or local primitives for buttons, segmented controls, cards, progress, form fields, toasts, and modal/sheet states.
- `react-hook-form` or equivalent state handling for form persistence and validation.
- `zod` for request validation and typed answer parsing.
- Server Route Handlers for preview and send-result APIs.
- Email provider: Resend for MVP transactional result delivery.
- CRM abstraction, for example HubSpot, Pipedrive, Airtable, Notion, Google Sheets, or internal database.

Implementation must keep the eligibility engine deterministic. Do not use AI to choose the legal route in MVP.

## 5. Information Architecture

### Routes

- `/` redirects to `/en/calculator` unless locale is known.
- `/en/calculator` English calculator.
- `/zh/calculator` Chinese calculator.
- `/api/eligibility/preview` computes teaser and creates an anonymous lead token.
- `/api/eligibility/send-result` attaches email, persists CRM lead, and sends the full result.
- `/en/qualification` and `/zh/qualification` collect the second-round readiness and lead qualification answers after email capture.
- `/api/lead-qualification/submit` stores second-round qualification answers, computes internal lead scoring, and syncs the enriched lead to CRM.
- Resend Automations should run the post-assessment email sequence from application events, not from hard-coded delayed jobs in the app.

### Main UI Regions

Mobile:

- Compact brand header with locale switcher.
- Question title and helper text.
- Step progress with current stage name.
- Answer area with cards, segmented controls, inputs, or toggles.
- Sticky bottom CTA with disabled/loading/submitting states.
- Optional collapsible profile summary after step 2.

Laptop:

- Left column: active question flow.
- Right column: live profile summary, trust notes, and progress.
- Result gate appears centered but keeps the summary visible.

## 6. Visual Direction

### Look And Feel

The UI should feel like a boutique immigration concierge: calm, precise, polished, and reassuring. Avoid a generic Typeform clone. The interface should feel interactive and premium without becoming slow or theatrical.

Recommended visual system:

- Background: off-white or very light neutral with subtle full-width bands.
- Primary color: deep green or burgundy inspired by Hungary, used sparingly.
- Accent: warm gold or soft red for highlights and progress.
- Text: strong charcoal, not pure black.
- Border radius: 8px or less for cards and controls.
- Shadows: subtle, mostly used for sticky CTA and active cards.
- Icons: use lucide icons where helpful for purpose cards, risk flags, and CTA buttons.

Avoid:

- Purple/blue SaaS gradients.
- Decorative blobs, orbs, and abstract SVG hero art.
- Marketing landing hero before the calculator.
- Long paragraphs inside active question cards.
- Revealing exact results before the email gate.

### First Screen

The first viewport must show the calculator immediately:

- Brand: `VisaHungary`.
- Headline: "Find your Hungary visa route".
- Subcopy: "Answer a few questions. We will send your tailored route, process, and document checklist by email."
- Language switch: `EN | 中文`.
- First question visible above the fold: "What brings you to Hungary?"
- Four to six large answer cards visible or partially visible.
- Trust line: "Pre-screening only. Final eligibility depends on official rules and documents."

Chinese first-screen copy:

- Headline: "找到你的匈牙利签证路径"
- Subcopy: "回答几个问题，我们会通过邮件发送你的路径、流程和材料清单。"
- Trust line: "此工具仅用于初步评估，最终结果取决于官方要求和材料审核。"

## 7. Flow Overview

The flow uses stages, not a fixed linear questionnaire. Each stage can contain one or more screens depending on answers.

### Stage 1: Goal

Primary question:

- `purpose`: What brings you to Hungary?

Options:

- Visit, tourism, business trip, conference, family visit.
- Work for a Hungarian employer.
- Study or training.
- Join family or partner.
- Run or start a business.
- Remote work / digital nomad.
- Invest.
- Medical treatment.
- Research.
- Official, diplomatic, or institutional purpose.
- Long-term or permanent status.
- I am not sure yet.

Branching:

- Short visit purposes ask stay length next.
- Work asks employer, contract, qualification, salary, nationality qualifiers.
- Study asks school admission, tuition/scholarship, mobility.
- Family asks sponsor status and relationship.
- Business asks self-employment/company details.
- Remote work asks foreign employer/company, Hungary work restrictions, income.
- Invest asks investment route and funds.
- Not sure keeps the broad flow and asks stay length early.

### Stage 2: Personal And Travel Context

Questions:

- `nationality`: What is your citizenship?
- `currentLocation`: Where are you now?
- `visaFreeEntry`: Can you enter Schengen visa-free?
- `currentHungarianPermit`: Do you already have a Hungarian residence permit?
- `currentEuPermit`: Do you hold another EU residence permit?
- `intendedStay`: How long do you want to stay in Hungary?
- `arrivalTimeline`: When do you plan to arrive or start?

Stay options:

- Airport transit only.
- Up to 90 days.
- More than 90 days.
- I want to extend or switch an existing status.
- Long-term/permanent route.

### Stage 3: Route-Specific Details

Work details:

- Hungarian employer exists.
- Signed contract or preliminary agreement exists.
- Role requires degree/high qualification.
- User has higher education or high-level experience.
- Monthly salary band.
- Employer is part of company group or intra-corporate transfer.
- Posting from another EU employer.
- Seasonal or guest worker context.
- Nationality relevant to National Card or Working Holiday Scheme.

Study details:

- Hungarian institution admission.
- Active student status.
- Tuition paid or scholarship.
- Language ability.
- Student mobility from another EU state.
- Post-study job search/business start.

Family details:

- Sponsor citizenship/status.
- Relationship type.
- Family documents available.
- Sponsor housing and income.
- Whether family member is EU/EEA/Swiss.

Business/self-employment details:

- Hungarian company or sole entrepreneur status.
- Ownership or executive role.
- Real and sustainable business activity.
- Revenue/funds proof.
- Need to work personally in the business.

Remote work details:

- Foreign employer or foreign company ownership.
- Work performed digitally.
- No Hungarian employer/client employment.
- No ownership in Hungarian company.
- Monthly net income around or above EUR 3,000.

Investment details:

- Guest investor visa intent.
- EUR 250,000 real estate fund investment path.
- EUR 1,000,000 higher education donation path.
- Source of funds and compliance documents.

Risk details:

- Prior visa or residence refusal.
- Schengen overstay.
- Deportation, entry ban, criminal issue.
- Missing passport validity.
- Missing housing.
- Missing financial proof.
- Missing health insurance.
- Urgent deadline.

### Stage 4: Documents And Readiness

Ask lightweight readiness questions:

- Passport valid and available.
- Housing proof available or planned.
- Financial proof available.
- Health insurance available.
- Key purpose document available.
- Family member joining.
- Needs help with translation/apostille.

Do not ask users to upload documents in MVP.

### Stage 5: Teaser Result And Email Gate

After final submit:

1. Show loading state: "Checking your answers against Hungarian visa routes..."
2. Compute deterministic eligibility preview.
3. Show teaser:
   - "Assessment complete"
   - "We found your likely route and document checklist."
   - Confidence band: strong / likely / needs review.
   - Risk level: low / medium / high.
   - "Enter your email to receive the full result."
4. Ask email and consent.
5. Send full result by email and create/update CRM lead.

The teaser must not reveal:

- Exact visa/residence route name.
- Detailed process path.
- Document checklist.
- Fee estimate.
- Specific legal warnings.

## 8. Question Model

```ts
type Locale = "en" | "zh";

type QuestionType =
  | "single_choice"
  | "multi_choice"
  | "text"
  | "email"
  | "country"
  | "number"
  | "date"
  | "boolean";

type Question = {
  id: string;
  stage: "goal" | "context" | "route_details" | "readiness" | "gate";
  type: QuestionType;
  title: Record<Locale, string>;
  description?: Record<Locale, string>;
  options?: AnswerOption[];
  required: boolean;
  showIf?: EligibilityCondition[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message: Record<Locale, string>;
  };
};

type AnswerOption = {
  id: string;
  label: Record<Locale, string>;
  description?: Record<Locale, string>;
  icon?: string;
  value: string | number | boolean;
};

type Answers = Record<string, string | number | boolean | string[] | null>;
```

### Required MVP Questions

| ID | Type | Purpose |
|---|---|---|
| `purpose` | single choice | Main route branch |
| `nationality` | country | Citizenship |
| `currentLocation` | single choice | Hungary / EU / outside EU |
| `visaFreeEntry` | single choice | Short-stay and domestic submission clue |
| `currentHungarianPermit` | boolean | Extension or status switch clue |
| `currentEuPermit` | boolean | Mobility/posting/long-term clue |
| `intendedStay` | single choice | 0-90 days vs 90+ |
| `hasHungarianEmployer` | boolean | Employment routes |
| `hasAdmission` | boolean | Study route |
| `hasFamilySponsor` | boolean | Family route |
| `remoteForeignIncome` | boolean | White Card route |
| `monthlyNetIncomeEur` | number | White Card and means proof |
| `investmentCapacity` | single choice | Guest investor route |
| `housingReady` | boolean | Readiness and risk |
| `financialProofReady` | boolean | Readiness and risk |
| `insuranceReady` | boolean | Readiness and risk |
| `priorRefusalOrOverstay` | boolean | Risk and manual review |
| `deadlineUrgency` | single choice | Service urgency |
| `hasPassport` | boolean | Basic readiness and seriousness |
| `hasCorePurposeDocument` | boolean | Intent signal: contract, admission, sponsor proof, investment path |
| `budgetRange` | single choice | Service affordability and routing |
| `wantsExpertHelp` | boolean | Consultation intent |
| `wouldPayForDocumentReview` | boolean | Paid pre-check upsell intent |
| `preferredContactChannel` | single choice | Email / WhatsApp / phone |
| `preferredContactTime` | single choice | Follow-up scheduling |
| `fullName` | text | Seriousness and CRM qualification, asked after value is created |
| `phoneOrWhatsapp` | text | Optional high-intent follow-up channel |

## 9. Visa Route Catalog

Each `VisaRoute` must be mapped to the source knowledge base route title.

```ts
type VisaRoute = {
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
  processPath: "no_application" | "consulate" | "enter_hungary_oif" | "mixed" | "manual_review";
  baseDocuments: string[];
  extraDocuments: string[];
  resultDisclaimerKey: string;
};
```

### MVP Route IDs

| Route ID | Source section | English name |
|---|---|---|
| `visa_free_short_stay` | 6.1 | Visa-free short stay |
| `airport_transit_a_visa` | 6.2 | Airport transit A visa |
| `schengen_c_visa` | 6.3 | Short-stay Schengen C visa |
| `c_eea_family_visa` | 6.4 | C-EEA visa for EU/EEA/Swiss family member |
| `d_visa_pickup` | 6.5 | D visa for residence permit pickup |
| `guest_investor_visa` | 6.6 | Guest Investor Visa |
| `employment_residence` | 6.7 | Residence permit for employment |
| `guest_worker_residence` | 6.8 | Guest worker residence permit |
| `seasonal_work` | 6.9 | Seasonal work permit |
| `investment_employment` | 6.10 | Employment for investment implementation |
| `national_card` | 6.11 | National Card |
| `hungarian_card` | 6.12 | Hungarian Card |
| `eu_blue_card` | 6.13 | EU Blue Card |
| `ict` | 6.14 | Intra-corporate transfer |
| `posting` | 6.15 | Posted worker residence permit |
| `corporate_card` | 6.16 | Corporate Card |
| `study` | 6.17 | Residence permit for study |
| `student_mobility` | 6.18 | Student mobility permit/certificate |
| `training` | 6.19 | Residence permit for training |
| `trainee` | 6.20 | Trainee residence permit |
| `research` | 6.21 | Residence permit for research |
| `research_mobility` | 6.22 | Researcher mobility |
| `job_seeking_business_start` | 6.23 | Job seeking or business start permit |
| `guest_self_employment` | 6.24 | Guest self-employment residence permit |
| `white_card` | 6.25 | White Card / Digital Nomad |
| `guest_investor_residence` | 6.26 | Guest Investor Residence Permit |
| `family_reunification` | 6.27 | Family Reunification |
| `medical_treatment` | 6.28 | Medical treatment residence permit |
| `voluntary_activity` | 6.29 | Voluntary activity residence permit |
| `official_purpose` | 6.30 | Official purpose residence permit |
| `national_interest` | 6.31 | Residence permit in Hungarian national interest |
| `working_holiday` | 6.32 | Working Holiday Scheme |
| `eu_residence_card` | 6.33 | EU Residence Card |
| `national_residence_card` | 6.34 | National Residence Card |
| `interim_residence_card` | 6.35 | Interim Residence Card |
| `eea_registration` | 6.36 | EEA citizen registration certificate |
| `eea_family_card` | 6.37 | EEA family member residence card |
| `eea_permanent_family_card` | 6.38 | Permanent residence card for EEA family member |

## 10. Eligibility Engine

The engine scores routes deterministically. It should be implemented as pure functions so it can be unit tested without API, email, or CRM dependencies.

```ts
type EligibilityCondition = {
  answerId: string;
  operator: "equals" | "not_equals" | "includes" | "gt" | "gte" | "lt" | "lte" | "exists";
  value?: string | number | boolean;
};

type EligibilityRule = {
  id: string;
  routeId: string;
  conditions: EligibilityCondition[];
  score: number;
  disqualify?: boolean;
  riskFlag?: string;
  missingInfo?: string;
};

type EligibilityResult = {
  primaryRecommendation: {
    routeId: string;
    confidenceScore: number;
    confidenceBand: "strong" | "likely" | "needs_review";
  } | null;
  secondaryOptions: Array<{
    routeId: string;
    confidenceScore: number;
  }>;
  disqualifiers: string[];
  missingInfo: string[];
  riskFlags: string[];
  riskLevel: "low" | "medium" | "high";
  processPath: "no_application" | "consulate" | "enter_hungary_oif" | "mixed" | "manual_review";
};
```

### Scoring Defaults

- Add 40 points for a direct purpose match.
- Add 20 points for intended stay matching route category.
- Add 15 points for having the core purpose document, such as employer contract, admission, sponsor, foreign remote income, or investment capacity.
- Add 10 points for location/submission compatibility.
- Add 5 points each for housing, financial proof, and insurance readiness.
- Subtract 20 points for missing critical purpose document.
- Subtract 15 points for urgent deadline without readiness.
- Add high-risk flag and force `needs_review` for prior refusal, overstay, deportation, entry ban, or criminal issue.

Confidence bands:

- `strong`: score >= 75 and no high-risk flags.
- `likely`: score 50-74 and no high-risk flags.
- `needs_review`: score below 50, missing critical answers, conflicting route signals, or any high-risk flag.

### High-Level Route Rules

- If `intendedStay` is up to 90 days and `visaFreeEntry` is true, prefer `visa_free_short_stay`.
- If `intendedStay` is up to 90 days and `visaFreeEntry` is false, prefer `schengen_c_visa`.
- If purpose is airport transit, prefer `airport_transit_a_visa`.
- If purpose is EU/EEA/Swiss family visit and family relationship exists, consider `c_eea_family_visa`.
- If `intendedStay` is more than 90 days, avoid short-stay routes except as secondary context.
- If Hungarian employment exists, score `employment_residence`, then branch to `hungarian_card`, `eu_blue_card`, `national_card`, `guest_worker_residence`, `ict`, `posting`, `corporate_card`, or `seasonal_work` based on detailed answers.
- If qualified/high-salary work is selected, score `eu_blue_card` and `hungarian_card`.
- If study admission exists, prefer `study`; if another EU study permit and mobility exists, consider `student_mobility`.
- If family sponsor exists, prefer `family_reunification`, but add missing info if sponsor status is unknown.
- If foreign remote work and income threshold are satisfied, prefer `white_card`; disqualify or downgrade if Hungarian work/company ownership is present.
- If investment capacity matches EUR 250,000 fund or EUR 1,000,000 donation, prefer `guest_investor_visa` or `guest_investor_residence` depending on current entry stage.
- If business/self-employment is selected, prefer `guest_self_employment`.
- If current permit is study/research and user wants post-study stay, prefer `job_seeking_business_start`.
- If user is EEA citizen, prefer `eea_registration`.
- If user is third-country family member of EEA citizen, prefer `eea_family_card`.
- If user asks for long-term/permanent status, score `eu_residence_card`, `national_residence_card`, or `interim_residence_card`, but usually require manual review due to residence history requirements.

## 11. API Contracts

### `POST /api/eligibility/preview`

Purpose:

- Validate answers.
- Compute eligibility result.
- Create a temporary lead record without email, or store server-side by token.
- Return only teaser-safe information.

Request:

```ts
type PreviewRequest = {
  locale: Locale;
  answers: Answers;
  sourcePage: string;
  consent: {
    privacyAccepted: boolean;
    profilingAccepted: boolean;
  };
};
```

Response:

```ts
type PreviewResponse = {
  leadToken: string;
  teaser: {
    title: string;
    body: string;
    confidenceBand: "strong" | "likely" | "needs_review";
    riskLevel: "low" | "medium" | "high";
    missingCriticalAnswers: string[];
  };
};
```

Preview must not include `routeId`, route name, exact document checklist, or process details.

### `POST /api/eligibility/send-result`

Purpose:

- Validate email.
- Attach email and marketing consent to lead.
- Persist lead to CRM.
- Send full result email.
- Return delivery state.

Request:

```ts
type SendResultRequest = {
  leadToken: string;
  email: string;
  preferredLanguage: Locale;
  consent: {
    privacyAccepted: boolean;
    marketingAccepted: boolean;
  };
};
```

Response:

```ts
type SendResultResponse = {
  status: "sent" | "queued";
  message: string;
  nextStepCta: {
    label: string;
    href: string;
  };
};
```

## 12. Lead And CRM Data

```ts
type LeadCategory =
  | "hot_inhouse"
  | "hot_partner"
  | "employer_lead"
  | "student_lead"
  | "family_lead"
  | "low_budget"
  | "researching"
  | "risky_case";

type SuggestedLeadAction =
  | "handle_inhouse"
  | "offer_paid_document_precheck"
  | "route_to_partner"
  | "manual_review"
  | "nurture_sequence"
  | "self_service_content";

type LeadQualificationResult = {
  intentScore: number;
  urgencyScore: number;
  budgetScore: number;
  complexityScore: number;
  conversionScore: number;
  partnerFitScore: number;
  seriousnessScore: number;
  leadCategory: LeadCategory;
  suggestedAction: SuggestedLeadAction;
  estimatedValue: "low" | "medium" | "high" | "premium";
  partnerFit?: {
    eligibleForPartnerRouting: boolean;
    preferredPartnerType?: "student" | "work" | "family" | "business_investor" | "general";
    exclusivityRecommendation?: "shared" | "exclusive";
    minimumLeadPriceBand?: "low" | "medium" | "high" | "premium";
  };
};

type LeadRecord = {
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
  computed: EligibilityResult;
  primaryRouteId?: string;
  secondaryRouteIds: string[];
  riskFlags: string[];
  leadQualification: LeadQualificationResult;
  consent: {
    privacyAccepted: boolean;
    profilingAccepted: boolean;
    marketingAccepted?: boolean;
    partnerContactAccepted?: boolean;
    partnerDataSharingAccepted?: boolean;
  };
  auditTrail: Array<{
    event: "privacy_accept" | "profiling_accept" | "marketing_accept" | "partner_contact_accept" | "partner_data_share_accept" | "data_erasure_request";
    timestamp: string;
    sourcePage: string;
    consentTextVersion: string;
  }>;
  delivery: {
    resultEmailSentAt?: string;
    resultEmailProviderId?: string;
    crmSyncedAt?: string;
    crmRecordId?: string;
  };
};
```

CRM fields:

- Email.
- Preferred language.
- Primary route ID.
- Secondary route IDs.
- Confidence band.
- Risk level.
- Risk flags.
- Intent score.
- Urgency score.
- Budget score.
- Complexity score.
- Conversion score.
- Partner-fit score.
- Lead category.
- Suggested action.
- Estimated lead value.
- Intended stay.
- Purpose.
- Nationality.
- Current location.
- Current permit status.
- Deadline urgency.
- Budget range.
- Preferred contact channel.
- Consultation interest.
- Document pre-check interest.
- Partner contact consent.
- Partner data-sharing consent.
- Full serialized answer JSON.
- Created timestamp.
- Source URL.
- Marketing consent.

## 13. Email Result Template

Subject examples:

- English: "Your Hungary visa route assessment"
- Chinese: "你的匈牙利签证路径评估"

Email sections:

1. Greeting.
2. Legal disclaimer: this is a pre-screening result, not legal advice.
3. Best-fit route name.
4. Why this route matched the answers.
5. Secondary routes, if relevant.
6. Likely process path:
   - No application / border compliance.
   - Consulate submission.
   - Enter Hungary / OIF.
   - Mixed path.
   - Manual review.
7. Document checklist:
   - Base documents.
   - Route-specific documents.
   - Documents likely needing translation/apostille.
8. Readiness gaps and risk flags.
9. Timeline and fee disclaimer.
10. CTA: book consultation.

CTA copy:

- English: "Book a visa consultation"
- Chinese: "预约签证咨询"

### Resend Automation Sequence

The first transactional result email is sent directly by the application through Resend. The follow-up sequence should be handled in Resend Automations.

Application events:

- `visa.assessment.sent`: sent after the result email is accepted or queued and the user has marketing consent.
- `visa.qualification.completed`: sent after the second-round readiness/qualification form is submitted and the user has marketing consent.

Default environment variables:

- `RESEND_ASSESSMENT_SEQUENCE_EVENT=visa.assessment.sent`
- `RESEND_QUALIFICATION_SEQUENCE_EVENT=visa.qualification.completed`
- `RESEND_SEQUENCE_REQUIRE_MARKETING_CONSENT=true`

Event payload for `visa.assessment.sent`:

- `leadToken`
- `locale`
- `primaryRouteId`
- `riskLevel`
- `confidenceBand`
- `purpose`
- `nationality`
- `qualificationUrl`

Event payload for `visa.qualification.completed`:

- `leadToken`
- `locale`
- `primaryRouteId`
- `riskLevel`
- `leadCategory`
- `suggestedAction`
- `estimatedValue`
- `intentScore`
- `urgencyScore`
- `budgetScore`
- `conversionScore`
- `partnerFitScore`

Recommended Resend sequence:

1. Trigger: `visa.assessment.sent`.
2. Email 1, immediate: "Your checklist is ready. Complete your readiness check."
3. Wait 1 day.
4. If `riskLevel` is high or `confidenceBand` is `needs_review`, send manual review CTA.
5. Wait for event: `visa.qualification.completed`, timeout 2 days.
6. If qualification is completed, branch by `suggestedAction`.
7. If `suggestedAction` is `offer_paid_document_precheck`, send document pre-check offer.
8. If `suggestedAction` is `handle_inhouse` or `manual_review`, send human follow-up / WhatsApp CTA.
9. If qualification is not completed, send reminder to finish readiness check.
10. Final email after 4-7 days: low-risk users receive route/country guide content; high-risk users receive consultation/manual review CTA.

Compliance:

- Non-transactional automation emails must include unsubscribe handling.
- Marketing and nurture sequences should not run unless marketing consent is true, unless a specific sequence is strictly transactional/service-related and reviewed separately.
- Partner-routing emails must not run unless partner contact and partner data-sharing consent are true.

## 14. Content And Legal Guardrails

Every calculator screen footer or final email must include a short disclaimer.

English short disclaimer:

> This tool provides preliminary information only and is not legal advice. Final eligibility depends on current official rules, documents, deadlines, and authority review.

Chinese short disclaimer:

> 本工具仅提供初步信息，不构成法律建议。最终资格取决于最新官方规定、材料、期限和主管机关审核。

The result must never say:

- "You are eligible."
- "You will get this visa."
- "Guaranteed."
- "Approved route."

Use safer wording:

- "Your likely route may be..."
- "This appears to fit your answers..."
- "Manual review is recommended..."
- "You may need..."

## 15. UI Components

Required components:

- `CalculatorShell`
- `LocaleSwitcher`
- `ProgressRail`
- `StepHeader`
- `AnswerCard`
- `SegmentedControl`
- `CountrySelect`
- `MoneyInput`
- `BooleanToggle`
- `ProfileSummary`
- `RiskNotice`
- `StickyActionBar`
- `AssessmentLoading`
- `EmailGate`
- `ConsentCheckbox`
- `SuccessState`
- `ErrorToast`

Behavior:

- Answer cards show selected, disabled, and recommended follow-up states.
- Progress must be based on stages, not raw question count, because branching changes total screens.
- Profile summary should use plain-language chips, for example "90+ days", "Work", "Outside EU", "Needs housing proof".
- Sticky action bar must not cover form content on mobile.
- The UI must preserve answers when switching language.

## 16. Microcopy

### Loading State

English:

- "Checking your answers against Hungarian visa routes..."
- "Preparing your route summary..."
- "Almost ready..."

Chinese:

- "正在根据匈牙利签证路径检查你的答案..."
- "正在准备你的路径摘要..."
- "即将完成..."

### Teaser Gate

English:

- Title: "Your assessment is ready"
- Body: "We found your likely route, process path, and document checklist. Enter your email and we will send the full result."
- Button: "Send my result"

Chinese:

- Title: "你的评估已完成"
- Body: "我们已找到可能适合你的路径、办理流程和材料清单。请输入邮箱接收完整结果。"
- Button: "发送我的结果"

### Success State

English:

- "Your result is on its way."
- "Check your inbox for the route summary and document checklist."

Chinese:

- "你的结果正在发送。"
- "请查看邮箱中的路径摘要和材料清单。"

## 17. Accessibility And Responsiveness

- All controls must be keyboard reachable.
- All answer cards must be real buttons, radios, or checkbox controls semantically.
- Minimum touch target: 44px.
- Form errors must be announced and visible.
- Progress must not rely only on color.
- Chinese text must be checked at 360px viewport.
- Buttons must not resize layout when loading.
- Sticky CTA must respect safe-area insets on mobile.

## 18. Analytics

Track events:

- `calculator_started`
- `locale_changed`
- `question_answered`
- `stage_completed`
- `preview_generated`
- `email_gate_viewed`
- `email_submitted`
- `result_email_sent`
- `crm_sync_failed`
- `consultation_cta_clicked`
- `lead_scored`
- `lead_category_assigned`
- `document_precheck_offer_viewed`
- `document_precheck_checkout_started`
- `partner_consent_checked`
- `partner_route_recommended`

Do not send sensitive full answer payloads to analytics. Keep full answer payload only in CRM/database.

## 19. Error Handling

Preview API:

- If validation fails, return field-level errors.
- If eligibility engine fails, show "manual review recommended" fallback and log the error.
- If temporary lead creation fails, block progression and ask user to retry.

Send-result API:

- If email is invalid, show inline validation.
- If CRM sync fails but email sends, tell user result was sent and log CRM retry.
- If email provider fails, queue retry if possible and show "queued" status.
- If lead token expired, ask user to restart assessment.

## 20. Testing And Acceptance Criteria

### Viewport QA

Test these viewports:

- 360px mobile.
- 390px mobile.
- 430px mobile.
- 768px tablet.
- 1366px laptop.
- 1440px laptop.

Acceptance:

- No text overflow.
- Sticky CTA does not cover fields.
- Progress is visible.
- Selected answers are visually obvious.
- Laptop right summary is useful and not sparse.
- Email gate does not reveal exact route.

### Eligibility Scenario Tests

Create unit tests for:

- Visa-free short tourist stay.
- C visa needed for short stay.
- Hungarian employment with contract.
- Skilled worker matching EU Blue Card or Hungarian Card.
- Student with admission.
- Family reunification with sponsor.
- White Card remote worker with foreign income.
- Guest investor with qualifying investment.
- EEA citizen registration.
- Prior refusal or overstay forcing manual review.
- Missing critical answers producing missingInfo.

### API Tests

- `preview` validates required answers.
- `preview` returns lead token and teaser only.
- `preview` never returns exact `routeId`.
- `send-result` rejects invalid email.
- `send-result` persists CRM lead.
- `send-result` sends email in selected language.
- `send-result` handles CRM failure gracefully.

### Content QA

- Every route in `VisaRoute` maps to a source section.
- Every route has English and Chinese display copy.
- Every email includes disclaimer.
- Every result uses non-guarantee language.
- Document checklist comes from the source knowledge base or a reviewed internal route mapping.

## 21. MVP Delivery Checklist

- Create Next.js App Router project.
- Add bilingual dictionary structure.
- Build calculator shell and responsive layout.
- Implement question schema and branching.
- Implement deterministic eligibility engine.
- Add route catalog from source knowledge base.
- Implement preview API.
- Implement email gate.
- Implement CRM adapter.
- Implement email adapter and templates.
- Add analytics event hooks.
- Add unit tests for engine and APIs.
- Add browser QA for mobile and laptop viewports.
- Run content QA against source knowledge base.

## 22. Business Lead Engine, Scoring Funnel And Partner Marketplace

The product should be treated as more than a simple visa calculator. The business product is:

- A lead qualification engine.
- A visa lead marketplace foundation.
- An owned client intake channel for VisaHungary.
- A self-service entry point that can upsell paid document review and consultation.

The public user-facing experience should still feel like a helpful visa route finder. The scoring, routing, partner marketplace, and revenue logic must remain internal unless the user explicitly reaches a paid or consultant handoff step.

### Calculator As Lead Scoring Funnel

At the end of the calculator, the system should compute both:

- The user's likely Hungarian visa or residence route.
- The internal business quality of the lead.

Internal scoring dimensions:

- `intentScore`: how serious and concrete the user's immigration intent appears.
- `urgencyScore`: how time-sensitive the case is.
- `budgetScore`: how likely the user can afford paid help.
- `complexityScore`: how difficult or document-heavy the case is.
- `conversionScore`: how attractive the lead is for in-house handling.
- `partnerFitScore`: how suitable the lead is for a partner or marketplace handoff.
- `seriousnessScore`: how complete and credible the lead data is.

Example internal dashboard summary:

```txt
Lead: Ahmed, UAE
Visa type: Hungary work residence permit
Intent: 91/100
Urgency: 84/100
Budget: 73/100
Complexity: Medium
Suggested action: Handle in-house
Estimated value: High
```

### Intent Signals And Qualification Questions

The calculator should not ask directly, "Are you serious?" Instead, seriousness should be inferred from behavior and concrete answers.

High-signal qualification questions:

- When do you want to move to Hungary?
- Do you already have a work contract, university admission, family sponsor, or other documented basis?
- Do you already have a valid passport?
- Where are you currently located?
- Have you ever had a visa or residence permit refused?
- What budget range are you planning for professional help?
- Would you like expert assistance with the process?
- Would you pay for a fast document readiness review?
- When should we contact you?
- Which contact channel do you prefer: email, WhatsApp, or phone?

Strong intent signals:

- Concrete moving or arrival date.
- Existing employer, university, or family sponsor.
- Willingness to upload or later provide documents.
- Willingness to book a consultation.
- Willingness to pay a deposit or document review fee.
- Clear answer to budget range.
- Valid phone or WhatsApp number after value has been created.

### MVP Lead Scoring Logic

Lead qualification scoring should be deterministic in MVP and implemented as pure functions, similar to the eligibility engine.

Intent score:

- Add 25 if there is a concrete goal: work, study, family, investment, business, remote work.
- Add 20 if there is a documented basis: contract, admission letter, sponsor, investment path.
- Add 15 if the user wants to move within 3 months.
- Add 15 if the user is willing to provide documents in a later secure step.
- Add 10 if the user provides WhatsApp or phone.
- Add 10 if the user accepts consultation interest.
- Subtract 20 if the user selects "just researching" or gives no concrete timeline.

Urgency score:

- Add 30 if the user wants to arrive or submit within 30 days.
- Add 20 if there is already an appointment or authority deadline.
- Add 15 if there is an employer or university deadline.
- Add 10 if the user is already in Hungary and needs extension or status clarification.

Budget score:

- Add 30 if the selected budget range is above the target service fee.
- Add 20 if the user would pay by card for document review.
- Add 15 if the employer, school, or sponsor may pay.
- Add 10 if the user selects a premium service package.
- Subtract 20 if the user only wants free information.

Seriousness score:

- Add 20 if the user provides a full name.
- Add 20 if the user provides valid email plus phone or WhatsApp.
- Add 20 if the user is willing to provide documents in a later secure step.
- Add 15 if the user books or requests a time slot.
- Add 15 if the user completes the full flow.
- Subtract 30 if the email appears disposable, fake, or invalid.

Complexity score:

- Add points for prior refusal, overstay, missing core documents, urgent deadline, switching status in Hungary, unclear sponsor status, complex family case, investment route, or employer-sponsored work.
- High complexity does not automatically mean bad lead quality. It should often trigger manual review or in-house handling if the budget and intent are strong.

Conversion score:

- Increase when intent, budget, urgency, and readiness are high.
- Increase for work, family, business, investor, and employer-sponsored cases.
- Decrease when the user is only researching, low-budget, not ready, or only wants free content.

Partner-fit score:

- Increase when the route is valuable but not ideal for in-house handling.
- Increase when the user has consented to partner contact and data sharing.
- Decrease when consent is missing, the lead is low quality, or the case contains sensitive risk issues requiring direct review.

### Recommended User Flow

The business funnel should work as follows:

1. User arrives from an SEO/GEO landing page.
   Example: "Hungary work visa for Indian citizens".
2. User sees a short embedded calculator or the full calculator experience.
   First touch should be 6-10 questions, not a long static form.
3. User receives an instant teaser result.
   Example: "We found a likely Hungary work residence route and checklist."
4. Lead magnet appears.
   Example: "Get your personalized document checklist."
5. Email and optional WhatsApp capture.
   This is the main lead capture step.
6. Second-round qualification.
   Ask budget, urgency, document readiness, and consultation interest after value is created.
7. Automatic routing.
   Route the lead to in-house handling, partner marketplace, nurture sequence, low-quality/self-service content, risky-case manual review, or paid document pre-check.

### Lead Categories

Internal lead categories:

- `hot_inhouse`: high intent, good budget, valuable visa route, suitable for VisaHungary to handle directly.
- `hot_partner`: good lead, but better suited for a partner or external service provider.
- `employer_lead`: company-sponsored case with potentially high value.
- `student_lead`: useful for volume, may have lower budget.
- `family_lead`: often complex, but usually strong intent.
- `low_budget`: route to nurture, affiliate, low-cost self-service, or free content.
- `researching`: route to blog/email sequence and retargeting.
- `risky_case`: refusal, overstay, missing legal basis, unclear history, or manual review needed.

Suggested actions:

- `handle_inhouse`
- `offer_paid_document_precheck`
- `route_to_partner`
- `manual_review`
- `nurture_sequence`
- `self_service_content`

### Partner Lead Marketplace

If VisaHungary sells or routes leads to partners, the system needs a partner-facing layer.

Partner filters:

- Visa/residence route type.
- Country or citizenship.
- Current location.
- Urgency.
- Lead category.
- Budget band.
- Risk level.
- Language.
- Exclusive or shared lead type.

Partner lead statuses:

- `new`
- `viewed`
- `contacted`
- `accepted`
- `converted`
- `rejected`
- `refunded`
- `disputed`

Partner metadata:

- Partner name and service category.
- Allowed route types.
- Allowed countries/languages.
- Partner rating.
- Conversion history.
- Refund/dispute rate.
- Maximum lead price.
- Whether the partner can receive exclusive leads.

Lead pricing logic:

- Student visa lead: lower price.
- Work permit lead: medium/high price.
- Employer-sponsored lead: high price.
- Family reunification lead: medium/high price.
- Business or investor-type lead: premium price.
- Exclusive urgent lead: premium multiplier.

Marketplace safeguards:

- Do not share a lead with any partner unless the user has explicitly consented to partner contact and partner data sharing.
- Share only the minimum necessary data.
- Keep sensitive risk flags internal unless sharing is necessary, consented, and covered by the privacy policy.
- Provide audit trail for when and why the lead was shared.
- Support refund/dispute rules for fake, duplicate, unreachable, or non-consenting leads.

### Compliance For Partner Sharing

Because the product handles personal data and immigration intent, consent must be explicit and granular.

Required consent controls:

- Privacy policy acceptance.
- Profiling/automated pre-screening acceptance.
- Separate marketing checkbox.
- Separate partner contact checkbox.
- Separate partner data-sharing checkbox.

Operational requirements:

- Store consent text version, timestamp, source page, and user action.
- Do not bundle marketing consent with result delivery.
- Do not bundle partner contact consent with privacy acceptance.
- Allow users to request data deletion.
- Allow users to withdraw marketing and partner contact consent.
- Never transfer more data to a partner than is necessary for the agreed purpose.

This is not only legal hygiene. It is a trust feature. Users are more likely to provide accurate information when they understand and control how their data will be used.

### Paid Document Pre-Check Upsell

The strongest early revenue step should appear after the calculator has created value.

Suggested offer:

- "Document readiness review"
- Price range: EUR 29-79 in MVP.
- User receives a fast human or semi-structured review of whether their core documents appear ready for the next application step.

Good upsell moments:

- After the email result has been sent.
- When the lead has high intent but missing readiness.
- When the user has a deadline.
- When the user has employer/admission/sponsor documents.
- When the user asks for human help in chat.

This paid step is also a lead quality filter. A user who pays even a small review fee is usually a much stronger lead.

### MVP Business Build Order

Recommended implementation order:

1. Visa Fit Calculator.
2. Lead scoring backend.
3. Admin lead dashboard.
4. Email and WhatsApp capture.
5. Document checklist generator.
6. Partner routing rules.
7. 20-30 SEO/GEO landing pages.
8. Stripe paid document pre-check upsell.
9. Partner dashboard and marketplace controls.

### Admin Dashboard Requirements

The internal dashboard should show:

- Lead identity: name, email, phone/WhatsApp if provided.
- Citizenship and current location.
- Primary route and secondary routes.
- Intent, urgency, budget, complexity, conversion, partner-fit, and seriousness scores.
- Lead category.
- Suggested action.
- Estimated value.
- Risk flags.
- Missing information.
- Preferred contact channel and contact time.
- Consent status.
- Source page and SEO keyword cluster.
- Full answers.
- Timeline of email delivery, CRM sync, partner routing, and contact attempts.

The dashboard should make the next action obvious: handle in-house, offer document pre-check, call/WhatsApp, route to partner, nurture, or ignore.
