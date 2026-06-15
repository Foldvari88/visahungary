import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import type {
  ComparisonTableBlock,
  ContentBlock,
  ContentItem,
  ContentSection,
  ContentSource,
} from "@/lib/content";
import type { Locale } from "@/lib/types";

const contentRoots = [
  path.join(process.cwd(), "src", "content", "blog"),
  path.join(process.cwd(), "content", "blog"),
];

const frontmatterSchema = z.object({
  slug: z.string().min(3),
  locale: z.enum(["en", "zh"]).optional(),
  title: z.string().min(10),
  description: z.string().min(30),
  keywords: z.array(z.string()).default([]),
  category: z.string().default("Immigration"),
  date: z.string().default("2026-06-02"),
  updatedAt: z.string().optional(),
  readingTime: z.string().default("6 min read"),
  heroLabel: z.string().default("Blog"),
  status: z.enum(["draft", "review", "published"]).default("draft"),
  riskLevel: z.enum(["low", "medium", "high"]).default("medium"),
  sources: z.array(z.object({ title: z.string(), url: z.string().url() })).default([]),
  ctaTitle: z.string().optional(),
  ctaBody: z.string().optional(),
  ctaButton: z.string().optional(),
  image: z.string().optional(),
});

type Frontmatter = {
  slug?: string;
  locale?: Locale;
  title?: string;
  description?: string;
  keywords?: string[];
  category?: string;
  date?: string;
  updatedAt?: string;
  readingTime?: string;
  heroLabel?: string;
  status?: ContentItem["status"];
  riskLevel?: ContentItem["riskLevel"];
  sources?: ContentSource[];
  ctaTitle?: string;
  ctaBody?: string;
  ctaButton?: string;
  image?: string;
};

export function validateMdxBlogFrontmatter(value: unknown) {
  return frontmatterSchema.parse(value);
}

function parseScalar(value: string) {
  const trimmed = value.trim();

  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }

  if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
    return JSON.parse(trimmed);
  }

  return trimmed;
}

function parseFrontmatter(raw: string): { data: Frontmatter; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) {
    throw new Error("Markdown content is missing frontmatter.");
  }

  const data = match[1].split(/\r?\n/).reduce<Frontmatter>((acc, line) => {
    const separatorIndex = line.indexOf(":");
    if (separatorIndex === -1) return acc;

    const key = line.slice(0, separatorIndex).trim() as keyof Frontmatter;
    const value = line.slice(separatorIndex + 1);
    if (!key) return acc;

    return {
      ...acc,
      [key]: parseScalar(value),
    };
  }, {});

  return {
    data,
    body: raw.slice(match[0].length).trim(),
  };
}

function parseParagraphs(lines: string[]) {
  const paragraphs: string[] = [];
  let buffer: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("- ") || trimmed.startsWith("### ")) {
      if (buffer.length > 0) {
        paragraphs.push(buffer.join(" "));
        buffer = [];
      }
      continue;
    }

    buffer.push(trimmed);
  }

  if (buffer.length > 0) {
    paragraphs.push(buffer.join(" "));
  }

  return paragraphs;
}

function parseBullets(lines: string[]) {
  return lines
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => line.slice(2).trim());
}

function parseFaqBlock(heading: string, lines: string[]): ContentBlock | null {
  const items: Array<{ question: string; answer: string }> = [];
  let currentQuestion = "";
  let answerLines: string[] = [];

  const flush = () => {
    if (!currentQuestion) return;
    const answer = parseParagraphs(answerLines).join(" ");
    if (answer) {
      items.push({ question: currentQuestion, answer });
    }
    answerLines = [];
  };

  for (const line of lines) {
    if (line.startsWith("### ")) {
      flush();
      currentQuestion = line.replace(/^###\s+/, "").trim();
      continue;
    }

    answerLines.push(line);
  }

  flush();

  if (items.length === 0) return null;
  return { type: "faq", heading, items };
}

function parseMarkdownBody(body: string): {
  intro: string;
  sections: ContentSection[];
  blocks: ContentBlock[];
} {
  const structured = extractStructuredBlocks(body);
  const lines = structured.markdown.split(/\r?\n/);
  const firstHeadingIndex = lines.findIndex((line) => line.startsWith("## "));
  const introLines = firstHeadingIndex === -1 ? lines : lines.slice(0, firstHeadingIndex);
  const contentLines = firstHeadingIndex === -1 ? [] : lines.slice(firstHeadingIndex);
  const intro = parseParagraphs(introLines).join(" ");
  const sections: ContentSection[] = [];
  const blocks: ContentBlock[] = [...structured.blocks];

  let currentHeading = "";
  let currentLines: string[] = [];

  const flush = () => {
    if (!currentHeading) return;

    if (currentHeading.toLowerCase().includes("faq")) {
      const block = parseFaqBlock(currentHeading, currentLines);
      if (block) blocks.push(block);
      currentHeading = "";
      currentLines = [];
      return;
    }

    const bodyParagraphs = parseParagraphs(currentLines);
    const bullets = parseBullets(currentLines);
    sections.push({
      heading: currentHeading,
      body: bodyParagraphs,
      ...(bullets.length > 0 ? { bullets } : {}),
    });
    currentHeading = "";
    currentLines = [];
  };

  for (const line of contentLines) {
    if (line.startsWith("## ")) {
      flush();
      currentHeading = line.replace(/^##\s+/, "").trim();
      continue;
    }

    currentLines.push(line);
  }

  flush();

  return { intro, sections, blocks };
}

function extractStructuredBlocks(body: string): {
  markdown: string;
  blocks: ContentBlock[];
} {
  const blocks: ContentBlock[] = [];
  let markdown = body;

  markdown = markdown.replace(
    /<Checklist\s+heading="([^"]+)">\s*([\s\S]*?)\s*<\/Checklist>/g,
    (_, heading: string, content: string) => {
      blocks.push({
        type: "checklist",
        heading,
        items: parseBullets(content.split(/\r?\n/)),
      });
      return "";
    },
  );

  markdown = markdown.replace(
    /<Faq\s+heading="([^"]+)">\s*([\s\S]*?)\s*<\/Faq>/g,
    (_, heading: string, content: string) => {
      blocks.push(parseInlineFaqBlock(heading, content));
      return "";
    },
  );

  markdown = markdown.replace(
    /<ComparisonTable\s+heading="([^"]+)">\s*([\s\S]*?)\s*<\/ComparisonTable>/g,
    (_, heading: string, content: string) => {
      blocks.push(parseComparisonTableBlock(heading, content));
      return "";
    },
  );

  markdown = markdown.replace(
    /<Infographic\s+([\s\S]*?)\s*\/>/g,
    (_, attrs: string) => {
      const parsedAttrs = parseAttributes(attrs);
      blocks.push({
        type: "infographic",
        heading: parsedAttrs.heading ?? "Infographic",
        src: parsedAttrs.src ?? "",
        alt: parsedAttrs.alt ?? "",
        caption: parsedAttrs.caption,
      });
      return "";
    },
  );

  return { markdown, blocks };
}

