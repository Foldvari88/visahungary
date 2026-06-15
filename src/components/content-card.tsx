import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import type { ContentItem } from "@/lib/content";
import { contentPath } from "@/lib/seo";

export function ContentCard({ item }: { item: ContentItem }) {
  return (
    <article className="content-card">
      <div className="content-card-meta">
        <span>{item.heroLabel}</span>
        <span>{item.readingTime}</span>
      </div>
      <h3>
        <Link href={contentPath(item)}>{item.title}</Link>
      </h3>
      <p>{item.description}</p>
      <div className="content-card-footer">
        <span>
          <CalendarDays size={14} />
          Updated {item.updatedAt}
        </span>
        <Link href={contentPath(item)} aria-label={`Read ${item.title}`}>
          Read
          <ArrowRight size={15} />
        </Link>
      </div>
    </article>
  );
}
