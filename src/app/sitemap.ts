import type { MetadataRoute } from "next";
import { contentItems } from "@/lib/content";
import { absoluteUrl, contentPath, listingPath } from "@/lib/seo";
import type { Locale } from "@/lib/types";

const locales: Locale[] = ["en", "zh"];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = locales.flatMap((locale) => [
    `/${locale}/calculator`,
    `/${locale}/terms`,
    `/${locale}/privacy`,
    listingPath(locale, "blog"),
    listingPath(locale, "visa-guides"),
    listingPath(locale, "country-guides"),
  ]);

  return [
    ...staticRoutes.map((route) => ({
      url: absoluteUrl(route),
      lastModified: new Date("2026-06-01"),
      changeFrequency: "weekly" as const,
      priority: route.includes("calculator") ? 1 : 0.7,
    })),
    ...contentItems.map((item) => ({
      url: absoluteUrl(contentPath(item)),
      lastModified: new Date(item.updatedAt),
      changeFrequency: "monthly" as const,
      priority: item.type === "visa-guides" ? 0.9 : 0.8,
    })),
  ];
}

export const dynamic = "force-static";
