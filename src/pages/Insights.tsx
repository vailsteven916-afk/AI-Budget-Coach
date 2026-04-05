import { motion } from 'motion/react';
import { BrainCircuit, TrendingDown, AlertTriangle, Lightbulb, Trophy } from 'lucide-react';

const insights = [
  {
    id: 1,
    type: 'warning',
    icon: <AlertTriangle size={20} className="text-amber-500" />,
    title: "High Food Spending",
    message: "You spent 28% more on food this week compared to last week.",
    color: "bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-900/50"
  },
  {
    id: 2,
    type: 'prediction',
    icon: <TrendingDown size={20} className="text-rose-500" />,
    title: "Budget Risk",
    message: "You are likely to exceed your shopping budget in 5 days at your current rate.",
    color: "bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-900/50"
  },
  {
    id: 3,
    type: 'suggestion',
    icon: <Lightbulb size={20} className="text-blue-500" />,
    title: "Savings Opportunity",
    message: "If you reduce food delivery by ৳2,000 per month, you could save ৳24,000 per year.",
    color: "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/50"
  },
  {
    id: 4,
    type: 'positive',
    icon: <Trophy size={20} className="text-emerald-500" />,
    title: "Great Progress!",
    message: "You are spending 15% less than last month. Keep it up!",
    color: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900/50"
  }
];

export default function Insights() {
  return (
    <div className="flex flex-col min-h-full pb-24">
      <header className="px-6 pt-12 pb-6 sticky top-0 bg-gray-50/80 dark:bg-zinc-950/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
            <BrainCircuit className="text-emerald-600 dark:text-emerald-400" size={24} />
          </div>
          <h1 className="text-2xl font-bold">AI Coach</h1>
        </div>
      </header>

      <div className="px-6 space-y-4">
        {insights.map((insight, index) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-5 rounded-3xl border ${insight.color}`}
          >
            <div className="flex gap-4">
              <div className="bg-white dark:bg-zinc-900 p-2 rounded-xl h-fit shadow-sm">
                {insight.icon}
              </div>
              <div>
                <h3 className="font-bold mb-1 text-zinc-900 dark:text-zinc-100">{insight.title}</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {insight.message}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
