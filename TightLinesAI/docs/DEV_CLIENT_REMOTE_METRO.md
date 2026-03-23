# Dev client + Metro while away from home (no rebuild)

When your phone is not on the same Wi‑Fi as your laptop, **do not use `--host lan`**. Use a **tunnel** so Metro gets a public URL you can type into the dev client.

## 1. Start Metro with tunnel

From `TightLinesAI/`:

```bash
npm run start:dev-client:tunnel
```

If bundles act stale, clear the cache:

```bash
npm run start:dev-client:tunnel:clear
```

First run may prompt for Expo account login; tunneling uses Expo’s infrastructure.

## 2. Copy the URL from the terminal

After Metro is up, the CLI prints a connection string. Look for a line with **`exp://`** or a deep link starting with **`exp+`** (scheme for custom dev clients). **Copy that full URL** — it is unique per session.

Do not guess an IP or port; the tunnel hostname is what makes the phone reach your machine.

## 3. Enter it on the phone

1. Open your **TightLines dev client** (not Expo Go unless that is what you use).
2. Open the **developer menu** (shake device, or hardware shortcut).
3. Choose **Enter URL manually** (wording may be “Open from URL” / similar).
4. Paste the URL from step 2 and confirm.

Reload once if the first connection is slow.

## 4. Same code as your repo

This only changes **how** JS reaches the device. Your app code is whatever is on disk when Metro starts (e.g. current `main` / `8f13051`). No new native build is required.

---

## If “Enter URL manually” fails (localtunnel / random https URL)

Pasting **`https://….loca.lt`** or **`exp://…loca.lt:443`** alone often **does not work**: Metro was still telling the app to download JavaScript from **`localhost`** or your LAN IP. The phone cannot see your laptop’s localhost.

**Fix:** set the packager hostname to your tunnel **before** starting Metro, **then** use the URL or QR code **that Metro prints** (not only the tunnel homepage).

### Option A — localtunnel + hostname (two terminals)

**Terminal 1** (leave running):

```bash
cd TightLinesAI
npx localtunnel --port 8081
```

Copy the hostname only, e.g. `nice-pears-wear.loca.lt` (no `https://`).

**Terminal 2**:

```bash
cd TightLinesAI
TUNNEL_HOST=nice-pears-wear.loca.lt npm run start:dev-client:with-tunnel-host
```

On the iPhone, prefer **scanning the QR code** from Terminal 2. If you use “Enter URL manually”, paste the **`exp://…`** line Metro shows **after** this start (it should mention your tunnel host).

If localtunnel shows a browser warning the first time, open the `https://…loca.lt` link once in Safari and continue, then retry the dev client.

### Option B — ngrok (most reliable; free account)

1. Create an [ngrok](https://dashboard.ngrok.com/signup) account and run:  
   `ngrok config add-authtoken <your token>`
2. **Terminal 1:** `ngrok http 8081` — copy the **Forwarding** hostname, e.g. `abcd-12-34-56-78.ngrok-free.app`.
3. **Terminal 2:**  
   `TUNNEL_HOST=abcd-12-34-56-78.ngrok-free.app npm run start:dev-client:with-tunnel-host`

### Option C — Expo `--tunnel` from a normal Mac terminal

If `npm run start:dev-client:tunnel` fails inside Cursor (ngrok `remote gone away` / `body` errors), run the **same command in Terminal.app** (not the IDE). Expo’s tunnel uses managed ngrok and avoids localtunnel quirks.

Set `CI=false` if your environment sets `CI=true` (that can break tunnel mode):

```bash
cd TightLinesAI
CI=false npm run start:dev-client:tunnel
```
