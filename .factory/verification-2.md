# Independent verification 2 — Revision Receipts

**Verdict: FAIL**

- Candidate: `2c2dd5b5d7b8ea6c42511b7a64702afab08b799f`
- Branch: `main`
- Live URL: <https://revision-feedback-receipts.sociobot.in/>
- Verified: 2026-08-28 UTC
- Environment: Node `v22.23.2`, npm `10.9.8`, Playwright `1.58.2`, Chromium `145.0.7632.6`

The prior service-worker blocker is repaired in this candidate and on the live
site. The release still fails the acceptance contract because valid boundary
input can destroy the mobile layout. A separate small touch-target defect also
remains. The normal classroom workflow, privacy model, build, PWA lifecycle,
accessibility scans, security policies, and performance checks otherwise pass.

## Defects

### Medium — valid maximum-length content makes the mobile workflow unusable

At a 390 × 844 mobile viewport, use valid values at the declared limits:

1. Enter an 80-character unbroken student name, a 120-character unbroken
   assignment name, and a 180-character unbroken feedback goal.
2. Enter different drafts and select **Find changed passages**.
3. Select the detected passage and enter an 800-character unbroken reflection.
4. Finish the receipt.

All values are accepted by the product. The evidence step expands from 390 px
to a `documentElement.scrollWidth` of **2,263 px**. The finished receipt expands
to **9,277 px**. Within the receipt, a 324 px content area produces these
measured overflows:

- receipt metadata: 1,293 px scroll width;
- feedback-goal heading: 2,729 px scroll width;
- receipt goal/reflection: 9,244 px scroll width.

The browser scales the entire product into a tiny strip at the left of a very
wide canvas. Two ordinary Playwright attempts could not activate **Finish the
receipt** because the broken layout caused other page elements to intercept the
click; the final diagnostic used a DOM-level click only to inspect the receipt.
This violates the required mobile, boundary-value, and no-horizontal-overflow
behavior. Long URLs or other unbroken teacher/student text can trigger the same
class of failure; the values do not have to be malicious.

Required repair: constrain grid children with `min-width: 0` where appropriate
and apply `overflow-wrap: anywhere` (or an equivalent safe wrapping rule) to
every user-rendered name, assignment, goal, reflection, and receipt field,
including the self-contained export. Add a 390 px end-to-end regression using
maximum-length unbroken values and assert `scrollWidth <= innerWidth` in both
the evidence and receipt phases.

### Low — mobile home link is below the required touch-target size

At 390 px, the `Revision Receipts home` link measures **124 × 38 CSS px**. All
other non-inline controls measured at least 44 px in each applicable dimension,
but this link fails the attached 44 × 44 px touch-target requirement. Give the
link a minimum block size of 44 px while retaining the smaller visible mark if
desired.

No critical or high-severity defects were found.

## Clean checkout and repository gates

The worktree began clean at the exact candidate commit.

| Check | Fresh result |
|---|---|
| `npm ci` | PASS — 60 packages installed; 0 vulnerabilities |
| `npm audit --omit=dev --audit-level=high` | PASS — 0 vulnerabilities |
| `npm test` | PASS — 6/6 Vitest tests |
| `npm run build` | PASS — `tsc --noEmit` and Vite 7.3.6; `dist/` produced |
| `npm run test:e2e -- --reporter=list` | PASS — 6 passed, 2 intentional project skips |
| Lint | Not available — no lint script or lint configuration exists |

The E2E suite covers the complete workflow at desktop and 390 px, validation
and persistence, legal-page axe checks, plus service-worker install/update and
offline reload. The two skips avoid rerunning static legal-page axe checks and
the shared PWA shell in the mobile project.

## Independent product exercise

The live product was exercised separately from its own tests in Chromium.

### Normal flow and recovery — PASS

- Created a three-goal receipt from representative first/revised drafts; two
  changed passages were produced and all three goal/reflection sections were
  rendered.
- The three-goal maximum is enforced; add and remove work from the keyboard,
  and removing goal 2 returns focus to goal 1.
- Empty submission reports all five missing requirements and focuses the alert.
  Missing evidence/reflections reports all six errors and focuses that alert.
- Identical drafts, a `.docx`, and a 1,000,001-byte text file each produce an
  actionable error. A valid Markdown file clears the error and recovers.
- Declared limits are present: student 80, assignment 120, goal 180, draft
  100,000 characters, and reflection 800 characters.
- Finished state survives reload. Corrupt JSON in the app's local-storage key
  recovers to an empty form. Cancelling clear preserves the receipt; confirming
  clear removes the working copy.
- Copy summary works. Download creates a self-contained HTML receipt with the
  learning/authorship caveat and no external resources.
- HTML-like payloads in student, goal, and reflection fields render as text.
  The downloaded receipt escaped the payloads and created no executable script
  or image element.

