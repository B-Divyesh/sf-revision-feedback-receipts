# Adversarial first-read review 3 — Revision Receipts

**Verdict: FAIL**

Reviewed 2026-08-30 against the deployed site at <https://revision-feedback-receipts.sociobot.in> and a clean clone of repository commit `16e6151969fb4522b290ab89a3a652662a258abc`.

The cold landing page, build, all 13 declared claim commands, sandbox isolation, offline reload, routing, accessibility scans, and all 18 earlier repairs pass. The product still fails the mandatory demo first screen: neither phone nor desktop shows a changed passage, reflection, or receipt without substantial scrolling. Five additional claim/copy/structure findings remain. Zero findings are required for acceptance.

## 1. Cold first screen

Fresh Chromium contexts with empty storage were opened at 390×844 and 1440×900. Neither page was scrolled before this result was recorded.

| Question | 390×844 phone | 1440×900 desktop |
| --- | --- | --- |
| What does this do? | Creates a receipt from changes between student drafts. | Creates a receipt from changes between student drafts. |
| For whom? | Writing teachers checking how students used feedback. | Writing teachers checking how students used feedback. |
| What should I click first? | `Try it with sample data`. | `Try it with sample data`. |

The exact copy is `Create receipts from draft changes.`, `For writing teachers who need a quick record of how students used feedback.`, and `Try it with sample data`. On the phone, the H1 ends at 298 px, the audience sentence at 364 px, the primary action at 426 px, the result note at 533 px, and the final fact at 622 px. All required landing content fits inside 844 px. The desktop primary action ends at 715 px and the final fact at 844 px. **The landing first read passes.** F-3-5 below records the unsupported adjective `quick`; it does not prevent understanding.

## 2. Findings

### Blocking

#### F-3-1 — The demo first screen does not show the product's result

- **Exact quote/location:** live `/?demo=1` and `/demo` at 390×844: `Try a completed revision receipt` and `Review Jordan’s changed passages and reflections, then finish or export the sample receipt.` The first viewport contains the banner, shared header, instructions, and only the `Jordan K.` field at 767–815 px. `Community park argument` starts at 899 px, the first feedback goal at 1,108 px, the first changed passage at 3,707 px, and the first reflection card at 4,293 px. On desktop, the first changed passage still starts at 2,464 px.
- **Why this fails:** the required one-click demo must immediately show realistic use and the product's value. A first-time phone visitor sees an ordinary prefilled identity form, not before/after evidence, a reflection, or a receipt. The heading is also inaccurate: the receipt is not completed or visible until the visitor reaches and activates `Finish the receipt` near the bottom. The current automated demo test checks that sample elements exist anywhere in the DOM; it never checks the first viewport.
- **Concrete fix:** open demo mode on a compact completed receipt or evidence preview. Put one realistic before/after passage, its feedback goal, and the student reflection inside the first 844 px, with `Edit sample` below. Keep the banner and isolation controls. Change the heading to match the state, and add a 390×844 test that asserts the evidence and reflection bounding boxes end within the initial viewport and that the receipt is already usable without another action.

### Major

#### F-3-2 — The classroom-content privacy claim is not proved by its test

- **Exact quote/location:** `/privacy/`: `No classroom content is transmitted to us.` Landing workspace: `We cannot see, recover, or grade them.` The nearest contract entry is `browser-only`, whose test only asserts that request URLs have the same origin and that demo text exists in local storage.
- **Why this fails:** same-origin traffic can still transmit drafts to the site's server. The declared test does not assert request methods, bodies, headers, fetch/XHR/beacon/WebSocket use, or the absence of draft/reflection strings. The live audit happened to observe only same-origin GET requests with no bodies, but the claim contract would not catch a later same-origin upload.
- **Concrete fix:** add an exact `no-classroom-content-transmission` claim, or narrow and strengthen `browser-only`. During the complete demo flow, record every request and assert that no fetch/XHR/beacon/WebSocket is made, every request body is empty, and no student name, draft, goal, or reflection appears in a URL, header, or body. Keep the separate storage assertions.

#### F-3-3 — `No analytics or tracking` is an unlisted privacy claim

