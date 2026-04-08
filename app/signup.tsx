import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import React, { useState } from 'react';
import { useRouter, Link } from 'expo-router';
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { BrainCircuit } from 'lucide-react-native';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignup = async () => {
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      router.push('/onboarding');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    }
  };

  const handleGoogleSignup = async () => {
    setError('');
    try {
      await signInWithPopup(auth, googleProvider);
      router.push('/onboarding');
    } catch (err: any) {
      setError(err.message || 'Failed to sign up with Google');
    }
  };

  return (
    <View className="flex flex-col h-full bg-white dark:bg-zinc-950 p-6 max-w-md mx-auto">
      <View className="flex-1 flex flex-col justify-center">
        <View className="flex flex-col items-center mb-12">
          <View className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mb-6">
            <BrainCircuit size={32} color="#10b981" />
          </View>
          <Text className="text-3xl font-bold mb-2 text-zinc-900 dark:text-white">Create Account</Text>
          <Text className="text-zinc-500 dark:text-zinc-400">Join us to start your journey</Text>
        </View>

        <View className="flex flex-col gap-4">
          {error ? <Text className="text-rose-500 text-sm font-medium text-center">{error}</Text> : null}
          <View>
            <Text className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Full Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3.5 text-zinc-900 dark:text-white"
              placeholder="John Doe"
            />
          </View>
          <View>
            <Text className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3.5 text-zinc-900 dark:text-white"
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          <View>
            <Text className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3.5 text-zinc-900 dark:text-white"
              placeholder="••••••••"
            />
          </View>

          <TouchableOpacity onPress={handleSignup} className="w-full bg-emerald-500 py-4 rounded-xl items-center mt-2">
            <Text className="text-white font-semibold">Sign Up</Text>
          </TouchableOpacity>

          <View className="relative my-4 items-center justify-center">
            <View className="absolute w-full border-t border-zinc-200 dark:border-zinc-800" />
            <View className="bg-white dark:bg-zinc-950 px-2">
              <Text className="text-zinc-500 text-sm">Or continue with</Text>
            </View>
          </View>

          <TouchableOpacity onPress={handleGoogleSignup} className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 py-4 rounded-xl items-center flex-row justify-center gap-2">
            <View style={{width: 20, height: 20, backgroundColor: "gray", borderRadius: 10}} />
            <Text className="text-zinc-900 dark:text-white font-semibold">Google</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="pb-8 items-center flex-row justify-center">
        <Text className="text-zinc-500 dark:text-zinc-400 text-sm">Already have an account? </Text>
        <Link href="/login">
          <Text className="text-emerald-600 dark:text-emerald-400 font-semibold">Sign in</Text>
        </Link>
      </View>
    </View>
  );
}
