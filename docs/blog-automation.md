# VisaHungary Daily Blog Automation

This V1 workflow creates one English blog draft per run and opens it as a review PR.
It does not publish directly. Publishing happens only after the PR is reviewed and merged.

## Content model

Blog posts live in `src/content/blog/en/*.mdx`.

Required frontmatter:

- `slug`
- `title`
- `description`
- `keywords`
- `category`
- `date`
- `updatedAt`
- `readingTime`
- `status`
- `riskLevel`
- `sources`

Supported article blocks:

- `<Infographic ... />`
- `<ComparisonTable>...</ComparisonTable>`
- `<Checklist>...</Checklist>`
- `<Faq>...</Faq>`

Generated infographics are stored under `public/generated/blog/{slug}/infographic-1.svg`.

## Required GitHub configuration

Secrets:

- `OPENAI_API_KEY`
- `GSC_CLIENT_EMAIL`
- `GSC_PRIVATE_KEY`
- `REDDIT_CLIENT_ID`
- `REDDIT_CLIENT_SECRET`

Variables:

- `OPENAI_MODEL`
- `GSC_SITE_URL`
- `REDDIT_USER_AGENT`

`GSC_SITE_URL` must match the Search Console property exactly, for example
`https://visahungary.hu/` or `sc-domain:visahungary.hu`.

## Running

Dry run:

```bash
node scripts/blog-automation.mjs
```

Write files:

```bash
node scripts/blog-automation.mjs --write
```

GitHub Actions:

- scheduled runs create a content PR
- manual `workflow_dispatch` defaults to dry-run artifacts
- manual `dry_run=false` creates a content PR

## Editorial review

Before merging:

- verify legal/process claims against official sources
- keep high-risk topics in review until checked manually
- confirm the disclaimer is present
- inspect the infographic text
- confirm the CTA and internal links match the user intent

High-risk topics include refusal, appeal, overstay, investor, family reunification,
and work eligibility questions.
