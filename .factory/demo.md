# Revision Receipts demo

## Open it

Use `https://revision-feedback-receipts.sociobot.in/?demo=1` or choose **Try it with sample data** on the landing page. The `/demo` route remains an equivalent direct link.

## Sample workspace

The demo opens a completed revision receipt for Jordan K.’s *Community park argument*. Its first view shows a feedback goal, a before-and-after passage, and Jordan’s reflection. The full sample contains two feedback goals, drafts, selected evidence, and reflections. Visitors can export, edit, reset, and take the sample offline after the first visit.

## Isolation and controls

The demo uses only the browser-local `demo:revision-receipts-work-v1` key. It never reads or writes the real workspace key, `revision-receipts-work-v1`.

- **Reset demo** restores the shipped sample in the demo namespace.
- **Start for real** deletes the demo copy and opens your saved browser work. If none exists, it opens a blank receipt.
- Leaving the demo does not copy sample text into real work.
