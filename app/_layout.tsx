import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useStore } from '../store/useStore';
import { View, ActivityIndicator } from 'react-native';

export default function RootLayout() {
  const { setUser, setAuthReady, isAuthReady, isLoggedIn } = useStore();
  const segments = useSegments();
  const router = useRouter();

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setAuthReady(true);
    });
    return unsubscribe;
  }, []);

  // Protect routes
  useEffect(() => {
    if (!isAuthReady) return;

    const inAuthGroup = segments[0] === 'login' || segments[0] === 'signup';

    if (!isLoggedIn && !inAuthGroup) {
      // Redirect to login if not logged in
      router.replace('/login');
    } else if (isLoggedIn && inAuthGroup) {
      // Redirect to dashboard if logged in
      router.replace('/');
    }
  }, [isLoggedIn, isAuthReady, segments]);

  if (!isAuthReady) {
    return (
      <View style={{ flex: 1, backgroundColor: '#09090b', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="premium" />
    </Stack>
  );
}
