import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import {
  runAutomation,
  scoreTopic,
  validateSourceUrl,
} from "../scripts/blog-automation.mjs";

const outputDir = path.join(process.cwd(), "automation-output");

test("source allowlist accepts official sources and rejects untrusted domains", () => {
  assert.equal(validateSourceUrl("https://enterhungary.gov.hu/"), true);
  assert.equal(
    validateSourceUrl(
      "https://home-affairs.ec.europa.eu/policies/schengen/visa-policy_en",
    ),
    true,
  );
  assert.equal(validateSourceUrl("https://example.com/hungary-visa"), false);
});

test("topic scoring rewards long-tail route intent and penalizes duplicates", () => {
  const topic = {
    query: "can I apply for Hungary residence permit from inside Hungary",
    impressions: 40,
    painPoints: 1,
  };
  const firstScore = scoreTopic(topic, new Set());
  const duplicateScore = scoreTopic(topic, new Set(["can-i-apply-for-hungary-residence-permit-from-inside-hungary"]));

  assert.ok(firstScore > 50);
  assert.ok(duplicateScore < firstScore);
});

test("dry run writes MDX, infographic, PR body, and summary artifacts", async () => {
  fs.rmSync(outputDir, { recursive: true, force: true });
  const result = await runAutomation({ dryRun: true });
  const mdxPath = path.join(
    outputDir,
    "src",
    "content",
    "blog",
    "en",
    `${result.slug}.mdx`,
  );
  const svgPath = path.join(
    outputDir,
    "public",
    "generated",
    "blog",
    result.slug,
    "infographic-1.svg",
  );

  assert.equal(result.dryRun, true);
  assert.equal(fs.existsSync(mdxPath), true);
  assert.equal(fs.existsSync(svgPath), true);
  assert.equal(fs.existsSync(path.join(outputDir, "daily-blog-pr-body.md")), true);
  assert.equal(fs.existsSync(path.join(outputDir, "daily-blog-summary.json")), true);

  const mdx = fs.readFileSync(mdxPath, "utf8");
  assert.match(mdx, /status: "draft"/);
  assert.match(mdx, /<Checklist heading="Review checklist">/);
  assert.match(mdx, /<Infographic /);
});