- **Exact quote/location:** `/privacy/`, `What leaves your device`: `We do not add analytics or tracking.` No `.factory/claims.json` entry states this.
- **Why this fails:** this is a privacy promise a visitor can rely on. The same-origin-only test would allow same-origin analytics, so the statement is neither listed nor proved by the current suite.
- **Concrete fix:** add a `no-analytics-tracking` claim and a clean-context test that completes the demo while rejecting analytics requests, beacons, tracking storage/cookies, and telemetry code; or remove the sentence. The claim should name any narrowly allowed page-view request if one is later added.

#### F-3-4 — The personal-information claim is unlisted and too broad

- **Exact quote/location:** `/privacy/`, `Students and schools`: `The tool is designed for teacher-directed classroom use and does not knowingly collect personal information.` The preceding section says hosting may process an IP address and browser type.
- **Why this fails:** the broad statement has no claim entry or test and sits uneasily beside the disclosed technical request data. A visitor cannot tell whether “collect” excludes hosting logs.
- **Concrete fix:** replace it with the tested, scoped facts: `The app asks for no account and sends no classroom content. Hosting may process the technical request data listed above.` Ensure the content-transmission half is covered by the stronger test in F-3-2.

### Minor

#### F-3-5 — `quick` is an untested marketing adjective

- **Exact quote/location:** landing first-screen sentence: `For writing teachers who need a quick record of how students used feedback.`
- **Why this fails:** `quick` implies a speed outcome but gives no number and has no quantitative claim test. Removing it keeps the audience and job just as clear.
- **Concrete fix:** use `For writing teachers who need a record of how students used feedback.` If speed is important, publish and test a specific threshold.

#### F-3-6 — The landing skeleton has no limits/privacy section

- **Exact location:** live `/`, between `Make a revision receipt in three steps.` and the footer. The page ends without the required `What it does not do / privacy` section.
- **Why this fails:** privacy and limits appear as scattered facts and a form callout, but there is no scannable section after `How it works` that explains what the receipt does not prove. A visitor reviewing the landing page outside the form can miss the central human-review limitation.
- **Concrete fix:** add a plainly named section after `How it works`, such as `What a revision receipt does not prove`, covering local storage, no generated writing or automatic score, and the human-review limit, with a link to Privacy. Use only statements represented by claim entries.

## 3. Copy audit

Counting method: lexical tokens; hyphenated terms, URLs, commands, versions, and placeholders count as one word. Stable reader-facing sentences in the landing/app source are included, including conditional messages. Headings, controls, fragments, and terminology are checked after the tables.

### Landing and embedded product sentences

| Sentence | Words | Result |
| --- | ---: | --- |
| You’re offline. | 2 | Pass |
| The tool still works; exports stay on this device. | 9 | Pass |
| Use the sample receipt without changing your own browser work. | 10 | Pass |
| Create receipts from draft changes. | 5 | Pass |
| For writing teachers who need a quick record of how students used feedback. | 13 | **Flag F-3-5** |
| Loads a completed sample; your real browser work stays separate. | 10 | **Flag F-3-1: the first demo view is not a completed receipt** |
| Drafts are compared in this browser. | 6 | Pass |
| No account needed. | 3 | Pass |
| No automatic score. | 3 | Pass |
| Export an HTML receipt. | 4 | Pass |
| Make a revision receipt in three steps. | 7 | Pass |
| Unfinished work saves in this browser as you type. | 9 | Pass |
| Required fields are marked with an asterisk. | 7 | Pass |
| Use initials if your classroom policy prefers. | 7 | Pass |
| Add up to three specific goals from the teacher’s feedback. | 10 | Pass |
| Paste the draft before feedback here… | 6 | Pass; placeholder |
| Paste the draft after feedback here… | 6 | Pass; placeholder |
| Local-only: these drafts are compared on your device. | 8 | Pass |
| We cannot see, recover, or grade them. | 7 | **Claim coverage gap F-3-2** |
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
| Review Jordan’s changed passages and reflections, then finish or export the sample receipt. | 13 | **Flag F-3-1: the named content is below the first screen** |
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

No sentence exceeds 22 words and no banned term appears. F-3-5 is the one marketing-adjective flag.

Headings name their tasks except the inaccurate demo H1 `Try a completed revision receipt` in F-3-1. Controls name actions or results: `Try it with sample data`, `Start a blank receipt`, `Reset demo`, `Start for real`, `Add another goal`, `Choose .txt or .md`, `Find changed passages`, `Finish the receipt`, `Download receipt`, `Print / save PDF`, `Copy summary`, and `Clear this device and start over`. `Start for real` is the prescribed demo-exit label. No button wording finding remains.

