import { create } from 'zustand';
import { addDays, subDays } from 'date-fns';
import { User } from 'firebase/auth';

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
  isAuthReady: boolean;
  user: User | null;
  hasCompletedOnboarding: boolean;
  balance: number;
  transactions: Transaction[];
  goals: Goal[];
  challenges: Challenge[];
  setUser: (user: User | null) => void;
  setAuthReady: (ready: boolean) => void;
  completeOnboarding: () => void;
  addTransaction: (t: Omit<Transaction, 'id'>) => void;
  addGoal: (g: Omit<Goal, 'id'>) => void;
}

export const useStore = create<AppState>((set) => ({
  isLoggedIn: false,
  isAuthReady: false,
  user: null,
  hasCompletedOnboarding: false,
  balance: 0,
  transactions: [],
  goals: [],
  challenges: [],
  setUser: (user) => set({ user, isLoggedIn: !!user }),
  setAuthReady: (ready) => set({ isAuthReady: ready }),
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
