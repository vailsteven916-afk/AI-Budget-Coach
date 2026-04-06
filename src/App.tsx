import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, doc, onSnapshot, query, orderBy, setDoc } from 'firebase/firestore';
import { auth, db } from './lib/firebase';
import { logInRevenueCat, checkPremiumStatus } from './lib/revenuecat';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Onboarding from './pages/Onboarding';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import AddTransaction from './pages/AddTransaction';
import Analytics from './pages/Analytics';
import Insights from './pages/Insights';
import Profile from './pages/Profile';
import Goals from './pages/Goals';
import Premium from './pages/Premium';
import Transactions from './pages/Transactions';
import Badges from './pages/Badges';
import Settings from './pages/Settings';
import PrivacySecurity from './pages/PrivacySecurity';
import HelpSupport from './pages/HelpSupport';
import { useStore } from './store/useStore';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, hasCompletedOnboarding, isAuthReady } = useStore();
  
  if (!isAuthReady) {
    return <div className="flex items-center justify-center h-screen bg-zinc-950 text-emerald-500">Loading...</div>;
  }

  if (!hasCompletedOnboarding) return <Navigate to="/onboarding" />;
  if (!isLoggedIn) return <Navigate to="/login" />;
  
  return <>{children}</>;
}

export default function App() {
  const { 
    setUser, 
    setAuthReady, 
    user,
    setTransactions, 
    setGoals, 
    setChallenges, 
    setBalance, 
    setHasCompletedOnboarding,
    setIsPremium,
    darkMode
  } = useStore();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        try {
          const customerInfo = await logInRevenueCat(user.uid);
          const hasPremium = checkPremiumStatus(customerInfo);
          
          setIsPremium(hasPremium);
          
          if (hasPremium) {
            await setDoc(doc(db, 'users', user.uid), { isPremium: true }, { merge: true });
          }
        } catch (error) {
          console.error("Error checking RevenueCat entitlements:", error);
        }
      } else {
        setAuthReady(true);
      }
    });
    return () => unsubscribe();
  }, [setUser, setAuthReady, setIsPremium]);

  useEffect(() => {
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    const unsubscribeUser = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.balance !== undefined) setBalance(data.balance);
        if (data.hasCompletedOnboarding !== undefined) setHasCompletedOnboarding(data.hasCompletedOnboarding);
        if (data.isPremium !== undefined) setIsPremium(data.isPremium);
      }
      setAuthReady(true);
    }, (error) => {
      console.error('Firestore Error: ', error);
      setAuthReady(true);
    });

    const transactionsRef = collection(db, 'users', user.uid, 'transactions');
    const qTransactions = query(transactionsRef, orderBy('date', 'desc'));
    const unsubscribeTransactions = onSnapshot(qTransactions, (snapshot) => {
      const txs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      setTransactions(txs);
    }, (error) => {
      console.error('Firestore Error: ', error);
    });

    const goalsRef = collection(db, 'users', user.uid, 'goals');
    const unsubscribeGoals = onSnapshot(goalsRef, (snapshot) => {
      const gls = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      setGoals(gls);
    }, (error) => {
      console.error('Firestore Error: ', error);
    });

    const challengesRef = collection(db, 'users', user.uid, 'challenges');
    const unsubscribeChallenges = onSnapshot(challengesRef, (snapshot) => {
      const chs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      setChallenges(chs);
    }, (error) => {
      console.error('Firestore Error: ', error);
    });

    return () => {
      unsubscribeUser();
      unsubscribeTransactions();
      unsubscribeGoals();
      unsubscribeChallenges();
    };
  }, [user, setTransactions, setGoals, setChallenges, setBalance, setHasCompletedOnboarding, setIsPremium, setAuthReady]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="add-transaction" element={<AddTransaction />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="insights" element={<Insights />} />
          <Route path="profile" element={<Profile />} />
          <Route path="goals" element={<Goals />} />
          <Route path="premium" element={<Premium />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="badges" element={<Badges />} />
          <Route path="settings" element={<Settings />} />
          <Route path="privacy" element={<PrivacySecurity />} />
          <Route path="help" element={<HelpSupport />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
