# Adversarial first-read review 2 — Revision Receipts

**Verdict: FAIL**

Reviewed 2026-08-30 against the live site at <https://revision-feedback-receipts.sociobot.in> and a clean clone of repository commit `44f17cbec5f7c2790d201a27928dc3307408c1b5`.

The first read, sample demo, sandbox isolation, all 13 claim tests, offline reload, routing, and earlier repairs pass. The release still has three minor findings. The acceptance rule requires zero findings, so the verdict is FAIL even though no blocking finding remains.

## 1. Cold first screen

Fresh Chromium contexts with empty browser state were opened at 390×844 and 1440×900. Neither page was scrolled before recording the result.

| Question | 390×844 phone | 1440×900 desktop |
| --- | --- | --- |
| What does this do? | Creates a receipt from the differences between two drafts. | Creates a receipt from the differences between two drafts. |
| For whom? | Writing teachers checking whether students used feedback. | Writing teachers checking whether students used feedback. |
| What should I click first? | `Try it with sample data`. | `Try it with sample data`. |

The exact first-screen copy is `Create receipts from draft changes.`, `For writing teachers who need a quick record of how students used feedback.`, and `Try it with sample data`. On the phone, the H1 ends at 226 px, the audience sentence at 292 px, the primary action at 354 px, its result sentence at 461 px, and the final plain fact at 550 px. All required content fits inside the 844 px viewport. **PASS; no blocking first-read finding.**

## 2. Findings

### Blocking

None.

### Minor

#### F-2-1 — Two root-page regions have the same accessible name

- **Exact location/quote:** live `/`; `section#make-receipt[aria-labelledby="workspace-title"]` and `section#how-it-works[aria-labelledby="how-title"]` are both named `Make a revision receipt in three steps.`
- **Evidence:** axe-core 4.10 reports `landmark-unique` with moderate impact on `#make-receipt`. The remaining four tested routes have no axe violations.
- **Why this matters:** a screen-reader landmark list exposes two indistinguishable regions. A visitor cannot tell whether a region is the actual editor or the explanatory overview.
- **Concrete fix:** give the workspace a distinct name such as `Create your revision receipt` and keep `Make a revision receipt in three steps` for the explanatory section. Add an axe assertion that fails on every violation, not only serious or critical ones.

#### F-2-2 — The mobile header changes navigation between routes

- **Exact location/quote:** at 390 px, `/` and `/demo` hide `Try the demo`, `Make a receipt`, and `Privacy` through `.site-header nav { display: none; }`. `/privacy/`, `/terms/`, and the designed 404 instead show `Tool`, `Demo`, and `Privacy`, with `Privacy` wrapping onto a second row.
- **Why this matters:** the required consistent site header is not consistent. A phone visitor loses global navigation on the product routes, then sees a differently labelled and differently arranged header on policy and error routes.
- **Concrete fix:** use one shared mobile header pattern on every route. Keep the same link names and order, and expose them through a compact menu or a layout that fits at 390 px.

#### F-2-3 — The mobile `Tool` navigation target is narrower than 44 px

- **Exact location/quote:** the `Tool` header link on `/privacy/`, `/terms/`, and the designed 404 measures **35×44 px** at 390×844. `src/legal.css` sets `min-height: 44px` but no minimum width or horizontal padding.
- **Why this matters:** it misses the repository's 44×44 px touch-target baseline and is easier to miss on a phone.
- **Concrete fix:** add enough horizontal padding or `min-width: 44px` to `.legal-header nav a`, preserving the visible focus treatment. Add a 390 px test that measures every non-inline header control in both axes.

## 3. Copy audit

Counting method: words are lexical tokens; hyphenated terms, URLs, commands, versions, and placeholders count as one word. Presentation marks do not count. Labels, headings, and actions are checked separately after the sentence tables.

### Landing and embedded product sentences

