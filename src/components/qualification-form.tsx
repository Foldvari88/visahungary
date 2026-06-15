"use client";

import Link from "next/link";
import { CheckCircle2, ChevronRight, ClipboardCheck, Loader2, ShieldCheck } from "lucide-react";
import { FormEvent, useState } from "react";
import type { Locale, QualificationAnswers } from "@/lib/types";

type QualificationFormProps = {
  locale: Locale;
  leadToken: string;
};

const initialAnswers: QualificationAnswers = {
  fullName: "",
  moveTimeline: "one_to_three_months",
  hasDocumentedBasis: false,
  hasValidPassport: true,
  budgetRange: "100_300",
  wantsExpertHelp: true,
  wouldPayForDocumentReview: true,
  preferredContactChannel: "whatsapp",
  phoneOrWhatsapp: "",
  preferredContactTime: "this_week",
  partnerContactAccepted: false,
  partnerDataSharingAccepted: false,
};

const copy = {
  en: {
    title: "Complete your readiness check",
    intro:
      "Answer a few business-critical questions after your calculator result. This helps us decide whether you need self-service guidance, document pre-check, or human review.",
    missingLead: "Missing assessment token. Please restart the calculator.",
    fullName: "Full name",
    fullNamePlaceholder: "Your full name",
    moveTimeline: "When do you want to move or submit?",
    documentedBasis: "Do you already have a contract, admission, sponsor, or similar basis?",
    passport: "Do you have a valid passport?",
    budget: "What budget range are you planning for professional help?",
    expertHelp: "Would you like expert help?",
    docReview: "Would you pay for a fast document readiness review?",
    contact: "Preferred contact channel",
    contactValue: "Phone or WhatsApp number",
    contactValuePlaceholder: "+36...",
    contactTime: "When should we contact you?",
    partnerContact: "I allow VisaHungary to let a suitable partner contact me if needed.",
    partnerShare:
      "I allow VisaHungary to share the minimum necessary lead data with a suitable partner.",
    submit: "Save my readiness check",
    saving: "Saving...",
    saved: "Readiness check saved",
    savedBody:
      "We saved the qualification details for this lead. The next step can now be routed more intelligently.",
    required: "Please add your full name before submitting.",
  },
  zh: {
    title: "Complete your readiness check",
    intro:
      "Answer a few readiness questions after your calculator result so VisaHungary can route your case better.",
    missingLead: "Missing assessment token. Please restart the calculator.",
    fullName: "Full name",
    fullNamePlaceholder: "Your full name",
    moveTimeline: "When do you want to move or submit?",
    documentedBasis: "Do you already have a contract, admission, sponsor, or similar basis?",
    passport: "Do you have a valid passport?",
    budget: "What budget range are you planning for professional help?",
    expertHelp: "Would you like expert help?",
    docReview: "Would you pay for a fast document readiness review?",
    contact: "Preferred contact channel",
    contactValue: "Phone or WhatsApp number",
    contactValuePlaceholder: "+86...",
    contactTime: "When should we contact you?",
    partnerContact: "I allow VisaHungary to let a suitable partner contact me if needed.",
    partnerShare:
      "I allow VisaHungary to share the minimum necessary lead data with a suitable partner.",
    submit: "Save my readiness check",
    saving: "Saving...",
    saved: "Readiness check saved",
    savedBody: "We saved the qualification details for this lead.",
    required: "Please add your full name before submitting.",
  },
} satisfies Record<Locale, Record<string, string>>;

function BooleanChoice({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="qualification-field">
      <span>{label}</span>
      <div className="qualification-toggle">
        <button type="button" data-active={value} onClick={() => onChange(true)}>
          Yes
        </button>
        <button type="button" data-active={!value} onClick={() => onChange(false)}>
          No
        </button>
      </div>
    </div>
  );
}

