# AnswerWatch Lite

AnswerWatch Lite is a browser-based AI-answer visibility report builder for SEO agencies, GEO consultants, and small web shops. It helps a marketer record what ChatGPT, Perplexity, Gemini, Grok, or Google AI answers say about a client brand, then turns those observations into a scored weekly report.

## What It Does

- Tracks buyer-intent prompts for a client brand.
- Records whether the brand appeared in AI answers.
- Captures competitor mentions and cited sources.
- Calculates visibility score, risk level, and practical next actions.
- Generates a client-ready report that can be copied into email, Docs, or a proposal.

The MVP is intentionally local-first and client-side only. There is no auth, database, scraping, or provider automation yet.

## Run Locally

```bash
npm install
npm test
npm run build
npm run check:html
npm start
```

Then open the local URL served by `serve`, or open `web/index.html` directly.

## Project Structure

```text
answerwatch-lite/
├── README.md
├── package.json
├── vercel.json
├── src/
│   └── answerwatch.ts
├── tests/
│   ├── analyzer.test.mjs
│   ├── build-check.mjs
│   └── html-check.mjs
└── web/
    ├── index.html
    ├── styles.css
    └── script.js
```

## Monetization

- Free: one client report at a time, manual observations, copy/export report text.
- Pro: $19/month for saved clients, scheduled runs, PDF export, and white-label reports.
- Agency: $49/month for 10 client workspaces, team templates, and weekly email digests.

Year-1 target: $5.7K ARR conservative, $24K ARR moderate, $80K ARR stretch.

## Roadmap

- Add OpenAI/OpenRouter-compatible provider adapter behind serverless API keys.
- Add saved local workspaces and CSV export.
- Add PDF report generation.
- Add Stripe checkout and hosted Pro workspaces.
- Add weekly scheduled prompt checks.

## Brand

Built by North Star Holdings for Astra Web Development.
