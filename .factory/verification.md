# Verification report — Revision Receipts

**Verdict: FAIL**

Tested candidate: `206895e54853fe6b353f093c048db4a5927a7210` on `main`
Live URL: <https://revision-feedback-receipts.sociobot.in/>
Verification date: 2026-08-28 (UTC)

## Blocking defect

### High — PWA installation fails; the advertised offline workflow is unavailable

The product presents itself as installable/offline in its README, privacy notice,
and prior handoff. The live app also ships a manifest and registers `/sw.js`.
However, the generated worker's `SHELL` array includes four files that do not
exist in either the candidate `dist/` output or the live deployment:

- `/assets/privacy-CSUSwM90.js`
- `/assets/terms-CSUSwM90.js`
- `/assets/legal-CYClypZu.js`
- `/assets/legal-CYClypZu.js.map`

All four live requests return HTTP 404. Reproducing the worker's
`cache.addAll(SHELL)` in Chromium failed with
`TypeError: Failed to execute 'addAll' on 'Cache': Request failed`. After a
normal live page load and a further three-second wait,
`navigator.serviceWorker.getRegistrations()` returned `[]` and there was no
controller. A direct `navigator.serviceWorker.register('/sw.js')` began
installing but did not yield a registration because the install event failed.
Consequently an update cannot be applied and an offline reload is not a valid
service-worker test; an apparent offline navigation in a browser test was only
the browser's ordinary HTTP cache, not a controlled page.

This is a candidate-build defect, not a deployment-only failure. The candidate
build's generated `dist/sw.js` contains the same four missing paths. The live
worker differs from this local build only in the order of two source-map URLs;
all functional assets match byte-for-byte and both workers contain the bad
paths.

## Checks that passed

### Clean local quality gates

- `npm ci`: completed; `npm audit --omit=dev --audit-level=high`: 0
  vulnerabilities.
- `npm test`: 6/6 Vitest unit tests passed.
- `npm run build`: passed TypeScript `--noEmit` and Vite 7.3.6 production
  build; `dist/` was produced.
- No lint script is defined in `package.json`; TypeScript checking is included
  in the build script.
- `npm run test:e2e -- --reporter=dot`: 5 passed, 1 intentional mobile legal
  page skip, in 26.4 seconds.

### Independent browser and product exercise (live)

Chromium was used against the live URL at desktop and a 390 px mobile viewport.

- Created a three-goal receipt from representative before/revised drafts;
  two changed passages were detected, all three evidence/reflection controls
  accepted input, and the finished receipt rendered three goal sections.
- The fourth-goal boundary is enforced (three controls visible; “Add another
  goal” disabled).
- Download produced
  `jordan-k-community-park-argument-receipt.html`; user-supplied angle brackets
  were HTML-escaped and the exported receipt includes the no-proof-of-learning
  caveat.
- Empty required form, identical-draft validation, invalid `.docx`, and a
  1,000,001-byte text file each show an actionable error. Replacing the file
  with a valid Markdown file and changing the revised draft recovered
  successfully.
- Mobile has no horizontal overflow (`scrollWidth` 390 at a 390 px viewport),
  retains a 16 px body font, and visually stacks the drafts and actions.
  Desktop and mobile visual smoke checks found the intended layout legible and
  intact.
- Keyboard Tab reaches the visible skip link first (4 px focus outline, shown
  at `top: 16px`). `prefers-reduced-motion: reduce` changes a button transition
  duration to `0.00001s`.
- A live axe scan after receipt generation found **0 serious or critical**
  violations. The document has `lang="en"`, one H1, one main landmark, and an
  appropriate title. No console errors or page errors occurred.

### Privacy, network, security, and performance evidence

- The browser observed 12 requests in the full receipt flow, all to the same
  origin; there were no analytics, tracking, remote font, or third-party
  requests. Source inspection confirms browser-local storage and no API calls
  for classroom text.
- Live root, privacy, terms, manifest, SVG, images, JavaScript, and CSS all
  match the candidate production build byte-for-byte. The service worker is
  the sole byte mismatch, with only source-map order differing as described
  above.
- Live responses include CSP (`default-src 'self'`; no external connect or
  script sources), HSTS, `Referrer-Policy: strict-origin-when-cross-origin`,
  `X-Content-Type-Options: nosniff`, and a restrictive permissions policy.
  Hashed JS/CSS/images use `public, max-age=31536000, immutable`; `/sw.js`
  uses `no-cache`; HTML uses a short 30-second revalidation cache.
- Candidate bundle sizes: application JS 16,650 bytes (6,018 gzip) plus 771
  byte Vite helper, CSS 15,088 bytes (4,022 gzip), mobile hero 29,842 bytes,
  desktop hero 88,136 bytes. These are within the stated budgets.
- `/privacy/` and `/terms/` are present, accessible, and accurately describe
  the local-first model, except that their claim of working offline is blocked
  by the defect above.

## Required remediation and re-verification

Generate the service-worker manifest from files that are actually emitted, or
filter the generated list to existing output paths. Do not include sourcemaps
or stale Rollup entries. Rebuild and verify that every `SHELL` request is 200,
that `navigator.serviceWorker.ready` resolves with an active controller after
a reload, that an update installs/activates, and that a network-disabled reload
is served by that controller. Re-run this entire verification after the fix.
