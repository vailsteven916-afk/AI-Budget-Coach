import { View, Text, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native';
import { useStore } from '../store/useStore';
import { formatCurrency, cn } from '../lib/utils';
import { motion } from 'react-native';
import { Bell, ArrowUpRight, ArrowDownRight, Wallet, Sparkles, ChevronRight } from 'lucide-react-native';
import { Link } from 'expo-router';
import { format, isToday, isYesterday } from 'date-fns';
import { useTranslation } from '../lib/i18n';

export default function Dashboard() {
  const { balance, transactions, goals, user, language } = useStore();
  const { t } = useTranslation(language);

  const monthlyExpenses = transactions
    .filter(t => t.type === 'expense' && new Date(t.date).getMonth() === new Date().getMonth())
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyIncome = transactions
    .filter(t => t.type === 'income' && new Date(t.date).getMonth() === new Date().getMonth())
    .reduce((sum, t) => sum + t.amount, 0);

  // Safe to spend calculation
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const currentDay = new Date().getDate();
  const remainingDays = daysInMonth - currentDay + 1;
  const plannedSavings = goals.reduce((sum, g) => sum + (g.targetAmount / 12), 0); // Rough estimate
  const remainingMoney = monthlyIncome - monthlyExpenses;
  const safeDailySpend = Math.max(0, (remainingMoney - plannedSavings) / remainingDays);

  const recentTransactions = transactions.slice(0, 4);

  return (
    <View className="flex flex-col min-h-full pb-24">
      {/* Header */}
      <header className="px-6 pt-12 pb-6 flex justify-between items-center sticky top-0 bg-gray-50/80 dark:bg-zinc-950/80 backdrop-blur-md z-10">
        <View>
          <Text className="text-sm text-zinc-500 dark:text-zinc-400 font-medium mb-1">Good morning,</Text>
          <Text className="text-2xl font-bold">{user?.displayName?.split(' ')[0] || 'User'}</Text>
        </View>
        <TouchableOpacity className="w-10 h-10 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center relative">
          <Bell size={20} />
          <Text className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white dark:border-zinc-900"></Text>
        </TouchableOpacity>
      </header>

      <View className="px-6 space-y-6">
        {/* Balance Card */}
        <View 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900 dark:bg-zinc-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden"
        >
          <View className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          
          <View className="relative z-10">
            <View className="flex items-center gap-2 mb-2">
              <Wallet size={20} className="text-emerald-400" />
              <Text className="text-zinc-400 font-medium">{t('totalBalance')}</Text>
            </View>
            <Text className="text-4xl font-bold mb-6">{formatCurrency(balance)}</Text>
            
            <View className="flex gap-4">
              <View className="flex-1 bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                <View className="flex items-center gap-1 text-emerald-400 mb-1">
                  <ArrowDownRight size={16} />
                  <Text className="text-xs font-medium">Income</Text>
                </View>
                <Text className="font-semibold">{formatCurrency(monthlyIncome)}</Text>
              </View>
              <View className="flex-1 bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                <View className="flex items-center gap-1 text-rose-400 mb-1">
                  <ArrowUpRight size={16} />
                  <Text className="text-xs font-medium">Expenses</Text>
                </View>
                <Text className="font-semibold">{formatCurrency(monthlyExpenses)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* AI Insight Snippet */}
        <View 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/50 rounded-2xl p-4 flex gap-4 items-start"
        >
          <View className="bg-emerald-100 dark:bg-emerald-900/50 p-2 rounded-xl text-emerald-600 dark:text-emerald-400 shrink-0">
            <Sparkles size={20} />
          </View>
          <View>
            <Text className="font-semibold text-emerald-900 dark:text-emerald-100 mb-1">Safe to spend today</Text>
            {monthlyIncome === 0 ? (
              <Text className="text-emerald-700 dark:text-emerald-300 text-sm leading-relaxed">
                Add your income to see your safe daily spending limit.
              </Text>
            ) : (
              <Text className="text-emerald-700 dark:text-emerald-300 text-sm leading-relaxed">
                You have <Text className="font-bold">{formatCurrency(remainingMoney - plannedSavings)}</Text> left for the remaining {remainingDays} days of the month. You can safely spend <Text className="font-bold">{formatCurrency(safeDailySpend)}</Text> today.
              </Text>
            )}
          </View>
        </View>

        {/* Recent Transactions */}
        <View 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <View className="flex justify-between items-end mb-4">
            <Text className="text-lg font-bold">{t('recentTransactions')}</Text>
            <Link href="/transactions" className="text-sm font-medium text-emerald-600 dark:text-emerald-400 flex items-center">
              {t('viewAll')} <ChevronRight size={16} />
            </Link>
          </View>
          
          <View className="bg-white dark:bg-zinc-900 rounded-3xl p-2 shadow-sm border border-zinc-100 dark:border-zinc-800">
            {recentTransactions.length === 0 ? (
              <View className="p-8 text-center text-zinc-500 dark:text-zinc-400">
                <Text>No recent transactions.</Text>
                <Link href="/add-transaction" className="text-emerald-500 font-medium mt-2 inline-block">Add one now</Link>
              </View>
            ) : (
              recentTransactions.map((t, i) => {
                const date = new Date(t.date);
                const dateLabel = isToday(date) ? 'Today' : isYesterday(date) ? 'Yesterday' : format(date, 'MMM d');
                
                return (
                  <View key={t.id} className={cn("flex items-center justify-between p-4", i !== recentTransactions.length - 1 && "border-b border-zinc-100 dark:border-zinc-800")}>
                    <View className="flex items-center gap-4">
                      <View className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center",
                        t.type === 'income' ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                      )}>
                        {t.type === 'income' ? <ArrowDownRight size={20} /> : <ArrowUpRight size={20} />}
                      </View>
                      <View>
                        <Text className="font-semibold">{t.category}</Text>
                        <Text className="text-xs text-zinc-500 dark:text-zinc-400">{t.note} • {dateLabel}</Text>
                      </View>
                    </View>
                    <Text className={cn("font-bold", t.type === 'income' ? "text-emerald-600 dark:text-emerald-400" : "")}>
                      {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                    </Text>
                  </View>
                );
              })
            )}
          </View>
        </View>
      </View>
    </View>
  );
}
