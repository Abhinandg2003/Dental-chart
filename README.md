# Dental Chart

An interactive dental chart built with Next.js (App Router), React, and Tailwind CSS.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## How it's structured

- **`lib/toothLayout.ts`** — universal tooth numbering (1–32), tooth types
  (molar / premolar / canine / incisor), and the geometry math that arranges
  32 teeth into upper/lower arches. Also has the path builders
  (`roundedRectPath`, `ellipsePath`) used to draw each tooth shape.
- **`components/ToothChart.tsx`** — renders the SVG. For every tooth it draws
  a `<g>` containing, in order:
  - `teeth{n}shadow` — a dark offset copy behind the tooth
  - `teeth{n}` — the **only clickable/selectable** path
  - `teeth{n}hole` (molars) or `teeth{n}hole1` / `teeth{n}hole2` (premolars) —
    decorative occlusal grooves
  - `teeth{n}highlight` — a light gloss shape on top

  Selection uses a single click handler on the `<svg>` with event
  delegation: it reads `event.target.id` and only treats it as a selection
  if the id matches `^teeth\d+$` exactly. Clicking a shadow/highlight/hole
  path is intentionally a no-op.
- **`components/ToothForm.tsx`** — the per-tooth form (treatment: none / root
  canal / remove, plus notes). Selecting "Root canal" sets that tooth's fill
  to yellow; "Remove" sets it to red; both are stored in React state.
- **`components/PatientForm.tsx`** — patient name/age/gender/phone/notes.
- **`app/page.tsx`** — owns all state in memory (`useState`):
  - `records: Record<toothNumber, { procedure, notes }>`
  - `patient: PatientInfo`
  - `selected: number | null`

Everything is client-side only for now (no backend/database) — refreshing
the page resets the data, as requested. When you're ready to persist this,
`records` and `patient` are the two pieces of state to send to an API route
/ database.
