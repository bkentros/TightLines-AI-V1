import { Stack } from 'expo-router';

/**
 * Deep-link targets (email PKCE bridge → finfindr://auth/confirm?code=...)
 * live outside the (auth) route group so URLs stay stable. Keep headers off
 * to match the rest of the auth shell.
 */
export default function AuthDeepLinkLayout() {
  return <Stack screenOptions={{ headerShown: false, animation: 'fade' }} />;
}
