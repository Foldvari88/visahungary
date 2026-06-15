#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const ROOT = process.cwd();
const OUTPUT_DIR = path.join(ROOT, "automation-output");
const BLOG_DIR = path.join(ROOT, "src", "content", "blog", "en");
const GENERATED_DIR = path.join(ROOT, "public", "generated", "blog");
const DEFAULT_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
const OFFICIAL_SOURCE_ALLOWLIST = [
  "enterhungary.gov.hu",
  "oif.gov.hu",
  "konzinfo.mfa.gov.hu",
  "home-affairs.ec.europa.eu",
  "commission.europa.eu",
  "eur-lex.europa.eu",
];

const seedTopics = [
  {
    query: "can I apply for a Hungary residence permit from inside Hungary",
    impressions: 44,
    clicks: 1,
    ctr: 0.023,
    source: "seed",
  },
  {
    query: "Hungary White Card income proof bank statements",
    impressions: 32,
    clicks: 0,
    ctr: 0,
    source: "seed",
  },
  {
    query: "Hungary work permit accommodation proof documents",
    impressions: 26,
    clicks: 1,
    ctr: 0.038,
    source: "seed",
  },
];

export function validateSourceUrl(url) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return OFFICIAL_SOURCE_ALLOWLIST.some(
      (allowed) => host === allowed || host.endsWith(`.${allowed}`),
    );
  } catch {
    return false;
  }
}

export function scoreTopic(topic, existingSlugs = new Set()) {
  const query = topic.query.toLowerCase();
  const longTailScore = Math.min(query.split(/\s+/).length / 8, 1) * 24;
  const intentScore = /(can|how|what|which|documents|proof|inside|permit|visa)/.test(
    query,
  )
    ? 22
    : 8;
  const businessScore = /(work|white card|family|student|residence|permit)/.test(
    query,
  )
    ? 18
    : 10;
  const opportunityScore =
    Number(topic.impressions ?? 0) > 0
      ? Math.min(Number(topic.impressions) / 50, 1) * 16
      : 6;
  const painPointScore = Number(topic.painPoints ?? 0) > 0 ? 12 : 0;
  const riskPenalty = /(refused|appeal|investor|family reunification|overstay)/.test(
    query,
  )
    ? 18
    : 0;
  const duplicatePenalty = existingSlugs.has(slugify(topic.query)) ? 30 : 0;

  return Math.round(
    longTailScore +
      intentScore +
      businessScore +
      opportunityScore +
      painPointScore -
      riskPenalty -
      duplicatePenalty,
  );
}

export async function runAutomation({ dryRun = true } = {}) {
  const existingSlugs = readExistingSlugs();
  const candidates = await collectTopicCandidates();
  const scored = candidates
    .map((candidate) => ({
      ...candidate,
      score: scoreTopic(candidate, existingSlugs),
    }))
    .sort((a, b) => b.score - a.score);

  const topic = scored[0] ?? seedTopics[0];
  const brief = buildSeoBrief(topic);
  const draft = await generateDraft(brief);
  const slug = slugify(draft.slug || brief.slug);
  const infographicSvg = renderInfographicSvg(draft);
  const mdx = renderMdx({ ...draft, slug });
  const prBody = renderPrBody({ topic, brief, draft });

  const baseDir = dryRun ? OUTPUT_DIR : ROOT;
  const blogDir = dryRun ? path.join(baseDir, "src", "content", "blog", "en") : BLOG_DIR;
  const generatedDir = dryRun
    ? path.join(baseDir, "public", "generated", "blog", slug)
    : path.join(GENERATED_DIR, slug);

  fs.mkdirSync(blogDir, { recursive: true });
  fs.mkdirSync(generatedDir, { recursive: true });
  fs.writeFileSync(path.join(blogDir, `${slug}.mdx`), mdx);
  fs.writeFileSync(path.join(generatedDir, "infographic-1.svg"), infographicSvg);
  fs.writeFileSync(path.join(baseDir, "daily-blog-pr-body.md"), prBody);
  fs.writeFileSync(
    path.join(baseDir, "daily-blog-summary.json"),
    JSON.stringify({ dryRun, topic, brief, slug, score: topic.score }, null, 2),
  );

  return { slug, score: topic.score, dryRun };
}

