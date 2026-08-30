# Revision Receipts — adversarial review 2 handoff

## Status

**Review complete; product verdict FAIL with three minor findings and no blocking findings.**

- Work order: `revision-feedback-receipts-review-2`
- Reviewed source: `44f17cbec5f7c2790d201a27928dc3307408c1b5`
- Live site: <https://revision-feedback-receipts.sociobot.in/>
- Full report: [`.factory/review-2.md`](review-2.md)

## What was done

The live site was opened cold at 390×844 and 1440×900 before scrolling. The landing and README copy were audited sentence by sentence. The one-click demo, sample quality, Reset, Start for real, real/demo storage isolation, same-origin request behavior, and live offline reload were verified.

Every command in `.factory/claims.json` was run from a clean clone. Routes, metadata, 404 behavior, internal links, history focus, accessibility, touch targets, and the visual identity were checked. All 15 findings from review 1 and their polish claims were rechecked live and in code; all remain fixed. Product code was not modified.

## Verification

```text
npm run test:claims                 PASS — all 13 claim entries
npm test                            PASS — 6/6
npm run lint                        PASS
npm run typecheck                   PASS
npm run build                       PASS — dist/ produced
npm run test:e2e -- --reporter=list PASS — 37 passed, 5 intentional project skips
```

The live root and demo also passed `/opt/fleet/lib/verify-url.sh`. Live request logging observed only same-origin GETs; the service-worker-controlled demo reloaded offline with its sample intact.

## Findings left

1. `F-2-1`: the editor and How it works regions share the accessible name `Make a revision receipt in three steps.`
2. `F-2-2`: the mobile product header hides navigation while legal and 404 headers show a differently labelled, wrapping navigation.
3. `F-2-3`: the legal/404 `Tool` navigation target is 35×44 px instead of at least 44×44 px.

No demo, claim, privacy, routing, build, or earlier-finding blocker remains. See the report for exact locations and fixes.
