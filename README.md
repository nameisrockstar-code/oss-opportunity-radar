# OSS Opportunity Radar

A repository-first, source-aware developer opportunity directory. Independent; no organization listed is implied to endorse this project.

## Requirements

Node.js >=22.12, npm, and Git. No database, authentication, API keys, or paid services.

## Run locally

```bash
git clone <YOUR_REPOSITORY_URL> oss-opportunity-radar
cd oss-opportunity-radar
npm install
npm run dev
```

Open http://localhost:3000. For a downloaded ZIP, skip `git clone` and run the commands in the extracted folder. Do not paste the placeholder URL into your terminal; replace it with your own published repository address.

## Commands

```bash
npm run validate   # schema, duplicates, deadline conflicts, freshness warnings
npm run lint       # ESLint
npm run typecheck  # TypeScript
npm test           # Vitest unit tests
npx playwright install chromium
npx playwright test # browser checks; needs Chromium and working npm installation
npm run build      # production build (also validates data)
npm run start      # serve built application on port 3000
npm run links      # optional live link audit; HTTP errors don't change records
npm run check      # deterministic validations, lint, types, unit tests, build
```

## Architecture and data

Next.js App Router + React + TypeScript, Tailwind CSS v4, Zod v4, JSON files, client-side filtering, Vitest and Playwright. Production records live in `data/opportunities/*.json`. The directory deliberately starts **empty**: no real program has been verified for publication. `data/fixtures/*.json` is **fictional, development/test-only** and never loaded by public pages. The one fixture uses example.com and is not an official real-world opportunity.

Each record is validated with `src/lib/schema.ts` and requires an official HTTPS source; eligibility, benefits, verification metadata, dated status evidence for any non-unknown status, and ISO timestamps. The full typed schema is the canonical machine-readable data contract. See `data/fixtures/fictional-maintainer.json` for a schema-valid illustration (NOT publishable). Keep facts from providers separate from commentary in verification notes. `id`/`slug` must be unique; official URLs are normalized to detect duplicates. All benefits, documents, deadlines and application states require source evidence. Missing deadlines are `null`; deadline timezone is provided only with a confirmed deadline.

**Production ingestion:** a maintainer reviews an official provider source, creates a JSON record, validates and submits a PR. Records are never automatically scraped or promoted from fixtures.

## Verification policy

Review `src/app/methodology/page.tsx`. By default >30 days since last verification is stale, or >7 days for deadlines within seven days. Absence of a check is stale. Deadline passage never silently implies an authoritative closure; mismatched `open`/`upcoming` statuses fail validation and display as review-needed. Unknown statuses remain unknown. The scheduled audit checks links and raises an issue for maintainers, never automatically changes status. A live link failure can mean a bot block, timeout, redirection or rate limit and must be reviewed.

## Community process

See [CONTRIBUTING.md](CONTRIBUTING.md). GitHub issue forms and PR templates enforce citation and maintainer review. Report in the repository's Issues tab; no repository URL is fabricated in the app.

## Deploy (Vercel)

1. Publish this repository to GitHub under a name you control.
2. Import it into Vercel and select Next.js preset.
3. Use `npm install` and `npm run build`; no environment variables needed.
4. Enable GitHub Actions and verify required CI checks before accepting listing PRs.
5. Add verified, provider-sourced records via reviewed PRs; redeploy on merge.

Another Node-capable Next.js host works using `npm run build && npm run start`. No app deployment, domain or published repository is claimed here.

## Limitations

Initial production directory is empty until legitimate records are reviewed; no automated program discovery, login, emails, push, paid placements, data backend or usage analytics. Geography is an explicit text filter against recorded provider criteria, not an eligibility determination. Link checker is intentionally conservative and serial, and can be blocked by websites. A human must verify changed program terms. Dark mode follows the device setting. Full browser testing requires a local Playwright browser installation.

MIT licensed; see [LICENSE](LICENSE). Contributions are welcome, subject to source review.