| Sentence | Words | Result |
| --- | ---: | --- |
| You’re offline. | 2 | Pass |
| The tool still works; exports stay on this device. | 9 | Pass |
| Use the sample receipt without changing your own browser work. | 10 | Pass |
| Create receipts from draft changes. | 5 | Pass |
| For writing teachers who need a quick record of how students used feedback. | 13 | Pass |
| Loads a completed sample; your real browser work stays separate. | 10 | Pass |
| Drafts are compared in this browser. | 6 | Pass |
| No account needed. | 3 | Pass |
| No automatic score. | 3 | Pass |
| Export an HTML receipt. | 4 | Pass |
| Make a revision receipt in three steps. | 7 | Pass |
| Unfinished work saves in this browser as you type. | 9 | Pass |
| Required fields are marked with an asterisk. | 7 | Pass |
| Use initials if your classroom policy prefers. | 7 | Pass |
| Add up to three specific goals from the teacher’s feedback. | 10 | Pass |
| Paste the draft before feedback here… | 6 | Pass; field placeholder |
| Paste the draft after feedback here… | 6 | Pass; field placeholder |
| Local-only: these drafts are compared on your device. | 8 | Pass |
| We cannot see, recover, or grade them. | 7 | Pass |
| Review the detected changes, then choose the strongest passage for each goal and explain what you did. | 17 | Pass |
| The tool finds textual change; it does not judge quality or learning. | 12 | Pass |
| This reflection is included verbatim on the receipt. | 8 | Pass |
| Text changed and the student explained why. | 7 | Pass |
| It is evidence for a conversation—not proof of learning, authorship, or quality. | 13 | Pass |
| Keep one to three feedback goals beside the drafts. | 9 | Pass |
| Choose the before-and-after passage that best fits each goal. | 9 | Pass |
| Export a receipt for human review, not an automatic grade. | 10 | Pass |
| Compare two drafts and save a revision receipt. | 8 | Pass |
| Original AI-generated hero artwork. | 4 | Pass; provenance disclosure |
| Built by Param Factory · Build 2026.08.30. | 6 | Pass |
| Review Jordan’s changed passages and reflections, then finish or export the sample receipt. | 13 | Pass; demo introduction |
| Selected evidence is no longer available. | 6 | Pass |
| In 1–3 sentences, explain the decision you made. | 8 | Pass |
| The explanation should be your own. | 6 | Pass |
| What did you change, and why? | 6 | Pass; form label |
| Receipt downloaded as a portable HTML file. | 7 | Pass |
| Textual change is evidence for a conversation, not proof of learning or quality. | 13 | Pass |
| Add the student name or initials. | 6 | Pass |
| Add the assignment name. | 4 | Pass |
| Write feedback goal `<n>`. | 4 | Pass |
| Paste or choose the first draft. | 6 | Pass |
| Paste or choose the revised draft. | 6 | Pass |
| The two drafts are identical. | 5 | Pass |
| Add the revised version before comparing. | 6 | Pass |
| `<file>` is larger than 1 MB. | 6 | Pass |
| Choose a plain-text classroom draft under 1 MB. | 8 | Pass |
| `<file>` is not a .txt or .md file. | 8 | Pass |
| Export the draft as plain text and try again. | 9 | Pass |
| `<file>` contains more than 100,000 characters. | 6 | Pass |
| Shorten it before comparing. | 4 | Pass |
| No changed passages were found. | 5 | Pass |
| Check that the revised draft is different from the first draft. | 11 | Pass |
| Choose evidence for feedback goal `<n>`. | 6 | Pass |
| Write a reflection for feedback goal `<n>`. | 7 | Pass |
| Receipt summary copied to the clipboard. | 6 | Pass |
| Clipboard access was blocked. | 4 | Pass |
| Download the receipt instead. | 4 | Pass |
| Clear `<student>`’s drafts, goals, and receipt from this device? | 9 | Pass |
| This cannot be undone. | 4 | Pass |

### README sentences

