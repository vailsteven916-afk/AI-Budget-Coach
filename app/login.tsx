import { View, Text, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { useNavigate, Link } from 'expo-router';
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { motion } from 'react-native';
import { BrainCircuit } from 'lucide-react-native';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
    }
  };

  return (
    <View className="flex flex-col h-[100dvh] bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white p-6 max-w-md mx-auto">
      <View className="flex-1 flex flex-col justify-center">
        <View 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center mb-12"
        >
          <View className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mb-6">
            <BrainCircuit className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </View>
          <Text className="text-3xl font-bold mb-2">Welcome Back</Text>
          <Text className="text-zinc-500 dark:text-zinc-400">Sign in to continue your journey</Text>
        </View>

        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleLogin} 
          className="flex flex-col gap-4"
        >
          {error && <View className="text-rose-500 text-sm font-medium text-center">{error}</View>}
          <View>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Email</label>
            <TextInput
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              placeholder="you@example.com"
              required
            />
          </View>
          <View>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Password</label>
            <TextInput
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              placeholder="••••••••"
              required
            />
          </View>
          
          <View className="flex justify-end mb-4">
            <TouchableOpacity type="button" className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
              Forgot password?
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-4 rounded-xl transition-colors active:scale-[0.98]"
          >
            Sign In
          </TouchableOpacity>

          <View className="relative my-4">
            <View className="absolute inset-0 flex items-center">
              <View className="w-full border-t border-zinc-200 dark:border-zinc-800"></View>
            </View>
            <View className="relative flex justify-center text-sm">
              <Text className="px-2 bg-white dark:bg-zinc-950 text-zinc-500">Or continue with</Text>
            </View>
          </View>

          <TouchableOpacity
            type="button"
            onPress={handleGoogleLogin}
            className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white font-semibold py-4 rounded-xl transition-colors active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <Textath d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <Textath d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <Textath d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <Textath d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Google
          </TouchableOpacity>
        </motion.form>
      </View>

      <View className="pb-8 text-center">
        <Text className="text-zinc-500 dark:text-zinc-400 text-sm">
          Don't have an account?{' '}
          <Link href="/signup" className="text-emerald-600 dark:text-emerald-400 font-semibold">Sign up</Link>
        </Text>
      </View>
    </View>
  );
}
