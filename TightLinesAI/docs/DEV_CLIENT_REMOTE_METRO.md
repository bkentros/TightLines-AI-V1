# Dev client + Metro (no rebuild)

## Fastest way in when LAN keeps timing out (guest Wi‑Fi, AP isolation)

Many routers block phone ↔ Mac even on “same Wi‑Fi.” Use a **tunnel**.  
**`npm run dev:live`** uses **Cloudflare Quick Tunnel** (no Expo/ngrok). If **`npm run dev:live:expo`** fails with `failed to start tunnel` / `session closed`, use **`dev:live`** instead.

From `TightLinesAI/`:

```bash
npm run setup:cloudflared
npm run dev:kill-servers
npm run dev:live
```

(`setup:cloudflared` is one-time if you do not have `cloudflared` / Homebrew.)

1. When Metro shows a **QR code**, scan **once** with the iPhone Camera, or paste the printed `exp+…` line.
2. **Leave that terminal open** — that is your live server.
3. After the first successful load, use **Recently opened** until you stop Metro (new `*.trycloudflare.com` host each run — you reconnect once per new terminal session).

Optional Expo/ngrok tunnel (when it works): `npm run dev:live:expo`

Stale cache: `npm run dev:live:clear`

---

## Same Wi‑Fi (recommended when LAN actually works — usually no URL)

From `TightLinesAI/`:

```bash
npm run start:dev-client
```

(`start:dev-client`, `start:dev-client:lan`, and `start:dev-client:same-wifi` all run `scripts/start-metro-lan.sh`, which sets your LAN IP for Metro and prints a fallback link.)

1. Mac and iPhone on the **same Wi‑Fi**.
2. iPhone: **Settings → TightLines AI → Local Network → On** (needed once).
3. Open the **TightLines dev build** (not App Store production).
4. Use the dev launcher’s **Development servers** list (Bonjour / “Searching for development servers…”) and **tap your Mac** — no manual URL in the common case.
5. If the list is empty, **scan the QR code** Metro prints in the terminal, or use the `exp+…` line from the banner.

### New place, new Wi‑Fi (still LAN)

There is no “home network” stored in the app. **Recently opened** only shows the **last Metro URL** (e.g. `http://192.168.1.39:8081` from your old router). On a new network your Mac gets a **new IP**, so that row stays **offline** until you connect again. Run `npm run start:dev-client` on the Mac — the banner shows **today’s IP** — then tap your Mac under **Development servers**, scan the **new** QR, or paste the **new** `exp+…` line once. After a successful load, **Recently opened** will reflect this network.

### QR works but times out / grey dot (LAN)

1. On the **iPhone**, open **Safari** and visit `http://<IP-from-banner>:8081` (same IP `start-metro-lan.sh` prints). If Safari **times out**, the phone cannot reach Metro (guest/AP **client isolation**, **Mac firewall**, or wrong IP). Fix the network or allow **Node** in **System Settings → Network → Firewall**.
2. **Green dot** appears only after the dev client can **reach** that URL; fix Safari first, then rescan QR or tap the server again.
3. If the Mac has **VPN** or several interfaces, force the Wi‑Fi IP:  
   `METRO_LAN_IP=192.168.x.x npm run start:dev-client`

Clear cache:

```bash
npm run start:dev-client:lan:clear
```

### Nothing loads / spinner forever / stale tunnel

1. Stop **every** Metro terminal (Ctrl+C in each).
2. From `TightLinesAI/` run:

```bash
npm run dev:kill-servers
```

3. Start **only one** session: either **same‑Wi‑Fi** (`npm run start:dev-client`) **or** **tunnel** (`npm run start:dev-client:localtunnel`), not both.
4. After a tunnel restart, use the **new** QR code or `exp+…` URL from that run (old `*.loca.lt` hosts die when the tunnel process stops).

---

## Away from home (tunnel)

When your phone is not on the same Wi‑Fi as your laptop, **do not use LAN**. Use a **tunnel** so Metro gets a public URL the phone can reach. **Prefer scanning the QR code** Metro prints; paste URL only if needed.

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
