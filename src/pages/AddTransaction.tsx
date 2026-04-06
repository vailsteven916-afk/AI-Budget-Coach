import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore, Category } from '../store/useStore';
import { motion } from 'motion/react';
import { X, ArrowUpRight, ArrowDownRight, Tag, AlignLeft, Calendar } from 'lucide-react';

const categories: Category[] = ['Food', 'Transport', 'Rent', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Education', 'Income'];

export default function AddTransaction() {
  const navigate = useNavigate();
  const addTransaction = useStore(state => state.addTransaction);
  
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>('Food');
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;
    
    addTransaction({
      amount: parseFloat(amount),
      type,
      category,
      note,
      date: new Date().toISOString(),
      tags: []
    });
    navigate(-1);
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-gray-50 dark:bg-zinc-950">
      <header className="px-6 pt-12 pb-6 flex justify-between items-center bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white">
          <X size={24} />
        </button>
        <h1 className="text-lg font-bold">Add Transaction</h1>
        <div className="w-10" /> {/* Spacer */}
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex bg-zinc-100 dark:bg-zinc-900 p-1 rounded-2xl mb-8">
          <button
            onClick={() => {
              setType('expense');
              if (category === 'Income') setCategory('Food');
            }}
            className={`flex-1 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
              type === 'expense' ? 'bg-white dark:bg-zinc-800 shadow-sm text-zinc-900 dark:text-white' : 'text-zinc-500'
            }`}
          >
            <ArrowUpRight size={18} className={type === 'expense' ? 'text-rose-500' : ''} />
            Expense
          </button>
          <button
            onClick={() => {
              setType('income');
              setCategory('Income');
            }}
            className={`flex-1 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
              type === 'income' ? 'bg-white dark:bg-zinc-800 shadow-sm text-zinc-900 dark:text-white' : 'text-zinc-500'
            }`}
          >
            <ArrowDownRight size={18} className={type === 'income' ? 'text-emerald-500' : ''} />
            Income
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center mb-8">
            <label className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2 block">Amount</label>
            <div className="flex items-center justify-center text-5xl font-bold">
              <span className="text-zinc-400 mr-1">৳</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-transparent w-full max-w-[200px] text-center focus:outline-none"
                placeholder="0"
                autoFocus
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 block">Category</label>
              <div className="flex flex-wrap gap-2">
                {categories.filter(c => type === 'expense' ? c !== 'Income' : c === 'Income').map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCategory(c)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors border ${
                      category === c 
                        ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300' 
                        : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
              <div className="flex items-center px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
                <AlignLeft size={20} className="text-zinc-400 mr-3" />
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Note (optional)"
                  className="bg-transparent w-full text-sm focus:outline-none"
                />
              </div>
              <div className="flex items-center px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
                <Calendar size={20} className="text-zinc-400 mr-3" />
                <span className="text-sm text-zinc-500">Today</span>
              </div>
              <div className="flex items-center px-4 py-3">
                <Tag size={20} className="text-zinc-400 mr-3" />
                <span className="text-sm text-zinc-500">Add tags...</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-4 rounded-2xl transition-colors active:scale-[0.98] mt-8"
          >
            Save Transaction
          </button>
        </form>
      </div>
    </div>
  );
}
