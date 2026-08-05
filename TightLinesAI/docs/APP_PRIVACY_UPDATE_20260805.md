# App Privacy Update — August 5, 2026

This checklist maps the current FinFindr iOS data flows to App Store Connect.
It is an engineering audit, not legal advice. Reconfirm the answers against the
exact production build and each enabled production vendor before publishing.

## Current release posture

River Migration does not add a new personal-data type. USGS and Monitor My
Watershed provide public environmental observations for configured gauges and
stations. The feature does add product-interaction and request-performance
events to the analytics already used by the app.

Instally and creator-program attribution are disabled for the current release:
the Instally SDK is not bundled, install matching and fingerprint resolution do
not run, creator links do not alter app routing or subscription UI, and public
creator/referral pages are not shipped. Keep **Data Used to Track You** set to
**No**. No ATT prompt is needed for these first-party app flows.

Keep the Privacy Policy URL as `https://finfindr.app/privacy` after deploying
the updated public legal site.

## App Store Connect data types

Select and configure the following. Mark every listed type as **Linked to the
User: Yes** and **Used for Tracking: No**.

| Apple data type | Purposes to select |
| --- | --- |
| Contact Info → Email Address | App Functionality |
| Location → Precise Location | App Functionality; Product Personalization |
| Location → Coarse Location | App Functionality; Product Personalization; Analytics |
| User Content → Customer Support | App Functionality |
| User Content → Other User Content | App Functionality; Product Personalization |
| Search History | App Functionality; Analytics |
| Identifiers → User ID | App Functionality; Product Personalization; Analytics |
| Identifiers → Device ID | App Functionality; Analytics |
| Purchases → Purchase History | App Functionality; Analytics |
| Usage Data → Product Interaction | App Functionality; Analytics |
| Diagnostics → Performance Data | App Functionality; Analytics |
| Diagnostics → Other Diagnostic Data | App Functionality; Analytics |

Do not remove **Linked to the User**: FinFindr identifies signed-in analytics
and associates account, location, entitlement, support, search, and operational
records with the user's account or device. The app's username is an account
identifier, so it belongs under User ID; FinFindr does not currently transmit
or store the Apple account holder's real name.

## Do not select for the current shipping build

- Contact Info → Name.
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
- Developer's Advertising or Marketing, Third-Party Advertising, or Other
  Purposes for any selected data type.

## App Store Connect steps

1. Open **Apps → FinFindr → App Privacy**.
2. Confirm **Yes, we collect data from this app**.
3. Choose **Edit** beside Data Types and make the selections above.
4. Open each selected data type and set its purposes, linked status, and
   tracking status exactly as listed.
5. Confirm **Data Used to Track You** is empty and that no selected purpose is
   advertising or marketing.
6. Keep the Privacy Policy URL at `https://finfindr.app/privacy`.
7. Preview the product-page disclosure, then select **Publish**.
