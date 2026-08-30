# Revision Receipts — repair handoff

## Independent verification 4

**PASS — accepted at `e4ecde30fd730af6509af145cc47bb93b871a73e`.** On 2026-08-30 UTC, an independent clean-clone verifier ran every one of the ten declared `.factory/claims.json` commands first, then unit, lint, type, production-build, full Playwright, audit, live desktop/390 px, privacy/request, header/cache, offline-update, accessibility, link, and artifact-identity checks. All passed. The deployed URL is https://revision-feedback-receipts.sociobot.in/ and its 18 fetchable generated artifacts SHA-256 match the rebuilt candidate. There are **no known defects by severity**. Full exact evidence is in `.factory/verification-4.md`.

## Status

**PASS — repaired, verified, and deployed.**

- Work order: `revision-feedback-receipts-repair-4`
- Verification report commit repaired: `cf78e7bb72fc7a001af0246612284dac41ccead9`
- Candidate reviewed: `fc04028226e74de07aade8903f1742aa1baf8f0d`
- Artifact/deployment class: unchanged `static-web` / Azure Static Web Apps (`dist/` site root)
- Repair commits: `1b005108acb7c20834259857c51bc64309e0cde6` and `a06e88b6d1d26cc832a87a8bd093ca4b08cea7c8`.

## Findings reproduced and repaired

### Missing claim contract

The reported failure was reproduced before editing: `/demo` returned the empty root workspace, its title was `Revision Receipts — Show what changed`, the cold H1 was `Show the work between drafts.`, the sample CTA/banner were absent, and no `.factory/claims.json` existed.

`.factory/claims.json` now declares ten observable claims. Each has one exact `@claim:<id>` Playwright test from a clean `/demo` entry point. `npm run test:claims` builds once and runs all ten declared commands separately. Coverage includes the demo boundary, no-account receipt creation, the two-draft/goals/reflection workflow, same-origin browser-only data flow, local autosave, portable HTML export, no-score/human-review limits, source-only receipt text, and controlled offline reload.

### One-click isolated demo and plain first screen

`/demo` is now a built static page (`dist/demo/index.html`) with Azure routing for the no-trailing-slash URL. It starts with a realistic Jordan K. community-park argument, two feedback goals, detected passages, selected evidence, and reflections. The persistent **Demo — sample data, nothing is saved** banner supplies **Reset demo** and **Start for real**.

Demo data uses only `demo:revision-receipts-work-v1`; real work remains under `revision-receipts-work-v1`. Reset restores the shipped sample. Start-for-real deletes only the demo key. Demo mode removes the marketing hero so the first mobile viewport immediately shows populated product fields. `.factory/demo.md` documents the URL, sample, namespace, and controls.

The landing H1 is now the plain-words **Create receipts from draft changes.** The first primary action is **Try it with sample data**, followed by a clear result sentence. The untestable “under two minutes” statement was removed. `.factory/copy-audit.md` records landing sentence word counts, banned-word review, and terminology.

### Every remaining verification gap

- Added a designed `404.html`, Azure 404 response override, and an end-to-end regression for its title, H1, return link, and configuration. The final live check found that Azure's SPA `navigationFallback` still made unknown paths return 200. Removing that unnecessary fallback produces the intended HTTP 404 while preserving all explicit static routes; the regression now also asserts that the fallback cannot be reintroduced.
- Added canonical, Open Graph, Twitter-card, Apple touch icon, and route-specific titles for home, demo, privacy, terms, and 404. Added the social preview derivative with design provenance.
- Added a consistent footer on every route with the product one-liner, Demo/Privacy/Terms, Param Factory attribution, and build ID.
- Added real ESLint plus explicit `typecheck` and `test:claims` scripts.
- Strengthened the PWA fetch policy: precached assets are matched with `ignoreVary` (so Vary-bearing module requests work offline), and only navigation requests receive an HTML fallback. Demo navigations use the cached demo shell. The offline regression owns its own browser context, proves worker activation, query-versioned update/controller takeover, and an offline demo reload.
- Preserved all previously passing workflows: validation/recovery, text/Markdown file handling, safe escaped download, local persistence, boundary wrapping, desktop/mobile layouts, keyboard controls, and reduced motion.

