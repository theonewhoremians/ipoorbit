# IPO Orbit

A local Indian IPO research website with Framer Motion transitions and an interactive Three.js orbital scene.

## Run locally

Requires Node.js 22.13 or later.

```sh
npm install
npm run dev
```

Open http://localhost:5173. No deployment is required or performed.

## Features

- Search by company or sector; filter Mainboard/SME and IPO status; sort by date, issue size or company.
- Company panels with terms, timelines, application amount calculator, news, disclosures and source links.
- Monthly calendar with opening and closing dates.
- Watchlists saved only in this browser, with no account required.
- Three.js scene with pointer interaction, pause control and reduced-motion support.
- Responsive layout and keyboard-accessible native company dialogs.

## Data and limitations

The server attempts to refresh the public IPO Market upcoming list every five minutes. It includes scheduled issues and pipeline records when the source provides them. The stored research snapshot was checked on 15 September 2026 using IPO Market and the Economic Times. The interface displays whether it is using refreshed or saved information and its retrieval time.

Sources:
- https://www.ipomarket.in/ipo/upcoming
- https://economictimes.indiatimes.com/markets/ipo/upcoming
- https://www.sebi.gov.in/filings/public-issues.html

Company news is retrieved on selection from Google News RSS, cached for five minutes, and sorted newest first. Headlines link to their publishers through Google News. Company detail pages are retrieved from IPO Market when a company-specific source URL is available. Unknown financial values and dates remain explicitly unavailable; they are never invented.

This public-source adapter is not a licensed, exhaustive exchange feed. Publisher blocking, layout changes, internet outages and incomplete coverage can affect the results. A production service promising every IPO and every update needs an appropriate exchange/data-provider agreement and a monitored ingestion service. No keys are required for this local implementation.

`npm run build` creates the production build. `npx tsc --noEmit` checks TypeScript.

## Company logos and AI research

Company cards, detail panels and research cards share locally saved official logos. `lib/company-brands.json` records each original asset URL and check date (16 September 2026). Logos are snapshots of official branding, not an automatic brand-monitoring service; new companies without a verified logo show an accessible initials fallback.

The AI Research section contains 12 saved AI-written assessments dated 15 September 2026, with financial metrics, strengths, risks, research recommendations and source links. They are not live model output or personalized investment advice. Missing or inconsistent disclosures result in a wait-for-disclosures assessment. Update `lib/research-snapshots.json` only after reviewing new financial disclosures and dates; no API key is required.

Run `node scripts/check-research.mjs` to check research records and local logo references.

## Vercel deployment

`vercel.json` selects the Next.js production build (`next build`) and preserves the existing local development command. Import this GitHub repository into Vercel with the project root as its root directory. No environment variables or API keys are required. The API routes run as server functions; source outages use the saved IPO snapshot or show an unavailable message.
