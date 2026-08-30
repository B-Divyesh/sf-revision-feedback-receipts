# Revision Receipts — polish round 1 handoff

## Status

**PASS — all findings resolved, pushed, deployed, and checked cold on the live site.**

- Work order: `revision-feedback-receipts-polish-1`
- Candidate repaired: `e4ecde30fd730af6509af145cc47bb93b871a73e`
- Review commit: `16699b1a073cb0c6cb23b2bca2551f2a26a4fa2d`
- Deployed product commit: `effb432`
- Live site: <https://revision-feedback-receipts.sociobot.in/>
- Artifact/deployment class: unchanged `static-web`; Vite output remains `dist/`; Azure Static Web Apps deployment succeeded.

## What changed

The 390×844 first screen now presents the job, audience, sample action, result sentence, and all three facts before the artwork. The first-screen sample action opens the isolated `?demo=1` path. Demo mode has one visible H1, a valid heading outline, realistic sample data, a persistent banner, Reset demo, and Start for real. Demo and real work remain in separate local-storage namespaces.

All reviewed copy was made literal and consistent. The vague privacy chip, abstract headings, footer jargon, service-worker jargon, storage jargon, false empty-workspace statement, imprecise Node range, and “teacher goals” drift are gone. The exported receipt now names the student in its H1.

The claim contract now has 13 claims. New tests cover free use, no plagiarism detection, and destructive clearing of real work without touching demo data. Cross-route focus moves to the new H1 and is restored on browser history navigation. Node engines and CI use the supported runtime range.

The live verifier initially exposed a hidden second H1 on `/`. That heading was removed from static HTML and is now created only in demo mode. The fix was committed, pushed, redeployed, and rechecked: `/` and `/?demo=1` each have exactly one H1.

The complete finding-by-finding mapping is in `.factory/polish-1.md`.

## Verification

From final clean clone `/tmp/revision-receipts-verified.nGNjc7` at tested source commit `2002ea9`:

```text
npm ci                                            PASS — 161 packages, 0 vulnerabilities
npm audit --omit=dev --audit-level=high           PASS — 0 vulnerabilities
npm run test:claims                               PASS — all 13 declared commands
npm test                                          PASS — 6/6
npm run lint                                      PASS
npm run typecheck                                 PASS
npm run build                                     PASS — dist/ produced
npm run test:e2e -- --reporter=list               PASS — 37 passed, 5 intentional project skips
git diff --check                                  PASS
```

The final post-deploy H1 change additionally passed lint, typecheck, build, the metadata/demo/404 test, the 390×844 first-screen test, and the route-focus test. The receipt-export and reviewed-copy contract tests also passed after the final documentation update.

Lighthouse 12.8.2 simulated-mobile results:

| Category | Score |
| --- | ---: |
| Performance | 100 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 100 |

FCP was 0.9 s, LCP 1.4 s, TBT 0 ms, and CLS 0. Initial application JavaScript is 19.45 kB raw / 6.88 kB gzip; CSS is 17.03 kB raw / 4.35 kB gzip. Both remain far below the static-product budgets.

Live cold checks on 2026-08-30 UTC confirmed:

- Mobile first-screen content ends at 550 px in an 844 px viewport; width is exactly 390 px with no overflow.
- Root and query demo each have one H1, correct titles/canonicals, `lang=en`, one main landmark, no missing alt text, no unlabeled buttons, and no console errors.
- Demo reset restores Jordan K.; Start for real restores seeded real work and deletes only demo storage.
- All captured workflow requests are same-origin.
- Route focus and back-navigation focus land on H1; legal titles are route-specific; unknown routes return the designed HTTP 404.
- Live axe scans found zero serious or critical violations on root, demo, privacy, terms, and 404.
- The controlled demo reloads offline with its sample present.
- CSP, Referrer-Policy, X-Content-Type-Options, and Permissions-Policy headers are present.

Evidence is under `.factory/evidence/`, including live screenshots, verifier JSON, the live finding audit, offline result, and Lighthouse JSON.

## Known gaps and next steps

None. No blocking, major, or minor finding remains, and no follow-up work is deferred.
