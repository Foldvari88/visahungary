import Link from "next/link";
import { ArrowRight, SearchCheck } from "lucide-react";
import { ContentCard } from "@/components/content-card";
import { contentTypeLabel, type ContentItem, type ContentType } from "@/lib/content";
import type { Locale } from "@/lib/types";

const listingCopy = {
  blog: {
    eyebrow: "VisaHungary blog",
    title: "Practical Hungary visa answers",
    body: "Long-tail answers for applicants comparing documents, process steps, timelines, and risk points.",
  },
  "visa-guides": {
    eyebrow: "Visa route guides",
    title: "Hungary visa and residence guides",
    body: "Evergreen route pages for the most searched Hungarian visa and residence permit topics.",
  },
  "country-guides": {
    eyebrow: "Country guides",
    title: "Hungary routes by applicant country",
    body: "Country-focused guides for non-EU applicants planning short stay, work, study, family, remote work, business, or investment routes.",
  },
} satisfies Record<ContentType, { eyebrow: string; title: string; body: string }>;

export function ContentListing({
  locale,
  type,
  items,
}: {
  locale: Locale;
  type: ContentType;
  items: ContentItem[];
}) {
  const copy = listingCopy[type];

  return (
    <main className="content-hub-page">
      <section className="content-hub-hero">
        <div>
          <p className="article-kicker">{copy.eyebrow}</p>
          <h1>{copy.title}</h1>
          <p>{copy.body}</p>
        </div>
        <Link className="content-hub-cta" href={`/${locale}/calculator`}>
          <SearchCheck size={19} />
          Find my route
          <ArrowRight size={16} />
        </Link>
      </section>

      <section className="content-section">
        <div className="content-section-heading">
          <h2>{contentTypeLabel(type)}</h2>
          <span>{items.length} resources</span>
        </div>
        <div className="content-grid">
          {items.map((item) => (
            <ContentCard item={item} key={item.slug} />
          ))}
        </div>
      </section>
    </main>
  );
}
