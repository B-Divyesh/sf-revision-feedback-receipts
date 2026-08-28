# Revision Receipts

Revision Receipts is a free, local-first tool for secondary-school and college writing classes. It turns 1–3 teacher feedback goals, a first draft, and a revised draft into a concise evidence artifact: quoted before/after passages plus the student’s own reflection.

It is built for a teacher who needs to verify whether feedback was acted on without reading every draft side by side. It does **not** generate writing, grade work, detect plagiarism, determine authorship, or treat textual change as proof of learning.

Live site: <https://revision-feedback-receipts.sociobot.in>

## What it does

- Accepts pasted text or local `.txt`/`.md` drafts.
- Keeps up to three feedback goals visible through the workflow.
- Finds changed sentence-level passages entirely in the browser.
- Lets the student connect one strong before/after passage to each goal.
- Captures a short student reflection for each goal.
- Produces a print-ready receipt and a portable, self-contained HTML download.
- Autosaves unfinished work locally and works offline after the first visit.

All classroom content stays in browser local storage. There are no accounts, third-party scripts, analytics, network fonts, server-side text processing, or paid features.

## Develop

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Test and build

```bash
npm test          # unit tests for passage comparison
npm run build     # type-check + production build -> dist/
npm run test:e2e  # Chromium desktop + 390 px mobile + axe checks
```

Playwright is pinned to `1.58.2`. If its Chromium binary is not already available, run `npx playwright install chromium` before the end-to-end suite.

The deployment command is exactly `npm run build`; Azure Static Web Apps should publish `./dist`. `public/staticwebapp.config.json` supplies security, routing, and cache headers. The build creates a versioned service worker that precaches the application shell.

## Privacy and classroom use

Drafts, goals, student identifiers, evidence choices, and reflections are stored only in the current browser. “Clear this device and start over” removes that working copy. Downloaded or printed receipts are the user’s responsibility to handle under school policy. See [`/privacy`](https://revision-feedback-receipts.sociobot.in/privacy/) and [`/terms`](https://revision-feedback-receipts.sociobot.in/terms/).

## Project notes

- Product brief: [`.factory/brief.json`](.factory/brief.json)
- Visual system and artwork provenance: [`.factory/design.md`](.factory/design.md)
- Build handoff: [`.factory/handoff.md`](.factory/handoff.md)
- License: [MIT](LICENSE)
