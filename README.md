# QA Inspection Portal V2 — Cape Town Logistics Warehouse Facility (EC0148)

A booking-first quality inspection portal. The engineer's daily bookings are the
parent record; findings, NCRs, cubes, and documents all link to a booking.

**You are deploying this from an iPad using GitHub Codespaces — no laptop needed.**

---

## What this portal does

- **Today's Bookings** — type the engineer's WhatsApp bookings (or upload the I&TN xlsx). Each booking gets ONE status: Conformant / Nonconformant / Cancelled / Rejected.
- **Findings** — pure evidence trail. A Conformant booking CAN still have findings. Never auto-becomes an NCR — you decide.
- **NCRs** — can be raised by Joshua, Engineer, Foreman, Client, or QA Manager. Generates a Word NCR with up to 4 photos.
- **Cubes** — auto-created for every concrete pour booking. Fill in 7-day & 28-day results later.
- **Documents** — cube certs, sign-offs, delivery notes; tagged by uploader role.
- **Dashboard** — KPIs and charts for management.
- **ITP Register** — live roll-up by ITP (full Phase 2 tracking later).

---

## PART 1 — Set up the Google Sheets backend (do this FIRST)

1. On your iPad, go to **drive.google.com** → New → Google Sheets → blank sheet.
2. Rename it **QA Portal Data V2**.
3. In the sheet: tap **Extensions → Apps Script**. (If you don't see Extensions, request the desktop site in Safari/Chrome: tap **aA** in the address bar → **Request Desktop Website**.)
4. Delete any code in the editor. Open `backend/Code.gs` from this project, copy ALL of it, and paste it in.
5. Tap **Save** (disk icon).
6. In the function dropdown at the top, select **setupSheets**, then tap **Run**.
   - First run: it asks for permission → **Review permissions** → choose your Google account → **Advanced** → **Go to (project) (unsafe)** → **Allow**. (It says "unsafe" only because it's your own script.)
   - It will create all the tabs (Inspections, Findings, NCRs, Cubes, etc.) with seed data.
7. Now deploy it as a web app:
   - Tap **Deploy → New deployment**.
   - Tap the gear ⚙ next to "Select type" → **Web app**.
   - Description: `QA Portal v2`
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Tap **Deploy** → authorise again if asked.
   - **COPY the Web app URL** (ends in `/exec`). You need it in Part 2.

---

## PART 2 — Deploy the portal from your Codespace

You already have the Codespace open ("fantastic orbit"). If not: github.com →
your `quality-platform` repo → green **Code** button → **Codespaces** → open it.

### 2a. Upload this zip into the Codespace

1. In the Codespace file explorer (left side), long-press the empty area → **Upload…**
2. Choose **qa-portal-v2.zip** (the file you just downloaded).
3. Wait for it to appear in the file list.

### 2b. Unzip and move files into place

In the **Terminal** (bottom panel — if hidden: top menu ☰ → Terminal → New Terminal),
type these one line at a time, pressing Return after each:

```bash
unzip qa-portal-v2.zip
cp -r qa_portal_v2/* .
cp qa_portal_v2/.gitignore . 2>/dev/null
rm -rf qa_portal_v2 qa-portal-v2.zip
ls
```

You should now see `src`, `public`, `backend`, `package.json`, `README.md` in the explorer.

### 2c. Paste your Apps Script URL

1. In the explorer, open **src/config.js**.
2. Find the line:
   ```js
   export const SCRIPT_URL = 'PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';
   ```
3. Replace the placeholder with the `/exec` URL you copied in Part 1. Keep the quotes:
   ```js
   export const SCRIPT_URL = 'https://script.google.com/macros/s/AKfyc.../exec';
   ```
4. Save (Cmd+S, or ☰ → File → Save).

### 2d. Install and deploy

Back in the Terminal:

```bash
npm install
npm run deploy
```

- `npm install` takes 2–4 minutes (downloads React, xlsx, docx, etc.).
- `npm run deploy` builds the site and pushes it to a `gh-pages` branch.
- If it asks about git identity, run:
  ```bash
  git config --global user.email "senoskyjj@example.com"
  git config --global user.name "Joshua Senosky"
  ```
  then `npm run deploy` again.

---

## PART 3 — Turn on GitHub Pages

1. Go to your repo on github.com → **Settings** → **Pages** (left menu).
2. Under "Build and deployment" → Source: **Deploy from a branch**.
3. Branch: **gh-pages** / **(root)** → **Save**.
4. Wait 1–2 minutes. Your portal will be live at:

   **https://senoskyjj-beep.github.io/quality-platform**

Add it to your iPad home screen: open the link in Safari → Share → **Add to Home Screen**.
It then behaves like an app.

---

## Updating later

Whenever I give you a new zip:
1. Upload it into the Codespace.
2. `unzip` + `cp -r` over the old files (same as 2b).
3. Re-paste SCRIPT_URL if config.js was overwritten.
4. `npm run deploy`.

Your Google Sheet data is untouched by redeploys — it lives on the server, not in the app.

---

## Architecture notes (why it's built this way)

- **Server is the single source of truth.** The portal reads from Google Sheets on load.
- **Persistent retry queue.** If a save fails (bad signal on site), it's stored locally
  and retried every 30 seconds and on reconnect — no silent data loss.
- **Soft delete + audit log.** Nothing is truly deleted; every write is logged.
- **Booking-first.** Findings/NCRs/cubes/docs link to a booking, which shows summary chips.
- **SANS clauses** are reference numbers + topics only (no copyrighted standard text).
