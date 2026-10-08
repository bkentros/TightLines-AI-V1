# FinFindr 1.16 release draft

## Release notes

- PierCast city reports recover gracefully when a city's available species differs from the saved target, with a clear notice and species switcher.
- City reports open without waiting for standings, and first-time PierCast startup no longer requests every species leaderboard.
- Live Lake Map access authorization starts sooner.
- Signed-in accounts are never sent to onboarding when a cold-start profile request times out; the app retries and offers a connection retry state.
- JavaScript-only over-the-air updates are scoped to the 1.16 runtime.
- The Terms clarify that temperatures below the surface are modeled estimates.

Catch Log is not part of 1.16 and remains planned for 1.17.

## Safe OTA flow

The runtime policy is `appVersion`, so an update published for 1.16 cannot load in a 1.15 or older binary. Native dependency or configuration changes require a new store binary and must not be delivered as JavaScript-only updates.

1. Work from a clean, reviewed commit on `release/1.16`.
2. Publish to preview only: `eas update --channel preview --message "1.16 preview: <summary>"`.
3. On the owner's iPhone, install and open the 1.16 preview build, force-quit twice, reopen, and verify the update ID plus profile recovery, PierCast, Today's Bite, River Run, and Live Lake Map.
4. Promote the exact tested update group: `eas update:republish --group <preview-group-id> --destination-channel production`.
5. Monitor the production health workflow and error reporting before publishing another update.

Rollback is a republish, not a rebuild: identify the last known-good 1.16 update group and run `eas update:republish --group <known-good-group-id> --destination-channel production`. If an update has a native incompatibility, stop publishing and ship a corrected store binary with a new app version/runtime.

## Versioning

`app.json` carries app version `1.16`. The current EAS remote values are iOS build 42 and Android versionCode 23. EAS uses remote version state and the production profile has `autoIncrement: true`, so the first 1.16 production builds will advance these to iOS 43 and Android 24. This pass does not start either build.

## Test the 1.16 development client on the owner's iPhone

From Terminal:

```bash
cd "/Users/brandonkentros/TightLines AI V1/tmp/release-1.16-worktree/TightLinesAI"
cp "/Users/brandonkentros/TightLines AI V1/TightLinesAI/.env" .env
npm ci --legacy-peer-deps
eas build --platform ios --profile development
```

Open the EAS install link on the registered iPhone and install the development build. Then, from the same directory, start Metro:

```bash
npx expo start --dev-client --tunnel --clear
```

Open the installed FinFindr development client and choose the running project (or scan Metro's QR code with the iPhone camera). Keep Terminal and the phone online. This new development build is required because 1.16 adds the native `expo-updates` module; an older 1.15 development client is not a valid native-runtime test.
