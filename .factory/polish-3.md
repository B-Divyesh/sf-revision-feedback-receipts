# Polish round 3 receipt — Revision Receipts

Candidate repaired: `16e6151969fb4522b290ab89a3a652662a258abc`
Review repaired: `d2aeddad0d9c103851d5ed048c1ce29440d99097`
Repair commit: `da9e2d8f5d2d7aceaf598b0f3a7567632bb2e3f4`
Live URL: <https://revision-feedback-receipts.sociobot.in/>

Every finding from all three adversarial reviews is closed below. Evidence paths are repository-relative. The live audit was a new cold browser context after the Azure Static Web Apps deploy.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept the landing copy, action, result note, and facts before the artwork on phones. | `keeps the full first-screen promise visible at 390 by 844`; live [`root-390x844.png`](evidence/live-polish-3/root-390x844.png). |
| F-1-2 | Kept README and demo documentation precise: exiting demo restores saved work or a blank receipt. | `@claim:demo-sandbox`; live reset/exit audit restored `Real student` and deleted only the demo key. |
| F-1-3 | Retained exactly one visible demo H1 and a sequential heading outline. Its wording now describes the ready receipt preview. | `repairs the verifier landing, demo, metadata, and 404 findings`; live `/demo` axe scan: zero violations. |
| F-1-4 | Kept the scoped fact `Drafts stay in this browser`. | `@claim:browser-only`; live `/` and `/privacy/`. |
| F-1-5 | Kept the free-use promise in its listed, tested locations. | `@claim:free-use`; all 15 claim commands passed from the clean clone. |
| F-1-6 | Kept real-work clearing isolated from demo storage. | `@claim:clear-real-work`; seeded-namespace test. |
| F-1-7 | Kept the plagiarism limitation explicit and tested. | `@claim:no-plagiarism-detection`; completed sample flow. |
| F-1-8 | Kept cross-page and history focus on the destination H1 with a polite announcement. | `moves focus to page headings across links and browser history`; cold live Privacy and Back check passed. |
| F-1-9 | Kept the concrete heading `Explain why each passage changed`. | `creates a complete student revision receipt`; live `/demo`. |
| F-1-10 | Kept specific receipt headings on screen and in the downloaded HTML. | `@claim:receipt-export`; exported H1 names the student receipt. |
| F-1-11 | Kept the plain footer sentence on every route. | `keeps reviewed copy and documentation precise`; live route audit. |
| F-1-12 | Kept storage-key implementation detail out of getting-started copy. | `keeps reviewed copy and documentation precise`; README and demo documentation. |
| F-1-13 | Kept the offline promise in usable-result language. | `@claim:offline-reload`; cold live service-worker-controlled `/demo` reloaded offline with Jordan K. present. |
| F-1-14 | Kept the Node range aligned across README, package metadata, and CI. | `keeps reviewed copy and documentation precise`; clean `npm ci` passed. |
| F-1-15 | Kept `feedback goal` as the single term. | `.factory/copy-audit.md`; landing, demo, receipt, and docs. |
| F-2-1 | Kept the editor and overview independently named and made axe assertions fail on every violation. | Full browser suite and cold live axe scan: zero violations on `/`, `/demo`, `/privacy/`, `/terms/`, and `/404.html`. |
| F-2-2 | Kept the same three-column mobile header on product and legal routes. | `keeps one usable mobile header on every route`; cold live audit measured each link at least 116.65 px wide and 64 px high. |
| F-2-3 | Kept every mobile header target above 44 px in both dimensions. | Same live route audit; legal/404 links are 116.65×70.38 px. |
| F-3-1 | The one-click demo now starts on a genuine completed-receipt preview: feedback goal, before/after passage, reflection, Edit sample, and Download sample receipt. The seeded demo state is a finished receipt, not a prefilled setup form. | `opens the completed demo on evidence and a reflection at 390 by 844`; live [`demo-390x844.png`](evidence/live-polish-3/demo-390x844.png). Before and after end at 616.66 px; reflection ends at 697.81 px. |
| F-3-2 | Added the exact `no-classroom-content-transmission` contract and a request-level test that rejects fetch/XHR/ping/WebSocket, non-GET methods, bodies, and every sample classroom string in URLs, headers, or bodies. | `@claim:no-classroom-content-transmission`; cold live completed-demo audit saw six same-origin GET asset requests, no bodies, no WebSockets, and no classroom text. |
| F-3-3 | Listed `We do not add analytics or tracking` and added a clean-context test for telemetry requests, beacons, WebSockets, cookies, tracking storage, scripts, and resource names. | `@claim:no-analytics-tracking`; cold live audit found no cookies, only `demo:revision-receipts-work-v1` storage, no session storage, and five non-tracking resources. |
| F-3-4 | Replaced the broad personal-information statement with `The app asks for no account and sends no classroom content. Hosting may process the technical request data listed above.` | `/privacy/`; `@claim:no-account` and `@claim:no-classroom-content-transmission`. |
| F-3-5 | Removed the unsupported adjective `quick` from the first-screen audience sentence. | `keeps reviewed copy and documentation precise`; `.factory/copy-audit.md`; live landing screenshot. |
| F-3-6 | Added the required landing section `What a revision receipt does not prove` after How it works, using only listed local-storage, no-writing, no-score, and human-review claims. | `keeps reviewed copy and documentation precise`; live `/` and [`root-390x844.png`](evidence/live-polish-3/root-390x844.png). |

## Acceptance evidence

- Clean clone: `/tmp/revision-receipts-polish3-final.cUfJE4`, checked out at repair commit `da9e2d8f5d2d7aceaf598b0f3a7567632bb2e3f4`.
- `npm ci`: passed (161 packages; 0 vulnerabilities).
- `npm run test:claims`: passed every declared command independently: all 15 claim IDs, including the dedicated browser context for `offline-reload`.
- `npm test`: 6/6 passed. `npm run lint`, `npm run typecheck`, `npm run build`, and `git diff --check`: passed.
- `npm run test:e2e -- --reporter=list`: 43 passed, 7 intentional project skips across desktop Chromium and the 390×844 mobile project.
- Playwright axe 4.10.2: zero violations of any severity locally and on cold live `/`, `/demo`, `/privacy/`, `/terms/`, and `/404.html`.
- URL verifier: root and demo passed title, `lang`, one H1, main landmark, alt text, button names, and zero console errors locally and live. See [`verify.json`](evidence/live-polish-3/root/verify.json) and [`demo verify.json`](evidence/live-polish-3/demo/verify.json).
- Lighthouse 12.8.2 local mobile: performance 100, accessibility 100, best practices 100, SEO 100; FCP 0.9 s, LCP 1.4 s, TBT 0 ms, CLS 0. Report: [`lighthouse-polish-3.json`](evidence/lighthouse-polish-3.json).
- Build budget: initial application JS 21.04 kB raw / 7.19 kB gzip; CSS 19.61 kB raw / 4.76 kB gzip.
- Deployment: the factory static deployment script built `dist/`, uploaded it to Azure Static Web Apps `sf-revision-feedback-receipts`, and the custom domain served the new demo preview before the cold audit.

No finding of any severity is deferred.
