# Independent release verification 5 — PASS

**Candidate:** `418f03ccf107651e4b1219d184c3f805e2a534e4`  
**Live URL:** <https://revision-feedback-receipts.sociobot.in/>  
**Verified:** 2026-08-30 UTC  
**Verdict:** **PASS — release accepted.**

This was a clean-checkout, independent verification. Product code was not changed.

## First-read and demo gate — PASS

Cold live-page reading answered all three required questions in plain language: **“Create receipts from draft changes.”** says what it does; **“For writing teachers who need a record of how students used feedback.”** says who it is for; and **“Try it with sample data”** is the immediate first action. The action opened the completed, realistic Jordan K. sample in one click.

The demo had its persistent `Demo — sample data, nothing is saved` banner, **Reset demo**, and the correctly semantic **Start for real** link. The sample exposes a feedback goal, before/after evidence, a reflection, and an HTML receipt download on its first view. A seeded real browser workspace remained intact during demo use; Start for real removed only `demo:revision-receipts-work-v1` and restored the real workspace.

## Claims gate — PASS

`.factory/claims.json` exists. From this clean checkout I ran every command it declares individually through the demo entry point, then ran the manifest runner (`npm run test:claims`). All 15 claims passed:

`demo-sandbox`, `no-account`, `free-use`, `revision-workflow`, `browser-only`, `no-classroom-content-transmission`, `no-analytics-tracking`, `local-autosave`, `receipt-export`, `evidence-not-score`, `human-review-limit`, `no-writing-generation`, `no-plagiarism-detection`, `clear-real-work`, and `offline-reload`.

## Build and test evidence — PASS

- `npm ci`: passed; 161 packages installed and npm reported 0 vulnerabilities.
- `npm test`: passed, 6/6 Vitest tests.
- `npm run lint`, `npm run typecheck`, and exact `npm run build`: passed; `dist/` produced.
- `npm run test:e2e`: passed, 50 Playwright tests across desktop and 390 px mobile.
- The build reported app JavaScript at 7.19 KB gzip and CSS at 4.76 KB gzip. The 768 px hero is 29,842 bytes. All are inside the applicable budgets.

## Independent product exercise — PASS

- Completed the live sample and downloaded `jordan-k-community-park-argument-receipt.html`; inspected its quoted evidence, reflection, and explicit human-review limitation.
- Started a blank real workspace from the demo, submitted it empty, and received five specific recovery errors. Then completed a two-goal normal case and exported `qa-student-library-funding-argument-receipt.html`.
- The claim suite covers the additional boundaries: identical/additional/Markdown passages, long unbroken mobile values, file import, offline reload, and browser-storage clearing.

## Live deployment, privacy, PWA, and accessibility — PASS

- The rebuilt root, demo, privacy, terms, 404, service-worker, manifest, robots, sitemap, root app JS/CSS, route-focus JS, and hero assets match the live bytes (SHA-256 / `cmp`). All same-origin links found on the product routes returned 200.
- Cold live headers include self-only CSP with `frame-ancestors 'none'`, HSTS, strict-origin referrer policy, `nosniff`, permissions restrictions, HTML `max-age=30`, immutable hashed assets, and `sw.js` `no-cache`.
- A live sample/export request log contained six same-origin GET static-resource requests only; no fetch/XHR/ping/WebSocket, request body, classroom string, cookie, session-storage entry, third-party script, analytics, or tracking resource was observed. Demo storage contained only `demo:revision-receipts-work-v1`.
- The service worker activated and controlled `/demo`; a query-versioned registration became active, and a cold offline reload retained the demo title and banner.
- Axe found 0 violations (therefore 0 serious/critical) on live `/`, `/?demo=1`, `/privacy/`, `/terms/`, and `/404.html`, plus the mobile landing page. No console or page errors were observed during the sample flow.
- At 390×844 there was no horizontal overflow; the first-screen heading and demo action were within the viewport, and all header links were at least 44 px high. Keyboard Tab exposed a designed 4 px red skip-link outline; Enter moved focus to `<main>`. With reduced motion, controls resolve to 0.01 ms transitions/animations (the standard effective disable pattern).

The repository does not provide the referenced `verify-url.sh` or a Lighthouse executable, so I performed its required live title/lang/main/alt/console equivalent through Playwright and the axe scans above. No server-side product endpoints, sign-in, product-unlock calls, or rate-limited APIs exist; rate-limit and Entra checks are not applicable.

## Defects

None found. There are no release-blocking, critical, high, medium, or low defects.
