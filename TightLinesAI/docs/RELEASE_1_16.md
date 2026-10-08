# FinFindr 1.16 release draft

## Store release notes

Use the same 260-character text in both App Store Connect and Google Play:

> PierCast and city reports now load faster. City reports always open, even when your target species isn’t forecast at that city. NOAA forecast delays are explained more clearly, sign-in is more reliable, and this release includes general stability improvements.

## Detailed release contents

- PierCast city reports open on the best available species when the saved target is not forecast there, while retaining the in-report species switcher and leaving the saved target unchanged.
- City reports open without waiting for standings, and first-time PierCast startup no longer requests every species leaderboard.
- Live Lake Map access authorization starts sooner.
- Delayed NOAA cycles and the no-live-or-saved-data retry state are explained clearly.
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

## Store release runbook

Do not begin this runbook until the owner says **build**. Use the dedicated release worktree; do not switch the checkout used by the detached scorecard backfill.

1. Confirm PR #59 is still green and mergeable, then perform a normal merge (never `--admin`):

   ```bash
   cd "/Users/brandonkentros/TightLines AI V1/tmp/release-1.16-worktree"
   git fetch origin
   gh pr checks 59 --watch
   gh pr view 59 --json mergeable,mergeStateStatus,headRefOid
   gh pr merge 59 --merge
   ```

2. Move only the release worktree to the exact merged `main` commit and confirm it is clean:

   ```bash
   git fetch origin
   git switch --detach origin/main
   test -z "$(git status --porcelain)"
   cd TightLinesAI
   ```

3. Run the final `main` gates:

   ```bash
   npx tsc --noEmit
   node --import tsx --test scripts/*.test.ts scripts/*.test.mjs
   deno test --no-check --allow-read --allow-env supabase/functions
   (cd web/lake-map && "/Users/brandonkentros/TightLines AI V1/TightLinesAI/web/lake-map/.venv/bin/python" -m unittest discover -s job/tests)
   (cd web/lake-map && node --test test/*.test.mjs job/*.test.mjs)
   npx expo-doctor
   ```

4. Recheck the remote counters. They must still be iOS 42 and Android 23 so `autoIncrement` allocates 43 and 24:

   ```bash
   eas build:version:get --platform ios --profile production
   eas build:version:get --platform android --profile production
   ```

5. Start the two production store builds:

   ```bash
   eas build --platform ios --profile production --non-interactive --wait
   eas build --platform android --profile production --non-interactive --wait
   ```

6. Confirm the finished artifacts say app version 1.16, iOS build 43, and Android versionCode 24. Submit only iOS to App Store Connect; this uploads the binary but does not submit it for App Review:

   ```bash
   eas build:list --platform all --status finished --app-version 1.16 --limit 5
   eas submit --platform ios --profile production --latest
   ```

7. Open the Android build's EAS details link from the preceding command, choose **Download build**, and save the artifact as `/Users/brandonkentros/Downloads/FinFindr-1.16-24.aab`. Confirm the file ends in `.aab` before uploading it manually to the intended Google Play production release.

8. The owner completes the listing review and manually submits the 1.16 release for review in both App Store Connect and Google Play. No CLI command submits either store listing for review.

9. Wait until build 43 is publicly live in the App Store **and** versionCode 24 is publicly live in Google Play. Verify both public store pages and install/update paths. Until then, keep both `app_release_policies.enabled` values `false`.

10. Only after both stores are live, enable the dismissible update notice as one controlled production change:

    ```sql
    begin;
    update public.app_release_policies
    set enabled = true,
        latest_version = '1.16',
        latest_build = case platform when 'ios' then 43 when 'android' then 24 end,
        updated_at = now()
    where platform in ('ios', 'android');
    commit;
    ```

    Read the two rows back immediately and run the production health workflow. If only one store is live, do not partially enable the notice.

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
