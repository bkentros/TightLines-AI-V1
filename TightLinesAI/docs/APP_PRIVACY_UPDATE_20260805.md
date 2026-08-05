# App Privacy Update — August 5, 2026

This checklist maps the current FinFindr iOS data flows to App Store Connect.
It is an engineering audit, not legal advice. Reconfirm the answers against the
exact production build and each enabled production vendor before publishing.

## River Migration delta

River Migration does not add a new personal-data type. USGS and Monitor My
Watershed provide public environmental observations for configured gauges and
stations. The feature does, however, add product-interaction and request-
performance events to the analytics already used by the app.

Keep the Privacy Policy URL as `https://finfindr.app/privacy` after deploying
the updated public legal site.

## Submission blocker: install fingerprint attribution

The current production startup can call Instally and a custom network
`fingerprint` resolver to match an App Store install with a creator-link click.
The signal set includes device model category, OS version, screen dimensions,
time zone, language, and network request information. Apple says deriving a
device identity from device or network signals is prohibited even when ATT
permission exists.

Recommended release posture:

1. Disable Instally install matching and the custom `match_method: fingerprint`
   fallback in the iOS production build.
2. Retain explicit deep-link, universal-link, and user-entered creator-code
   attribution.
3. Use Apple's privacy-preserving attribution technology for future paid or
   cross-property install attribution.
4. Keep **Data Used to Track You** set to **No** only after the prohibited
   fingerprint path is absent from the submitted build.

Do not try to solve this by changing the privacy label to tracking = Yes.
Fingerprinting remains prohibited even with an ATT prompt.

## App Store Connect data types

For the recommended no-fingerprinting production build, select and configure
the following. Mark every listed type as **Linked to the User: Yes** and **Used
for Tracking: No**.

| Apple data type | Purposes to select |
| --- | --- |
| Contact Info → Name | App Functionality; Product Personalization |
| Contact Info → Email Address | App Functionality |
| Location → Precise Location | App Functionality; Product Personalization |
| Location → Coarse Location | App Functionality; Product Personalization; Analytics |
| User Content → Customer Support | App Functionality |
| User Content → Other User Content | App Functionality; Product Personalization |
| Search History | App Functionality; Analytics |
| Identifiers → User ID | App Functionality; Product Personalization; Analytics; Developer's Advertising or Marketing |
| Identifiers → Device ID | App Functionality; Analytics |
| Purchases → Purchase History | App Functionality; Analytics; Developer's Advertising or Marketing |
| Usage Data → Product Interaction | App Functionality; Analytics; Developer's Advertising or Marketing |
| Diagnostics → Performance Data | App Functionality; Analytics |
| Diagnostics → Other Diagnostic Data | App Functionality; Analytics |

Why the marketing purpose remains after fingerprinting is removed: explicit
creator codes and referral tokens can still connect sign-up and subscription
conversion to a FinFindr creator partnership for attribution and commission.

## Do not select for the current shipping build

- Payment Info — Apple processes payment details; FinFindr does not receive full
  card information.
- Phone Number or Physical Address.
- Contacts.
- Photos or Videos and Audio Data — the current iOS build does not request those
  permissions or ship collection flows. Revisit before enabling photo or voice
  logging.
- Advertising Data.
- Crash Data — no production crash-reporting collection is currently wired.
- Browsing History, Health, Fitness, Sensitive Info, or Environment Scanning.
- Third-Party Advertising or Other Purposes for any selected data type.

## App Store Connect steps

1. Open **Apps → FinFindr → App Privacy**.
2. Confirm **Yes, we collect data from this app**.
3. Choose **Edit** beside Data Types and make the selections above.
4. Open each selected data type and set its purposes, linked status, and
   tracking status exactly as listed.
5. Confirm **Data Used to Track You** is empty only after fingerprint attribution
   is removed from the submitted build.
6. Keep the Privacy Policy URL at `https://finfindr.app/privacy`.
7. Preview the product-page disclosure, then select **Publish**.

