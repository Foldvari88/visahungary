import { notFound } from "next/navigation";
import { QualificationForm } from "@/components/qualification-form";
import type { Locale } from "@/lib/types";

const locales = new Set(["en", "zh"]);

export default async function QualificationPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ leadToken?: string }>;
}) {
  const { locale } = await params;
  const { leadToken = "" } = await searchParams;

  if (!locales.has(locale)) {
    notFound();
  }

  return <QualificationForm locale={locale as Locale} leadToken={leadToken} />;
}
