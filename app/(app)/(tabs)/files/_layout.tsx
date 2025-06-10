import { Stack } from 'expo-router';

export default function MyHealthStack() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="upload" options={{ presentation: 'modal', headerShown: false }} />
    </Stack>
  );
}
