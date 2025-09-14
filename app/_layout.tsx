import { Stack, router, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { ActivityIndicator, View, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const InitialLayout = () => {
  // Get the user's auth and onboarding state from the global context
  const { user, hasSeenOnboarding, isLoading } = useAuth();
  
  useEffect(() => {
    // Wait until the context has finished loading from storage
    if (isLoading) return;

    // This logic ensures the user is always on the correct screen
    if (!hasSeenOnboarding) {
      router.replace('/onboarding');
    } else if (!user) {
      router.replace('/auth');
    } else {
      router.replace('/(tabs)');
    }
  }, [isLoading, user, hasSeenOnboarding]);

  // Show a loading screen while we determine where to send the user
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="auth" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
};

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      {/* This AuthProvider wraps the entire app, making the user state global */}
      <AuthProvider>
        <InitialLayout />
        {/* @ts-ignore */}
        <StatusBar style="auto" />
      </AuthProvider>
    </SafeAreaProvider>
  );
}