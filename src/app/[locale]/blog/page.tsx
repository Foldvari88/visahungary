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
  const path = listingPath(locale as Locale, "blog");

  return {
    title: "VisaHungary Blog | Hungary Visa and Residence Answers",
    description:
      "Practical answers about Hungarian visas, residence permits, documents, process paths, refusals, and route selection.",
    alternates: {
      canonical: absoluteUrl(path),
    },
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.has(locale)) notFound();

  return (
    <ContentListing
      locale={locale as Locale}
      type="blog"
      items={getContentItems(locale as Locale, "blog")}
    />
  );
}
