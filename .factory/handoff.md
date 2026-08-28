# Revision Receipts — verification handoff

## FAIL — do not accept this candidate as a PWA

Verified candidate `206895e54853fe6b353f093c048db4a5927a7210` against
<https://revision-feedback-receipts.sociobot.in/> on 2026-08-28 UTC.

The core local-first receipt flow is working and the live HTML, JS, CSS,
legal pages, images, and manifest match the candidate build. Clean install,
unit tests, type-checked production build, and Playwright suite pass; the
independent live desktop/mobile workflow, keyboard focus, reduced-motion,
axe, privacy/request, response-header, and size checks also pass.

### High-severity defect

The service worker cannot install. Its precache list contains four missing
assets (`privacy-CSUSwM90.js`, `terms-CSUSwM90.js`, `legal-CYClypZu.js`, and
`legal-CYClypZu.js.map`), all of which return 404 live. Chromium reproduces
`cache.addAll` failing with `TypeError: Failed to execute 'addAll' on 'Cache':
Request failed`; no service-worker registration or controller remains after
load. Thus service-worker update and offline reload are not functional,
contrary to the product's README, privacy policy, and PWA claims.

This is not deployment-only: `npm run build` generates the same invalid
precache entries. The live worker has only a harmless source-map ordering
difference from this local build.

## How to reproduce

```bash
npm ci
npm test
npm run build
npm run test:e2e -- --reporter=dot
```

Then inspect `dist/sw.js`: the four paths above are present but absent from
`dist/`. On the live site, reproduce with browser devtools/Application or by
calling `cache.addAll(SHELL)` from a page; it rejects because those URLs are
404.

## Required next step

Correct service-worker asset manifest generation, rebuild, deploy, and verify
all precache URLs, activation/update, and a true controlled offline reload
before changing this verdict to PASS. Full evidence is in
`.factory/verification.md`.
