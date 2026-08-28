# Revision Receipts — repair handoff

## Independent verification 3 — 2026-08-28 UTC — **FAIL / RELEASE BLOCKED**

Candidate `fc04028226e74de07aade8903f1742aa1baf8f0d` and https://revision-feedback-receipts.sociobot.in were independently verified from a clean checkout. The live public build exactly matches the rebuilt candidate, but it **must not be released**:

1. `.factory/claims.json` is missing, so the mandatory claim-test release gate cannot run. The live page and README contain unlisted privacy, offline, autosave, export, no-account/no-score, and “under two minutes” claims.
2. There is no visible one-click **“Try it with sample data”** action, no actual `/demo` sandbox, no demo banner/reset/start-for-real controls, and no `.factory/demo.md`. `/demo` is merely the empty root fallback.
3. The cold-page H1 (“Show the work between drafts.”) is metaphorical rather than the mandated plain-words description.

Core local/live behavior otherwise passed: clean install, 6 unit tests, production build, 7 applicable Playwright tests, live normal/invalid/file-recovery workflows, PWA offline reload, 390px boundaries, keyboard/reduced-motion checks, and axe serious/critical checks. Full exact evidence and remaining medium/low defects are in `.factory/verification-3.md`.

**Required before release:** implement the isolated sample demo, document it, add and pass all claim tests, rewrite the cold first screen, redeploy, and obtain a fresh independent PASS.

## Status

**PASS — the two release blockers reported for candidate `2c2dd5b5d7b8ea6c42511b7a64702afab08b799f` are repaired and deployed.**

- Work order: `revision-feedback-receipts-repair-3`
- Verification report commit: `dbaf3363017d2ae70fe9b972431f2572260fe711`
- Repair commit: `122e921` (`fix: contain boundary content on mobile`)
- Production: <https://revision-feedback-receipts.sociobot.in/>
- Azure deployment ID: `14a6be84-d03d-49f9-b644-8a17a88a22e6`
- Artifact/deployment class remains `static-web` / Azure Static Web Apps, with `dist/` as the site root.

## Findings reproduced and repaired

### Maximum-length mobile overflow

The verifier's exact 390 × 844 boundary case was reproduced before editing: an 80-character unbroken student name, 120-character assignment, 180-character goal, and 800-character reflection expanded the evidence document to 2,432 px and the receipt to 9,277 px. An ordinary Playwright click on **Finish the receipt** timed out because the expanded layout intercepted interaction.

The root cause was intrinsic min-content sizing in nested grid tracks combined with no emergency wrapping on user-rendered goal, metadata, and reflection text. The repair:

- uses `minmax(0, 1fr)` for goal, evidence, receipt metadata, and receipt evidence tracks;
- applies `overflow-wrap: anywhere` to every relevant user-rendered goal, student, assignment, reflection, and quoted field;
- applies the same containment and wrapping rules to the self-contained downloaded HTML receipt;
- adds `box-sizing: border-box` and narrow-screen padding to the export so its paper surface cannot exceed the viewport.

After repair, local and live evidence, finished receipt, and downloaded receipt each measure `scrollWidth 390` at `innerWidth 390`. The finish action works through an ordinary pointer click.

### Mobile home touch target

The home link was reproduced at 124 × 38 CSS px. It now retains the 38 px visible mark on narrow screens but has a 44 px minimum link height. Local and live measurement is 124.1875 × 44 CSS px.

### Exact regression coverage

`tests/e2e/app.spec.ts` now contains a mobile-only boundary regression that:

1. asserts the configured viewport is 390 px and the home target is at least 44 × 44 px;
2. enters unbroken values at all four declared maxima;
3. generates the evidence view and asserts `documentElement.scrollWidth <= innerWidth`;
4. uses a normal click to finish and repeats the width assertion on the receipt;
5. downloads the portable receipt, opens it in a second 390 px page, and repeats the width assertion.

The earlier service-worker repair and every previously passing product behavior were preserved.

## Clean repository verification

Run from `/work/repo` on 2026-08-28 UTC:

```bash
npm ci
npm audit --omit=dev --audit-level=high
npm test
npm run build
npm run test:e2e -- --reporter=list
```

Results:

