import { View, Text, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native';
import React from 'react';
import { motion } from 'react-native';
import { Award, Star, Trophy, Zap, Shield, Target, Flame } from 'lucide-react-native';
import { useNavigate } from 'expo-router';

const badges = [
  {
    id: 1,
    title: 'First Step',
    description: 'Added your first transaction',
    icon: <Star size={24} />,
    color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    unlocked: true,
  },
  {
    id: 2,
    title: 'Saver',
    description: 'Created your first savings goal',
    icon: <Target size={24} />,
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    unlocked: true,
  },
  {
    id: 3,
    title: 'On Fire',
    description: 'Logged in for 7 consecutive days',
    icon: <Flame size={24} />,
    color: 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400',
    unlocked: false,
  },
  {
    id: 4,
    title: 'Budget Master',
    description: 'Stayed under budget for a full month',
    icon: <Shield size={24} />,
    color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
    unlocked: false,
  },
  {
    id: 5,
    title: 'High Achiever',
    description: 'Completed a savings goal',
    icon: <Trophy size={24} />,
    color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    unlocked: false,
  },
  {
    id: 6,
    title: 'Lightning Fast',
    description: 'Added 5 transactions in one day',
    icon: <Zap size={24} />,
    color: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400',
    unlocked: false,
  }
];

export default function Badges() {
  const navigate = useNavigate();

  return (
    <View className="flex flex-col min-h-full pb-24">
      <header className="px-6 pt-12 pb-6 sticky top-0 bg-gray-50/80 dark:bg-zinc-950/80 backdrop-blur-md z-10 flex items-center gap-4">
        <TouchableOpacity 
          onPress={() => navigate(-1)}
          className="w-10 h-10 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full flex items-center justify-center"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><Textath d="m15 18-6-6 6-6"/></svg>
        </TouchableOpacity>
        <Text className="text-2xl font-bold">Badges & Rewards</Text>
      </header>

      <View className="px-6 space-y-6">
        <View className="bg-gradient-to-br from-amber-400 to-amber-600 rounded-3xl p-6 text-white shadow-lg shadow-amber-500/20">
          <View className="flex items-center gap-4 mb-4">
            <View className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Award size={24} />
            </View>
            <View>
              <Text className="text-xl font-bold">Level 2 Saver</Text>
              <Text className="text-amber-100 text-sm">2/6 Badges Unlocked</Text>
            </View>
          </View>
          <View className="h-2 bg-black/20 rounded-full overflow-hidden">
            <View className="h-full bg-white rounded-full" style={{ width: '33%' }} />
          </View>
        </View>

        <View className="grid grid-cols-2 gap-4">
          {badges.map((badge, index) => (
            <View
              key={badge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-3xl border ${badge.unlocked ? 'bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 shadow-sm' : 'bg-zinc-50 dark:bg-zinc-900/50 border-zinc-100 dark:border-zinc-800/50 opacity-60 grayscale'}`}
            >
              <View className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 ${badge.color}`}>
                {badge.icon}
              </View>
              <Text className="font-bold text-sm mb-1">{badge.title}</Text>
              <Text className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{badge.description}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
