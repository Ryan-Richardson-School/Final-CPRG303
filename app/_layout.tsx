//entry point
//Root layout

import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="index"/>
      <Stack.Screen name="/screens/login"/>
      <Stack.Screen name="/screens/signup" />
      <Stack.Screen name="/(tabs)" />
    </Stack>

  );
}