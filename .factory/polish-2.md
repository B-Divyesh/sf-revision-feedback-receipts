# Polish round 2 receipt — Revision Receipts

Candidate repaired: `44f17cbec5f7c2790d201a27928dc3307408c1b5`  
Review repaired: `3631536e572093864bacb0cb452e355c365986f5`  
Live URL: <https://revision-feedback-receipts.sociobot.in/>

Every finding from `.factory/review-1.md` and `.factory/review-2.md` is mapped below. Round 1 fixes were rechecked rather than assumed.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept the job, audience, sample action, result note, and three facts before the artwork at 390 px. The visible mobile navigation added in round 2 still leaves all required copy inside 844 px. | `keeps the full first-screen promise visible at 390 by 844`; `.factory/evidence/polish-2-local/root-390x844.png`; live `/`. |
| F-1-2 | Kept README and demo documentation precise: Start for real opens saved work, or a blank receipt when none exists. | `keeps reviewed copy and documentation precise`; `@claim:demo-sandbox`; README and `.factory/demo.md`. |
| F-1-3 | Kept one visible demo H1 and an ordered visible heading outline. | `repairs the verifier landing, demo, metadata, and 404 findings`; `.factory/evidence/polish-2-local/demo-390x844.png`; live `/demo`. |
| F-1-4 | Kept the exact fact “Drafts stay in this browser” in the now-shared header. | `@claim:browser-only`; local and live request audits; live `/`. |
| F-1-5 | Kept the published free-use statement covered by its claim contract. | `@claim:free-use`; every declared claim command passes. |
| F-1-6 | Kept real-work clearing isolated from demo storage. | `@claim:clear-real-work`; dedicated seeded namespace test. |
| F-1-7 | Kept the plagiarism limitation explicitly covered. | `@claim:no-plagiarism-detection`; completed demo test. |
| F-1-8 | Kept full-route and history navigation focused on the destination H1 with a polite announcement. | `moves focus to page headings across links and browser history`; live Privacy and Back checks. |
| F-1-9 | Kept the concrete heading “Explain why each passage changed.” | `creates a complete student revision receipt`; live `/demo`. |
| F-1-10 | Kept the on-screen and exported receipt headings specific to the revision receipt. | `creates a complete student revision receipt`; `@claim:receipt-export`. |
| F-1-11 | Kept the plain footer line “Compare two drafts and save a revision receipt.” | `keeps reviewed copy and documentation precise`; all routes. |
| F-1-12 | Kept storage implementation terms out of the getting-started path. | `keeps reviewed copy and documentation precise`; README and `.factory/demo.md`. |
| F-1-13 | Kept the offline description in usable-result language. | `@claim:offline-reload`; dedicated offline context. |
| F-1-14 | Kept the Node range aligned across package metadata, README, and CI. | `keeps reviewed copy and documentation precise`; `package.json#engines`; `.github/workflows/ci.yml`. |
| F-1-15 | Kept “feedback goal” as the single term throughout the product. | `.factory/copy-audit.md`; `keeps reviewed copy and documentation precise`. |
| F-2-1 | Renamed the editor region to “Create your revision receipt” while retaining “Make a revision receipt in three steps” for the overview. Axe assertions now fail on every violation, regardless of impact. | `repairs the verifier landing, demo, metadata, and 404 findings`; full-suite axe result: zero violations on `/`, `/demo`, `/privacy/`, `/terms/`, and `/404.html`; Lighthouse accessibility 100. |
| F-2-2 | Gave product, demo, policy, terms, and 404 routes the same visible mobile navigation: Try the demo, Make a receipt, Privacy. The bordered three-column strip preserves the classroom-ledger identity. | `keeps one usable mobile header on every route`; `.factory/evidence/polish-2-local/route-audit.json`; screenshots for all five routes under `.factory/evidence/polish-2-local/`; live route checks. |
| F-2-3 | Added a 44 px minimum in both axes and equal-width mobile columns for every header link. | `keeps one usable mobile header on every route`; measured links are 116.66×64 px on product routes and 116.66×70.38 px on policy/404 routes in `.factory/evidence/polish-2-local/route-audit.json`. |

## Cumulative acceptance evidence

- `npm run test:claims`: all 13 `.factory/claims.json` commands passed independently; the offline claim used its own browser context.
- `npm test`: 6/6 passed. `npm run lint`, `npm run typecheck`, `npm run build`, and `git diff --check`: passed.
- `npm run test:e2e -- --reporter=list`: 38 passed, 6 intentional project skips. Both desktop Chromium and 390×844 mobile projects ran.
- Playwright axe 4.10.2: zero violations of any severity on the app, completed receipt, demo, policy, terms, and 404 views.
- Lighthouse 12.8.2: performance 100, accessibility 100, best practices 100, SEO 100; FCP 1.0 s, LCP 1.4 s, TBT 0 ms, CLS 0. Report: `.factory/evidence/lighthouse-polish-2.json`.
- Standard URL verifier: root and demo have route-specific titles, `lang=en`, one H1, one main landmark, complete alt text, named buttons, and zero console errors. Reports: `.factory/evidence/polish-2-local/verify-root/verify.json` and `verify-demo/verify.json`.
- Build budgets: initial app JavaScript is 19.45 kB raw / 6.88 kB gzip; app CSS is 17.26 kB raw / 4.39 kB gzip.
- Catalog copy is verb-first and 89 characters: “Compare student drafts, connect changes to feedback goals, and export a revision receipt.”

All 18 cumulative findings are resolved. No severity is deferred.