async function collectTopicCandidates() {
  const [gsc, reddit] = await Promise.all([fetchGscTopics(), fetchRedditPainPoints()]);
  const merged = new Map();

  for (const topic of [...seedTopics, ...gsc, ...reddit]) {
    const key = topic.query.toLowerCase();
    const current = merged.get(key) ?? { query: topic.query, source: topic.source };
    merged.set(key, {
      ...current,
      impressions: Math.max(current.impressions ?? 0, topic.impressions ?? 0),
      clicks: Math.max(current.clicks ?? 0, topic.clicks ?? 0),
      ctr: Math.max(current.ctr ?? 0, topic.ctr ?? 0),
      painPoints: (current.painPoints ?? 0) + (topic.painPoints ?? 0),
      examples: [...(current.examples ?? []), ...(topic.examples ?? [])].slice(0, 5),
    });
  }

  return [...merged.values()];
}

async function fetchGscTopics() {
  if (
    !process.env.GSC_CLIENT_EMAIL ||
    !process.env.GSC_PRIVATE_KEY ||
    !process.env.GSC_SITE_URL
  ) {
    return [];
  }

  const token = await fetchGoogleAccessToken();
  const endDate = new Date();
  endDate.setUTCDate(endDate.getUTCDate() - 2);
  const startDate = new Date(endDate);
  startDate.setUTCDate(startDate.getUTCDate() - 28);
  const siteUrl = encodeURIComponent(process.env.GSC_SITE_URL);
  const response = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${siteUrl}/searchAnalytics/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        startDate: startDate.toISOString().slice(0, 10),
        endDate: endDate.toISOString().slice(0, 10),
        dimensions: ["query"],
        rowLimit: 50,
      }),
    },
  );

  if (!response.ok) {
    console.warn(`GSC query failed: ${response.status}`);
    return [];
  }

  const data = await response.json();
  return (data.rows ?? [])
    .map((row) => ({
      query: row.keys?.[0],
      clicks: row.clicks,
      impressions: row.impressions,
      ctr: row.ctr,
      source: "gsc",
    }))
    .filter((row) => typeof row.query === "string" && /hungary|visa|permit/i.test(row.query));
}

async function fetchGoogleAccessToken() {
  const now = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = base64Url(
    JSON.stringify({
      iss: process.env.GSC_CLIENT_EMAIL,
      scope: "https://www.googleapis.com/auth/webmasters.readonly",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    }),
  );
  const unsigned = `${header}.${claim}`;
  const privateKey = process.env.GSC_PRIVATE_KEY.replace(/\\n/g, "\n");
  const signature = crypto
    .createSign("RSA-SHA256")
    .update(unsigned)
    .sign(privateKey, "base64url");

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${unsigned}.${signature}`,
    }),
  });

  if (!response.ok) {
    throw new Error(`Google token request failed: ${response.status}`);
  }

  const data = await response.json();
  return data.access_token;
}

async function fetchRedditPainPoints() {
  if (
    !process.env.REDDIT_CLIENT_ID ||
    !process.env.REDDIT_CLIENT_SECRET ||
    !process.env.REDDIT_USER_AGENT
  ) {
    return [];
  }

  const token = await fetchRedditToken();
  const subreddits = ["hungary", "digitalnomad", "SchengenVisa", "immigration"];
  const topics = [];

  for (const subreddit of subreddits) {
    const response = await fetch(
      `https://oauth.reddit.com/r/${subreddit}/search.json?q=hungary%20visa%20OR%20residence%20permit&restrict_sr=1&sort=new&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "User-Agent": process.env.REDDIT_USER_AGENT,
        },
      },
    );
    if (!response.ok) continue;
    const data = await response.json();
    for (const child of data.data?.children ?? []) {
      const post = child.data;
      if (!post?.title) continue;
      topics.push({
        query: normalizePainPointTitle(post.title),
        source: `reddit:${subreddit}`,
        painPoints: 1,
        examples: [
          {
            subreddit,
            title: post.title,
            score: post.score,
            permalink: `https://www.reddit.com${post.permalink}`,
          },
        ],
      });
    }
  }

  return topics;
}

