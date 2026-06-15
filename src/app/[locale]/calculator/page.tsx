import { notFound } from "next/navigation";
import { VisaCalculator } from "@/components/visa-calculator";
import type { Locale } from "@/lib/types";

const locales = new Set(["en", "zh"]);

export default async function CalculatorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.has(locale)) {
    notFound();
  }

  return <VisaCalculator initialLocale={locale as Locale} />;
}
