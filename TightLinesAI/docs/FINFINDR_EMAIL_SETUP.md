# finfindr.app email — receive mail at support@finfindr.app

## Why in-app works but external email does not

| Path | How it works |
|------|----------------|
| **In-app feedback** | Supabase `submit-feedback` → **Resend API** sends **outbound** mail **from** `support@finfindr.app` **to** `FEEDBACK_EMAIL_TO` (your Hotmail inbox). No inbox on `finfindr.app` is required. |
| **Someone emails support@finfindr.app** | Requires **inbound MX records** on `finfindr.app`. **Currently none are set** — mail has nowhere to go. |

This is DNS / Cloudflare configuration, not an app code bug.

---

## Fix: Cloudflare Email Routing (recommended — free)

Your domain `finfindr.app` is already on Cloudflare. Use **Email Routing** to forward `support@finfindr.app` → `finfindr@hotmail.com`.

### Steps (about 10 minutes)

1. Log in to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Select zone **finfindr.app**
3. Left sidebar → **Email** → **Email Routing**
4. Click **Get started** / **Enable Email Routing**
5. **Destination addresses** → **Add** → enter `finfindr@hotmail.com`
   - Cloudflare sends a verification link to Hotmail — click it
6. **Routing rules** → **Create address**
   - **Custom address:** `support@finfindr.app`
   - **Action:** Forward to → `finfindr@hotmail.com`
   - Save
7. Confirm **DNS records** tab shows MX records added by Cloudflare (status **Active**), typically:
   - `route1.mx.cloudflare.net`
   - `route2.mx.cloudflare.net`
   - `route3.mx.cloudflare.net`

### Test

From any external account (Gmail, iCloud, etc.), send:

```
To: support@finfindr.app
Subject: FinFindr support test
Body: Testing inbound mail
```

Should arrive in `finfindr@hotmail.com` within a few minutes.

### Optional addresses (Apple org / public contact)

| Address | Forward to |
|---------|------------|
| `support@finfindr.app` | `finfindr@hotmail.com` |
| `hello@finfindr.app` | `finfindr@hotmail.com` (optional) |
| Catch-all `*@finfindr.app` | `finfindr@hotmail.com` (optional — catches typos) |

---

## What stays the same (in-app)

Supabase secrets (already set for outbound feedback):

| Secret | Typical value |
|--------|----------------|
| `RESEND_API_KEY` | Resend API key |
| `FEEDBACK_EMAIL_TO` | `finfindr@hotmail.com` |
| `FEEDBACK_EMAIL_FROM` | `FinFindr <support@finfindr.app>` |

In-app feedback continues to work as today. Email Routing only fixes **inbound** mail to `@finfindr.app`.

---

## Apple Developer Individual → Organization

Apple may ask for a support email on your domain. After Email Routing is live:

- **Support URL:** `https://finfindr.app/support`
- **Support email:** `support@finfindr.app` (must receive mail — test before replying to Apple)

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| MX still empty after enabling | Email Routing → DNS → **Configure** / re-enable routing |
| Verification email not received | Check Hotmail junk; resend destination verification |
| External mail delayed 15+ min | Wait for DNS propagation (usually &lt; 1 hour) |
| Resend outbound breaks | Unrelated — outbound uses Resend DKIM/SPF, not MX |

Verify MX from terminal:

```bash
dig MX finfindr.app +short
```

Should list `*.mx.cloudflare.net` after setup.