| Sentence | Words | Result |
| --- | ---: | --- |
| Revision Receipts is a browser tool for secondary-school and college writing classes. | 12 | Pass |
| It helps teachers compare two drafts against 1–3 feedback goals and prepare a student reflection for review. | 17 | Pass |
| It is built for a teacher who needs to verify whether feedback was acted on without reading every draft side by side. | 22 | Pass at the hard cap |
| It does not generate writing, grade work, detect plagiarism, determine authorship, or treat textual change as proof of learning. | 19 | Pass |
| Live site: `https://revision-feedback-receipts.sociobot.in` | 3 | Pass |
| Open `https://revision-feedback-receipts.sociobot.in/?demo=1` or choose Try it with sample data on the landing page. | 13 | Pass |
| The sample uses Jordan K.’s community-park argument with two feedback goals, changed passages, and reflections. | 15 | Pass |
| The sample is stored separately from your own work. | 9 | Pass |
| Reset demo restores the sample. | 5 | Pass |
| Start for real deletes the demo copy and opens your saved browser work. | 13 | Pass |
| If none exists, it opens a blank receipt. | 8 | Pass |
| The tool saves unfinished work in browser storage, exports a portable HTML receipt, and works offline after the first online visit. | 21 | Pass |
| No account is needed. | 4 | Pass |
| The receipt shows passages and reflections, not an automatic score. | 10 | Pass |
| It does not generate writing, grade work, detect plagiarism, or determine authorship. | 12 | Pass |
| Textual change is not proof of learning, authorship, or quality. | 10 | Pass |
| Requires Node.js 20.19+ or 22.12+. | 5 | Pass |
| Open the local URL printed by Vite. | 7 | Pass |
| Playwright is pinned to 1.58.2. | 5 | Pass |
| If its Chromium binary is not already available, run `npx playwright install chromium` before the end-to-end suite. | 17 | Pass |
| The deployment command is exactly `npm run build`; Azure Static Web Apps should publish `./dist`. | 15 | Pass |
| `public/staticwebapp.config.json` supplies security, routing, the designed 404 response, and cache headers. | 11 | Pass |
| The build caches the site files needed for offline use. | 10 | Pass |
| Drafts, goals, student identifiers, evidence choices, and reflections are stored in the current browser. | 14 | Pass |
| “Clear this device and start over” removes the real working copy. | 11 | Pass |
| Downloaded or printed receipts are the user’s responsibility to handle under school policy. | 13 | Pass |
| See `/privacy` and `/terms`. | 4 | Pass |
| Technical note: the isolated sample uses `demo:revision-receipts-work-v1`; real work uses `revision-receipts-work-v1`. | 11 | Pass |

No sentence exceeds 22 words. No sentence contains a banned marketing term. Headings name their section or task, including `Explain why each passage changed` and `Review the finished revision receipt`. Actions name their result: `Try it with sample data`, `Start a blank receipt`, `Find changed passages`, `Finish the receipt`, `Download receipt`, `Print / save PDF`, and `Copy summary`. `Reset demo` and the required `Start for real` control are clear in the persistent demo banner. Core terms remain consistent: **draft**, **feedback goal**, **changed passage**, **reflection**, and **revision receipt**. No copy finding remains.

## 4. Demo and sandbox

**PASS.** The landing primary action opens `/?demo=1` in one click. Its first screen already shows Jordan K., *Community park argument*, two specific feedback goals, draft word counts, two detected changes, chosen evidence, and completed reflections.

- The banner says `Demo — sample data, nothing is saved` and exposes `Reset demo` and `Start for real`.
- Editing the sample name and choosing Reset restored `Jordan K.`.
- A seeded real workspace remained byte-for-byte unchanged while the demo used `demo:revision-receipts-work-v1`.
- Start for real removed only the demo key and reopened the seeded real workspace.
- The completed live demo made same-origin GET requests only. No analytics, external font, script, API, POST, or request containing draft text was observed.
- After one online visit, a service-worker-controlled `/demo` reloaded with HTTP 200 while the browser context was offline. Jordan K.’s sample remained present and the offline banner appeared.

## 5. Claims

Every test command listed in `.factory/claims.json` was run through `npm run test:claims` from clean clone `/tmp/revision-receipts-review2.zjuQC6` at commit `44f17cbec5f7c2790d201a27928dc3307408c1b5`.

| Claim ID | Result | Evidence |
| --- | --- | --- |
| `demo-sandbox` | PASS | Reset and exit preserved seeded real work and discarded only demo storage. |
| `no-account` | PASS | Completed the sample without sign-in controls. |
| `free-use` | PASS | Completed and downloaded without billing controls or requests. |
| `revision-workflow` | PASS | Two changes, evidence choices, reflections, and receipt sections were present. |
| `browser-only` | PASS | Requests were same-origin and only demo storage held sample data. |
| `local-autosave` | PASS | Edited demo data survived reload in the demo key. |
| `receipt-export` | PASS | The self-contained HTML contained the expected evidence and reflection. |
| `evidence-not-score` | PASS | Receipt contained evidence and reflection with no score or grade output. |
| `human-review-limit` | PASS | Receipt displayed the human-review limitation. |
| `no-writing-generation` | PASS | Output reproduced supplied passages and reflections. |
| `no-plagiarism-detection` | PASS | No plagiarism control or result appeared. |
| `clear-real-work` | PASS | Clearing real work preserved the demo namespace. |
| `offline-reload` | PASS | A dedicated context reloaded the controlled demo offline. |

All stable reliance-worthy product statements on the live landing page and README map to these claim entries. Technical setup statements were also checked against package metadata, the production build, and deployment configuration. No claim test failed and no unlisted product claim remains.

## 6. Earlier finding and polish audit

