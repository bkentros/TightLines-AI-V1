import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        gestureEnabled: false,
      }}
    >
      <Stack.Screen name="step-1-welcome" />
      <Stack.Screen name="step-2-preferences" />
      <Stack.Screen name="step-3-location" />
    </Stack>
  );
}
