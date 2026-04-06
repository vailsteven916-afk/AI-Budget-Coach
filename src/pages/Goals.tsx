import React from 'react';
import { useStore } from '../store/useStore';
import { formatCurrency } from '../lib/utils';
import { motion } from 'motion/react';
import { Target, Plus, ShieldAlert, Laptop, Plane, Car, Heart } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  ShieldAlert: <ShieldAlert size={24} />,
  Laptop: <Laptop size={24} />,
  Plane: <Plane size={24} />,
  Car: <Car size={24} />,
  Heart: <Heart size={24} />,
};

export default function Goals() {
  const goals = useStore(state => state.goals);

  return (
    <div className="flex flex-col min-h-full pb-24">
      <header className="px-6 pt-12 pb-6 flex justify-between items-center sticky top-0 bg-gray-50/80 dark:bg-zinc-950/80 backdrop-blur-md z-10">
        <h1 className="text-2xl font-bold">Savings Goals</h1>
        <button className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center">
          <Plus size={20} />
        </button>
      </header>

      <div className="px-6 space-y-4">
        {goals.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 text-center shadow-sm border border-zinc-100 dark:border-zinc-800">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Target size={32} />
            </div>
            <h3 className="text-lg font-bold mb-2">No Goals Yet</h3>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-6">Set a savings goal to start tracking your progress.</p>
            <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors active:scale-[0.98]">
              Create Goal
            </button>
          </div>
        ) : (
          goals.map((goal, index) => {
            const progress = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
            
            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-zinc-900 rounded-3xl p-5 shadow-sm border border-zinc-100 dark:border-zinc-800"
              >
                <div className="flex gap-4 mb-4">
                  <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-2xl flex items-center justify-center shrink-0">
                    {iconMap[goal.icon] || <Target size={24} />}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{goal.title}</h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      {progress.toFixed(0)}%
                    </span>
                  </div>
                </div>

                <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="h-full bg-emerald-500 rounded-full"
                  />
                </div>
                
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-3 text-center">
                  {formatCurrency(goal.targetAmount - goal.currentAmount)} left to reach your goal
                </p>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
