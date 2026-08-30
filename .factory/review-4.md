# Adversarial first-read review 4 — Revision Receipts

**Verdict: PASS**

Reviewed 2026-08-30 against <https://revision-feedback-receipts.sociobot.in/> and a clean clone at `f85a5ab0447d52a066efae98c0b8a992b1d48f0a`. Product code was not changed. There are zero findings.

## Cold first read

Fresh Chromium contexts opened `/` without scrolling at 390×844 and 1440×900.

| Question | 390×844 phone | 1440×900 desktop |
| --- | --- | --- |
| What does this do? | Creates a receipt from changes between two drafts. | Creates a receipt from changes between two drafts. |
| For whom? | Writing teachers checking how students used feedback. | Writing teachers checking how students used feedback. |
| What should I click first? | **Try it with sample data**. | **Try it with sample data**. |

The phone’s exact first-screen copy is `Create receipts from draft changes.`, `For writing teachers who need a record of how students used feedback.`, `Try it with sample data`, and `Loads a completed sample; your real browser work stays separate.` The action begins at 382 px and the three plain facts end at 622 px. This passes the cold-read gate.

## Copy audit

Counts are whitespace-delimited words after removing presentation punctuation. All sentences are at or below 22 words. The current source and live rendering contain no banned marketing term, jargon-only/mood heading, inconsistent core term, or non-result-naming button. `draft`, `feedback goal`, `changed passage`, `reflection`, `revision receipt`, `demo`, and `sample` retain one meaning throughout.

### Landing and product sentences

| Sentence | Words | Result |
| --- | ---: | --- |
| You’re offline. | 2 | Pass |
| The tool still works; exports stay on this device. | 9 | Pass |
| Use the sample receipt without changing your own browser work. | 10 | Pass |
| Create receipts from draft changes. | 5 | Pass |
| For writing teachers who need a record of how students used feedback. | 12 | Pass |
| Loads a completed sample; your real browser work stays separate. | 9 | Pass |
| Drafts are compared in this browser. | 6 | Pass |
| No account needed. | 3 | Pass |
| No automatic score. | 3 | Pass |
| Export an HTML receipt. | 4 | Pass |
| Unfinished work saves in this browser as you type. | 9 | Pass |
| Required fields are marked with an asterisk. | 7 | Pass |
| Use initials if your classroom policy prefers. | 7 | Pass |
| Add up to three specific goals from the teacher’s feedback. | 10 | Pass |
| These drafts are compared on your device. | 7 | Pass |
| We cannot see, recover, or grade them. | 7 | Pass; local-only/no-transmission/no-score contracts |
| Review the detected changes, then choose the strongest passage for each goal and explain what you did. | 17 | Pass |
| The tool finds textual change; it does not judge quality or learning. | 12 | Pass |
| This reflection is included verbatim on the receipt. | 8 | Pass |
| Text changed and the student explained why. | 7 | Pass |
| It is evidence for a conversation—not proof of learning, authorship, or quality. | 13 | Pass |
| Keep one to three feedback goals beside the drafts. | 9 | Pass |
| Choose the before-and-after passage that best fits each goal. | 9 | Pass |
| Export a receipt for human review, not an automatic grade. | 10 | Pass |
| The tool only compares supplied drafts. | 6 | Pass |
| It does not generate writing or assign a score. | 9 | Pass |
| A receipt supports human review. | 5 | Pass |
| It does not prove learning, authorship, or quality. | 8 | Pass |
| Drafts stay in this browser. | 5 | Pass |
| Read the privacy policy. | 4 | Pass |
| Compare two drafts and save a revision receipt. | 8 | Pass |
| Original AI-generated hero artwork. | 4 | Pass; provenance |
| One changed passage and its reflection are ready to review. | 10 | Pass |
| In 1–3 sentences, explain the decision you made. | 8 | Pass |
| The explanation should be your own. | 6 | Pass |
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

Field labels, headings, sample passages, and other fragments are not sentences. Headings name their function: `Create your revision receipt`, `Explain why each passage changed`, `Make a revision receipt in three steps`, and `What a revision receipt does not prove`. Controls name their outcome, including `Try it with sample data`, `Find changed passages`, `Finish the receipt`, `Download receipt`, `Reset demo`, and `Start for real`.

### README sentences

| Sentence | Words | Result |
| --- | ---: | --- |
| Revision Receipts is a browser tool for secondary-school and college writing classes. | 12 | Pass |
| It helps teachers compare two drafts against 1–3 feedback goals and prepare a student reflection for review. | 17 | Pass |
| It is built for a teacher who needs to verify whether feedback was acted on without reading every draft side by side. | 22 | Pass at cap |
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
| The app sends no classroom content and adds no analytics or tracking. | 11 | Pass |
| “Clear this device and start over” removes the real working copy. | 11 | Pass |
| Downloaded or printed receipts are the user’s responsibility to handle under school policy. | 13 | Pass |
| See `/privacy` and `/terms`. | 4 | Pass |
| Technical note: the isolated sample uses `demo:revision-receipts-work-v1`; real work uses `revision-receipts-work-v1`. | 11 | Pass |

