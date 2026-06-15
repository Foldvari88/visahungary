"use client";

import Link from "next/link";
import {
  AlertTriangle,
  BadgeCheck,
  BadgeX,
  BriefcaseBusiness,
  Building2,
  Calendar,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FileCheck2,
  Globe2,
  GraduationCap,
  Heart,
  HelpCircle,
  Home,
  KeyRound,
  Landmark,
  Laptop,
  Loader2,
  Mail,
  Map,
  MapPin,
  MessageSquareText,
  Plane,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Stars,
  WalletCards,
  X,
} from "lucide-react";
import { type ReactNode, useMemo, useState } from "react";
import { dictionary } from "@/lib/i18n";
import { getVisibleQuestions, questions } from "@/lib/questions";
import type { AnswerOption, Answers, Locale, Question } from "@/lib/types";

type Preview = {
  leadToken: string;
  teaser: {
    title: string;
    body: string;
    confidenceBand: "strong" | "likely" | "needs_review";
    riskLevel: "low" | "medium" | "high";
    missingCriticalAnswers: string[];
  };
};

type SendState = "idle" | "submitting" | "sent";

type SendResultResponse = {
  status: "sent" | "queued";
  message: string;
  nextStepCta: {
    label: string;
    href: string;
  };
};

const iconElements: Record<string, ReactNode> = {
  alert: <AlertTriangle size={20} />,
  badge: <BadgeCheck size={20} />,
  "badge-x": <BadgeX size={20} />,
  briefcase: <BriefcaseBusiness size={20} />,
  building: <Building2 size={20} />,
  calendar: <Calendar size={20} />,
  "calendar-days": <CalendarDays size={20} />,
  check: <Check size={20} />,
  clock: <Clock3 size={20} />,
  "file-check": <FileCheck2 size={20} />,
  globe: <Globe2 size={20} />,
  graduation: <GraduationCap size={20} />,
  heart: <Heart size={20} />,
  help: <HelpCircle size={20} />,
  home: <Home size={20} />,
  key: <KeyRound size={20} />,
  landmark: <Landmark size={20} />,
  laptop: <Laptop size={20} />,
  map: <Map size={20} />,
  "map-pin": <MapPin size={20} />,
  messages: <MessageSquareText size={20} />,
  plane: <Plane size={20} />,
  refresh: <RefreshCw size={20} />,
  shield: <ShieldCheck size={20} />,
  sparkles: <Sparkles size={20} />,
  stars: <Stars size={20} />,
  wallet: <WalletCards size={20} />,
  x: <X size={20} />,
};

const stageNames: Record<Question["stage"], Record<Locale, string>> = {
  goal: { en: "Goal", zh: "目的" },
  context: { en: "Context", zh: "背景" },
  route_details: { en: "Details", zh: "细节" },
  readiness: { en: "Readiness", zh: "准备度" },
  gate: { en: "Result", zh: "结果" },
};

const stageOrder: Array<Question["stage"]> = [
  "goal",
  "context",
  "route_details",
  "readiness",
  "gate",
];

const heroSignals = {
  en: [
    { label: "For non-EU applicants", icon: "globe" },
    { label: "Hungary / Schengen route", icon: "landmark" },
    { label: "Private email dossier", icon: "shield" },
  ],
  zh: [
    { label: "面向非欧盟申请人", icon: "globe" },
    { label: "匈牙利 / 申根路径", icon: "landmark" },
    { label: "邮件私密档案", icon: "shield" },
  ],
} satisfies Record<Locale, Array<{ label: string; icon: string }>>;

const destinationVisual = {
  en: {
    eyebrow: "Budapest arrival dossier",
    title: "From intention to the right route",
    description: "Short stay, work, study, family, business, remote work or investment.",
    points: ["Consulate", "Enter Hungary", "OIF review"],
  },
  zh: {
    eyebrow: "布达佩斯入境档案",
    title: "从计划到合适路径",
    description: "短期停留、工作、学习、家庭、创业、远程工作或投资。",
    points: ["领事馆", "Enter Hungary", "OIF审核"],
  },
} satisfies Record<
  Locale,
  { eyebrow: string; title: string; description: string; points: string[] }
>;

const routeSteps = {
  en: ["Intent", "Profile", "Route match", "Email checklist"],
  zh: ["目的", "资料", "路径匹配", "邮件清单"],
} satisfies Record<Locale, string[]>;

function isAnswered(question: Question, answers: Answers) {
  const value = answers[question.id];
  if (!question.required) return true;
  if (question.type === "number") return value !== null && value !== undefined && value !== "";
  return value !== null && value !== undefined && value !== "";
}