async function fetchRedditToken() {
  const credentials = Buffer.from(
    `${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET}`,
  ).toString("base64");
  const response = await fetch("https://www.reddit.com/api/v1/access_token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": process.env.REDDIT_USER_AGENT,
    },
    body: "grant_type=client_credentials",
  });
  if (!response.ok) {
    throw new Error(`Reddit token request failed: ${response.status}`);
  }
  const data = await response.json();
  return data.access_token;
}

function buildSeoBrief(topic) {
  const slug = slugify(topic.query);
  return {
    slug,
    query: topic.query,
    painPoint:
      topic.examples?.[0]?.title ??
      "Applicants need a practical answer before choosing a Hungary visa or residence route.",
    suggestedTitle: titleFromQuery(topic.query),
    metaDescription: `A practical, source-based guide to ${topic.query}, including route signals, documents, risk points, and next steps.`,
    sources: [
      {
        title: "Enter Hungary official portal",
        url: "https://enterhungary.gov.hu/",
      },
      {
        title: "European Commission Schengen visa policy",
        url: "https://home-affairs.ec.europa.eu/policies/schengen/visa-policy_en",
      },
    ].filter((source) => validateSourceUrl(source.url)),
    internalLinks: ["/en/calculator", "/en/visa-guides", "/en/blog"],
    riskLevel: riskLevelForQuery(topic.query),
  };
}

async function generateDraft(brief) {
  if (!process.env.OPENAI_API_KEY) return fallbackDraft(brief);

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      input: [
        {
          role: "system",
          content:
            "You create cautious, source-based Hungary visa blog drafts. Do not invent legal rules. Use preliminary language and include only claims supported by the provided brief.",
        },
        {
          role: "user",
          content: `Return strict JSON for an MDX article draft with keys: slug,title,description,keywords,category,readingTime,riskLevel,intro,sections,checklist,faq,comparisonRows,ctaTitle,ctaBody,ctaButton. Brief: ${JSON.stringify(
            brief,
          )}`,
        },
      ],
      text: {
        format: {
          type: "json_object",
        },
      },
    }),
  });

  if (!response.ok) {
    console.warn(`OpenAI draft request failed: ${response.status}`);
    return fallbackDraft(brief);
  }

  const data = await response.json();
  const text = data.output_text ?? data.output?.[0]?.content?.[0]?.text;
  if (!text) return fallbackDraft(brief);

  return normalizeDraft(JSON.parse(text), brief);
}

function fallbackDraft(brief) {
  return normalizeDraft(
    {
      slug: brief.slug,
      title: brief.suggestedTitle,
      description: brief.metaDescription,
      keywords: [brief.query, "Hungary visa documents", "Hungary residence permit"],
      category: "Process",
      readingTime: "5 min read",
      riskLevel: brief.riskLevel,
      intro:
        "Many Hungary visa questions start with the same problem: applicants need to know which route fits before they prepare documents or choose a filing path.",
      sections: [
        {
          heading: "Start with purpose and stay length",
          body:
            "Short visits, work, study, family residence, remote work, and investment cases follow different planning logic. The first step is to separate the intended activity from the intended duration.",
        },
        {
          heading: "Check the route before collecting documents",
          body:
            "A general document list can be misleading. Hungarian residence planning usually depends on the specific purpose, current location, lawful status, and route-specific proof.",
        },
        {
          heading: "When manual review is safer",
          body:
            "Prior refusal, overstay, urgent deadlines, unclear income, family status questions, or business activity usually justify a careful review before filing.",
        },
      ],
      checklist: [
        "Confirm the main purpose of stay.",
        "Check whether the stay is short-term or 90+ days.",
        "Identify the likely Hungary route before preparing documents.",
        "Use official sources and review risk flags before filing.",
      ],
      faq: [
        {
          question: "Can I rely on a general Hungary visa checklist?",
          answer:
            "A general checklist can help with orientation, but the final document set should match the exact route and applicant facts.",
        },
        {
          question: "Should high-risk cases be handled automatically?",
          answer:
            "No. Refusal, overstay, investor, family, and work eligibility questions should be reviewed before relying on automated content.",
        },
      ],
      comparisonRows: [
        ["First question", "Short stay", "Residence purpose"],
        ["Main risk", "Wrong visa category", "Missing route proof"],
        ["Best next step", "Check travel purpose", "Check residence route"],
      ],
      ctaTitle: "Check your likely Hungary route",
      ctaBody:
        "Use the calculator to compare short-stay, work, study, family, remote work, business, and investment paths.",
      ctaButton: "Start the calculator",
    },
    brief,
  );
}

