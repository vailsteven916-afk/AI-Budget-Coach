import { create } from 'zustand';
import { addDays, subDays } from 'date-fns';
import { User } from 'firebase/auth';
import { collection, doc, setDoc, addDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../lib/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  darkMode: boolean;
  notifications: boolean;
  language: string;
  isPremium: boolean;
  balance: number;
  transactions: Transaction[];
  goals: Goal[];
  challenges: Challenge[];
  setUser: (user: User | null) => void;
  setAuthReady: (ready: boolean) => void;
  setDarkMode: (isDark: boolean) => void;
  setNotifications: (enabled: boolean) => void;
  setLanguage: (lang: string) => void;
  setIsPremium: (isPremium: boolean) => void;
  completeOnboarding: () => void;
  setHasCompletedOnboarding: (completed: boolean) => void;
  setTransactions: (transactions: Transaction[]) => void;
  setGoals: (goals: Goal[]) => void;
  setChallenges: (challenges: Challenge[]) => void;
  setBalance: (balance: number) => void;
  addTransaction: (t: Omit<Transaction, 'id'>) => Promise<void>;
  addGoal: (g: Omit<Goal, 'id'>) => Promise<void>;
  loadSettings: () => Promise<void>;
}

export const useStore = create<AppState>((set) => ({
  isLoggedIn: false,
  isAuthReady: false,
  user: null,
  hasCompletedOnboarding: false,
  darkMode: true,
  notifications: true,
  language: 'English',
  isPremium: false,
  balance: 0,
  transactions: [],
  goals: [],
  challenges: [],
  loadSettings: async () => {
    try {
      const dark = await AsyncStorage.getItem('darkMode');
      const notif = await AsyncStorage.getItem('notifications');
      const lang = await AsyncStorage.getItem('language');
      set({
        darkMode: dark !== 'false',
        notifications: notif !== 'false',
        language: lang || 'English'
      });
    } catch (e) {
      console.error(e);
    }
  },
  setUser: (user) => {
    if (user) {
      set({ user, isLoggedIn: true });
    } else {
      set({ 
        user: null, 
        isLoggedIn: false,
        isPremium: false,
        balance: 0,
        transactions: [],
        goals: [],
        challenges: [],
        hasCompletedOnboarding: false
      });
    }
  },
  setAuthReady: (ready) => set({ isAuthReady: ready }),
  setDarkMode: async (isDark) => {
    await AsyncStorage.setItem('darkMode', String(isDark));
    set({ darkMode: isDark });
  },
  setNotifications: async (enabled) => {
    await AsyncStorage.setItem('notifications', String(enabled));
    set({ notifications: enabled });
  },
  setLanguage: async (lang) => {
    await AsyncStorage.setItem('language', lang);
    set({ language: lang });
  },
  setIsPremium: (isPremium) => set({ isPremium }),
  setHasCompletedOnboarding: (completed) => set({ hasCompletedOnboarding: completed }),
  setTransactions: (transactions) => set({ transactions }),
  setGoals: (goals) => set({ goals }),
  setChallenges: (challenges) => set({ challenges }),
  setBalance: (balance) => set({ balance }),
  addTransaction: async (t) => {
    const state = useStore.getState();
    if (!state.user) return;
    
    const amountChange = t.type === 'income' ? t.amount : -t.amount;
    
    try {
      // Add transaction
      await addDoc(collection(db, 'users', state.user.uid, 'transactions'), t);
      
      // Update balance
      await setDoc(doc(db, 'users', state.user.uid), {
        balance: increment(amountChange)
      }, { merge: true });
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  },
  addGoal: async (g) => {
    const state = useStore.getState();
    if (!state.user) return;
    
    try {
      await addDoc(collection(db, 'users', state.user.uid, 'goals'), g);
    } catch (error) {
      console.error('Error adding goal:', error);
    }
  },
  completeOnboarding: async () => {
    const state = useStore.getState();
    set({ hasCompletedOnboarding: true });
    if (state.user) {
      try {
        await setDoc(doc(db, 'users', state.user.uid), {
          hasCompletedOnboarding: true
        }, { merge: true });
      } catch (error) {
        console.error('Error completing onboarding:', error);
      }
    }
  },
}));
