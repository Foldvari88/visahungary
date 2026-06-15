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
  const path = listingPath(locale as Locale, "country-guides");

  return {
    title: "Hungary Visa Country Guides | VisaHungary",
    description:
      "Country-focused Hungary visa and residence guides for non-EU applicants from India, China, Turkey, UAE and more.",
    alternates: {
      canonical: absoluteUrl(path),
    },
  };
}

export default async function CountryGuidesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.has(locale)) notFound();

  return (
    <ContentListing
      locale={locale as Locale}
      type="country-guides"
      items={getContentItems(locale as Locale, "country-guides")}
    />
  );
}