Terminology is consistent: **draft** = one writing version; **feedback goal** = the teacher's revision request; **changed passage** = before/after evidence; **reflection** = the student's explanation; **revision receipt** = the exported/reviewed result; **demo** = the isolated mode; **sample** = its seeded data.

## 4. Demo and sandbox

**Isolation passes; first-screen usefulness fails under F-3-1.**

- The landing primary action opens `/?demo=1` in one click. `/demo` is an equivalent direct URL.
- Jordan K., *Community park argument*, two specific feedback goals, two changed passages, selected evidence, and two reflections are realistically seeded.
- The first phone viewport does not show the assignment, feedback goals, changed passages, or reflection. The first changed passage is 3,707 px down. The first desktop viewport shows identity fields and one goal, but its first changed passage is 2,464 px down.
- The persistent banner says `Demo — sample data, nothing is saved` and contains `Reset demo` and `Start for real`.
- Editing `Jordan K.` to `DEMO CHANGED`, then resetting, restored the seed.
- Seeded real work remained byte-for-byte unchanged while demo work used `demo:revision-receipts-work-v1`.
- `Start for real` deleted only the demo key and reopened the seeded real work.
- The full live edit/reset/exit audit made only same-origin GET requests with empty bodies. No third-party font, script, API, analytics request, POST, or draft-bearing request was observed.
- After one online visit, a service-worker-controlled `/demo` reloaded with HTTP 200 offline and retained Jordan K.'s sample.

## 5. Claims

`npm run test:claims` was run from clean clone `/tmp/revision-receipts-review3.L6d4lH` at the reviewed commit. It rebuilt the product and invoked every command in `.factory/claims.json`.

| Claim ID | Result | Evidence |
| --- | --- | --- |
| `demo-sandbox` | PASS | Reset/exit preserved seeded real work and removed only demo storage. |
| `no-account` | PASS | Completed the sample without sign-in controls. |
| `free-use` | PASS | Completed and downloaded without payment controls or billing requests. |
| `revision-workflow` | PASS | Two changes, evidence choices, reflections, and receipt sections were present. |
| `browser-only` | PASS as written | Requests were same-origin and sample data occupied only demo storage; F-3-2 records the weaker-than-published assertion. |
| `local-autosave` | PASS | An edited demo name survived reload in demo storage. |
| `receipt-export` | PASS | The self-contained HTML contained the expected evidence and reflection. |
| `evidence-not-score` | PASS | Receipt showed evidence and reflection without a score or grade. |
| `human-review-limit` | PASS | Receipt displayed the human-review limitation. |
| `no-writing-generation` | PASS | Output reproduced supplied passages and reflections. |
| `no-plagiarism-detection` | PASS | No plagiarism control or result appeared. |
| `clear-real-work` | PASS | Clearing real work preserved demo storage. |
| `offline-reload` | PASS | A dedicated browser context reloaded the controlled demo offline. |

No declared test fails, so there is no blocking claim-test failure. F-3-2 identifies an inadequate observable assertion. F-3-3 and F-3-4 are unlisted live privacy claims. F-3-5 is an unlisted qualitative speed claim.

## 6. Earlier finding and polish audit

Every finding in `.factory/review-1.md` and `.factory/review-2.md`, plus both polish receipts and the prior handoff, was checked on the live site and in source.

