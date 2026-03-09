import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#0a1628' },
          headerTintColor: '#ffffff',
          headerTitleStyle: { fontWeight: 'bold' },
          contentStyle: { backgroundColor: '#0a1628' },
        }}
      />
    </>
  );
}
