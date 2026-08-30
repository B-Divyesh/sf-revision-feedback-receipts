# Revision Receipts

Revision Receipts is a browser tool for secondary-school and college writing classes. It helps teachers compare two drafts against 1–3 feedback goals and prepare a student reflection for review.

It is built for a teacher who needs to verify whether feedback was acted on without reading every draft side by side. It does **not** generate writing, grade work, detect plagiarism, determine authorship, or treat textual change as proof of learning.

Live site: <https://revision-feedback-receipts.sociobot.in>

## Start with the sample

Open <https://revision-feedback-receipts.sociobot.in/?demo=1> or choose **Try it with sample data** on the landing page. The sample uses Jordan K.’s community-park argument with two feedback goals, changed passages, and reflections. The sample is stored separately from your own work. **Reset demo** restores the sample. **Start for real** deletes the demo copy and opens your saved browser work. If none exists, it opens a blank receipt.

The tool saves unfinished work in browser storage, exports a portable HTML receipt, and works offline after the first online visit. No account is needed. The receipt shows passages and reflections, not an automatic score. It does not generate writing, grade work, detect plagiarism, or determine authorship. Textual change is not proof of learning, authorship, or quality.

## Develop

Requires Node.js 20.19+ or 22.12+.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Test and build

```bash
npm test          # unit tests for passage comparison
npm run lint      # ESLint
npm run typecheck # TypeScript
npm run build     # type-check + production build -> dist/
npm run test:e2e  # Chromium desktop + 390 px mobile + axe checks
npm run test:claims # every published claim from a clean demo entry point
```

Playwright is pinned to `1.58.2`. If its Chromium binary is not already available, run `npx playwright install chromium` before the end-to-end suite.

The deployment command is exactly `npm run build`; Azure Static Web Apps should publish `./dist`. `public/staticwebapp.config.json` supplies security, routing, the designed 404 response, and cache headers. The build caches the site files needed for offline use.

## Privacy and classroom use

Drafts, goals, student identifiers, evidence choices, and reflections are stored in the current browser. The app sends no classroom content and adds no analytics or tracking. “Clear this device and start over” removes the real working copy. Downloaded or printed receipts are the user’s responsibility to handle under school policy. See [`/privacy`](https://revision-feedback-receipts.sociobot.in/privacy/) and [`/terms`](https://revision-feedback-receipts.sociobot.in/terms/).

Technical note: the isolated sample uses `demo:revision-receipts-work-v1`; real work uses `revision-receipts-work-v1`.

## Project notes

- Product brief: [`.factory/brief.json`](.factory/brief.json)
- Demo contract: [`.factory/demo.md`](.factory/demo.md)
- Claim contract: [`.factory/claims.json`](.factory/claims.json)
- Visual system and artwork provenance: [`.factory/design.md`](.factory/design.md)
- Build handoff: [`.factory/handoff.md`](.factory/handoff.md)
- License: [MIT](LICENSE)
