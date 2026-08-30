# Adversarial first-read review 1 — Revision Receipts

**Verdict: FAIL**

Reviewed 2026-08-30 against the live site at <https://revision-feedback-receipts.sociobot.in> and repository commit `86a8b6f5c9aa6bb4f0ede7d7ba9fefc0b3b0ae29`.

The claim tests and core workflow pass. The product still fails the required cold mobile read: at 390×844, the first screen does not say what the product does, who it serves, or what to click. There are 15 findings below, including one blocking finding and four published claims that are absent from or broader than `.factory/claims.json`.

## 1. Cold first screen

Fresh Chromium contexts were used with empty browser state. Neither page was scrolled before recording this result.

| Question | 390×844 phone | 1440×900 desktop |
| --- | --- | --- |
| What does this do? | **Cannot answer.** The viewport shows only the wordmark, `Private by default`, and a large marked-up-paper image. | It creates a receipt showing changes between student drafts. |
| For whom? | **Cannot answer.** No audience copy is visible. | Writing teachers checking how students used feedback. |
| What should I click first? | **Cannot answer.** No action is visible. | `Try it with sample data` is the clear first action. |

Exact mobile geometry confirms the failure: the image starts at 128 px and occupies 863 px vertically; the H1 starts at 1,056 px; the audience sentence starts at 1,203 px; and the primary sample action starts at 1,291 px. The 844 px first viewport therefore contains none of the required explanation or action.

The desktop first screen is clear. Its exact copy is `Create receipts from draft changes.`, `For writing teachers who need a quick record of how students used feedback.`, and `Try it with sample data`.

## 2. Findings

### Blocking

#### F-1-1 — The phone first screen is only an image

- **Location/quote:** live `/` at 390×844; the only readable product copy before scrolling is `Revision Receipts` and `Private by default`. The informative H1, `Create receipts from draft changes.`, begins at 1,056 px. The primary action begins at 1,291 px.
- **Why this fails:** a phone visitor cannot identify the job, audience, or first action within one screen. It also makes the required one-click demo undiscoverable during the 30-second first read. This regresses the previous handoff's “plain first screen” resolution on the required mobile viewport.
- **Concrete fix:** keep `.hero-copy` before `.hero-art` at widths below 780 px and set the responsive image to `height: auto`. The first 844 px must contain the H1, audience sentence, `Try it with sample data`, its result sentence, and the three short facts. Add a 390×844 regression that asserts those elements' bounding boxes are within the initial viewport.

### Major

#### F-1-2 — README and demo documentation falsely promise an empty workspace

- **Location/quote:** README: `Start for real discards the sample workspace and returns to the empty tool.` `.factory/demo.md`: `Start for real deletes the demo namespace and opens the empty real workspace.`
- **Why this fails:** with a seeded real record, `Start for real` correctly restored that record. It did not open an empty workspace. A visitor could read the current wording as a warning that existing work will disappear.
- **Concrete fix:** use `Start for real deletes the demo copy and opens your existing browser workspace, or a blank receipt if you have no saved work.` in both documents. Keep the current isolation behavior and claim test.

#### F-1-3 — The demo route has no visible H1

- **Location/quote:** live `/demo`; the only DOM H1 is `Create receipts from draft changes.`, inside `.hero`, while `.demo-mode .hero { display: none; }`. The visible outline starts at H3 `Name the work and goals` because `.section-intro` and its H2 are also hidden.
- **Why this fails:** the demo is a real route but has no page headline in its visual or accessibility tree. Its visible heading hierarchy begins at level 3, so a screen-reader heading list does not identify the page.
- **Concrete fix:** add one visible demo H1 such as `Try a completed revision receipt`, followed by one short instruction. Make the step headings H2 beneath it, or retain a visible H2 wrapper before the H3s. Add a test that `/demo` has exactly one visible H1 and no skipped heading levels.

#### F-1-4 — `Private by default` is vague and broader than the tested claim

