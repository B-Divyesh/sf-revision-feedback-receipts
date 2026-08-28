# Independent release verification 3 — FAIL

**Candidate:** `fc04028226e74de07aade8903f1742aa1baf8f0d`  
**Live URL:** https://revision-feedback-receipts.sociobot.in/  
**Verified:** 2026-08-28 UTC  
**Verdict:** **FAIL — release blocked.**

This is an independent verification from a clean checkout. Product source was not changed. The live deployment is an exact match for the rebuilt candidate, so the findings below apply equally to the commit and production URL.

## Release-blocking defects

### Critical — required claim contract is absent

`.factory/claims.json` is absent from the candidate (`git ls-tree -r --name-only HEAD .factory` lists only `brief.json`, `design.md`, `handoff.md`, `verification.md`, and `verification-2.md`). Per the acceptance contract, this alone is a release blocker: there are no declared claim tests to run from a clean demo entry point.

The live landing page and README nevertheless make reliance-worthy claims with no test inventory, including:

- “Drafts stay in this browser. Nothing is uploaded.”
- “No accounts”, “No hidden score”, and “Exportable evidence”.
- “Your draft is autosaved on this device as you work.”
- “works offline after the first visit” (README).
- a teacher can check the receipt “in under two minutes”.

No `@claim:*` tests exist, and no required test commands could be run because the required claims file is missing. Add the file, one observable demo-entry-point test per claim, and remove or test every claim-like sentence.

### Critical — no one-click sample-data demo or isolated demo sandbox

Cold live-page evidence:

- `<h1>` is **“Show the work between drafts.”** It is a metaphor, not a plain-words statement of the job.
- The first CTA is **“Make a revision receipt”**, an anchor to an empty form. There is no **“Try it with sample data”** action anywhere in the page text or controls.
- `/demo` returns the ordinary root document (HTTP 200, 11,542 bytes) with empty fields; it does not seed a sample, show a persistent “Demo — sample data, nothing is saved” banner, provide Reset/Start-for-real actions, or use a separate `demo:` storage namespace.
- `.factory/demo.md` is absent.

Thus a cold visitor is not offered the required one-click try-out. The first screen partly describes draft comparison but does not plainly answer the mandated “what it does, for whom, and what to click first” test. The work order explicitly states that either this failure or a missing one-click sample demo is a candidate failure.

## Verification evidence

### Clean install, tests, and build

Executed from `/work/repo` at the candidate commit:

```text
npm ci                                      PASS (60 packages; 0 audit vulnerabilities)
npm test                                    PASS (Vitest: 6/6)
npm run build                               PASS (tsc --noEmit + Vite; dist/ produced)
npm run test:e2e -- --reporter=list         PASS (10 discovered; 7 applicable passed, 3 expected project skips)
npm audit --omit=dev --audit-level=high     PASS (0 vulnerabilities)
git diff --check                            PASS
```

There is no lint script or lint configuration. The TypeScript check is included in `npm run build`.

The required claims-test step was performed first as a repository check and **failed** because `.factory/claims.json` does not exist; consequently there were no test entries/commands to execute.

### End-to-end product behavior (live)

On the live deployment, in a fresh browser context:

- Empty submission reported all five missing-field errors in the `role=alert` summary.
- Identical drafts were rejected with “The two drafts are identical. Add the revised version before comparing.”
- A `draft.pdf` upload was rejected with a plain-text recovery instruction; a following `.txt` upload populated the draft successfully.
- A representative two-goal workflow generated two changed passages, required selected evidence and student reflections, and produced the intended review receipt.
- Download produced `jordan-k-community-park-argument-receipt.html`; the receipt contained both quoted before/after passages, both reflections, and the limitation that textual change is not proof of learning, authorship, or quality.
- The normal workflow made only same-origin requests and emitted no console errors or uncaught page errors. No third-party request, script, font, analytics, or classroom-data endpoint was observed.

### Deployment identity and privacy/policies

The following 14 emitted public files were fetched from production and SHA-256 compared with the clean local `dist/`; all matched: root HTML, service worker, manifest, mark, robots, sitemap, privacy/terms HTML, both hero images, app JS/CSS, legal CSS, and Vite modulepreload helper. For example:

```text
dist/index.html                       f8a38b5f90e80934a55d8b385c6d50fc16ad1a972ced575d01cff009917dbba4
dist/sw.js                            cb71958cd0a75703560530259e0d8f2196684c12f59189e03b25e31bcaa4e21e
dist/assets/index-0y2AtxJP.js        0130f21de10c70e01d49937f061ab8bbb308b740f18c0a98bd37cdb76f44aaf6
dist/assets/index-SNhxhQ9m.css       d3796f981429e6cddf560df280046fa872b0c53cf74139f64524d9d2e0054a51
```

Live headers on `/`, assets, `/sw.js`, `/privacy/`, and `/terms/` include self-only CSP, `nosniff`, HSTS, strict-origin referrer policy, and camera/microphone/geolocation denial. HTML is `max-age=30`, hashed assets are one-year immutable, and `/sw.js` is `no-cache`.

The PWA worker reached `activated`, controlled the page after reload, and served an offline reload (HTTP 200) with the offline banner visible. This behavior is real but remains an untested published claim under the mandatory claims contract.

No API/server endpoints, sign-in flow, or product-unlock calls exist, so rate-limit and Entra-tenant checks are not applicable.

### Accessibility and responsive checks

- Live `/`, `/privacy/`, and `/terms/`: `lang=en`, exactly one `main`, exactly one `h1`, correct titles, and zero axe serious/critical findings.
- A live completed receipt likewise returned zero axe serious/critical findings.
- At 390×844 with 80-character student name, 120-character assignment, 180-character goal, and 800-character reflection, app evidence and receipt each had `scrollWidth: 390` at `innerWidth: 390`.
- The 390px home target measured 124.19×44px. Body text is 16px.
- Keyboard Tab exposed the skip link at 16px with a 4px red focus outline; reduced motion computed to `scroll-behavior: auto` and `transition-duration: 1e-05s`.
- No browser console/page errors occurred in desktop or mobile checks.

### Performance/build budgets

Built initial app JS is 16,857 bytes (6,075 bytes gzip); app CSS is 15,316 bytes (4,041 bytes gzip). This is within the stated static-app JS/CSS budgets. The live cold load requested only same-origin root, JS, CSS, icon, and responsive hero image.

## Additional non-blocking acceptance gaps

- **Medium:** No designed 404 route exists. `/not-a-real-page` returns the root app (HTTP 200) due to navigation fallback, contrary to the required real 404 route.
- **Medium:** The root and legal pages lack canonical, Open Graph, Twitter-card, and Apple-touch metadata required by the site-structure contract. The root also lacks the required footer build/version identifier.
- **Low:** `.factory/copy-audit.md` is absent, so the prescribed plain-words audit was not supplied. Its absence is consistent with the failed metaphorical landing heading.

## Required next steps

1. Build `/demo` (or `?demo=1`) as a realistic, one-click isolated sample workspace with the required persistent demo banner/reset/start-real controls and documentation.
2. Add `.factory/claims.json` and a clean demo-entry-point test for every published claim; add claim tags and run every declared command in CI.
3. Rewrite the first-screen headline/CTA in plain words for the specified teacher, then add the missing routing/metadata work above.
4. Redeploy and repeat independent verification. Do not release this candidate until the critical defects are resolved.