## Final verification evidence

Run from a clean install on 2026-08-30 UTC:

```bash
npm ci
npm audit --omit=dev --audit-level=high
npm test
npm run lint
npm run typecheck
npm run build
npm run test:e2e -- --reporter=list
npm run test:claims
git diff --check
```

Results:

- `npm ci`: 161 packages installed; `npm audit --omit=dev --audit-level=high`: 0 vulnerabilities.
- Unit: 6/6 Vitest tests passed.
- Lint and strict TypeScript: passed.
- Production build: passed; `dist/index.html`, `dist/demo/index.html`, and `dist/404.html` exist.
- Browser suite: 27 passed, 3 intentional project skips (desktop-only static legal/PWA checks and mobile-only boundary check); desktop and 390×844 mobile both exercised.
- Claim suite: all ten declared claim commands passed; the dedicated offline test has one intentional mobile-project skip because it owns one Chromium browser context.
- `git diff --check`: passed.
- Package/consumer check: not applicable to this static website.

The final local browser verification on `http://127.0.0.1:4175/` recorded HTTPS-class page checks with no console/page errors: title present, `lang=en`, one H1, one main landmark, no missing image alts, and no unlabeled buttons. The root test also proves the first Tab reaches the skip link and Enter moves focus into `main`. Axe via `@axe-core/playwright` found zero serious/critical violations on the receipt, privacy page, terms page, landing page, demo page, and 404 page.

Lighthouse 12.8.2 simulated-mobile against the final local production build:

| Category | Score |
| --- | ---: |
| Performance | 100 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 100 |

FCP was 0.9 s, LCP 1.4 s, TBT 0 ms, CLS 0, and total transfer 47 KiB. The initial application JS is 18,492 bytes (6,647 gzip); app CSS is 16,460 bytes (4,236 gzip); mobile hero is 29,842 bytes. All are below the static-product budgets.

The browser-only claim records every demo workflow request and permits only the same local origin. There are no analytics, remote fonts, third-party scripts, or classroom-data endpoints. Local response-policy source is `public/staticwebapp.config.json`: self-only CSP with `frame-ancestors 'none'`, strict-origin referrer policy, `nosniff`, restrictive permissions policy, immutable assets, no-cache service worker, `/demo` rewrite, and a real 404 override.

Final selected build hashes:

- `dist/index.html`: `0eaa302f3320a621c55ec95ccb5d8e779d186d0bed18fe7a7d2851e675a5932b`
- `dist/demo/index.html`: `48255349ba93984e3695c84b368869997bdd2ec41bffb2649d166781a602184b`
- `dist/sw.js`: `c4f7eb738216aad30471325ce11f3998e89ef31d8bfbabedb9f1cd89b3a5e159`
- `dist/404.html`: `012e5ce08d7c34d6df4c2c552699561f6a813c1938829d006569a28445c00954`

## Known limits

The diff is deterministic sentence/line comparison, not semantic analysis. Textual change remains evidence for a human conversation, not proof of learning, authorship, causation, or quality. Work does not sync across browsers or devices. Only plain-text and Markdown drafts are accepted. Offline use begins after one successful online visit.

## Deployment and post-deploy check

Deployed the final `dist/` with the static-work-app work-order configuration on 2026-08-30 UTC.

- Final deployment ID: `741046c6-c1b4-4823-aafc-ee84dd08c586`.
- Live root: `https://revision-feedback-receipts.sociobot.in/` returned 200 in 790 ms with no console errors, a title, `lang=en`, one H1, a main landmark, no missing image alts, and no unlabeled buttons.
- Live routes: `/demo`, `/privacy`, and `/terms` each returned 200. `/not-a-real-page` returned **404** with title `Page not found — Revision Receipts`.
- Live response policy confirmed HSTS, `strict-origin-when-cross-origin`, `nosniff`, self-only CSP with `frame-ancestors 'none'`, and the restrictive camera/microphone/geolocation permissions policy.
- Byte identity: all 18 selected local build files (pages, manifest, PWA worker, icons, images, CSS, and JavaScript) matched the custom-domain responses by SHA-256.
