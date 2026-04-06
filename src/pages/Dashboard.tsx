import { useStore } from '../store/useStore';
import { formatCurrency, cn } from '../lib/utils';
import { motion } from 'motion/react';
import { Bell, ArrowUpRight, ArrowDownRight, Wallet, Sparkles, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
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
    <div className="flex flex-col min-h-full pb-24">
      {/* Header */}
      <header className="px-6 pt-12 pb-6 flex justify-between items-center sticky top-0 bg-gray-50/80 dark:bg-zinc-950/80 backdrop-blur-md z-10">
        <div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium mb-1">Good morning,</p>
          <h1 className="text-2xl font-bold">{user?.displayName?.split(' ')[0] || 'User'}</h1>
        </div>
        <button className="w-10 h-10 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white dark:border-zinc-900"></span>
        </button>
      </header>

      <div className="px-6 space-y-6">
        {/* Balance Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900 dark:bg-zinc-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Wallet size={20} className="text-emerald-400" />
              <span className="text-zinc-400 font-medium">{t('totalBalance')}</span>
            </div>
            <h2 className="text-4xl font-bold mb-6">{formatCurrency(balance)}</h2>
            
            <div className="flex gap-4">
              <div className="flex-1 bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                <div className="flex items-center gap-1 text-emerald-400 mb-1">
                  <ArrowDownRight size={16} />
                  <span className="text-xs font-medium">Income</span>
                </div>
                <p className="font-semibold">{formatCurrency(monthlyIncome)}</p>
              </div>
              <div className="flex-1 bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                <div className="flex items-center gap-1 text-rose-400 mb-1">
                  <ArrowUpRight size={16} />
                  <span className="text-xs font-medium">Expenses</span>
                </div>
                <p className="font-semibold">{formatCurrency(monthlyExpenses)}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* AI Insight Snippet */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/50 rounded-2xl p-4 flex gap-4 items-start"
        >
          <div className="bg-emerald-100 dark:bg-emerald-900/50 p-2 rounded-xl text-emerald-600 dark:text-emerald-400 shrink-0">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-emerald-900 dark:text-emerald-100 mb-1">Safe to spend today</h3>
            {monthlyIncome === 0 ? (
              <p className="text-emerald-700 dark:text-emerald-300 text-sm leading-relaxed">
                Add your income to see your safe daily spending limit.
              </p>
            ) : (
              <p className="text-emerald-700 dark:text-emerald-300 text-sm leading-relaxed">
                You have <span className="font-bold">{formatCurrency(remainingMoney - plannedSavings)}</span> left for the remaining {remainingDays} days of the month. You can safely spend <span className="font-bold">{formatCurrency(safeDailySpend)}</span> today.
              </p>
            )}
          </div>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-between items-end mb-4">
            <h3 className="text-lg font-bold">{t('recentTransactions')}</h3>
            <Link to="/transactions" className="text-sm font-medium text-emerald-600 dark:text-emerald-400 flex items-center">
              {t('viewAll')} <ChevronRight size={16} />
            </Link>
          </div>
          
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-2 shadow-sm border border-zinc-100 dark:border-zinc-800">
            {recentTransactions.length === 0 ? (
              <div className="p-8 text-center text-zinc-500 dark:text-zinc-400">
                <p>No recent transactions.</p>
                <Link to="/add-transaction" className="text-emerald-500 font-medium mt-2 inline-block">Add one now</Link>
              </div>
            ) : (
              recentTransactions.map((t, i) => {
                const date = new Date(t.date);
                const dateLabel = isToday(date) ? 'Today' : isYesterday(date) ? 'Yesterday' : format(date, 'MMM d');
                
                return (
                  <div key={t.id} className={cn("flex items-center justify-between p-4", i !== recentTransactions.length - 1 && "border-b border-zinc-100 dark:border-zinc-800")}>
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center",
                        t.type === 'income' ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                      )}>
                        {t.type === 'income' ? <ArrowDownRight size={20} /> : <ArrowUpRight size={20} />}
                      </div>
                      <div>
                        <p className="font-semibold">{t.category}</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">{t.note} • {dateLabel}</p>
                      </div>
                    </div>
                    <p className={cn("font-bold", t.type === 'income' ? "text-emerald-600 dark:text-emerald-400" : "")}>
                      {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
