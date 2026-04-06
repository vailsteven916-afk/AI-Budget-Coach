import { View, Text, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native';
import React from 'react';
import { motion } from 'react-native';
import { User, Settings, Crown, LogOut, ChevronRight, Target, Award, Shield } from 'lucide-react-native';
import { Link, useNavigate } from 'expo-router';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useStore } from '../store/useStore';
import { useTranslation } from '../lib/i18n';

export default function Profile() {
  const { challenges, user, language, isPremium } = useStore();
  const { t } = useTranslation(language);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <View className="flex flex-col min-h-full pb-24">
      <header className="px-6 pt-12 pb-6 sticky top-0 bg-gray-50/80 dark:bg-zinc-950/80 backdrop-blur-md z-10">
        <Text className="text-2xl font-bold">{t('profile')}</Text>
      </header>

      <View className="px-6 space-y-6">
        {/* Profile Card */}
        <View 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 bg-white dark:bg-zinc-900 p-4 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800"
        >
          <View className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center">
            <User size={32} />
          </View>
          <View className="flex-1">
            <View className="flex items-center gap-2">
              <Text className="text-xl font-bold">{user?.displayName || 'User'}</Text>
              {isPremium && (
                <View className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <Crown size={10} /> PRO
                </View>
              )}
            </View>
            <Text className="text-sm text-zinc-500 dark:text-zinc-400">{user?.email}</Text>
          </View>
          <Link href="/premium" className={`p-2 rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95 ${isPremium ? 'bg-zinc-100 dark:bg-zinc-800 text-amber-500 shadow-none' : 'bg-gradient-to-r from-amber-400 to-amber-600 text-white shadow-amber-500/20'}`}>
            <Crown size={20} />
          </Link>
        </View>

        {/* Active Challenges */}
        <View 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Text className="text-lg font-bold mb-4">{t('activeChallenges')}</Text>
          <View className="space-y-3">
            {challenges.length === 0 ? (
              <View className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 text-center">
                <Text className="text-zinc-500 dark:text-zinc-400 text-sm">{t('noActiveChallenges')}</Text>
              </View>
            ) : (
              challenges.map(c => (
                <View key={c.id} className="bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800">
                  <View className="flex justify-between items-center mb-2">
                    <Text className="font-semibold">{c.title}</Text>
                    <Text className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{c.progress}/{c.total} d</Text>
                  </View>
                  <View className="h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <View 
                      className="h-full bg-emerald-500 rounded-full" 
                      style={{ width: `${(c.progress / c.total) * 100}%` }}
                    />
                  </View>
                </View>
              ))
            )}
          </View>
        </View>

        {/* Menu */}
        <View 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800 overflow-hidden"
        >
          <Link href="/goals" className="flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
            <View className="flex items-center gap-3">
              <View className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center">
                <Target size={18} />
              </View>
              <Text className="font-medium">{t('savingsGoals')}</Text>
            </View>
            <ChevronRight size={20} className="text-zinc-400" />
          </Link>
          
          <Link href="/badges" className="w-full flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
            <View className="flex items-center gap-3">
              <View className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg flex items-center justify-center">
                <Award size={18} />
              </View>
              <Text className="font-medium">{t('badgesRewards')}</Text>
            </View>
            <ChevronRight size={20} className="text-zinc-400" />
          </Link>

          <Link href="/settings" className="w-full flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
            <View className="flex items-center gap-3">
              <View className="w-8 h-8 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-lg flex items-center justify-center">
                <Settings size={18} />
              </View>
              <Text className="font-medium">{t('settings')}</Text>
            </View>
            <ChevronRight size={20} className="text-zinc-400" />
          </Link>

          <TouchableOpacity onPress={handleLogout} className="w-full flex items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
            <View className="flex items-center gap-3">
              <View className="w-8 h-8 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-lg flex items-center justify-center">
                <LogOut size={18} />
              </View>
              <Text className="font-medium text-rose-600 dark:text-rose-400">{t('logOut')}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