function labelForAnswer(question: Question, value: unknown, locale: Locale) {
  const option = question.options?.find((item) => item.value === value);
  if (option) return option.label[locale];
  if (value === null || value === undefined || value === "") return null;
  return String(value);
}

function profileChips(answers: Answers, locale: Locale) {
  return questions
    .map((question) => {
      const label = labelForAnswer(question, answers[question.id], locale);
      if (!label) return null;
      return {
        id: question.id,
        question: question.title[locale],
        label,
      };
    })
    .filter(Boolean)
    .slice(0, 8) as Array<{ id: string; question: string; label: string }>;
}

function AnswerCard({
  option,
  selected,
  locale,
  onSelect,
}: {
  option: AnswerOption;
  selected: boolean;
  locale: Locale;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      className="answer-card"
      data-selected={selected}
      onClick={onSelect}
      aria-pressed={selected}
    >
      <span className="answer-icon" aria-hidden="true">
        {iconElements[option.icon] ?? iconElements.sparkles}
      </span>
      <span className="answer-text">
        <strong>{option.label[locale]}</strong>
        {option.description ? <span>{option.description[locale]}</span> : null}
      </span>
      <span className="answer-check" aria-hidden="true">
        <Check size={14} />
      </span>
    </button>
  );
}

function QuestionInput({
  question,
  locale,
  value,
  setValue,
}: {
  question: Question;
  locale: Locale;
  value: unknown;
  setValue: (value: string | number | boolean) => void;
}) {
  if (question.type === "single_choice") {
    return (
      <div
        className="answer-grid"
        data-compact={question.options && question.options.length <= 3}
      >
        {question.options?.map((option) => (
          <AnswerCard
            key={option.id}
            option={option}
            locale={locale}
            selected={value === option.value}
            onSelect={() => setValue(option.value)}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="input-stack">
      <input
        className="text-field"
        inputMode={question.type === "number" ? "numeric" : "text"}
        type={question.type === "number" ? "number" : "text"}
        value={typeof value === "string" || typeof value === "number" ? value : ""}
        placeholder={question.placeholder?.[locale]}
        onChange={(event) =>
          setValue(
            question.type === "number"
              ? Number(event.target.value)
              : event.target.value,
          )
        }
      />
    </div>
  );
}

function ProfileSummary({
  answers,
  locale,
  activeStage,
}: {
  answers: Answers;
  locale: Locale;
  activeStage: Question["stage"];
}) {
  const copy = dictionary[locale];
  const chips = profileChips(answers, locale);
  const activeStageIndex = Math.max(0, stageOrder.indexOf(activeStage));

  return (
    <aside className="summary-panel" aria-label={copy.profile as string}>
      <div className="route-pass">
        <div>
          <span>{locale === "zh" ? "实时路径图" : "Live route map"}</span>
          <strong>{locale === "zh" ? "评估档案正在生成" : "Case file building"}</strong>
        </div>
        <Sparkles size={18} />
      </div>
      <div className="route-steps" aria-hidden="true">
        {routeSteps[locale].map((step, stepIndex) => (
          <div
            className="route-step"
            data-active={stepIndex <= activeStageIndex}
            key={step}
          >
            <span>{stepIndex + 1}</span>
            <small>{step}</small>
          </div>
        ))}
      </div>
      <h3>{copy.profile}</h3>
      {chips.length ? (
        <div className="summary-chips">
          {chips.map((chip) => (
            <span className="summary-chip" key={chip.id} title={chip.question}>
              <Check size={13} />
              {chip.label}
            </span>
          ))}
        </div>
      ) : (
        <p className="fine-print">{copy.emptyProfile}</p>
      )}
      <h3>{copy.trustTitle}</h3>
      <div className="trust-list">
        {(copy.trustItems as string[]).map((item) => (
          <div className="trust-item" key={item}>
            <ShieldCheck size={17} />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}

function LegalLinks({ locale }: { locale: Locale }) {
  const copy = dictionary[locale];

  return (
    <p className="legal-mini">
      {copy.legalLinksIntro}{" "}
      <Link href={`/${locale}/terms`} target="_blank">
        {copy.termsLink}
      </Link>{" "}
      {copy.and}{" "}
      <Link href={`/${locale}/privacy`} target="_blank">
        {copy.privacyLink}
      </Link>
      .
    </p>
  );
}

export function VisaCalculator({ initialLocale }: { initialLocale: Locale }) {
  const [answers, setAnswers] = useState<Answers>({});
  const [index, setIndex] = useState(0);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<Preview | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [email, setEmail] = useState("");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [marketingAccepted, setMarketingAccepted] = useState(false);
  const [sendState, setSendState] = useState<SendState>("idle");
  const [sendError, setSendError] = useState("");
  const [nextStepCta, setNextStepCta] = useState<SendResultResponse["nextStepCta"] | null>(null);

  const locale = initialLocale;
  const copy = dictionary[locale];
  const visibleQuestions = useMemo(() => getVisibleQuestions(answers), [answers]);
  const activeQuestion = visibleQuestions[index] ?? visibleQuestions[visibleQuestions.length - 1];
  const progress = preview
    ? 100
    : Math.round(((index + 1) / Math.max(visibleQuestions.length, 1)) * 100);

  function updateAnswer(questionId: string, value: string | number | boolean) {
    setError("");
    setAnswers((current) => ({ ...current, [questionId]: value }));
  }

  function goBack() {
    setError("");
    if (preview) {
      setPreview(null);
      return;
    }
    setIndex((current) => Math.max(0, current - 1));
  }

  async function generatePreview() {
    setLoadingPreview(true);
    setError("");
    try {
      const response = await fetch("/api/eligibility/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          answers,
          sourcePage: window.location.pathname,
          consent: {
            privacyAccepted: true,
            profilingAccepted: true,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Preview failed");
      }

      setPreview((await response.json()) as Preview);
    } catch {
      setError(
        locale === "zh"
          ? "暂时无法生成评估，请稍后重试。"
          : "We could not generate the assessment. Please try again.",
      );
    } finally {
      setLoadingPreview(false);
    }
  }

  function goNext() {
    if (!activeQuestion) return;

    if (!isAnswered(activeQuestion, answers)) {
      setError(copy.required as string);
      return;
    }

    if (index < visibleQuestions.length - 1) {
      setIndex((current) => current + 1);
      return;
    }

    void generatePreview();
  }

  async function sendResult() {
    setSendError("");
    if (!preview || !email.includes("@") || !privacyAccepted) {
      setSendError(copy.emailError as string);
      return;
    }

    setSendState("submitting");

    try {
      const response = await fetch("/api/eligibility/send-result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadToken: preview.leadToken,
          email,
          preferredLanguage: locale,
          consent: {
            privacyAccepted,
            marketingAccepted,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Send failed");
      }

      const data = (await response.json()) as SendResultResponse;
      setNextStepCta(data.nextStepCta);
      setSendState("sent");
    } catch {
      setSendState("idle");
      setSendError(
        locale === "zh"
          ? "发送失败，请稍后重试。"
          : "We could not send the result. Please try again.",
      );
    }
  }

  if (!activeQuestion && !preview) return null;

  return (
    <main className="calculator-shell">
      <div className="brand-row">
        <Link className="brand-mark" href={`/${locale}/calculator`}>
          <span className="brand-icon" aria-hidden="true">
            <Landmark size={19} />
          </span>
          <span>{copy.brand}</span>
        </Link>
        <div className="top-actions">
          <nav className="content-nav" aria-label="Content">
            <Link href={`/${locale}/visa-guides`}>Guides</Link>
            <Link href={`/${locale}/country-guides`}>Countries</Link>
            <Link href={`/${locale}/blog`}>Blog</Link>
          </nav>
          <nav className="locale-switcher" aria-label="Language">
            <Link href="/en/calculator" data-active={locale === "en"}>
              EN
            </Link>
            <Link href="/zh/calculator" data-active={locale === "zh"}>
              中文
            </Link>
          </nav>
        </div>
      </div>

      {!preview ? (
        <section className="hero-section">
          <div className="hero-copy">
            <div className="eyebrow">
              <Sparkles size={15} />
              {copy.eyebrow}
            </div>
            <h1>{copy.headline}</h1>
            <p>{copy.subcopy}</p>
            <div className="hero-signals">
              {heroSignals[locale].map((signal) => (
                <span className="hero-signal" key={signal.label}>
                  {iconElements[signal.icon]}
                  {signal.label}
                </span>
              ))}
            </div>
          </div>
          <div className="destination-visual" aria-hidden="true">
            <div className="destination-sun" />
            <div className="destination-line">
              <span />
              <span />
              <span />
            </div>
            <div className="destination-content">
              <span>{destinationVisual[locale].eyebrow}</span>
              <strong>{destinationVisual[locale].title}</strong>
              <p>{destinationVisual[locale].description}</p>
            </div>
            <div className="destination-points">
              {destinationVisual[locale].points.map((point) => (
                <span key={point}>{point}</span>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <div className="calculator-grid">
        {!preview && activeQuestion ? (
          <section className="flow-panel" aria-live="polite">
            <div className="case-strip">
              <div>
                <span>{locale === "zh" ? "当前评估" : "Current assessment"}</span>
                <strong>{stageNames[activeQuestion.stage][locale]}</strong>
              </div>
              <div className="case-score">
                <span>{progress}%</span>
              </div>
            </div>
            <div className="progress-line">
              <span className="progress-label">
                {copy.step} {index + 1} / {visibleQuestions.length} ·{" "}
                {stageNames[activeQuestion.stage][locale]}
              </span>
              <span className="progress-track" aria-hidden="true">
                <span className="progress-fill" style={{ width: `${progress}%` }} />
              </span>
            </div>

            <div className="step-header">
              <h2>{activeQuestion.title[locale]}</h2>
              {activeQuestion.description ? (
                <p>{activeQuestion.description[locale]}</p>
              ) : null}
            </div>

            <QuestionInput
              question={activeQuestion}
              locale={locale}
              value={answers[activeQuestion.id]}
              setValue={(value) => updateAnswer(activeQuestion.id, value)}
            />

            {error ? <p className="error-text">{error}</p> : null}
            <p className="fine-print">{copy.disclaimer}</p>
            <LegalLinks locale={locale} />
          </section>
        ) : null}

        {preview ? (
          <section className="gate-panel" aria-live="polite">
            <span className="gate-status">
              {loadingPreview ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
              {copy.routeHidden}
            </span>
            <h2>{preview.teaser.title}</h2>
            <p>{preview.teaser.body}</p>

            <div className="gate-metrics">
              <div className="metric-card">
                <span>{copy.confidence}</span>
                <strong>{copy[preview.teaser.confidenceBand]}</strong>
              </div>
              <div className="metric-card">
                <span>{copy.risk}</span>
                <strong>{copy[preview.teaser.riskLevel]}</strong>
              </div>
            </div>

            {sendState === "sent" ? (
              <div className="success-card">
                <strong>{copy.successTitle}</strong>
                <p>{copy.successBody}</p>
                {nextStepCta ? (
                  <Link className="primary-button" href={nextStepCta.href}>
                    {nextStepCta.label}
                    <ChevronRight size={17} />
                  </Link>
                ) : null}
              </div>
            ) : (
              <div className="input-stack">
                <label htmlFor="email">{copy.emailLabel}</label>
                <input
                  id="email"
                  className="text-field"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  placeholder={copy.emailPlaceholder as string}
                  onChange={(event) => setEmail(event.target.value)}
                />
                <label className="consent-row">
                  <input
                    type="checkbox"
                    checked={privacyAccepted}
                    onChange={(event) => setPrivacyAccepted(event.target.checked)}
                  />
                  <span>
                    {copy.privacyConsent}{" "}
                    <Link href={`/${locale}/privacy`} target="_blank">
                      {copy.privacyLink}
                    </Link>
                    .
                  </span>
                </label>
                <label className="consent-row">
                  <input
                    type="checkbox"
                    checked={marketingAccepted}
                    onChange={(event) => setMarketingAccepted(event.target.checked)}
                  />
                  <span>{copy.marketingConsent}</span>
                </label>
                {sendError ? <p className="error-text">{sendError}</p> : null}
                <button
                  type="button"
                  className="primary-button"
                  disabled={sendState === "submitting"}
                  onClick={() => void sendResult()}
                >
                  {sendState === "submitting" ? (
                    <Loader2 size={17} className="animate-spin" />
                  ) : (
                    <Mail size={17} />
                  )}
                  {copy.sendResult}
                </button>
              </div>
            )}
            <p className="fine-print">{copy.disclaimer}</p>
            <LegalLinks locale={locale} />
          </section>
        ) : null}

        {!preview && activeQuestion ? (
          <ProfileSummary
            answers={answers}
            locale={locale}
            activeStage={activeQuestion.stage}
          />
        ) : null}
      </div>

      {!preview ? (
        <div className="sticky-actions">
          <div className="sticky-inner">
            <button
              type="button"
              className="secondary-button"
              onClick={goBack}
              disabled={index === 0 || loadingPreview}
            >
              <ChevronLeft size={17} />
              {copy.back}
            </button>
            <button
              type="button"
              className="primary-button"
              disabled={loadingPreview}
              onClick={goNext}
            >
              {loadingPreview ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  {copy.loading}
                </>
              ) : (
                <>
                  {index === visibleQuestions.length - 1 ? copy.finish : copy.next}
                  <ChevronRight size={17} />
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="sticky-actions">
          <div className="sticky-inner">
            <button type="button" className="secondary-button" onClick={goBack}>
              <ChevronLeft size={17} />
              {copy.back}
            </button>
            <Link className="primary-button" href={nextStepCta?.href ?? "#email"}>
              {nextStepCta?.label ?? "Enter email first"}
              <ChevronRight size={17} />
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