- **Location/quote:** header chip on every landing/demo load: `Private by default`.
- **Why this fails:** it does not say what is private or what “default” excludes. The listed `browser-only` claim proves that demo draft text uses browser storage and that the tested flow sends same-origin requests; it does not prove a general privacy claim. The privacy page also states that hosting may process IP address, request time, and browser type.
- **Concrete fix:** replace it with the listed, testable fact `Drafts stay in this browser`, or add a narrowly worded claim and a request/storage test covering the exact statement.

#### F-1-5 — `Free classroom tool` is an unlisted claim

- **Location/quote:** landing eyebrow: `Free classroom tool`.
- **Why this fails:** price is a fact a visitor can rely on, but no `.factory/claims.json` entry names or tests that the tool is free. `no-account` is not the same claim.
- **Concrete fix:** add a `free-use` claim whose clean-demo test completes and exports a receipt without billing or payment controls, or remove `Free` from the published copy.

#### F-1-6 — Clearing real work is an unlisted claim

- **Location/quote:** README: `“Clear this device and start over” removes the real working copy.`
- **Why this fails:** this destructive-data behavior has no claim entry or tagged clean-state test. The demo reset test exercises a different storage key and path.
- **Concrete fix:** add a `clear-real-work` claim test that seeds the real key, accepts the confirmation, verifies only that key is deleted, reloads to an empty form, and confirms demo storage is untouched.

#### F-1-7 — The plagiarism limitation is unlisted and untested

- **Location/quote:** README: `It does not generate writing, grade work, detect plagiarism, or determine authorship.`
- **Why this fails:** the listed tests cover supplied-only writing, no score, and authorship limits. None names or verifies the separate assertion that the tool does not detect plagiarism.
- **Concrete fix:** either remove `detect plagiarism` from this sentence or add a limitation claim whose test confirms no plagiarism result, control, or wording appears through the completed workflow.

### Minor

#### F-1-8 — Route changes do not move focus to the new page heading

- **Location/quote:** following the live header `Privacy` link from `/` loads `/privacy/` with `document.activeElement === document.body`.
- **Why this fails:** the requested route-change behavior requires focus on the new H1 and an announcement. Back navigation works, but keyboard/screen-reader position is not explicitly restored to the new page content.
- **Concrete fix:** on each full route load, focus the H1 when navigation came from this site, or implement the specified route-change focus/announcement behavior and test the active element after navigation and back/forward.

#### F-1-9 — `Connect change to intention` is an abstract heading

- **Location/quote:** step 3 H3: `Connect change to intention`.
- **Why this fails:** heard outside its surrounding paragraph, it does not name the task or result. “Intention” is abstract compared with the UI's actual reflection field.
- **Concrete fix:** rewrite it as `Explain why each passage changed`.

#### F-1-10 — `Ready for review` does not name the section

- **Location/quote:** completed receipt H2 and downloaded receipt H1: `Ready for review`.
- **Why this fails:** a heading list does not say what is ready. It is a status slogan rather than a section name.
- **Concrete fix:** use `Review the finished revision receipt` on screen and `Revision receipt for <student>` in the downloaded document.

#### F-1-11 — The footer one-liner is compressed jargon

- **Location/quote:** `Local evidence for teacher-led revision review.`
- **Why this fails:** “local evidence” and “teacher-led revision review” require interpretation and read like a slogan. The line does not tell a new visitor what to do.
- **Concrete fix:** use `Compare two drafts and save a revision receipt.`

#### F-1-12 — The README exposes storage jargon before explaining the outcome

- **Location/quote:** `It uses the separate demo:revision-receipts-work-v1 browser-storage key.`
- **Why this fails:** “browser-storage key” is implementation jargon in the getting-started path.
- **Concrete fix:** use `The sample is stored separately from your own work.` Move the exact key to a later technical note.

#### F-1-13 — The README uses service-worker jargon

- **Location/quote:** `The build creates a versioned service worker that precaches the application shell.`
- **Why this fails:** “versioned service worker,” “precaches,” and “application shell” do not tell a reader the usable result.
- **Concrete fix:** use `The build caches the site files needed for offline use.` Put worker-update details in developer documentation only if needed.

