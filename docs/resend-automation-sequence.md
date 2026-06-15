# VisaHungary Resend Automation Sequence

This sequence turns calculator users into qualified Hungary visa leads after their route assessment is sent.

The app already sends these Resend custom events:

- `visa.assessment.sent` after the result email is accepted or queued and the contact has marketing consent.
- `visa.qualification.completed` after the readiness form is submitted and the contact has marketing consent.

Keep `RESEND_SEQUENCE_REQUIRE_MARKETING_CONSENT=true` for production marketing and nurture flows.

## Resend setup

1. Create the custom events in Resend with the schemas from `automation-output/resend-automation-sequence.json`.
2. Create and publish the templates listed in that file. The aliases are stable and can be used as template IDs in the automation blueprint.
3. Create both automations in Resend as disabled first.
4. Test by sending events for an English lead and a Chinese lead.
5. Enable the automations only after confirming unsubscribe behavior and branch routing.

Resend Automations require published templates for `send_email` steps and support `{{{RESEND_UNSUBSCRIBE_URL}}}` in non-transactional emails.

## Automation 1: assessment readiness follow-up

Trigger: `visa.assessment.sent`

Flow:

1. Branch by `locale`.
2. Send Email 1 immediately.
3. Wait for `visa.qualification.completed` for 1 day.
4. If the event arrives, stop this reminder flow. The completed qualification automation handles the next message.
5. If the wait times out, send Email 2.
6. Wait for `visa.qualification.completed` for 2 more days.
7. If the event arrives, stop this reminder flow.
8. If the wait times out, branch by risk:
   - `riskLevel=high` or `confidenceBand=needs_review`: send Email 3A.
   - Otherwise: send Email 3B.

Emails:

- Email 1: `vh-assessment-ready-en` / `vh-assessment-ready-zh`
- Email 2: `vh-readiness-reminder-en` / `vh-readiness-reminder-zh`
- Email 3A: `vh-manual-review-en` / `vh-manual-review-zh`
- Email 3B: `vh-prep-guide-en` / `vh-prep-guide-zh`

## Automation 2: completed qualification routing

Trigger: `visa.qualification.completed`

Flow:

1. Branch by `locale`.
2. Branch by `suggestedAction`.
3. Send the matching email:
   - `offer_paid_document_precheck`: Q1 document pre-check.
   - `manual_review`: Q2 manual review.
   - `handle_inhouse`: Q3 direct VisaHungary follow-up.
   - `route_to_partner`: Q4 only when `partnerContactAccepted=true` and `partnerDataSharingAccepted=true`.
   - `nurture_sequence` or `self_service_content`: Q5 preparation checklist.

Emails:

- Q1: `vh-paid-precheck-en` / `vh-paid-precheck-zh`
- Q2: `vh-qualified-manual-review-en` / `vh-qualified-manual-review-zh`
- Q3: `vh-inhouse-next-step-en` / `vh-inhouse-next-step-zh`
- Q4: `vh-partner-confirm-en` / `vh-partner-confirm-zh`
- Q5: `vh-preparation-checklist-en` / `vh-preparation-checklist-zh`

## Compliance guardrails

- Do not send the sequence unless marketing consent is present.
- Include unsubscribe handling in every automation email.
- Do not imply a guaranteed visa outcome.
- Use cautious wording such as "likely route", "may fit your answers", and "manual review may be recommended".
- Do not ask users to email passport scans, bank statements, or sensitive documents.
- Do not send the partner email unless both partner contact consent and partner data-sharing consent are true.