### Keyboard, accessibility, responsive behavior, and motion

- First Tab reveals **Skip to main content** at `top: 16px` with a 4 px red
  focus outline. Enter sets `#main`; the next Tab bypasses header navigation and
  reaches **Make a revision receipt**.
- Normal content has no horizontal overflow at 390 px, uses a 16 px body size,
  and remains free of overflow after a 200% root text-size smoke test.
- Normal desktop and mobile screenshots were visually inspected. Layout,
  labels, contrast, image rendering, and hierarchy were intact.
- `prefers-reduced-motion: reduce` matches; transition duration becomes
  `1e-05s` and root scroll behavior becomes `auto`.
- Axe scans on the initial app, completed receipt, 390 px app, privacy page,
  and terms page found **0 serious or critical violations**.
- Semantic checks pass: `lang="en"`, one H1, one main landmark, descriptive
  title, complete images with alt attributes, named controls, and legal pages.
- `/opt/fleet/lib/verify-url.sh` passed: HTTPS 200, 742 ms observed load, no
  console errors, title/lang/H1/main/alts/button names present.
- No console errors or uncaught page errors occurred in normal desktop or
  mobile use.

The boundary overflow and 38 px home target remain acceptance failures despite
the clean axe/Lighthouse scores; those automated audits do not cover these
product-specific thresholds and input combinations.

## Privacy, outbound requests, and response policies

- The independent complete flow observed 30 browser requests, all to
  `https://revision-feedback-receipts.sociobot.in`; there were no third-party
  origins and **0 fetch/XHR/WebSocket application-data requests**.
- Source inspection found no analytics, telemetry, remote font/script, API,
  beacon, or server-side classroom-data path. Classroom state uses the one
  documented local-storage key; exports are generated as browser blobs.
- The privacy and terms pages accurately disclose local storage, ordinary host
  requests, export responsibility, and that textual change is not proof of
  learning, authorship, or quality.
- Root responses include CSP with self-only script/connect/default sources and
  `frame-ancestors 'none'`, HSTS, `Referrer-Policy:
  strict-origin-when-cross-origin`, `X-Content-Type-Options: nosniff`, and a
  restrictive camera/microphone/geolocation permissions policy.
- HTML uses `public, must-revalidate, max-age=30`; hashed assets use
  `public, max-age=31536000, immutable`; `/sw.js` uses `no-cache`.
- An unknown navigation path returns the SPA shell with HTTP 200. This was
  recorded as hosting behavior, not a release blocker for the single-page app.
- There are no server-side/API endpoints, billing/unlock calls, accounts, or
  sign-in. API burst/rate-limit and Entra authority checks are therefore not
  applicable. This is not a library or CLI, so pack/consumer checks are also
  not applicable.

## Candidate/deployment identity and PWA

The production build is deterministic at the candidate. Selected SHA-256
values:

- `dist/index.html`: `7d9d2bf4e7d576d860d6e1bd07f0f362586c0443ed60b7b4307b1fb7ce320d6b`
- `dist/sw.js`: `ab71cc2ae299fd6544e7fdfe9ff263a9ab683e00404b902a3147833322b3c169`
- app JS: `f0b6789225ff3087f69a1b3567bc7003ef126da0540dbfc3ba5bb0bf0c5b2644`
- app CSS: `556323ba010e9649751c7bda79d280aa2a2f252cd9dd7f7d73f79371ef325e0b`

Every one of the **18 publicly served build files** matched the local candidate
byte-for-byte. `staticwebapp.config.json` is consumed by Azure rather than
served; requesting that path receives the navigation fallback, so it is not a
public-artifact mismatch. The live service worker matches exactly.

The worker declares 12 unique shell URLs, with no source maps and no missing
files; all 12 return HTTP 200 live. Fresh live checks proved:

- installation reaches `activated` and controls the page after reload;
- registering a query-versioned worker updates the active worker and controller;
- a network-disabled controlled reload returns HTTP 200 with the correct title
  and visible offline banner.

This fresh evidence confirms the prior deployment/service-worker failure is
fixed and confirms the live deployment is the candidate under review.

## Performance and budgets

Fresh Lighthouse 13.4.1 simulated-mobile results:

| Category/metric | Result |
|---|---:|
| Performance | 100 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 100 |
| FCP | 1.0 s |
| LCP | 1.1 s |
| TBT | 40 ms |
| CLS | 0 |
| Total transfer | 45 KiB |

Build budgets pass: app JS is 16,650 bytes plus a 771-byte helper; initial app
CSS is 15,088 bytes; there are no font files; mobile hero is 29,842 bytes and
desktop hero is 88,136 bytes. These are all well below the contract budgets.

## Release decision

**FAIL.** Repair the valid-input mobile overflow and the undersized home target,
add boundary regressions, then rerun this verification. No product source was
modified during this QA pass.