#### F-1-14 — The stated Node requirement is imprecise

- **Location/quote:** README: `Requires Node.js 20 or newer.`
- **Why this fails:** installed Vite declares `^20.19.0 || >=22.12.0`; “20 or newer” wrongly includes unsupported Node 20.0–20.18 and Node 21.
- **Concrete fix:** use `Requires Node.js 20.19+ or 22.12+.` Add the same range to `package.json#engines` and verify it in CI.

#### F-1-15 — One core term changes from `feedback goals` to `teacher goals`

- **Location/quote:** the form and headings use `Feedback goals`, while How it works says `Keep one to three teacher goals beside the drafts.`
- **Why this fails:** the visitor must decide whether a teacher goal and feedback goal are the same object.
- **Concrete fix:** rewrite the latter as `Keep one to three feedback goals beside the drafts.`

## 3. Copy audit

Counting method: whitespace-delimited words after removing presentation punctuation. Hyphenated terms, URLs, command names, version numbers, and placeholders count as one word. This inventory includes every stable reader-facing sentence in the landing/app source, including conditional banners, errors, and status text. Labels, headings, actions, fragments, and sample student content are audited separately below.

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
| These drafts are compared on your device. | 7 | Pass |
| We cannot see, recover, or grade them. | 7 | Pass |
| Review the detected changes, then choose the strongest passage for each goal and explain what you did. | 17 | Pass |
| The tool finds textual change; it does not judge quality or learning. | 12 | Pass |
| This reflection is included verbatim on the receipt. | 8 | Pass |
| Text changed and the student explained why. | 7 | Pass |
| It is evidence for a conversation—not proof of learning, authorship, or quality. | 13 | Pass |
| Keep one to three teacher goals beside the drafts. | 9 | **Flag F-1-15** |
| Choose the before-and-after passage that best fits each goal. | 9 | Pass |
| Export a receipt for human review, not an automatic grade. | 10 | Pass |
| Local evidence for teacher-led revision review. | 6 | **Flag F-1-11** |
| Original AI-generated hero artwork. | 4 | Pass; provenance disclosure |
| Selected evidence is no longer available. | 6 | Pass |
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

No landing/app sentence exceeds 22 words. No banned marketing adjective appears.

### README sentences

| Sentence | Words | Result |
| --- | ---: | --- |
| Revision Receipts is a browser tool for secondary-school and college writing classes. | 12 | Pass |
| It helps teachers compare two drafts against 1–3 feedback goals and prepare a student reflection for review. | 17 | Pass |
| It is built for a teacher who needs to verify whether feedback was acted on without reading every draft side by side. | 22 | Pass at hard cap |
| It does not generate writing, grade work, detect plagiarism, determine authorship, or treat textual change as proof of learning. | 19 | **Flag F-1-7** |
| Live site: https://revision-feedback-receipts.sociobot.in | 3 | Pass |
| Open https://revision-feedback-receipts.sociobot.in/demo or choose Try it with sample data on the landing page. | 13 | Pass |
| The sample uses Jordan K.’s community-park argument with two feedback goals, changed passages, and reflections. | 15 | Pass |
| It uses the separate demo:revision-receipts-work-v1 browser-storage key. | 7 | **Flag F-1-12** |
| Reset demo restores the sample. | 5 | Pass |
| Start for real discards the sample workspace and returns to the empty tool. | 13 | **Flag F-1-2** |
| The tool saves unfinished work in browser storage, exports a portable HTML receipt, and works offline after the first online visit. | 21 | Pass |
| No account is needed. | 4 | Pass |
| The receipt shows passages and reflections, not an automatic score. | 10 | Pass |
| It does not generate writing, grade work, detect plagiarism, or determine authorship. | 12 | **Flag F-1-7** |
| Textual change is not proof of learning, authorship, or quality. | 10 | Pass |
| Requires Node.js 20 or newer. | 5 | **Flag F-1-14** |
| Open the local URL printed by Vite. | 7 | Pass |
| Playwright is pinned to 1.58.2. | 5 | Pass; confirmed in package metadata |
| If its Chromium binary is not already available, run npx playwright install chromium before the end-to-end suite. | 17 | Pass |
| The deployment command is exactly npm run build; Azure Static Web Apps should publish ./dist. | 15 | Pass; verified build instruction |
| public/staticwebapp.config.json supplies security, routing, the designed 404 response, and cache headers. | 11 | Pass; verified repository fact |
| The build creates a versioned service worker that precaches the application shell. | 12 | **Flag F-1-13** |
| Drafts, goals, student identifiers, evidence choices, and reflections are stored in the current browser. | 14 | Pass |
| Clear this device and start over removes the real working copy. | 11 | **Flag F-1-6** |
| Downloaded or printed receipts are the user’s responsibility to handle under school policy. | 13 | Pass |
| See /privacy and /terms. | 4 | Pass |