export function QualificationForm({ locale, leadToken }: QualificationFormProps) {
  const c = copy[locale];
  const [answers, setAnswers] = useState<QualificationAnswers>(initialAnswers);
  const [status, setStatus] = useState<"idle" | "submitting" | "saved">("idle");
  const [error, setError] = useState("");
  const [score, setScore] = useState<string | null>(null);

  function update<K extends keyof QualificationAnswers>(
    key: K,
    value: QualificationAnswers[K],
  ) {
    setAnswers((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!leadToken) {
      setError(c.missingLead);
      return;
    }

    if (!answers.fullName.trim()) {
      setError(c.required);
      return;
    }

    setStatus("submitting");

    try {
      const response = await fetch("/api/lead-qualification/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadToken, locale, answers }),
      });

      if (!response.ok) throw new Error("Qualification failed");

      const data = (await response.json()) as {
        leadQualification?: { leadCategory: string; suggestedAction: string; estimatedValue: string };
      };
      setScore(
        data.leadQualification
          ? `${data.leadQualification.leadCategory} / ${data.leadQualification.suggestedAction} / ${data.leadQualification.estimatedValue}`
          : null,
      );
      setStatus("saved");
    } catch {
      setStatus("idle");
      setError("We could not save the readiness check. Please try again.");
    }
  }

  if (!leadToken) {
    return (
      <main className="qualification-shell">
        <section className="qualification-card">
          <h1>{c.missingLead}</h1>
          <Link className="primary-button" href={`/${locale}/calculator`}>
            Restart calculator
            <ChevronRight size={17} />
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="qualification-shell">
      <section className="qualification-card">
        <div className="qualification-eyebrow">
          <ClipboardCheck size={16} />
          VisaHungary lead readiness
        </div>
        <h1>{c.title}</h1>
        <p>{c.intro}</p>

        {status === "saved" ? (
          <div className="qualification-success">
            <CheckCircle2 size={24} />
            <div>
              <strong>{c.saved}</strong>
              <p>{c.savedBody}</p>
              {score ? <span>{score}</span> : null}
            </div>
          </div>
        ) : (
          <form className="qualification-form" onSubmit={submit}>
            <label className="qualification-field">
              <span>{c.fullName}</span>
              <input
                value={answers.fullName}
                placeholder={c.fullNamePlaceholder}
                onChange={(event) => update("fullName", event.target.value)}
              />
            </label>

            <label className="qualification-field">
              <span>{c.moveTimeline}</span>
              <select
                value={answers.moveTimeline}
                onChange={(event) =>
                  update("moveTimeline", event.target.value as QualificationAnswers["moveTimeline"])
                }
              >
                <option value="within_30_days">Within 30 days</option>
                <option value="one_to_three_months">1-3 months</option>
                <option value="three_plus_months">More than 3 months</option>
                <option value="just_researching">Just researching</option>
              </select>
            </label>

            <BooleanChoice
              label={c.documentedBasis}
              value={answers.hasDocumentedBasis}
              onChange={(value) => update("hasDocumentedBasis", value)}
            />
            <BooleanChoice
              label={c.passport}
              value={answers.hasValidPassport}
              onChange={(value) => update("hasValidPassport", value)}
            />
            <BooleanChoice
              label={c.expertHelp}
              value={answers.wantsExpertHelp}
              onChange={(value) => update("wantsExpertHelp", value)}
            />
            <BooleanChoice
              label={c.docReview}
              value={answers.wouldPayForDocumentReview}
              onChange={(value) => update("wouldPayForDocumentReview", value)}
            />

            <label className="qualification-field">
              <span>{c.budget}</span>
              <select
                value={answers.budgetRange}
                onChange={(event) =>
                  update("budgetRange", event.target.value as QualificationAnswers["budgetRange"])
                }
              >
                <option value="free_only">Free information only</option>
                <option value="under_100">Under EUR 100</option>
                <option value="100_300">EUR 100-300</option>
                <option value="300_plus">EUR 300+</option>
                <option value="employer_or_sponsor_pays">Employer/sponsor pays</option>
              </select>
            </label>

            <label className="qualification-field">
              <span>{c.contact}</span>
              <select
                value={answers.preferredContactChannel}
                onChange={(event) =>
                  update(
                    "preferredContactChannel",
                    event.target.value as QualificationAnswers["preferredContactChannel"],
                  )
                }
              >
                <option value="email">Email</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="phone">Phone</option>
              </select>
            </label>

            <label className="qualification-field">
              <span>{c.contactValue}</span>
              <input
                value={answers.phoneOrWhatsapp}
                placeholder={c.contactValuePlaceholder}
                onChange={(event) => update("phoneOrWhatsapp", event.target.value)}
              />
            </label>

            <label className="qualification-field">
              <span>{c.contactTime}</span>
              <select
                value={answers.preferredContactTime}
                onChange={(event) =>
                  update(
                    "preferredContactTime",
                    event.target.value as QualificationAnswers["preferredContactTime"],
                  )
                }
              >
                <option value="today">Today</option>
                <option value="this_week">This week</option>
                <option value="next_week">Next week</option>
                <option value="email_first">Email first</option>
              </select>
            </label>

            <label className="consent-row">
              <input
                type="checkbox"
                checked={answers.partnerContactAccepted}
                onChange={(event) => update("partnerContactAccepted", event.target.checked)}
              />
              <span>{c.partnerContact}</span>
            </label>
            <label className="consent-row">
              <input
                type="checkbox"
                checked={answers.partnerDataSharingAccepted}
                onChange={(event) => update("partnerDataSharingAccepted", event.target.checked)}
              />
              <span>{c.partnerShare}</span>
            </label>

            {error ? <p className="error-text">{error}</p> : null}

            <button type="submit" className="primary-button" disabled={status === "submitting"}>
              {status === "submitting" ? <Loader2 size={17} className="animate-spin" /> : <ShieldCheck size={17} />}
              {status === "submitting" ? c.saving : c.submit}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
