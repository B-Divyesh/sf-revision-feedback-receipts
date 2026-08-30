# Polish round 1 receipt — Revision Receipts

Candidate repaired: `e4ecde30fd730af6509af145cc47bb93b871a73e`  
Review repaired: `16699b1a073cb0c6cb23b2bca2551f2a26a4fa2d`  
Deployed product commit: `effb432`  
Live URL: <https://revision-feedback-receipts.sociobot.in/>

No earlier `.factory/review-*.md` or `.factory/polish-*.md` files existed. Every finding in `.factory/review-1.md` is mapped below.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Put the copy before the artwork below 780 px, removed the forced image ratio, compacted the phone hero, and moved all three facts into the hero copy. | `keeps the full first-screen promise visible at 390 by 844`; live bottoms are H1 226 px, audience 292 px, action 354 px, note 461 px, and last fact 550 px in `.factory/evidence/live/finding-audit.json`; `.factory/evidence/live/mobile-first-screen-cold.png`; live `/`. |
| F-1-2 | Corrected README and demo docs: Start for real opens saved browser work, or a blank receipt when none exists. | `keeps reviewed copy and documentation precise`; live demo isolation in `.factory/evidence/live/finding-audit.json`; live `/?demo=1`. |
| F-1-3 | Demo mode removes the landing hero and creates one visible demo H1. Workflow step headings are H2 and generated evidence headings are H3. | `repairs the verifier landing, demo, metadata, and 404 findings`; live heading levels `1,2,2,2,3,3,3,3`; `.factory/evidence/live/demo-cold.png`; live `/?demo=1`. |
| F-1-4 | Replaced “Private by default” with the exact tested fact “Drafts stay in this browser.” | `@claim:browser-only`; `keeps reviewed copy and documentation precise`; live same-origin result in `.factory/evidence/live/finding-audit.json`; live `/`. |
| F-1-5 | Removed “Free” from the landing eyebrow and added the `free-use` claim for the remaining README/terms statement. | `@claim:free-use`; all 13 claim commands passed from the clean clone; live `/?demo=1`. |
| F-1-6 | Added `clear-real-work` to the claim contract and a seeded real/demo namespace deletion test. | `@claim:clear-real-work`; the test proves only the real key is deleted and the reloaded form is empty; live completed-receipt control. |
| F-1-7 | Added the explicit `no-plagiarism-detection` claim and completed-workflow test. | `@claim:no-plagiarism-detection`; live `/?demo=1` offers and produces no plagiarism result. |
| F-1-8 | Added route-focus state, H1 focus on full navigation and back/forward restoration, plus a polite route announcement. | `moves focus to page headings across links and browser history`; live `privacyFocused: true` and `backFocused: true` in `.factory/evidence/live/finding-audit.json`; live `/privacy/`. |
| F-1-9 | Rewrote the step heading to “Explain why each passage changed.” | `creates a complete student revision receipt`; `.factory/evidence/live/demo-cold.png`; live `/?demo=1`. |
| F-1-10 | Rewrote the screen heading to “Review the finished revision receipt” and the export H1 to “Revision receipt for <student>.” | `creates a complete student revision receipt` and `@claim:receipt-export`; live `/?demo=1`. |
| F-1-11 | Replaced the footer slogan everywhere with “Compare two drafts and save a revision receipt.” | `keeps reviewed copy and documentation precise`; live `/`, `/privacy/`, `/terms/`, and `/404.html`. |
| F-1-12 | Replaced getting-started storage-key jargon with “The sample is stored separately from your own work” and moved exact keys to a technical note. | `keeps reviewed copy and documentation precise`; README and `.factory/demo.md`. |
| F-1-13 | Replaced service-worker jargon with “The build caches the site files needed for offline use.” | `keeps reviewed copy and documentation precise`; `@claim:offline-reload`; live offline evidence in `.factory/evidence/live/offline.json`. |
| F-1-14 | Corrected the requirement to Node 20.19+ or 22.12+, added `engines.node`, and added a CI assertion on Node 20.19. | `keeps reviewed copy and documentation precise`; `.github/workflows/ci.yml`; clean `npm ci`, lint, typecheck, and build pass. |
| F-1-15 | Standardized “teacher goals” to “feedback goals.” | `keeps reviewed copy and documentation precise`; terminology table in `.factory/copy-audit.md`; live `/`. |

## Cumulative acceptance evidence

- Every `.factory/claims.json` command passed independently from `/tmp/revision-receipts-clean.1PSvlV`: 13 claims, two browser projects where applicable, with one intentional duplicate mobile skip for the isolated offline context.
- Full clean-clone browser suite: 35 passed, 5 intentional project skips. Unit suite: 6 passed. Lint, strict TypeScript, production build, audit, and `git diff --check`: passed.
- Lighthouse 12.8.2: performance 100, accessibility 100, best practices 100, SEO 100; FCP 0.9 s, LCP 1.4 s, TBT 0 ms, CLS 0. Report: `.factory/evidence/lighthouse-polish-1.json`.
- Live verifier: title, `lang=en`, main landmark, one H1, alt text, button names, and zero console errors on `/` and `/?demo=1`. Reports: `.factory/evidence/live/root/verify.json` and `.factory/evidence/live/demo/verify.json`.
- Live axe: zero serious/critical violations on `/`, `/?demo=1`, `/privacy/`, `/terms/`, and `/404.html`.
- Live routing: `/`, `/demo`, `/privacy/`, `/terms/`, `robots.txt`, and `sitemap.xml` return 200; an unknown route returns the designed HTTP 404.
- Live privacy/offline: completed demo flow made same-origin requests only; demo storage was discarded without changing seeded real work; the service-worker-controlled demo reloaded offline.

All 15 findings are resolved. No severity is deferred.
