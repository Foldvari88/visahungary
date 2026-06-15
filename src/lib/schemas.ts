import { z } from "zod";

export const localeSchema = z.enum(["en", "zh"]);

export const answersSchema = z.record(
  z.string(),
  z.union([z.string(), z.number(), z.boolean(), z.null()]),
);

export const previewRequestSchema = z.object({
  locale: localeSchema,
  answers: answersSchema,
  sourcePage: z.string().min(1),
  consent: z.object({
    privacyAccepted: z.boolean(),
    profilingAccepted: z.boolean(),
  }),
});

export const sendResultRequestSchema = z.object({
  leadToken: z.string().min(12),
  email: z.string().email(),
  preferredLanguage: localeSchema,
  consent: z.object({
    privacyAccepted: z.boolean(),
    marketingAccepted: z.boolean(),
  }),
});

export const qualificationRequestSchema = z.object({
  leadToken: z.string().min(12),
  locale: localeSchema,
  answers: z.object({
    fullName: z.string().trim().min(2).max(120),
    moveTimeline: z.enum([
      "within_30_days",
      "one_to_three_months",
      "three_plus_months",
      "just_researching",
    ]),
    hasDocumentedBasis: z.boolean(),
    hasValidPassport: z.boolean(),
    budgetRange: z.enum([
      "free_only",
      "under_100",
      "100_300",
      "300_plus",
      "employer_or_sponsor_pays",
    ]),
    wantsExpertHelp: z.boolean(),
    wouldPayForDocumentReview: z.boolean(),
    preferredContactChannel: z.enum(["email", "whatsapp", "phone"]),
    phoneOrWhatsapp: z.string().trim().max(80).optional(),
    preferredContactTime: z.enum(["today", "this_week", "next_week", "email_first"]),
    partnerContactAccepted: z.boolean(),
    partnerDataSharingAccepted: z.boolean(),
  }),
});