function parseInlineFaqBlock(heading: string, content: string): ContentBlock {
  const items = content
    .split(/\n(?=Q:\s+)/)
    .map((entry) => {
      const question = entry.match(/Q:\s*(.+)/)?.[1]?.trim();
      const answer = entry.match(/A:\s*([\s\S]+)/)?.[1]?.trim();
      return question && answer ? { question, answer } : null;
    })
    .filter((item): item is { question: string; answer: string } => Boolean(item));

  return { type: "faq", heading, items };
}

function parseComparisonTableBlock(
  heading: string,
  content: string,
): ComparisonTableBlock {
  const rows = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("|") && !line.includes("---"))
    .map((line) =>
      line
        .split("|")
        .slice(1, -1)
        .map((cell) => cell.trim()),
    );

  const [columns = [], ...tableRows] = rows;
  return {
    type: "comparisonTable",
    heading,
    columns,
    rows: tableRows,
  };
}

function parseAttributes(attrs: string) {
  const values: Record<string, string> = {};
  for (const match of attrs.matchAll(/(\w+)="([^"]*)"/g)) {
    values[match[1]] = match[2];
  }
  return values;
}

function isMarkdownFile(fileName: string) {
  return fileName.endsWith(".md") || fileName.endsWith(".mdx");
}

function collectMarkdownFiles(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return collectMarkdownFiles(entryPath);
    if (entry.isFile() && isMarkdownFile(entry.name)) return [entryPath];
    return [];
  });
}

function readMarkdownFiles() {
  return contentRoots.flatMap((contentRoot) => {
    if (!fs.existsSync(contentRoot)) return [];
    return collectMarkdownFiles(contentRoot).map((filePath) => ({
      contentRoot,
      filePath,
    }));
  });
}

function toContentItem({
  contentRoot,
  filePath,
}: {
  contentRoot: string;
  filePath: string;
}): ContentItem {
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, body } = parseFrontmatter(raw);
  const meta = validateMdxBlogFrontmatter({
    ...data,
    locale: data.locale ?? inferLocale(contentRoot, filePath),
  });
  const parsed = parseMarkdownBody(body);

  return {
    type: "blog",
    slug: meta.slug,
    locale: meta.locale ?? "en",
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    category: meta.category,
    date: meta.date,
    updatedAt: meta.updatedAt ?? meta.date,
    readingTime: meta.readingTime,
    heroLabel: meta.heroLabel,
    intro: parsed.intro,
    sections: parsed.sections,
    blocks: parsed.blocks,
    status: meta.status,
    riskLevel: meta.riskLevel,
    sources: meta.sources,
    image: meta.image,
    cta: {
      title: meta.ctaTitle ?? "Not sure which Hungary route fits?",
      body:
        meta.ctaBody ??
        "Use the calculator to compare routes and receive a tailored checklist by email.",
      button: meta.ctaButton ?? "Check my route",
    },
  };
}

export function getMdxBlogItems() {
  const items = readMarkdownFiles().map(toContentItem);
  const unique = new Map<string, ContentItem>();

  for (const item of items) {
    unique.set(`${item.locale}:${item.slug}`, item);
  }

  return [...unique.values()];
}

function inferLocale(contentRoot: string, filePath: string): Locale {
  const relative = path.relative(contentRoot, filePath);
  const firstSegment = relative.split(path.sep)[0];
  return firstSegment === "zh" ? "zh" : "en";
}
