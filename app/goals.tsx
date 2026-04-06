import { View, Text, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { formatCurrency } from '../lib/utils';
import { motion, AnimatePresence } from 'react-native';
import { Target, Plus, ShieldAlert, Laptop, Plane, Car, Heart, X, Crown } from 'lucide-react-native';
import { useNavigate } from 'expo-router';

const iconMap: Record<string, React.ReactNode> = {
  ShieldAlert: <ShieldAlert size={24} />,
  Laptop: <Laptop size={24} />,
  Plane: <Plane size={24} />,
  Car: <Car size={24} />,
  Heart: <Heart size={24} />,
};

export default function Goals() {
  const navigate = useNavigate();
  const { goals, addGoal, isPremium } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [showPremiumAlert, setShowPremiumAlert] = useState(false);
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [icon, setIcon] = useState('Target');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !targetAmount || !deadline) return;

    await addGoal({
      title,
      targetAmount: Number(targetAmount),
      currentAmount: 0,
      deadline,
      icon
    });

    setIsAdding(false);
    setTitle('');
    setTargetAmount('');
    setDeadline('');
    setIcon('Target');
  };

  return (
    <View className="flex flex-col min-h-full pb-24">
      <header className="px-6 pt-12 pb-6 flex justify-between items-center sticky top-0 bg-gray-50/80 dark:bg-zinc-950/80 backdrop-blur-md z-10">
        <Text className="text-2xl font-bold">Savings Goals</Text>
        <TouchableOpacity 
          onPress={() => {
            if (!isPremium && goals.length >= 3) {
              setShowPremiumAlert(true);
            } else {
              setIsAdding(true);
            }
          }}
          className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center"
        >
          <Plus size={20} />
        </TouchableOpacity>
      </header>

      <View className="px-6 space-y-4">
        {goals.length === 0 ? (
          <View className="bg-white dark:bg-zinc-900 rounded-3xl p-8 text-center shadow-sm border border-zinc-100 dark:border-zinc-800">
            <View className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Target size={32} />
            </View>
            <Text className="text-lg font-bold mb-2">No Goals Yet</Text>
            <Text className="text-zinc-500 dark:text-zinc-400 text-sm mb-6">Set a savings goal to start tracking your progress.</Text>
            <TouchableOpacity 
              onPress={() => {
                if (!isPremium && goals.length >= 3) {
                  setShowPremiumAlert(true);
                } else {
                  setIsAdding(true);
                }
              }}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors active:scale-[0.98]"
            >
              Create Goal
            </TouchableOpacity>
          </View>
        ) : (
          goals.map((goal, index) => {
            const progress = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
            
            return (
              <View
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-zinc-900 rounded-3xl p-5 shadow-sm border border-zinc-100 dark:border-zinc-800"
              >
                <View className="flex gap-4 mb-4">
                  <View className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-2xl flex items-center justify-center shrink-0">
                    {iconMap[goal.icon] || <Target size={24} />}
                  </View>
                  <View className="flex-1">
                    <Text className="font-bold text-lg">{goal.title}</Text>
                    <Text className="text-sm text-zinc-500 dark:text-zinc-400">
                      {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                    </Text>
                  </View>
                  <View className="text-right">
                    <Text className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      {progress.toFixed(0)}%
                    </Text>
                  </View>
                </View>

                <View className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <View 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="h-full bg-emerald-500 rounded-full"
                  />
                </View>
                
                <Text className="text-xs text-zinc-500 dark:text-zinc-400 mt-3 text-center">
                  {formatCurrency(goal.targetAmount - goal.currentAmount)} left to reach your goal
                </Text>
              </View>
            );
          })
        )}
      </View>

      <View>
        {isAdding && (
          <View 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          >
            <View 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-3xl p-6 shadow-xl"
            >
              <View className="flex justify-between items-center mb-6">
                <Text className="text-xl font-bold">Create New Goal</Text>
                <TouchableOpacity 
                  onPress={() => setIsAdding(false)}
                  className="w-8 h-8 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center"
                >
                  <X size={16} />
                </TouchableOpacity>
              </View>

              <View onSubmit={handleSubmit} className="space-y-4">
                <View>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Goal Name</label>
                  <TextInput 
                    type="text" 
                    required
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. New Laptop"
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </View>
                
                <View>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Target Amount (৳)</label>
                  <TextInput 
                    type="number" 
                    required
                    min="1"
                    value={targetAmount}
                    onChange={e => setTargetAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </View>

                <View>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Target Date</label>
                  <TextInput 
                    type="date" 
                    required
                    value={deadline}
                    onChange={e => setDeadline(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </View>

                <View>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Icon</label>
                  <View className="flex gap-3">
                    {Object.keys(iconMap).map(iconName => (
                      <TouchableOpacity
                        key={iconName}
                        type="button"
                        onPress={() => setIcon(iconName)}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                          icon === iconName 
                            ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400 border-2 border-emerald-500' 
                            : 'bg-zinc-50 text-zinc-500 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700'
                        }`}
                      >
                        {iconMap[iconName]}
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <TouchableOpacity 
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl mt-6 transition-colors active:scale-[0.98]"
                >
                  Save Goal
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>

      <View>
        {showPremiumAlert && (
          <View 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          >
            <View 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-3xl p-6 shadow-xl text-center"
            >
              <View className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown size={32} />
              </View>
              <Text className="text-xl font-bold mb-2">Goal Limit Reached</Text>
              <Text className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
                Free users can only create up to 3 savings goals. Upgrade to Premium for unlimited goals!
              </Text>
              <View className="flex gap-3">
                <TouchableOpacity 
                  onPress={() => setShowPremiumAlert(false)}
                  className="flex-1 py-3 rounded-xl font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors"
                >
                  Cancel
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => {
                    setShowPremiumAlert(false);
                    navigate('/premium');
                  }}
                  className="flex-1 py-3 rounded-xl font-medium bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/20 transition-transform active:scale-95"
                >
                  Upgrade
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