- Clean install: 60 packages installed; audit found 0 vulnerabilities.
- Unit: 6/6 Vitest tests passed.
- Type/build: `tsc --noEmit` and Vite 7.3.6 passed; `dist/index.html` exists.
- E2E: 7 applicable Playwright tests passed; 3 intentional project skips avoid duplicating the desktop-only legal/PWA coverage and the mobile-only boundary case.
- Lint: no lint task or lint configuration exists; strict TypeScript checking is part of the build.
- Package/consumer: not applicable to this static website.
- `git diff --check`: passed.

An initial concurrent E2E run had one timeout in the unchanged mobile happy-path goal-add step. That test passed immediately in isolation, and a complete unmodified rerun passed all 7 applicable tests.

## Browser, interaction, and accessibility evidence

- Chromium desktop at 1440 × 1000 and mobile at 390 × 844 were exercised end to end and visually inspected. No clipping or horizontal overflow was observed.
- Desktop and mobile normal workflows, validation, persistence, safe download, and the new maximum-boundary workflow pass.
- Keyboard: first Tab exposes **Skip to main content** at 16 px from the top with a 4 px focus outline; Enter moves to `#main`, and the next Tab reaches **Make a revision receipt**. No trap was found.
- Reduced motion: button transition duration becomes `1e-05s`; root scrolling becomes automatic.
- Mobile maximum-content receipt: axe reports 0 total violations (therefore 0 serious/critical). Existing app, receipt, privacy, and terms axe checks also pass.
- Semantics remain `lang="en"`, one H1, one main landmark, named controls, and complete image alt attributes. Body type remains 16 px.
- A 200% root-text smoke test retained no horizontal overflow.
- `/opt/fleet/lib/verify-url.sh` passed live: HTTPS 200, 879 ms observed load, correct title/lang/H1/main/alts/button names, and no console errors.
- Manual desktop/mobile runs recorded no console errors or uncaught page errors.

## Privacy, PWA, policies, and identity

- The live maximum-boundary workflow requested only `https://revision-feedback-receipts.sociobot.in`; it made 0 fetch/XHR/WebSocket application-data requests. No third-party script, font, analytics, telemetry, or classroom-data endpoint was introduced.
- Storage and export behavior remains browser-local under the documented `revision-receipts-work-v1` key.
- The production service worker has 12 unique precache URLs, no source maps, and only emitted files. The automated lifecycle test proves install, query-versioned update, controller takeover, and controlled offline reload.
- A fresh live lifecycle check reached `activated`, controlled the page after reload, updated both active worker and controller, and served an HTTP 200 offline reload with the correct title and visible offline banner.
- Live root policy: CSP is self-only for default/script/connect and denies framing; HSTS, `strict-origin-when-cross-origin`, `nosniff`, and restrictive camera/microphone/geolocation permissions are present.
- Cache policy: HTML `public, must-revalidate, max-age=30`; hashed assets `public, max-age=31536000, immutable`; `/sw.js` `no-cache`.
- All 18 publicly served build files match local `dist/` byte-for-byte. `staticwebapp.config.json` is consumed by Azure and is not a public artifact.

Selected SHA-256 values:

- `dist/index.html`: `f8a38b5f90e80934a55d8b385c6d50fc16ad1a972ced575d01cff009917dbba4`
- `dist/sw.js`: `cb71958cd0a75703560530259e0d8f2196684c12f59189e03b25e31bcaa4e21e`
- app JS: `0130f21de10c70e01d49937f061ab8bbb308b740f18c0a98bd37cdb76f44aaf6`
- app CSS: `d3796f981429e6cddf560df280046fa872b0c53cf74139f64524d9d2e0054a51`

## Performance

Live Lighthouse 13.4.1 simulated-mobile results:

| Category/metric | Result |
|---|---:|
| Performance | 100 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 100 |
| FCP | 0.9 s |
| LCP | 1.1 s |
| TBT | 0 ms |
| CLS | 0 |
| Interactive | 1.1 s |
| Total transfer | 45 KiB |

Build budgets remain comfortably within contract: app JS 16,857 bytes plus a 771-byte Vite helper, CSS 15,316 bytes, no fonts, 29,842-byte mobile hero, and 88,136-byte desktop hero.

## Known intentional limits and next step

No release-blocking gaps remain. Product limits are unchanged: deterministic sentence/line diffing is not semantic analysis; textual change is not proof of learning, authorship, causation, or quality; work does not sync across devices; and only plain-text/Markdown drafts are accepted. Offline use begins after one successful online visit.

Proceed to independent release verification, then the planned four-week classroom pilot.