| Earlier finding | Live and code result |
| --- | --- |
| F-1-1 mobile landing first screen | Fixed. Job, audience, action, result note, and all three facts end by 622 px. |
| F-1-2 false empty-workspace docs | Fixed. README and demo docs describe saved work or a blank receipt. |
| F-1-3 no visible demo H1 | Fixed. Demo has one visible H1 and ordered headings. F-3-1 concerns what that first screen shows, not H1 presence. |
| F-1-4 vague privacy chip | Fixed. It reads `Drafts stay in this browser`. |
| F-1-5 unlisted free claim | Fixed. `free-use` is listed and passes. |
| F-1-6 unlisted clear-work claim | Fixed. `clear-real-work` is listed and passes. |
| F-1-7 unlisted plagiarism limitation | Fixed. `no-plagiarism-detection` is listed and passes. |
| F-1-8 route focus | Fixed. Privacy navigation and browser Back focus and announce the destination H1. |
| F-1-9 abstract step heading | Fixed. It reads `Explain why each passage changed`. |
| F-1-10 abstract receipt heading | Fixed. Screen and export headings name the receipt. |
| F-1-11 footer jargon | Fixed. Footer says `Compare two drafts and save a revision receipt.` |
| F-1-12 storage jargon in setup | Fixed. Exact keys are confined to the technical note. |
| F-1-13 service-worker jargon | Fixed. README names the usable offline outcome. |
| F-1-14 Node range | Fixed. README and package metadata agree. |
| F-1-15 `teacher goals` drift | Fixed. Product copy uses `feedback goals`. |
| F-2-1 duplicate landmark names | Fixed. Workspace and explanation have distinct names; live axe reports zero violations. |
| F-2-2 inconsistent mobile header | Fixed. All five routes use `Try the demo`, `Make a receipt`, `Privacy` in that order. |
| F-2-3 narrow mobile header target | Fixed. Live header links measure at least 116×64 px. |

No earlier finding is reopened. F-3-1 through F-3-6 are new checks or stricter claim-contract checks.

## 7. Structure, accessibility, and visual identity

- `/`, `/demo`, `/privacy/`, `/terms/`, and the HTTP 404 have route-specific titles, one H1, one main landmark, `lang=en`, descriptions, canonicals, OG/Twitter metadata, SVG and Apple icons, and the 1200×630 product image.
- An unknown URL returns the designed paper/highlighter page with HTTP 404 and working routes back.
- All actual links crawled from the product, policy, terms, and 404 pages return 200; the two email links are explicit `mailto:` links. In-page targets exist.
- Browser navigation to Privacy and Back focuses and announces each destination H1.
- The standard URL verifier passes `/` and `/?demo=1` with zero console errors, missing alt text, or unnamed buttons.
- Playwright axe reports zero violations of any impact on all five tested views. At 390 px there is no horizontal overflow, and all shared-header targets exceed 44×44 px.
- The deployed response includes CSP, `frame-ancestors` as a header, HSTS, Referrer-Policy, Permissions-Policy, and `X-Content-Type-Options`.
- Reduced-motion handling and visible focus styles remain in source. Offline reload passes.
- Initial app JavaScript is 19.45 kB raw / 6.88 kB gzip; CSS is 17.26 kB raw / 4.39 kB gzip. `dist/` is produced.
- The recycled-paper field, black rules, red pencil, lime highlighter, carbon-copy blue, hard shadows, and original classroom still-life remain distinct and match `.factory/design.md`. This is not a generic SaaS template.
- F-3-6 records the missing limits/privacy section in the required landing order.

## 8. Missed leverage

No missed-leverage finding. The brief explicitly forbids generated writing and hidden scoring, so an AI drafting or automatic assessment step would conflict with the job. The tool already imports `.txt`/`.md`, exports standalone HTML, prints/saves PDF, and copies a summary. Sync would change the local-first privacy model, and the brief's smallest useful product is one document pair, so class-level cloud storage is not an obvious missing feature for this release.

## 9. Verification run

From the clean clone:

```text
npm ci                              PASS — 161 packages, 0 vulnerabilities
npm run test:claims                 PASS — all 13 claim commands
npm test                            PASS — 6/6
npm run lint                        PASS
npm run typecheck                   PASS
npm run build                       PASS — dist/ produced
npm run test:e2e -- --reporter=list PASS — 38 passed, 6 intentional project skips
```

Live verification additionally covered cold phone/desktop geometry, demo first-viewport geometry, seed/reset/exit isolation, request methods and bodies, offline reload, route metadata, unknown-route status, link crawling, focus/history, mobile target sizes, horizontal overflow, console/page errors, security headers, and axe scans.

## What would make this perfect

Make the first demo viewport show a real before/after passage and its reflection, and start in the state named by the demo heading. Strengthen the classroom-content network test, list and test the no-tracking statement, narrow the personal-information wording, remove `quick`, and add the required landing limits/privacy section. Then rerun the complete cold-read, demo, claim, privacy, routing, accessibility, history, and copy audit. Those verified changes would leave nothing identified in this round.
