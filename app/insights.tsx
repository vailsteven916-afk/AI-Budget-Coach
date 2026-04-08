import { View, Text, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native';
import { BrainCircuit, TrendingDown, AlertTriangle, Lightbulb, Trophy } from 'lucide-react-native';
import { useStore } from '../store/useStore';
import { formatCurrency } from '../lib/utils';

export default function Insights() {
  const transactions = useStore(state => state.transactions);

  const now = new Date();
  const currentMonth = now.getMonth();
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const currentYear = now.getFullYear();
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const currentMonthExpenses = transactions.filter(t => t.type === 'expense' && new Date(t.date).getMonth() === currentMonth && new Date(t.date).getFullYear() === currentYear);
  const lastMonthExpenses = transactions.filter(t => t.type === 'expense' && new Date(t.date).getMonth() === lastMonth && new Date(t.date).getFullYear() === lastMonthYear);

  const currentMonthTotal = currentMonthExpenses.reduce((sum, t) => sum + t.amount, 0);
  const lastMonthTotal = lastMonthExpenses.reduce((sum, t) => sum + t.amount, 0);

  const categoryTotals = currentMonthExpenses.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];

  const dynamicInsights = [];

  if (topCategory) {
    dynamicInsights.push({
      id: 'top-cat',
      type: 'warning',
      icon: <AlertTriangle size={20} className="text-amber-500" />,
      title: `High ${topCategory[0]} Spending`,
      message: `You've spent ${formatCurrency(topCategory[1])} on ${topCategory[0]} this month. Keep an eye on this category!`,
      color: "bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-900/50"
    });
  }

  if (lastMonthTotal > 0) {
    const diff = currentMonthTotal - lastMonthTotal;
    const percentChange = Math.abs((diff / lastMonthTotal) * 100).toFixed(0);
    
    if (diff > 0) {
      dynamicInsights.push({
        id: 'mom-up',
        type: 'prediction',
        icon: <TrendingDown size={20} className="text-rose-500" />,
        title: "Spending is Up",
        message: `Your spending is up ${percentChange}% compared to last month. Try to slow down your expenses.`,
        color: "bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-900/50"
      });
    } else {
      dynamicInsights.push({
        id: 'mom-down',
        type: 'positive',
        icon: <Trophy size={20} className="text-emerald-500" />,
        title: "Great Progress!",
        message: `You are spending ${percentChange}% less than last month. Keep it up!`,
        color: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900/50"
      });
    }
  }

  if (topCategory && topCategory[1] > 0) {
    const potentialSavings = topCategory[1] * 0.2;
    dynamicInsights.push({
      id: 'savings-opp',
      type: 'suggestion',
      icon: <Lightbulb size={20} className="text-blue-500" />,
      title: "Savings Opportunity",
      message: `If you reduce your ${topCategory[0]} spending by 20%, you could save ${formatCurrency(potentialSavings)} this month.`,
      color: "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/50"
    });
  }

  if (dynamicInsights.length === 0) {
    dynamicInsights.push({
      id: 'no-data',
      type: 'suggestion',
      icon: <Lightbulb size={20} className="text-blue-500" />,
      title: "Start Tracking",
      message: "Add more transactions to get personalized AI insights about your spending habits.",
      color: "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/50"
    });
  }

  return (
    <View className="flex flex-col min-h-full pb-24">
      <View className="px-6 pt-12 pb-6 sticky top-0 bg-gray-50/80 dark:bg-zinc-950/80 backdrop-blur-md z-10">
        <View className="flex items-center gap-3">
          <View className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
            <BrainCircuit className="text-emerald-600 dark:text-emerald-400" size={24} />
          </View>
          <Text className="text-2xl font-bold">AI Coach</Text>
        </View>
      </View>

      <View className="px-6 space-y-4">
        {dynamicInsights.map((insight, index) => (
          <View
            key={insight.id} className={`p-5 rounded-3xl border ${insight.color}`}
          >
            <View className="flex gap-4">
              <View className="bg-white dark:bg-zinc-900 p-2 rounded-xl h-fit shadow-sm">
                {insight.icon}
              </View>
              <View>
                <Text className="font-bold mb-1 text-zinc-900 dark:text-zinc-100">{insight.title}</Text>
                <Text className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {insight.message}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