Every finding in `.factory/review-1.md`, every repair asserted in `.factory/polish-1.md`, and the current `.factory/handoff.md` were checked on the live site and in source.

| Earlier finding | Live and code result |
| --- | --- |
| F-1-1 mobile first screen | Fixed. Required copy, action, note, and facts end at 550 px on a 390×844 viewport; the mobile regression passes. |
| F-1-2 false empty-workspace documentation | Fixed. README and demo documentation describe saved work or a blank receipt. |
| F-1-3 demo has no visible H1 | Fixed. `/demo` has one visible H1 and a valid visible heading sequence. |
| F-1-4 vague `Private by default` claim | Fixed. Header says `Drafts stay in this browser`; the browser-only claim passes. |
| F-1-5 unlisted free claim | Fixed. Landing no longer says free; `free-use` covers README and terms. |
| F-1-6 unlisted clear-real-work claim | Fixed. The listed destructive-storage test passes. |
| F-1-7 unlisted plagiarism limitation | Fixed. The listed completed-flow test passes. |
| F-1-8 route focus | Fixed. Privacy navigation and browser Back both focus the destination H1 and expose the polite announcement. |
| F-1-9 abstract step heading | Fixed. It now reads `Explain why each passage changed`. |
| F-1-10 abstract receipt heading | Fixed. Screen and exported receipt headings name the revision receipt. |
| F-1-11 footer jargon | Fixed. Footer says `Compare two drafts and save a revision receipt.` |
| F-1-12 storage jargon in getting started | Fixed. Exact keys moved to the technical note. |
| F-1-13 service-worker jargon | Fixed. README states the usable offline result. |
| F-1-14 imprecise Node requirement | Fixed. README, package engines, and CI use the supported range. |
| F-1-15 `teacher goals` term drift | Fixed. Product copy consistently uses `feedback goals`. |

No earlier finding is reopened. The three findings in this review are newly identified checks, not regressions of F-1-1 through F-1-15.

## 7. Structure, accessibility, and visual identity

- `/`, `/demo`, `/?demo=1`, `/privacy/`, `/terms/`, and `/404.html` have route-specific titles, one visible H1, one main landmark, `lang=en`, descriptions, canonicals, OG/Twitter metadata, SVG and Apple icons, and the product social image.
- An unknown URL returns HTTP 404 with the designed paper/highlighter error page and routes back to the tool and demo.
- All internal links from the normal routes return 200; in-page targets exist. Browser Back restores the previous H1 focus.
- The standard verifier passes `/` and `/?demo=1` with no console errors, missing alt text, or unnamed buttons. Axe has no serious or critical findings. F-2-1 records its one moderate root-page finding.
- Focus styles and reduced-motion behavior are present. F-2-3 records the one measured header touch target below 44 px.
- The black rules, paper stock, red-pencil marks, lime highlighter, carbon-copy blue, hard shadows, and original classroom still-life are distinct and match `.factory/design.md`. This is not a generic gradient/card SaaS template.
- The initial app JavaScript is 19.45 kB raw and 6.88 kB gzip, below the static-product budget.

F-2-2 records the remaining cross-route mobile-header inconsistency.

## 8. Missed leverage

No missed-leverage finding. The brief forbids generated writing and hidden scoring, so an AI writing or automatic assessment step would conflict with the product. The expected import/export loop already includes `.txt`/`.md` input, HTML download, print/PDF, and summary copy. Sync would require a new consent and privacy model rather than being an obvious omission from this local-first tool.

## 9. Verification run

From the clean clone:

```text
npm ci                              PASS — 161 packages, 0 vulnerabilities
npm run test:claims                 PASS — all 13 claim entries
npm test                            PASS — 6/6
npm run lint                        PASS
npm run typecheck                   PASS
npm run build                       PASS — dist/ produced
npm run test:e2e -- --reporter=list PASS — 37 passed, 5 intentional project skips
```

Live verification additionally covered fresh desktop/mobile contexts, first-screen geometry, completed sample data, reset and exit isolation, request logging, offline reload, all route metadata, unknown-route status, internal-link crawl, focus/history behavior, console/page errors, touch-target geometry, and axe scans.

## What would make this perfect

Give the editor and explanatory overview unique accessible names. Use one mobile header and navigation model on every route. Increase the legal/404 `Tool` link to at least 44×44 px. Then rerun axe without filtering moderate findings, measure all header targets at 390 px, and repeat the complete cold-read, demo, claims, privacy, routing, and history review. Those three verified fixes would leave nothing identified in this round.
