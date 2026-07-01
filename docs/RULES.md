# Rules & Instructions — Quality Platform (EC0148)

This is a plain-language record of every instruction Joshua has given about
this repo, so he can check it for mistakes or misunderstandings and correct
anything wrong. Update this file whenever a rule changes — don't just change
behavior silently.

**How to use this:** read through, and for anything wrong, unclear, or that
sounds off, tell Claude the rule number and what it should say instead.

---

## A. Scope — what this repo is and isn't

1. This repo (`senoskyjj-beep/quality-platform`) is for **one project only**:
   the QC inspection portal for the Cape Town Logistics Warehouse Facility,
   EC0148. Nothing about the Jeremiah Generation Youth platform, the
   financial program, or any other product belongs here.
2. If a task in a session against this repo references a different product,
   it should be redirected to that product's own repo — not actioned here.
3. Each of Joshua's platforms should have its own repo, with its own
   instructions/docs living in that repo — not mixed together.

## B. Backend / Apps Script deployment

4. **Never create a new Apps Script deployment.** When `backend/Code.gs`
   changes, Joshua edits the *existing* deployment: Apps Script editor →
   Deploy → Manage deployments → pencil icon → Version: New version →
   Deploy. A brand-new deployment issues a new URL and breaks
   `src/config.js`.
5. Claude cannot perform the Apps Script redeploy step — it happens in
   Joshua's own Google account, not in this repo. Claude must always tell
   him explicitly, in plain terms, when `Code.gs` has changed and needs
   redeploying.
6. `src/config.js`'s `SCRIPT_URL` must never be overwritten with a
   placeholder value. If a future zip/import touches this file, the real
   Apps Script URL must be re-pasted before deploying.
7. Don't touch the Apps Script deployment itself from a coding session —
   front-end/GitHub changes only, unless Joshua explicitly says otherwise.

## C. How Joshua works

8. Joshua works from an **iPad only** — no local machine, no terminal
   access outside of this kind of session. Don't suggest local-only
   workflows (e.g. "run this command on your laptop").
9. `npm run deploy` only pushes the compiled build to the `gh-pages`
   branch — it never touches `main`. "Deployed" and "committed to main"
   are two different things and shouldn't be confused.

## D. Access control / who sees what

10. **Exports (Excel/PDF) are Joshua-only for now.** No manager or client
    access or sharing until he explicitly says otherwise.
11. "All exes must come through me" — Joshua is the only one who
    generates/sends reports right now. The long-term plan is that the
    manager may get exports via phone/laptop/a live view later, but that
    hasn't been turned on yet.
12. The public booking form (`?form=booking`, shared over WhatsApp to
    engineers/foremen) is intentionally **login-free** — but it must never
    be able to see phone numbers, engineer/employer-rep lists, or overwrite
    existing records. It should only ever be able to create a new Pending
    booking.

## E. Security

13. The platform holds **company and private information** and must be
    kept secure. (Stated directly — this is a standing priority, not a
    one-off request.)
14. Anything reachable by the public booking link must be treated as
    "anyone on site could see/do this" — it should never carry the same
    access as the main app.

## F. Workflow expectations for Today's Bookings

15. Today's Bookings should support **two ways in**: uploading the day's
    I&TN Excel spreadsheet, or manually typing a booking (e.g. from a
    WhatsApp message) during the day.
16. Once a booking exists, the page must be **editable** — Joshua needs to
    be able to change the booking, set its status (Conformant /
    Nonconformant / Cancelled / Rejected) via a dropdown as the day
    progresses, and edit/add cube test results, regardless of what
    inspection type the booking was logged under.
17. A shareable booking link should let engineers/foremen submit a booking
    directly from their phone, with these fields: date, time, area,
    structure type + reference number (e.g. C4, B2, F1), foreman, and
    inspection type. No client/employer-rep field on this form.

## G. Documentation & citation caveats (flag for verification)

18. ⚠ The SANS/SANRAL/NHBRC clause numbers and specific tolerance values in
    `src/data/sansClauses.js` were written from general knowledge of how
    these standards are typically structured — **not verified against real
    SANS/ISO/SANRAL/NHBRC document text**. Joshua has not yet supplied the
    actual clause text from his physical binders for cross-checking. Treat
    this file as a navigation aid, not a citation source, until verified.

---

## Notes on rules that came from Claude's own judgement, not a direct instruction

These weren't things Joshua told Claude to do — they're technical decisions
made in service of rule #13 (security) and #4/#6 (deployment safety). Flagged
separately so Joshua can confirm he's fine with the approach, since he didn't
ask for these specifically:

- `src/apiKey.js` may only ever be imported by `src/api.js`, and the public
  booking page must never import it — this is what keeps the internal
  backend key out of the JS bundle shared over WhatsApp.
- The main app and the public booking page are built as two separate JS
  bundles (via dynamic `import()` in `src/index.js`) specifically to
  enforce the point above.

---

*If anything above is wrong, outdated, or doesn't match what you actually
meant, tell Claude the number and the correction — this file should always
reflect the real, current rules, not a stale first draft.*
