# Revision Receipts — repair handoff

## Status

**PASS — release blocker repaired and deployed.**

- Repair work order: `revision-feedback-receipts-repair-2`
- Verifier report: `6b6d93d773f235376cd815a70a7b73e5c753bc0b`
- Failed candidate: `206895e54853fe6b353f093c048db4a5927a7210`
- Live site: <https://revision-feedback-receipts.sociobot.in/>

## What was repaired

The failed candidate built its service-worker shell from Rollup bundle records.
Rollup exposed placeholder entries for legal-page chunks and source maps that
Vite never emitted. Four nonexistent URLs therefore entered `SHELL`, made
`cache.addAll()` reject, and prevented installation.

The repair now builds the precache list from files actually present in the
finished `dist/assets/` directory, excludes source maps, sorts the list for
deterministic output, and derives the cache revision from the emitted URLs and
file bytes. The inherited first repair also contained an invalid `Hash.update`
call that made TypeScript fail; this was corrected before release.

`tests/e2e/pwa.spec.ts` is the exact regression. It rejects the verifier's four
stale URLs, all `.map` entries, duplicates, missing disk files, and non-200
precache responses. In Chromium it then proves install/activation, controller
acquisition after reload, an updated worker becoming both active and the page's
controller, and a network-disabled reload served by that controller.

No product behavior, researched scope, visual system, artifact class, or
deployment class changed.

## Verification evidence

Run on 2026-08-28 UTC from a clean install:

```bash
npm ci
npm audit --omit=dev --audit-level=high
npm test
npm run build
npm run test:e2e -- --reporter=dot
```

- Clean install: 60 packages installed; audit found 0 vulnerabilities.
- Unit: 6/6 Vitest tests passed.
- Type/build: `tsc --noEmit` and Vite 7.3.6 passed; `dist/index.html` exists.
- Browser: 6/6 applicable Playwright tests passed. Two duplicate mobile checks
  are intentionally skipped (legal-page axe and the same shared PWA shell);
  the full workflow runs at both desktop and 390 px.
- Regression output: 12 unique precache URLs, all backed by emitted files and
  HTTP 200 responses; none of the four reported phantom URLs and no source maps.
- Desktop/mobile visual inspection: no console or page errors; at 390 px,
  `scrollWidth === innerWidth === 390`, body text is 16 px, and layout remains
  intact.
- Keyboard/motion: first Tab reveals “Skip to main content” with a 4 px focus
  outline; reduced-motion transitions resolve to `0.00001s`.
- Accessibility: one H1 and one main landmark; title/lang/alts/button names
  present; generated-receipt axe scan has 0 serious or critical findings.
- Privacy: the complete live three-goal flow made same-origin requests only;
  no analytics, remote fonts, trackers, or server-side classroom-data request.
- Performance: Lighthouse 12.8.2 mobile scored Performance 100,
  Accessibility 100, Best Practices 100, SEO 100; FCP 0.9 s, LCP 1.4 s,
  TBT 0 ms, CLS 0, 46 KiB transferred.
- Budgets: application JS 16,650 bytes plus a 771-byte helper; CSS 15,088 bytes
  plus 2,373-byte legal CSS; responsive hero images 29,842 and 88,136 bytes.
- Lint/package-consumer checks are not applicable: this static product has no
  lint configuration and is not a published package. Type checking is part of
  the production build.

## Deployment and live verification

Deployed `./dist` with the factory static deployment configuration to Azure
Static Web Apps deployment `579d89e5-3a09-46f4-ab4c-d1e652faebd6`; the custom
domain returned HTTPS 200.

Live re-verification showed:

- all 12 URLs in the deployed `SHELL` return 200;
- the deployed worker and all 18 publicly served build artifacts match local
  production bytes exactly;
- the registration is activated and controls the page;
- a query-versioned worker update becomes active and takes over the controller;
- a network-disabled controlled reload returns HTTP 200 with the correct title;
- the full three-goal receipt flow produces two changed passages and three
  receipt sections with 0 serious/critical axe findings;
- desktop and 390 px mobile load with 0 console/page errors and same-origin-only
  traffic;
- HTML responses use 30-second revalidation, hashed assets are immutable for
  one year, and `/sw.js` uses `no-cache`;
- CSP, HSTS, referrer policy, nosniff, and restrictive permissions policy are
  present on live responses.

## Known limits retained intentionally

- Diffing is deterministic sentence/line LCS, not semantic analysis. A moved
  sentence may appear as removed and added.
- Textual change and reflection support human review; they are not proof of
  learning, authorship, causation, quality, or academic integrity.
- Work remains local to one browser/device; there is no account, sync, roster,
  recovery service, LMS integration, or cloud processing.
- Only plain-text and Markdown files are accepted; other document formats must
  be pasted or exported as text.
- Offline use begins after one successful online visit installs the shell.

## Next step

Run the researched four-week classroom pilot and measure whether teachers can
verify two goals per student in under two minutes and whether at least 70% of
students submit a receipt.
