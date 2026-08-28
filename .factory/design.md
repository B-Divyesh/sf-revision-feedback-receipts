# Revision Receipts — visual thesis

## Direction and rationale

**Neo-brutalist classroom utility.** The product turns an otherwise invisible act—responding to feedback—into a concrete, inspectable artifact. Its visual language borrows from marked-up drafts, carbon-copy receipts, library slips, rubber stamps, and highlighter tape. Heavy black rules, square corners, offset shadows, and numbered steps make the workflow feel accountable and quick without pretending that revision can be reduced to a score. It should resemble a trusted tool on a teacher’s desk, not an AI writing assistant or a generic SaaS dashboard.

## Palette

- `paper` `#F4F0E6`: warm recycled-paper background; explicit single light mode.
- `sheet` `#FFFDF7`: reading surface.
- `ink` `#171713`: primary type and structural borders (14.5:1 on paper).
- `muted-ink` `#56564D`: secondary copy (6.5:1 on paper).
- `correction` `#E63B2E`: teacher’s red pencil; large accents and focus support, never status alone.
- `highlighter` `#D9FF57`: primary action and selected evidence (13:1 ink on accent).
- `blue-copy` `#BDE7F2`: old carbon-copy paper for informational panels.
- `success` `#18754A`, `warning` `#8A5200`, `danger` `#B42318`: paired with icons/labels.

The direction is deliberately single-mode: the warm paper field and literal ink/highlighter relationship are semantic, not ornamental. Every surface is explicitly painted, including form controls.

## Typography

- Display and controls: **Arial Black**, with `Arial Narrow`, `Arial`, and sans-serif fallbacks. Uppercase is reserved for short stamps, labels, and step numbers.
- Drafts and evidence: **Georgia**, then `Times New Roman`, serif. It keeps passages recognizable as student writing and separates content from controls.
- Body: **Arial**, system sans-serif. No network or bundled font files are required, keeping first load small and private.
- Scale: 14px micro-label, 16px body, 20px section heading, 28px subhead, clamp(40px, 8vw, 76px) display. Long text stays within 68 characters with 1.55 leading; diff passages use tabular line numbering.

## Spacing and structure

An 8px base rhythm (`4, 8, 16, 24, 32, 48, 64`). Content maxes at 1180px. The workflow is a single vertical ledger with three numbered sections. Inputs group by proximity before borders. Independent draft sheets and receipt evidence use 2px ink borders with a 6px hard shadow, like paper stacked on a desk. Touch targets are at least 44px. At 390px, the hero illustration becomes a compact masthead, draft columns stack, and actions span the available width.

## Interaction grammar

- Thick bordered controls move down/right by 2px when pressed, as if stamping paper.
- Goal cards expose a clear selected state with highlighter fill, checkbox, and numbered label.
- Draft inputs accept paste or `.txt`/`.md` files; filenames appear on the corresponding “paper” edge.
- Diff evidence uses red strike-through for removed wording and green/highlighter underlining for additions, with explicit “Before” and “After” labels so color is never the only cue.
- Receipt generation moves the user down the same ledger rather than opening a modal. Errors sit next to the relevant field and are summarized in an assertive live region.
- Export actions produce a portable HTML receipt and a print path; local work can be cleared only after a specific confirmation.

## Motion policy

State changes use 180ms transform/opacity transitions with physical origin: buttons depress, new receipt rows rise 8px from the paper below, and status stamps scale from 0.96 to 1. No looping animation. Under `prefers-reduced-motion: reduce`, scrolling is instant and all transforms/transitions are removed while borders, labels, and color retain hierarchy.

## Asset plan and provenance

The hero uses one original generated editorial still-life: overlapping marked-up paper drafts, a blank receipt strip, highlighter, and red pencil, composed as tactile cut paper. It clarifies the before → evidence → receipt mental model without showing a fake interface. Hand-authored SVG icons (upload, shield, download, print) use simple geometric strokes and are decorative beside text labels.

### Hero prompt sheet

- Use case: `stylized-concept`
- Subject: two overlapping student manuscript pages becoming a narrow receipt strip; visible abstract correction marks and highlight bars only.
- World/materials: analog classroom desk, recycled paper, red pencil, lime highlighter, black binder clip, cut-paper edges.
- Light/lens: top-down editorial still life, hard morning window shadow, shallow paper texture, crisp edges.
- Palette words: warm oat paper, near-black ink, correction red, acid-lime highlighter, pale carbon blue.
- Composition: landscape, objects weighted to the right with breathing room, no readable copy.
- Negative list: no people, hands, screens, logos, brands, legible text, handwriting words, watermark, gradients, glossy 3D, photoreal student data.

Generation command: `/opt/fleet/lib/gen-image.sh "<prompt derived from sheet>" assets/src/hero-receipt.png 1536x1024 high` using the factory image deployment. Generated 2026-08-28. The selected image is original AI-generated artwork for this product; reviewed for accidental text, brands, people, and misleading UI. Source prompt is retained beside the image in `assets/src/hero-receipt.json`. Delivery exports are WebP with explicit dimensions and responsive variants, each under 300 KB.

## Performance treatment

Vanilla TypeScript, no runtime dependencies, system fonts, one responsive WebP illustration, and hand-authored CSS. The initial JS target is below 60 KB gzip and CSS below 25 KB. The service worker precaches the shell; generated receipt data never leaves the browser.
