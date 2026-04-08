import { View, Text, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native';
import { useStore } from '../store/useStore';
import { formatCurrency } from '../lib/utils';
// import recharts removed for React Native
import { startOfWeek, endOfWeek, eachDayOfInterval, format, isSameDay } from 'date-fns';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#64748b'];

export default function Analytics() {
  const transactions = useStore(state => state.transactions);

  const expenses = transactions.filter(t => t.type === 'expense');
  
  const categoryData = expenses.reduce((acc, curr) => {
    const existing = acc.find(item => item.name === curr.category);
    if (existing) {
      existing.value += curr.amount;
    } else {
      acc.push({ name: curr.category, value: curr.amount });
    }
    return acc;
  }, [] as { name: string; value: number }[]).sort((a, b) => b.value - a.value);

  const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);

  const start = startOfWeek(new Date(), { weekStartsOn: 1 });
  const end = endOfWeek(new Date(), { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start, end });

  const weeklyData = days.map(day => {
    const dayExpenses = expenses.filter(t => isSameDay(new Date(t.date), day));
    const amount = dayExpenses.reduce((sum, t) => sum + t.amount, 0);
    return {
      name: format(day, 'EEE'),
      amount
    };
  });

  return (
    <View className="flex flex-col min-h-full pb-24">
      <View className="px-6 pt-12 pb-6 sticky top-0 bg-gray-50/80 dark:bg-zinc-950/80 backdrop-blur-md z-10">
        <Text className="text-2xl font-bold">Analytics</Text>
      </View>

      <View className="px-6 space-y-6">
        <View
          className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-800"
        >
          <Text className="font-semibold mb-6">Spending by Category</Text>
          <View className="h-48 mb-6">
            {categoryData.length === 0 ? (
              <View className="h-full flex items-center justify-center text-zinc-500 dark:text-zinc-400 text-sm">
                No expenses yet
              </View>
            ) : (
              <View style={{height: 200, justifyContent: "center", alignItems: "center"}}><Text style={{color: "white"}}>Chart Placeholder</Text></View>
            )}
          </View>

          <View className="space-y-3">
            {categoryData.map((cat, i) => (
              <View key={cat.name} className="flex items-center justify-between">
                <View className="flex items-center gap-2">
                  <View className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <Text className="text-sm font-medium">{cat.name}</Text>
                </View>
                <View className="text-right">
                  <Text className="text-sm font-bold">{formatCurrency(cat.value)}</Text>
                  <Text className="text-xs text-zinc-500">{((cat.value / totalExpense) * 100).toFixed(1)}%</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View
          className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-800"
        >
          <Text className="font-semibold mb-6">This Week</Text>
          <View className="h-48">
            <View style={{height: 200, justifyContent: "center", alignItems: "center"}}><Text style={{color: "white"}}>Chart Placeholder</Text></View>
          </View>
        </View>
      </View>
    </View>
  );
}
