import { useStore } from '../store/useStore';
import { formatCurrency, cn } from '../lib/utils';
import { ArrowUpRight, ArrowDownRight, ChevronLeft } from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export default function Transactions() {
  const transactions = useStore(state => state.transactions);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-full pb-24">
      <header className="px-6 pt-12 pb-6 flex items-center gap-4 sticky top-0 bg-gray-50/80 dark:bg-zinc-950/80 backdrop-blur-md z-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white bg-white dark:bg-zinc-900 rounded-full shadow-sm">
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold">Transactions</h1>
      </header>

      <div className="px-6">
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-2 shadow-sm border border-zinc-100 dark:border-zinc-800">
          {transactions.map((t, i) => {
            const date = new Date(t.date);
            const dateLabel = isToday(date) ? 'Today' : isYesterday(date) ? 'Yesterday' : format(date, 'MMM d, yyyy');
            
            return (
              <div key={t.id} className={cn("flex items-center justify-between p-4", i !== transactions.length - 1 && "border-b border-zinc-100 dark:border-zinc-800")}>
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
          })}
        </div>
      </div>
    </div>
  );
}
