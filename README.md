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

## Automatic updates

Upcoming and currently open IPO feeds are fetched together every five minutes while the page is open, and when the visitor returns to the tab or reconnects. New source records appear without a code change. Closed issues are removed after their closing date in Asia/Kolkata, including from dated fallback data. The browser checks expiry every 30 seconds. The calendar starts at the current month. News refreshes every five minutes; AI research remains explicitly dated as requested.

The logo endpoint resolves company branding automatically from company detail pages and official-site icons; existing verified images provide a fallback. Results are cached for up to a day and the browser refreshes them hourly. If a publisher provides no company website/logo or blocks access, initials appear rather than an unrelated logo. No API key, scheduled job or manual card creation is required. Coverage and arrival timing still depend on the public source; this is not a guaranteed exhaustive exchange feed.

`node scripts/check-auto-updates.mjs` verifies new-company parsing and the Indian-time closing boundary.

GMP is shown on every card and in company details as a rupee premium and percentage of the upper price band. Missing quotes remain unavailable; zero and negative quotes are preserved. GMP is unofficial and is not a promised listing return. Issue sizes retain source qualifiers (such as estimated or fresh issue); missing totals are supplemented from the issuer's source page where published. Both fields follow the five-minute feed refresh.
