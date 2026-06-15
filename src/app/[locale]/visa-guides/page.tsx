import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentListing } from "@/components/content-listing";
import { getContentItems } from "@/lib/content";
import { absoluteUrl, listingPath } from "@/lib/seo";
import type { Locale } from "@/lib/types";

const locales = new Set(["en", "zh"]);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const path = listingPath(locale as Locale, "visa-guides");

  return {
    title: "Hungary Visa Guides | VisaHungary",
    description:
      "Evergreen guides to Hungary visa, residence permit, White Card, work, study, family, investor, and Schengen routes.",
    alternates: {
      canonical: absoluteUrl(path),
    },
  };
}

export default async function VisaGuidesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.has(locale)) notFound();

  return (
    <ContentListing
      locale={locale as Locale}
      type="visa-guides"
      items={getContentItems(locale as Locale, "visa-guides")}
    />
  );
}
