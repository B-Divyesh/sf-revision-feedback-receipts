# Independent release verification 4 — PASS

**Candidate:** `e4ecde30fd730af6509af145cc47bb93b871a73e`
**Live URL:** https://revision-feedback-receipts.sociobot.in/
**Verified:** 2026-08-30 UTC
**Verdict:** **PASS — release accepted.**

This was an independent clean-checkout verification. Product source was not changed.

## First-read and demo gate — PASS

Cold live-page reading passed. The first screen says **“Create receipts from draft changes.”**, followed by **“For writing teachers who need a quick record of how students used feedback.”** Its primary action is **“Try it with sample data →”**. It plainly says what it does, who it is for, and what to click first.

That action opens `/demo` in one click. It immediately shows Jordan K.’s realistic two-goal revision workspace, a persistent **“Demo — sample data, nothing is saved”** banner, **Reset demo**, and **Start for real**. Completing the receipt succeeds on desktop and 390 px mobile.

## Required claims gate — PASS

`.factory/claims.json` exists and declares ten demo-entry-point claims. From a clean clone, every listed command was run exactly as specified and passed:

| Claim | Result |
| --- | --- |
| `demo-sandbox` | PASS |
| `no-account` | PASS |
| `revision-workflow` | PASS |
| `browser-only` | PASS |
| `local-autosave` | PASS |
| `receipt-export` | PASS |
| `evidence-not-score` | PASS |
| `human-review-limit` | PASS |
| `no-writing-generation` | PASS |
| `offline-reload` | PASS |

The offline test uses a dedicated browser context and proves activated/controlled service-worker offline reload of `/demo`.

## Clean build and test evidence — PASS

`npm ci` passed (161 packages; 0 audit vulnerabilities). `npm test` passed (6/6 Vitest tests). `npm run lint`, `npm run typecheck`, and the exact `npm run build` all passed, with production `dist/` emitted. `npm run test:e2e -- --reporter=list` passed with 28 tests passed and two intentional duplicate-project skips (desktop-only PWA and mobile-only boundary checks). `npm audit --omit=dev --audit-level=high` and `git diff --check` passed.

Build budgets pass: app JS is 18,492 bytes (6,647 gzip), app CSS is 16,460 bytes (4,236 gzip), and the mobile hero is 29,842 bytes.

## Product, PWA, privacy, and accessibility — PASS

- The sample shows two changed passages, selected evidence, reflections, and two receipt sections. Empty submission reports five useful missing-field errors. A `.pdf` upload is rejected with an actionable plain-text recovery message; the normal workflow exports a self-contained HTML receipt.
- Tests cover identical drafts, added passages, Markdown lines, multilingual word counts, long unbroken values, and a 390 px receipt/export without horizontal overflow.
- The live worker was activated and controlled after reload, accepted a query-versioned update, and served `/demo` offline after the initial visit.
- During the live completed-demo flow, desktop and mobile request logs contained only the product origin. No analytics, external fonts, third-party scripts, or classroom-data request was observed. The browser-only claim separately asserts demo-only storage.
- Live pages returned self-only CSP with `frame-ancestors 'none'`, HSTS, strict-origin referrer policy, `nosniff`, restricted camera/microphone/geolocation, HTML `max-age=30`, hashed-asset `max-age=31536000, immutable`, and service-worker `no-cache`. Unknown routes return HTTP 404.
- Desktop and 390 px mobile had no console or page errors, `lang=en`, one title, `<main>`, and `<h1>`, no horizontal overflow, and reduced-motion values of auto/near-zero transition. Keyboard first Tab revealed the 4 px visible skip-link focus outline and Enter moved focus to main. Axe found zero serious/critical issues on the completed demo receipt in both viewports. All internal links on home/demo/privacy/terms/404 returned 200; the two non-HTTP links are explicit `mailto:` links.

## Deployment identity and applicability

SHA-256 comparisons matched all 18 fetchable generated artifacts: root/demo/legal/404 pages, JS, CSS, service worker, manifest, images, icons, robots, and sitemap. `staticwebapp.config.json` is deployment configuration and correctly is not publicly served. The live deployment therefore matches the rebuilt candidate.

There are no product server-side endpoints, authentication flows, product-unlock calls, or sign-in controls. Rate-limit and Entra tenant checks are not applicable.

## Defects

No release-blocking, critical, high, medium, or low defects found.