No README sentence exceeds 22 words. No banned marketing adjective appears.

### Headings, actions, and terminology

- Heading flags: `Connect change to intention` (F-1-9), `Ready for review` (F-1-10), and the footer slogan (F-1-11). Other headings name their section or task.
- Action audit: `Try it with sample data`, `Start a blank receipt`, `Reset demo`, `Start for real`, `Add another goal`, `Remove feedback goal <n>`, `Choose .txt or .md`, `Find changed passages`, `Finish the receipt`, `Download receipt`, `Print / save PDF`, `Copy summary`, and `Clear this device and start over` identify an action or result. No button finding remains.
- Terminology: **drafts** = the two writing versions; **feedback goal** = teacher revision request; **changed passage** = before/after evidence; **reflection** = student explanation; **revision receipt** = finished artifact. `teacher goals` is the one remaining core-term drift (F-1-15).

## 4. Demo and sandbox

**Demo implementation: PASS.** `/demo` is reachable in one click from the desktop first screen and by direct URL. On mobile the action is below the failed first screen (F-1-1), but the route itself behaves correctly once opened.

- The first demo viewport shows realistic populated fields: Jordan K., `Community park argument`, and two specific feedback goals.
- The persistent banner says `Demo — sample data, nothing is saved` and exposes `Reset demo` and `Start for real`.
- Editing Jordan K. to `CHANGED DEMO`, then selecting Reset, restored the shipped sample.
- A seeded real record remained byte-for-byte present while demo state used `demo:revision-receipts-work-v1`.
- `Start for real` removed only the demo key and restored the seeded real record.
- Every request recorded through the live demo/reset/exit flow used `https://revision-feedback-receipts.sociobot.in`; no third-party request occurred.
- The listed offline test loaded `/demo/`, waited for service-worker control, disabled the network, reloaded successfully, and used its own browser context.

## 5. Claims

`npm run test:claims` built the product once and ran every command declared in `.factory/claims.json` against the clean local production preview.

| Claim ID | Result | Observable evidence |
| --- | --- | --- |
| `demo-sandbox` | PASS | Real state survived demo editing/reset/exit; demo state was discarded. |
| `no-account` | PASS | Finished the two-goal sample without sign-in controls. |
| `revision-workflow` | PASS | Two changed passages, two evidence choices, two reflections, and two receipt sections. |
| `browser-only` | PASS | All workflow requests were same-origin and only the demo key contained sample data. |
| `local-autosave` | PASS | Edited demo name survived reload in demo storage. |
| `receipt-export` | PASS | Downloaded self-contained HTML contained the expected passage and reflection and no script/remote URL. |
| `evidence-not-score` | PASS | Receipt showed Before, After, and Student reflection with no score/grade output. |
| `human-review-limit` | PASS | Receipt stated that it is conversation evidence, not proof of learning, authorship, or quality. |
| `no-writing-generation` | PASS | Receipt contained the supplied passage and reflection text. |
| `offline-reload` | PASS | Dedicated Chromium context reloaded the controlled demo offline; mobile project intentionally skipped the duplicate worker test. |

No declared claim test failed. Unlisted or over-broad published claims remain in F-1-4 through F-1-7, so the product still has untested claim surface.