function normalizeDraft(draft, brief) {
  return {
    slug: slugify(draft.slug || brief.slug),
    title: draft.title || brief.suggestedTitle,
    description: draft.description || brief.metaDescription,
    keywords: arrayOrDefault(draft.keywords, [brief.query]),
    category: draft.category || "Process",
    readingTime: draft.readingTime || "5 min read",
    riskLevel: draft.riskLevel || brief.riskLevel,
    intro: draft.intro,
    sections: arrayOrDefault(draft.sections, []),
    checklist: arrayOrDefault(draft.checklist, []),
    faq: arrayOrDefault(draft.faq, []),
    comparisonRows: arrayOrDefault(draft.comparisonRows, []),
    sources: brief.sources,
    ctaTitle: draft.ctaTitle || "Check your likely Hungary route",
    ctaBody: draft.ctaBody || "Use the calculator to identify the route and document gaps.",
    ctaButton: draft.ctaButton || "Start the calculator",
  };
}

function renderMdx(draft) {
  const today = new Date().toISOString().slice(0, 10);
  const image = `/generated/blog/${draft.slug}/infographic-1.svg`;
  const sections = draft.sections
    .map((section) => {
      const body = typeof section === "string" ? section : section.body;
      const heading =
        typeof section === "string" ? "What applicants should know" : section.heading;
      return `## ${heading}\n\n${body}`;
    })
    .join("\n\n");
  const comparisonRows = [
    "| Signal | Option A | Option B |",
    "| --- | --- | --- |",
    ...draft.comparisonRows.map((row) => `| ${row.join(" | ")} |`),
  ].join("\n");
  const faq = draft.faq
    .map((item) => `Q: ${item.question}\nA: ${item.answer}`)
    .join("\n");

  return `---\nslug: ${JSON.stringify(draft.slug)}\ntitle: ${JSON.stringify(draft.title)}\ndescription: ${JSON.stringify(draft.description)}\nkeywords: ${JSON.stringify(draft.keywords)}\ncategory: ${JSON.stringify(draft.category)}\ndate: ${JSON.stringify(today)}\nupdatedAt: ${JSON.stringify(today)}\nreadingTime: ${JSON.stringify(draft.readingTime)}\nstatus: "draft"\nriskLevel: ${JSON.stringify(draft.riskLevel)}\nsources: ${JSON.stringify(draft.sources)}\nctaTitle: ${JSON.stringify(draft.ctaTitle)}\nctaBody: ${JSON.stringify(draft.ctaBody)}\nctaButton: ${JSON.stringify(draft.ctaButton)}\nimage: ${JSON.stringify(image)}\n---\n\n${draft.intro}\n\n${sections}\n\n<Infographic heading="Route planning snapshot" src="${image}" alt="VisaHungary infographic for ${escapeAttr(draft.title)}" caption="Generated from the daily source-based SEO brief. Review before publishing." />\n\n<ComparisonTable heading="Planning comparison">\n${comparisonRows}\n</ComparisonTable>\n\n<Checklist heading="Review checklist">\n${draft.checklist.map((item) => `- ${item}`).join("\n")}\n</Checklist>\n\n<Faq heading="Common questions">\n${faq}\n</Faq>\n`;
}

