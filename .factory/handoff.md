# Revision Receipts — adversarial review 3 handoff

## Status

**Review complete: FAIL.**

- Work order: `revision-feedback-receipts-review-3`
- Reviewed commit: `16e6151969fb4522b290ab89a3a652662a258abc`
- Live site: <https://revision-feedback-receipts.sociobot.in/>
- Review: [`.factory/review-3.md`](review-3.md)

No product code was modified. The review records one blocking finding, three major findings, and two minor findings.

## What was checked

Fresh 390×844 and 1440×900 browser contexts were used for the cold landing read and one-click demo. The live demo was edited, reset, exited, taken offline, and checked against seeded real storage. Its requests, methods, and bodies were recorded. All product and legal routes were checked for metadata, headings, shared navigation, focus/history, links, 404 behavior, console errors, responsive overflow, touch targets, axe violations, and visual identity.

Every earlier review, polish receipt, and handoff was read. All 18 earlier findings remain fixed. The new blocking finding is that the first demo viewport does not show any changed passage, reflection, or receipt; the first changed passage starts 3,707 px down on a phone.

The clean clone was `/tmp/revision-receipts-review3.L6d4lH` at the reviewed commit.

```text
npm ci                              PASS — 161 packages, 0 vulnerabilities
npm run test:claims                 PASS — all 13 claim commands
npm test                            PASS — 6/6
npm run lint                        PASS
npm run typecheck                   PASS
npm run build                       PASS — dist/ produced
npm run test:e2e -- --reporter=list PASS — 38 passed, 6 intentional project skips
```

The factory URL verifier passed both `/` and `/?demo=1`. Live axe scans reported zero violations on `/`, `/demo`, `/privacy/`, `/terms/`, and the designed 404. The live request audit observed only same-origin GETs with empty bodies, and the controlled demo reloaded offline.

## Findings left for the repair round

- F-3-1 blocking: expose real before/after evidence and reflection in the first demo viewport and make the demo heading match its initial state.
- F-3-2 major: strengthen the classroom-content transmission claim and test beyond same-origin URLs.
- F-3-3 major: list and test `We do not add analytics or tracking`, or remove it.
- F-3-4 major: narrow the unlisted personal-information statement.
- F-3-5 minor: remove the untested adjective `quick` or add a quantitative claim.
- F-3-6 minor: add the required landing limits/privacy section after `How it works`.

The full evidence, exact quotes, geometry, proposed rewrites, claim results, and earlier-finding audit are in the review file.