## 6. Earlier finding audit

No earlier `.factory/review-*.md` or `.factory/polish-*.md` files exist. The prior `.factory/handoff.md` was checked item by item against the live site and code.

| Earlier handoff item | Live/code result |
| --- | --- |
| Ten-claim contract and clean demo tests | Fixed; all ten declared commands pass. |
| One-click isolated demo with banner, reset, and separate key | Fixed once reached; storage isolation and controls pass. Mobile discovery is half-fixed and reopens as **F-1-1**. |
| Plain first screen and sample action | Fixed on desktop; **not fixed at 390 px**, reopened as **F-1-1**. |
| Real 404 and removal of broad SPA fallback | Fixed; `/not-a-real-page` returns HTTP 404 with the designed page. |
| Route titles, canonical, OG/Twitter, icons | Fixed on `/`, `/demo`, `/privacy/`, `/terms/`, and the 404 page. |
| Consistent footer and build identity | Fixed; Demo, Privacy, Terms, product line, factory credit, and build ID are present. |
| ESLint, typecheck, claim runner | Fixed; all commands pass. |
| Service-worker update and offline demo reload | Fixed; the dedicated claim test passes. |
| Validation, file input, escaped download, storage, boundary wrapping, keyboard basics, reduced motion | Fixed in the current code and full browser suite. The separate route-focus requirement remains **F-1-8**. |
| “No known defects” conclusion | Regressed by the mobile first-screen layout and superseded by this review. |

## 7. Structure, access, and identity

- Titles follow the required pattern and are 24–41 characters. Each route has a plain meta description, canonical, OG/Twitter metadata, SVG favicon, Apple touch icon, and the product-specific social image.
- `/`, `/demo`, `/privacy/`, and `/terms/` return 200. An unknown path returns 404 and a designed in-style page with routes back to the tool and sample.
- All crawlable internal HTTP links return 200; every in-page hash target exists. `mailto:` links were excluded as allowed. Deep links and the browser back button work.
- The root, privacy, terms, and 404 pages each expose one visible H1. `/demo` fails this check as F-1-3.
- Live axe checks found no serious or critical violations on the five designed routes at 390 px. Normal routes emitted no console errors. The deliberate unknown URL produced only the expected 404 resource message.
- The hard-rule, paper, red-pencil, lime-highlighter, and carbon-copy treatment is distinct and matches `.factory/design.md`; it is not a generic SaaS card/gradient template. Artwork provenance exists beside the source asset.
- Production output is small: app JS is 18.49 kB raw / 6.64 kB gzip and app CSS is 16.46 kB raw / 4.23 kB gzip.

## 8. Missed leverage

No missed-leverage finding. The brief explicitly forbids model-generated writing and hidden scoring, so an AI drafting/classification feature would work against the product contract. The expected import/export loop is present: `.txt`/`.md` import, HTML download, print/PDF, and summary copy. Cross-device sync would conflict with the current local-first privacy promise unless it were introduced as a clearly separate, consented feature.

## 9. Verification run

Commands run from the clean checked-out tree after `npm ci`:

```text
npm run test:claims       PASS — all 10 declared claim commands
npm test                  PASS — 6/6
npm run lint              PASS
npm run typecheck         PASS
npm run build             PASS — dist/ produced
npm run test:e2e -- --reporter=list
                          PASS — 27 passed, 3 intentional project skips
```

Fresh live browser evidence was also collected at 390×844 and 1440×900, with a same-origin request log, real/demo storage probes, Reset/Start-for-real checks, route metadata extraction, link crawl, back/deep-link checks, console capture, and axe scans.

## What would make this perfect

Move the mobile hero copy and sample action above a correctly sized illustration. Give `/demo` a real H1 and valid heading outline. Correct the Start-for-real documentation, narrow or test every remaining claim, move focus on route changes, and replace the five flagged jargon/heading/terminology lines. Then repeat this entire cold-read, claims, demo-isolation, copy, route, accessibility, and history review from a fresh context. Zero findings—not merely green tests—is the pass condition.
