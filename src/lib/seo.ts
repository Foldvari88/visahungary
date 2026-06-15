import type { ContentItem, ContentType } from "@/lib/content";
import type { Locale } from "@/lib/types";

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function absoluteUrl(path: string) {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function contentPath(item: Pick<ContentItem, "locale" | "type" | "slug">) {
  return `/${item.locale}/${item.type}/${item.slug}`;
}

export function listingPath(locale: Locale, type: ContentType) {
  return `/${locale}/${type}`;
}

export function articleJsonLd(item: ContentItem) {
  const path = contentPath(item);

  return {
    "@context": "https://schema.org",
    "@type": item.type === "blog" ? "BlogPosting" : "Article",
    headline: item.title,
    description: item.description,
    datePublished: item.date,
    dateModified: item.updatedAt,
    inLanguage: item.locale === "zh" ? "zh-CN" : "en",
    author: {
      "@type": "Organization",
      name: "VisaHungary",
    },
    publisher: {
      "@type": "Organization",
      name: "VisaHungary",
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/opengraph-image"),
      },
    },
    image: item.image
      ? [absoluteUrl(item.image)]
      : [absoluteUrl(`${path}/opengraph-image`)],
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(path),
    },
  };
}

export function faqJsonLd(item: ContentItem) {
  const faqBlocks = item.blocks?.filter((block) => block.type === "faq") ?? [];
  const items = faqBlocks.flatMap((block) => block.items);

  if (items.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  };
}
