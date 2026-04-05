import { create } from 'zustand';
import { addDays, subDays } from 'date-fns';

export type Category = 'Food' | 'Transport' | 'Rent' | 'Shopping' | 'Bills' | 'Entertainment' | 'Health' | 'Education' | 'Income';

export interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: Category;
  date: string;
  note: string;
  tags: string[];
}

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  icon: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  progress: number;
  total: number;
  completed: boolean;
}

interface AppState {
  isLoggedIn: boolean;
  hasCompletedOnboarding: boolean;
  balance: number;
  monthlyIncome: number;
  transactions: Transaction[];
  goals: Goal[];
  challenges: Challenge[];
  login: () => void;
  completeOnboarding: () => void;
  addTransaction: (t: Omit<Transaction, 'id'>) => void;
  addGoal: (g: Omit<Goal, 'id'>) => void;
}

const dummyTransactions: Transaction[] = [
  { id: '1', amount: 50000, type: 'income', category: 'Income', date: new Date().toISOString(), note: 'Salary', tags: [] },
  { id: '2', amount: 1200, type: 'expense', category: 'Food', date: new Date().toISOString(), note: 'Groceries', tags: ['supermarket'] },
  { id: '3', amount: 300, type: 'expense', category: 'Transport', date: subDays(new Date(), 1).toISOString(), note: 'Uber', tags: [] },
  { id: '4', amount: 15000, type: 'expense', category: 'Rent', date: subDays(new Date(), 2).toISOString(), note: 'Monthly Rent', tags: [] },
  { id: '5', amount: 2000, type: 'expense', category: 'Entertainment', date: subDays(new Date(), 3).toISOString(), note: 'Movies', tags: [] },
  { id: '6', amount: 800, type: 'expense', category: 'Food', date: subDays(new Date(), 4).toISOString(), note: 'Restaurant', tags: [] },
];

const dummyGoals: Goal[] = [
  { id: '1', title: 'Emergency Fund', targetAmount: 100000, currentAmount: 45000, deadline: addDays(new Date(), 180).toISOString(), icon: 'ShieldAlert' },
  { id: '2', title: 'New Laptop', targetAmount: 80000, currentAmount: 20000, deadline: addDays(new Date(), 90).toISOString(), icon: 'Laptop' },
];

const dummyChallenges: Challenge[] = [
  { id: '1', title: 'No Food Delivery', description: 'Avoid ordering food for 7 days', progress: 3, total: 7, completed: false },
  { id: '2', title: 'Save ৳100 Daily', description: 'Save ৳100 every day this week', progress: 5, total: 7, completed: false },
];

export const useStore = create<AppState>((set) => ({
  isLoggedIn: false,
  hasCompletedOnboarding: false,
  balance: 32500,
  monthlyIncome: 50000,
  transactions: dummyTransactions,
  goals: dummyGoals,
  challenges: dummyChallenges,
  login: () => set({ isLoggedIn: true }),
  completeOnboarding: () => set({ hasCompletedOnboarding: true }),
  addTransaction: (t) => set((state) => {
    const newTransaction = { ...t, id: Math.random().toString(36).substring(2, 9) };
    const amountChange = t.type === 'income' ? t.amount : -t.amount;
    return {
      transactions: [newTransaction, ...state.transactions],
      balance: state.balance + amountChange
    };
  }),
  addGoal: (g) => set((state) => ({
    goals: [...state.goals, { ...g, id: Math.random().toString(36).substring(2, 9) }]
  })),
}));
