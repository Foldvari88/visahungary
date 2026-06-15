import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentPage } from "@/components/content-page";
import { contentItems, getContentItem } from "@/lib/content";
import { absoluteUrl, contentPath } from "@/lib/seo";
import type { Locale } from "@/lib/types";

export function generateStaticParams() {
  return contentItems
    .filter((item) => item.type === "blog")
    .map((item) => ({ locale: item.locale, slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const item = getContentItem(locale as Locale, "blog", slug);
  if (!item) return {};

  return {
    title: item.title,
    description: item.description,
    keywords: item.keywords,
    alternates: {
      canonical: absoluteUrl(contentPath(item)),
    },
    openGraph: {
      title: item.title,
      description: item.description,
      type: "article",
      url: absoluteUrl(contentPath(item)),
      publishedTime: item.date,
      modifiedTime: item.updatedAt,
    },
  };
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const item = getContentItem(locale as Locale, "blog", slug);
  if (!item) notFound();

  return <ContentPage item={item} />;
}
