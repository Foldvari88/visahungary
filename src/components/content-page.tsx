import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Landmark,
  MailCheck,
  ShieldCheck,
} from "lucide-react";
import type { ContentBlock, ContentItem } from "@/lib/content";
import {
  articleJsonLd,
  breadcrumbJsonLd,
  contentPath,
  faqJsonLd,
  listingPath,
} from "@/lib/seo";

export function ContentPage({ item }: { item: ContentItem }) {
  const articleLd = articleJsonLd(item);
  const faqLd = faqJsonLd(item);
  const breadcrumbLd = breadcrumbJsonLd([
    { name: "Home", url: `/${item.locale}/calculator` },
    { name: item.heroLabel, url: listingPath(item.locale, item.type) },
    { name: item.title, url: contentPath(item) },
  ]);

  return (
    <main className="article-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      {faqLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      ) : null}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <article className="article-shell">
        <nav className="article-breadcrumb" aria-label="Breadcrumb">
          <Link href={`/${item.locale}/calculator`}>Calculator</Link>
          <span>/</span>
          <Link href={listingPath(item.locale, item.type)}>{item.heroLabel}</Link>
        </nav>

        <header className="article-hero">
          <div>
            <p className="article-kicker">{item.heroLabel}</p>
            <h1>{item.title}</h1>
            <p>{item.description}</p>
            <div className="article-meta">
              <span>{item.category}</span>
              <span>{item.readingTime}</span>
              <span>Updated {item.updatedAt}</span>
            </div>
          </div>
          <aside className="article-route-card">
            <Landmark size={24} />
            <strong>Not sure which route fits?</strong>
            <p>Use the free calculator and receive your likely route by email.</p>
            <Link href={`/${item.locale}/calculator`}>
              Start calculator
              <ArrowRight size={16} />
            </Link>
          </aside>
        </header>

        <div className="article-layout">
          <div className="article-body">
            <p className="article-intro">{item.intro}</p>
            {item.sections.map((section) => (
              <section key={section.heading}>
                <h2>{section.heading}</h2>
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.bullets ? (
                  <ul>
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}

            {item.blocks?.map((block, index) => (
              <ContentBlockRenderer block={block} key={`${block.type}-${index}`} />
            ))}

            <section className="article-disclaimer">
              <ShieldCheck size={22} />
              <div>
                <h2>Preliminary information only</h2>
                <p>
                  This article is informational and not legal advice. Rules,
                  documents, deadlines, and authority practice can change, so a
                  case-specific review is recommended before filing.
                </p>
              </div>
            </section>

            {item.sources?.length ? (
              <section className="article-sources">
                <h2>Sources and review basis</h2>
                <ul>
                  {item.sources.map((source) => (
                    <li key={source.url}>
                      <a href={source.url} rel="noreferrer" target="_blank">
                        {source.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <section className="article-cta">
              <MailCheck size={26} />
              <div>
                <h2>{item.cta.title}</h2>
                <p>{item.cta.body}</p>
              </div>
              <Link href={`/${item.locale}/calculator`}>
                {item.cta.button}
                <ArrowRight size={16} />
              </Link>
            </section>
          </div>

          <aside className="article-sidebar">
            <div>
              <BookOpen size={18} />
              <strong>Important note</strong>
              <p>
                This page is preliminary information only, not legal advice.
                Final eligibility depends on official rules, documents,
                deadlines, and authority review.
              </p>
            </div>
            <div>
              <strong>Related action</strong>
              <p>Get a route-specific checklist through the calculator.</p>
              <Link href={`/${item.locale}/calculator`}>Check my route</Link>
            </div>
          </aside>
        </div>
      </article>
    </main>
  );
}

function ContentBlockRenderer({ block }: { block: ContentBlock }) {
  if (block.type === "checklist") {
    return (
      <section className="article-checklist">
        <h2>{block.heading}</h2>
        <ul>
          {block.items.map((item) => (
            <li key={item}>
              <CheckCircle2 size={18} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  if (block.type === "faq") {
    return (
      <section className="article-faq">
        <h2>{block.heading}</h2>
        {block.items.map((item) => (
          <details key={item.question}>
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </section>
    );
  }

  if (block.type === "comparisonTable") {
    return (
      <section className="article-table-section">
        <h2>{block.heading}</h2>
        <div className="article-table-wrap">
          <table>
            <thead>
              <tr>
                {block.columns.map((column) => (
                  <th key={column}>{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row) => (
                <tr key={row.join("-")}>
                  {row.map((cell) => (
                    <td key={cell}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    );
  }

  return (
    <section className="article-infographic">
      <h2>{block.heading}</h2>
      <figure>
        <Image
          alt={block.alt}
          height={720}
          src={block.src}
          width={1200}
          unoptimized={block.src.endsWith(".svg")}
        />
        {block.caption ? <figcaption>{block.caption}</figcaption> : null}
      </figure>
    </section>
  );
}
