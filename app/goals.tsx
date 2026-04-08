import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { formatCurrency } from '../lib/utils';
import { Target, Plus, ShieldAlert, Laptop, Plane, Car, Heart, X, Crown } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const iconMap: Record<string, React.ReactNode> = {
  ShieldAlert: <ShieldAlert size={24} />,
  Laptop: <Laptop size={24} />,
  Plane: <Plane size={24} />,
  Car: <Car size={24} />,
  Heart: <Heart size={24} />,
};

export default function Goals() {
  const router = useRouter();
  const { goals, addGoal, isPremium } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [showPremiumAlert, setShowPremiumAlert] = useState(false);
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [icon, setIcon] = useState('Target');

  const handleSubmit = async () => {
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
      <View className="px-6 pt-12 pb-6 flex justify-between items-center sticky top-0 bg-gray-50/80 dark:bg-zinc-950/80 backdrop-blur-md z-10">
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
      </View>

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
              <Text className="text-white font-semibold">Create Goal</Text>
            </TouchableOpacity>
          </View>
        ) : (
          goals.map((goal, index) => {
            const progress = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
            
            return (
              <View
                key={goal.id} className="bg-white dark:bg-zinc-900 rounded-3xl p-5 shadow-sm border border-zinc-100 dark:border-zinc-800"
              >
                <View className="flex flex-row gap-4 mb-4">
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
                  <View className="h-full bg-emerald-500 rounded-full" style={{ width: `${progress}%` }} />
                </View>
                
                <Text className="text-xs text-zinc-500 dark:text-zinc-400 mt-3 text-center">
                  {formatCurrency(goal.targetAmount - goal.currentAmount)} left to reach your goal
                </Text>
              </View>
            );
          })
        )}
      </View>

      {isAdding && (
        <View className="absolute inset-0 z-50 flex justify-center bg-black/50 p-4">
          <View className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-3xl p-6 shadow-xl">
            <View className="flex flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold text-zinc-900 dark:text-white">Create New Goal</Text>
              <TouchableOpacity 
                onPress={() => setIsAdding(false)}
                className="w-8 h-8 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center"
              >
                <X size={16} />
              </TouchableOpacity>
            </View>

            <View className="space-y-4">
              <View>
                <Text className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Goal Name</Text>
                <TextInput 
                  value={title}
                  onChangeText={setTitle}
                  placeholder="e.g. New Laptop"
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-white"
                />
              </View>
              
              <View>
                <Text className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Target Amount (৳)</Text>
                <TextInput 
                  keyboardType="numeric"
                  value={targetAmount}
                  onChangeText={setTargetAmount}
                  placeholder="0.00"
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-white"
                />
              </View>

              <View>
                <Text className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Target Date</Text>
                <TextInput 
                  value={deadline}
                  onChangeText={setDeadline}
                  placeholder="YYYY-MM-DD"
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-white"
                />
              </View>

              <View>
                <Text className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Icon</Text>
                <View className="flex flex-row flex-wrap gap-3">
                  {Object.keys(iconMap).map(iconName => (
                    <TouchableOpacity
                      key={iconName}
                      onPress={() => setIcon(iconName)}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                        icon === iconName 
                          ? 'bg-emerald-100 dark:bg-emerald-900/50 border-2 border-emerald-500' 
                          : 'bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700'
                      }`}
                    >
                      {iconMap[iconName]}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity onPress={handleSubmit} className="w-full bg-emerald-500 py-4 rounded-xl mt-6 items-center">
                <Text className="text-white font-bold">Save Goal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {showPremiumAlert && (
        <View className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <View className="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-3xl p-6 shadow-xl text-center">
            <View className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Crown size={32} color="#d97706" />
            </View>
            <Text className="text-xl font-bold mb-2 text-zinc-900 dark:text-white">Goal Limit Reached</Text>
            <Text className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
              Free users can only create up to 3 savings goals. Upgrade to Premium for unlimited goals!
            </Text>
            <View className="flex flex-row gap-3">
              <TouchableOpacity 
                onPress={() => setShowPremiumAlert(false)}
                className="flex-1 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 items-center"
              >
                <Text className="font-medium text-zinc-600 dark:text-zinc-300">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => {
                  setShowPremiumAlert(false);
                  router.push('/premium');
                }}
                className="flex-1 py-3 rounded-xl bg-amber-500 items-center"
              >
                <Text className="font-medium text-white">Upgrade</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
