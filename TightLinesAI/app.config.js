// Dynamic Expo config.
//
// Default (no APP_VARIANT): returns app.json untouched → this is what every
// EAS production/preview build and the App Store binary use. Nothing changes.
//
// APP_VARIANT=development: builds a side-by-side "FinFindr Dev" app with its
// own bundle ID + scheme so it installs ALONGSIDE the App Store FinFindr
// (iOS allows it because the bundle IDs differ). Use this for local dev-client
// builds you connect to Metro:
//
//   APP_VARIANT=development npx expo run:ios --device
//
// Notes for the dev variant:
//   - Sign in with Apple / magic-link / OAuth redirects are tied to the
//     production bundle ID + `finfindr://` scheme, so use EMAIL + PASSWORD
//     login in the dev app. Email login is all you need to preview UI.
//   - RevenueCat sandbox is keyed to the production bundle ID, so paywalls
//     may behave differently in the dev variant — fine for UI work.

const IS_DEV = process.env.APP_VARIANT === "development";

module.exports = ({ config }) => {
  if (!IS_DEV) return config;

  return {
    ...config,
    name: "FinFindr Dev",
    ios: {
      ...config.ios,
      bundleIdentifier: `${config.ios.bundleIdentifier}.dev`,
      infoPlist: {
        ...(config.ios?.infoPlist ?? {}),
        CFBundleDisplayName: "FinFindr Dev",
        CFBundleName: "FinFindr Dev",
      },
    },
    android: {
      ...config.android,
      package: `${config.android.package}.dev`,
    },
    scheme: "finfindrdev",
  };
};