## Demo, sandbox, and privacy

**PASS.** One click on **Try it with sample data** opens `/?demo=1`. The first phone view already displays a completed Jordan K. receipt: a feedback goal, before-and-after passage, student reflection, **Edit sample**, and **Download sample receipt**. The persistent banner is present with `Demo — sample data, nothing is saved`, **Reset demo**, and **Start for real**.

With a seeded real workspace, the demo used only `demo:revision-receipts-work-v1`; the real key remained byte-for-byte unchanged. Reset restored `Jordan K.`. Start for real removed the demo key and restored `Real Student` from the real workspace. The fresh-context request log contained only same-origin `GET` requests for the page and static assets: no fetch/XHR, beacon, WebSocket, request body, third-party resource, tracker, or classroom text.

## Claims and quality gates

From clean clone `/tmp/revision-receipts-review4.pxU8hy`, `npm ci` passed with 0 reported vulnerabilities. `npm run test:claims` rebuilt the product and ran every declared command; all passed. The final Playwright run recorded `{ "status": "passed", "failedTests": [] }`. `npm test` passed 6/6; lint, typecheck, and build passed; `dist/` was created. Build output reports 7.19 KB gzip application JS and 4.76 KB gzip CSS.

| Claim ID | Result |
| --- | --- |
| `demo-sandbox` | Pass |
| `no-account` | Pass |
| `free-use` | Pass |
| `revision-workflow` | Pass |
| `browser-only` | Pass |
| `no-classroom-content-transmission` | Pass |
| `no-analytics-tracking` | Pass |
| `local-autosave` | Pass |
| `receipt-export` | Pass |
| `evidence-not-score` | Pass |
| `human-review-limit` | Pass |
| `no-writing-generation` | Pass |
| `no-plagiarism-detection` | Pass |
| `clear-real-work` | Pass |
| `offline-reload` | Pass |

All reliance-worthy landing/README claims map to this manifest; technical setup statements were checked against the source and build.

## Earlier findings and receipts

Every prior review, polish receipt, and handoff was read. Each former finding was confirmed fixed on live and in source.

| Finding | Current confirmation |
| --- | --- |
| F-1-1 | Phone first screen contains job, audience, action, result note, and facts by 622 px. |
| F-1-2 | Docs say Start for real restores saved work or a blank receipt. |
| F-1-3 | Demo has one visible H1. |
| F-1-4 | Header privacy fact is specific and listed. |
| F-1-5 | Free-use claim is listed and tested. |
| F-1-6 | Clearing real work is listed and demo-isolated. |
| F-1-7 | Plagiarism limitation is listed and tested. |
| F-1-8 | Route navigation and Back focus the destination H1. |
| F-1-9 | The step heading names the explanation task. |
| F-1-10 | Screen/export headings name the receipt. |
| F-1-11 | Footer uses the concrete revision-receipt description. |
| F-1-12 | Storage keys occur only in the technical note. |
| F-1-13 | README describes offline use without service-worker jargon. |
| F-1-14 | README/package Node ranges agree. |
| F-1-15 | Product copy consistently says `feedback goal`. |
| F-2-1 | Workspace and overview names are distinct; axe reports none. |
| F-2-2 | Mobile headers use the same labels and order on every route. |
| F-2-3 | Mobile header targets meet the size baseline. |
| F-3-1 | Demo begins with actual evidence/reflection. |
| F-3-2 | Classroom-transmission claim has a request-level test and live audit. |
| F-3-3 | No-tracking claim is listed and tested. |
| F-3-4 | Privacy wording is narrowed and scoped. |
| F-3-5 | `quick` is absent. |
| F-3-6 | Landing includes the limits/privacy section. |

## Structure, accessibility, and identity

**PASS.** Live `/`, `/demo`, `/privacy/`, `/terms/`, and `/404.html` each have the expected title, one H1, one main landmark, no phone overflow, zero axe violations, and no console errors. `/review-4-does-not-exist` returns HTTP 404 with the designed recovery page. All crawled same-origin links return 200; `mailto:` and anchors are explicit.

Metadata includes `lang=en`, description, canonical, Open Graph/Twitter data, favicon, Apple touch icon, and product social art. `robots.txt`, `sitemap.xml`, CSP response headers including `frame-ancestors`, HSTS, referrer policy, `nosniff`, and permissions policy are live. Privacy navigation focused the legal-page H1; browser Back focused `#hero-title`.

The warm paper, black rules, red-pencil correction color, lime highlighter, carbon blue, hard shadows, and original classroom still-life match `.factory/design.md`. The result is distinct from a generic SaaS template.

## Missed leverage

No finding. The brief forbids generated writing and hidden scoring. The product already provides the useful implied actions: paste or `.txt`/`.md` import, local autosave, HTML export, print/save PDF, and copy summary. Sync would conflict with the stated local-first privacy model.

## What would make this perfect

Preserve this evidence standard in future work: retain the 390 px cold-read order, a completed isolated demo, request-level privacy tests, and rerun all claims and clean-clone browser checks whenever copy, routing, storage, or export behavior changes. No current change is required.
