# QA Inspection Portal V2 — Cape Town Logistics Warehouse Facility (EC0148)

This repo is scoped to **one project only**: the construction quality-control
inspection portal for EC0148. Nothing in here relates to any other app or
platform Joshua Senosky (senoskyjj@gmail.com) is building — if a task
references a different product, it belongs in that product's own repo, not
this one.

## What this is

A React SPA (Create React App) + Google Apps Script backend + Google Sheets
data store. Booking-first model: engineer/foreman bookings are the parent
record; findings, NCRs, cube tests, and documents all link to a booking.
Deployed to GitHub Pages via the `gh-pages` branch.

- `src/` — React app (see `README.md` for the tab-by-tab feature list)
- `backend/Code.gs` — Apps Script backend, deployed manually by Joshua from
  the Apps Script editor (not by this repo's CI/CD)
- `src/data/sansClauses.js` — SANS/SANRAL/NHBRC clause reference dictionary

## Hard constraints — do not violate these

1. **`src/config.js`'s `SCRIPT_URL` must never be overwritten** with a
   placeholder. If a future zip/import touches this file, re-paste the real
   Apps Script URL before deploying.
2. **Never create a new Apps Script deployment.** When `backend/Code.gs`
   changes, Joshua edits the *existing* deployment (Apps Script editor →
   Deploy → Manage deployments → pencil icon → Version: New version →
   Deploy). A new deployment issues a new URL and breaks `config.js`. Claude
   cannot perform this step — it happens in Joshua's Google account, not in
   this repo. Always tell him explicitly when `Code.gs` changed and needs
   redeploying.
3. **Joshua works from an iPad only** — no local machine, no terminal
   access outside this session. Don't suggest local-only workflows.
4. **Exports (Excel/PDF) are Joshua-only for now.** No manager/client access
   or sharing until he explicitly says otherwise.
5. **`src/apiKey.js` must only be imported by `src/api.js`.** It holds the
   shared secret that gates every backend action except the public booking
   form's two restricted actions (`getBookingFormOptions`,
   `submitBookingRequest`). `src/index.js` uses dynamic `import()` (not
   static imports) specifically so the booking-link page and the main app
   compile into separate JS bundles — this is what keeps the key out of the
   bundle served to anyone who only has the shareable booking link. Don't
   collapse that back into static imports without preserving the split.
6. **The public booking form (`src/BookingRequestForm.js`, reached via
   `?form=booking`) has no login by design** — it's shared over WhatsApp to
   engineers/foremen. Any change to it must keep it restricted to the two
   public backend actions and never let it reach PII (phone numbers,
   engineer/employer-rep lists) or overwrite existing records.

## Known follow-ups (not yet done)

- Booking form has no offline retry queue (unlike the rest of the app) —
  a failed submit on weak site signal currently just shows an error.
- `TodayTab.js` (~580 lines) should split into per-form files
  (`BookingForm`, `FindingForm`, `NCRForm`, `CubeForm`, `DocForm`).
- "Open" status counts for NCRs/Findings are computed inconsistently across
  `App.js`, `DashboardTab.js`, `NCRTab.js`, `FindingsTab.js` — should be one
  shared predicate.
- SANS clause numbers and tolerance values in `sansClauses.js` were
  generated from general knowledge of how these standards are structured,
  **not verified against real SANS/ISO document text**. Treat them as a
  navigation aid, not a citation source, until cross-checked against
  Joshua's physical binders.
- Excel export (`excelExport.js`) writes fields straight into cells with no
  formula-injection escaping (the backend now has this via
  `escapeFormulaValue`, the frontend export path does not).

## Working conventions

- Commit source to `main`. `npm run deploy` only pushes the compiled build
  to `gh-pages` — it never touches `main`. Don't confuse "deployed" with
  "committed."
- Don't touch the Apps Script deployment from this session — front-end/
  GitHub changes only, unless Joshua explicitly asks otherwise.
