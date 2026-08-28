# Revision Receipts — build handoff

## Shipped

- A complete local-first workflow for entering 1–3 feedback goals, pasting or loading `.txt`/`.md` drafts, reviewing sentence-level changed passages, selecting evidence per goal, and writing student reflections.
- A concise review receipt with before/after quotations, student reflection, contextual metadata, an honest evidence disclaimer, print/PDF support, clipboard summary, and a portable self-contained HTML download.
- Browser autosave and resume, explicit validation and file errors, identical-draft handling, a confirmation-protected clear action, word counts, and an offline status.
- Installable/offline static shell with a generated versioned service worker and Azure Static Web Apps routing, security, and asset cache configuration.
- Neo-brutalist classroom visual system documented in `.factory/design.md`, including the original generated hero prompt and provenance. Source PNG and prompt JSON live in `assets/src/`; responsive WebP outputs are 30 KB and 88 KB.
- Responsive desktop and 390 px layouts, keyboard-native controls, visible focus states, reduced-motion treatment, semantic landmarks, one H1 per page, labeled inputs, live error/status regions, and contrast-compliant states.
- Plain-language `/privacy/` and `/terms/` pages; no accounts, analytics, trackers, remote fonts, third-party runtime scripts, or server-side draft processing.
- README, MIT license, unit coverage, desktop/mobile Playwright coverage, and automated axe checks.

## Run and deploy

```bash
npm ci
npm test
npm run build
npm run test:e2e
```

Deploy `./dist` after `npm run build`. Its root contains `index.html`; the privacy and terms entry points are in `dist/privacy/` and `dist/terms/`.

## Verification performed

- `npm audit`: 0 vulnerabilities.
- `npm test`: 6/6 unit tests passed.
- `npm run build`: passed TypeScript checking and Vite 7.3.6 production build.
- `npm run test:e2e`: 5 passed, 1 intentional duplicate mobile legal-page check skipped. The full two-goal flow, Markdown file input, validation, persistence, HTML download, 390 px layout, and serious/critical axe scan pass in Chromium 1.58.2.
- Factory `verify-url.sh`: HTTP 200; title, `lang`, one H1, main landmark, image alts, and button names present; 0 page or console errors.
- Offline reload smoke test: service worker controlled the production page and reloaded the complete main shell with the network disabled and 0 console errors.
- Lighthouse 12.8.2, mobile profile against the local production build: Performance **100**, Accessibility **100**, Best Practices **100**, SEO **100**; FCP **0.9 s**, LCP **1.4 s**, TBT **0 ms**, CLS **0**, transferred **46 KiB**.
- Production budgets: app JS 16.65 KB plus 0.77 KB Vite helper (6.45 KB combined gzip), app CSS 15.09 KB (4.01 KB gzip), mobile hero 29.8 KB, desktop hero 88.1 KB. All are below the required limits.

## Known gaps and honest limits

- Diffing is deterministic sentence/line LCS, not semantic analysis. A moved sentence may appear as removed and added, and a long unpunctuated paragraph may be one evidence passage.
- Textual change and reflection are evidence for a human conversation, not proof of learning, authorship, causation, quality, or academic integrity. This is stated in the workflow, receipt, terms, and export.
- Work is local to one browser/device. There is no account, roster, collaboration, recovery service, LMS integration, or cloud sync by design.
- Only plain-text and Markdown files are accepted; Google Docs and Word content must be pasted or exported as text.
- Offline use is available after one successful online visit installs the application shell.

## Recommended next steps

Run a four-week classroom pilot and measure whether teachers verify two goals per student in under two minutes and whether at least 70% of students submit a receipt. Only after that evidence should a roster workspace or interoperable class export be considered.
