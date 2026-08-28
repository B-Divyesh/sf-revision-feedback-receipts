# Revision Receipts — verification handoff

## Status

**FAIL — candidate `2c2dd5b5d7b8ea6c42511b7a64702afab08b799f` is deployed correctly, but is not release-ready.**

- Verification work order: `revision-feedback-receipts-verify-2`
- Tested URL: <https://revision-feedback-receipts.sociobot.in/>
- Verification date: 2026-08-28 UTC
- Full evidence: [`.factory/verification-2.md`](verification-2.md)

## Release blockers

1. **Medium:** valid maximum-length unbroken student/assignment/goal/reflection
   values break the 390 px layout. Evidence view reaches 2,263 px scroll width;
   the finished receipt reaches 9,277 px, shrinking the app into a tiny strip
   and making ordinary interaction unreliable. Wrap all user-rendered content,
   constrain grid children, and add an end-to-end max-boundary mobile test.
2. **Low:** the mobile home/brand link is 38 px high rather than the required
   44 px minimum touch target.

No critical or high-severity defects were found.

## What passed

- Clean `npm ci`, audit, 6/6 unit tests, TypeScript, exact Vite production
  build, and 6 applicable Playwright tests all pass.
- The representative three-goal classroom workflow works at desktop and normal
  mobile content, including validation/recovery, local persistence, evidence,
  reflection, clipboard, safe self-contained download, and confirmed clearing.
- Empty, identical, invalid-type, oversize-file, corrupt-state, and incomplete
  evidence paths recover with actionable messages.
- Axe found 0 serious/critical findings across the app, finished receipt,
  mobile, privacy, and terms pages. Keyboard skip/focus and reduced motion pass.
- Privacy claims match behavior: all 30 observed workflow requests were same
  origin, with no fetch/XHR/WebSocket data request or third-party resource.
- Security and cache headers are present and correctly scoped.
- Lighthouse mobile: 100 performance, 100 accessibility, 100 best practices,
  100 SEO; FCP 1.0 s, LCP 1.1 s, TBT 40 ms, CLS 0, 45 KiB transfer.
- JS, CSS, font, and image budgets pass.

## Deployment and prior blocker

The previous service-worker installation defect is fixed. All 18 publicly
served build artifacts match the candidate byte-for-byte, including `/sw.js`.
Its 12 unique precache URLs all return 200. A fresh live worker installed,
activated, took control after a query-versioned update, and served an HTTP 200
offline reload with the correct page and offline banner.

The app has no backend/API, billing/unlock calls, accounts, or sign-in, so API
rate-limit and Microsoft Entra checks are not applicable. It is not a library or
CLI. No lint task exists; type checking is part of `npm run build`.

## How to reproduce and verify

```bash
npm ci
npm audit --omit=dev --audit-level=high
npm test
npm run build
npm run test:e2e -- --reporter=list
```

For the blocker, use a 390 × 844 Chromium viewport and enter unbroken values at
the UI maxima (80-character student, 120-character assignment, 180-character
goal, 800-character reflection). Generate the evidence view and receipt, then
inspect `document.documentElement.scrollWidth`; it must remain no greater than
the viewport after repair.

## Known intentional limits

- Diffing is deterministic sentence/line LCS, not semantic analysis.
- Textual change and reflection are evidence for human review, not proof of
  learning, authorship, causation, quality, or academic integrity.
- Work is local to one browser/device; there is no account, sync, roster,
  recovery service, LMS integration, or cloud processing.
- Only plain-text and Markdown files are accepted.
- Offline use begins after one successful online visit installs the shell.

## Next step

Repair both responsive defects and rerun independent verification before
release. After a passing build, proceed to the four-week classroom pilot.
