//entry point
//Root layout

import { Stack } from "expo-router";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { useSegments, useRouter } from "expo-router";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { session, isLoading } = useAuth();
  const segments = useSegments();
  // ['(tab)', 'home'] for /(tab)/home
  const router = useRouter();

  useEffect(() => {
    const inTabGroup = segments[0] === "(tab)";
    if (!session && inTabGroup) {
      router.replace("/login");
    } else if (session && !inTabGroup) {
      router.replace("/(tab)/home");
    }
  }, [session, segments, isLoading]);

  if (isLoading) return null;

  return <>{children}</>;
};

const RootLayout = () => {
  return (
    <AuthProvider>
      <AuthGuard>
        <Stack screenOptions={{headerShown: false,}}>
        <Stack.Screen name="index"/>
        <Stack.Screen name="/screens/login"/>
        <Stack.Screen name="/screens/signup" />
        <Stack.Screen name="/(tabs)" />
        </Stack>
      </AuthGuard>
    </AuthProvider>

  );
};
      
export default RootLayout;