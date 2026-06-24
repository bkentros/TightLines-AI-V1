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

## In-app feedback — Reply from Outlook not reaching the user

**Symptom:** You receive feedback in Hotmail but **Reply** goes nowhere, loops back to you, or Outlook won't send.

**Cause:** If `FEEDBACK_EMAIL_TO` is set to `support@finfindr.app`, mail is **forwarded** by Cloudflare before it hits Hotmail. Forwarding often **drops or ignores `Reply-To`**, so Outlook replies to `support@finfindr.app` (yourself) instead of the user's address.

**Fix:**

1. Supabase → **Edge Functions → Secrets** → set:
   - `FEEDBACK_EMAIL_TO` = **`finfindr@hotmail.com`** (direct inbox — **not** `support@finfindr.app`)
2. Redeploy `submit-feedback` (sets `Reply-To` + user email in subject + mailto link in body).
3. Send a test message from the app → open in Outlook → **Reply** should address the user's email.

Keep `support@finfindr.app` forwarding for **inbound** mail from the public; use **Hotmail directly** for **in-app** notifications.

---

## Apple Hide My Email — replies bounce with 550 5.1.1

**Symptom:** Feedback arrives in Hotmail. You click **Reply** (or the mailto link) to `something@privaterelay.appleid.com`. Outlook shows **Delivery has failed** — rejected by `outbound.st.icloud.com`, status **5.1.1**.

**Cause:** Users who sign in with **Sign in with Apple → Hide My Email** get a relay address. Apple **does not forward your reply** unless the message is sent **from an email source you registered** in Apple Developer. Personal Hotmail/Outlook is **not** registered by default → bounce.

This is **not** a FinFindr app bug. The in-app feedback flow correctly sets `Reply-To` to the user’s relay address. Apple blocks unregistered senders.

### Fix A — Keep replying from Outlook (fastest)

1. Go to [Apple Developer → Services](https://developer.apple.com/account/resources/services/list)
2. **Sign in with Apple for Email Communication** → **Configure**
3. Click **+** under **Email Sources** → choose **individual email addresses**
4. Enter **`finfindr@hotmail.com`** (the exact address you reply from in Outlook)
5. Complete Apple’s verification email to that inbox
6. Wait for a **green checkmark** in the table
7. Send a test reply to a `@privaterelay.appleid.com` address

You can register up to **32** individual addresses on an Individual developer account.

### Fix B — Reply from support@finfindr.app via Resend (recommended long-term)

1. In [Resend](https://resend.com/domains), confirm **finfindr.app** is verified (DKIM + SPF)
2. In Apple Developer (same **Email Communication** screen), register the domain **`finfindr.app`**
   - Apple shows whether **SPF passed** — fix DNS in Cloudflare if not
3. Send customer replies **from** `FinFindr <support@finfindr.app>` using:
   - [Resend dashboard](https://resend.com/emails) → **Send email**, or
   - Resend API / a future admin reply tool
4. Do **not** use personal Hotmail as the From address for relay customers

Resend already sends in-app feedback **from** `support@finfindr.app`; registering `finfindr.app` with Apple makes **outbound** support replies work for relay users too.

### What to register in Apple

| You send from | Register in Apple as |
|---------------|----------------------|
| `finfindr@hotmail.com` in Outlook | Individual email: `finfindr@hotmail.com` |
| `support@finfindr.app` via Resend | Domain: `finfindr.app` (SPF/DKIM via Resend) |

Register **every** address or domain you use. Missing registration = bounce.

### In-app fallback

Every feedback row is stored in Supabase **`app_feedback`** (username, message, `user_email`). For relay users you also see **Username: @ncb** in the notification — useful if email reply is blocked before Apple setup is done.

### Test after setup

1. Have a test account use **Sign in with Apple** (Hide My Email) and submit in-app feedback
2. Reply using your registered sender (Hotmail **or** Resend/support@)
3. Confirm delivery (check spam; relay can take a minute)

Apple docs: [Configure private email relay service](https://developer.apple.com/help/account/capabilities/configure-private-email-relay-service)

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Reply to `@privaterelay.appleid.com` bounces 5.1.1 | Register sender in Apple Developer → Sign in with Apple → **Email Communication** (see section above) |
| Can't reply to user from Outlook | Set `FEEDBACK_EMAIL_TO=finfindr@hotmail.com` (not support@); register `finfindr@hotmail.com` with Apple if user uses Hide My Email |
| MX still empty after enabling | Email Routing → DNS → **Configure** / re-enable routing |
| Verification email not received | Check Hotmail junk; resend destination verification |
| External mail delayed 15+ min | Wait for DNS propagation (usually &lt; 1 hour) |
| Resend outbound breaks | Unrelated — outbound uses Resend DKIM/SPF, not MX |

Verify MX from terminal:

```bash
dig MX finfindr.app +short
```

Should list `*.mx.cloudflare.net` after setup.