function renderInfographicSvg(draft) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="720" viewBox="0 0 1200 720" role="img" aria-labelledby="title desc">
  <title id="title">${escapeXml(draft.title)}</title>
  <desc id="desc">VisaHungary source-based blog infographic generated for editorial review.</desc>
  <rect width="1200" height="720" fill="#fff8ec"/>
  <rect x="48" y="48" width="1104" height="624" rx="22" fill="#fffaf1" stroke="#dccdb6" stroke-width="2"/>
  <text x="86" y="112" fill="#9a1f35" font-family="Arial, sans-serif" font-size="24" font-weight="700">VisaHungary daily draft</text>
  <text x="86" y="178" fill="#102b25" font-family="Arial, sans-serif" font-size="44" font-weight="700">${escapeXml(
    truncate(draft.title, 48),
  )}</text>
  <g transform="translate(86 240)">
    ${draft.checklist
      .slice(0, 4)
      .map(
        (item, index) => `<g transform="translate(0 ${index * 82})">
      <circle cx="24" cy="24" r="24" fill="${index % 2 === 0 ? "#0f4437" : "#c3922e"}"/>
      <text x="17" y="33" fill="#fff8ec" font-family="Arial, sans-serif" font-size="24" font-weight="700">${index + 1}</text>
      <text x="70" y="32" fill="#102b25" font-family="Arial, sans-serif" font-size="24" font-weight="700">${escapeXml(
        truncate(item, 64),
      )}</text>
    </g>`,
      )
      .join("")}
  </g>
  <rect x="86" y="590" width="1028" height="46" rx="23" fill="#0f4437"/>
  <text x="120" y="621" fill="#fff8ec" font-family="Arial, sans-serif" font-size="21" font-weight="700">Preliminary information only. Review official sources and case facts before publishing.</text>
</svg>`;
}

function renderPrBody({ topic, brief, draft }) {
  return `## Daily blog draft\n\n- Topic: ${topic.query}\n- Score: ${topic.score}\n- Risk level: ${draft.riskLevel}\n- Source mode: ${topic.source ?? "mixed"}\n\n## Sources\n${brief.sources.map((source) => `- [${source.title}](${source.url})`).join("\n")}\n\n## Editorial checklist\n- [ ] Verify every legal/process claim against official sources.\n- [ ] Confirm the disclaimer is present.\n- [ ] Check infographic text for accuracy.\n- [ ] Confirm internal links and CTA fit the article intent.\n- [ ] Keep as draft if risk level is high.\n`;
}

function readExistingSlugs() {
  if (!fs.existsSync(BLOG_DIR)) return new Set();
  return new Set(
    fs
      .readdirSync(BLOG_DIR)
      .filter((file) => file.endsWith(".mdx"))
      .map((file) => file.replace(/\.mdx$/, "")),
  );
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 78);
}

function titleFromQuery(query) {
  const words = query
    .replace(/\bhungary\b/i, "Hungary")
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1));
  return `${words.join(" ")}: Practical Guide`;
}

function riskLevelForQuery(query) {
  return /(refused|appeal|investor|family reunification|overstay|work eligibility)/i.test(
    query,
  )
    ? "high"
    : "medium";
}

function normalizePainPointTitle(title) {
  return title
    .replace(/\bI\b/g, "applicants")
    .replace(/\bmy\b/gi, "their")
    .replace(/[?!.]+$/g, "")
    .trim();
}

function arrayOrDefault(value, fallback) {
  return Array.isArray(value) && value.length > 0 ? value : fallback;
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(value) {
  return String(value).replace(/"/g, "&quot;");
}

function truncate(value, length) {
  return value.length > length ? `${value.slice(0, length - 1)}...` : value;
}

function base64Url(value) {
  return Buffer.from(value).toString("base64url");
}

const isMain = fileURLToPath(import.meta.url) === path.resolve(process.argv[1] ?? "");
if (isMain) {
  const dryRun = !process.argv.includes("--write");
  runAutomation({ dryRun })
    .then((result) => {
      console.log(
        JSON.stringify(
          {
            ok: true,
            ...result,
          },
          null,
          2,
        ),
      );
    })
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
}
