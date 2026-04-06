import { View, Text, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'react-native';
import { Crown, CheckCircle2, ChevronLeft, Loader2, Lock, X, AlertCircle } from 'lucide-react-native';
import { useNavigate } from 'expo-router';
import { useStore } from '../store/useStore';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { subscribeToPremium, checkPremiumStatus } from '../lib/revenuecat';

export default function Premium() {
  const navigate = useNavigate();
  const { isPremium, user, setIsPremium } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubscribe = async () => {
    if (!user) return;
    setIsLoading(true);
    setErrorMsg(null);
    
    try {
      const customerInfo = await subscribeToPremium();
      const hasPremium = checkPremiumStatus(customerInfo);

      if (hasPremium) {
        setIsPremium(true);
        // Update Firebase to reflect premium status
        await setDoc(doc(db, 'users', user.uid), {
          isPremium: true
        }, { merge: true });
      } else {
        throw new Error("Purchase completed, but premium entitlement was not unlocked.");
      }
    } catch (error: any) {
      console.error('Error upgrading to premium:', error);
      // RevenueCat throws a specific error if the user cancels the purchase flow
      if (error.errorCode === 1 || error.message?.includes('cancelled')) { 
        setErrorMsg(null); // Just ignore user cancellations
      } else {
        setErrorMsg(error.message || "Failed to initiate purchase. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    "Unlimited savings goals",
    "AI-powered spending predictions",
    "Export to PDF/Excel",
    "Multiple wallets/accounts",
    "Family sharing",
    "Advanced analytics",
    "Smart bill forecasting"
  ];

  return (
    <View className="flex flex-col h-[100dvh] bg-zinc-950 text-white relative overflow-hidden">
      {/* Background decoration */}
      <View className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-amber-900/20 via-zinc-950 to-zinc-950 pointer-events-none" />
      
      <header className="px-6 pt-12 pb-6 flex items-center gap-4 relative z-10">
        <TouchableOpacity onPress={() => navigate(-1)} className="p-2 -ml-2 text-zinc-400 hover:text-white">
          <ChevronLeft size={24} />
        </TouchableOpacity>
      </header>

      <View className="flex-1 overflow-y-auto px-6 pb-24 relative z-10">
        <View 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center text-center mb-10"
        >
          <View className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-amber-500/20 rotate-12">
            <Crown size={40} className="text-white -rotate-12" />
          </View>
          <Text className="text-3xl font-bold mb-2">
            {isPremium ? 'Premium Active' : 'Upgrade to Premium'}
          </Text>
          <Text className="text-zinc-400">
            {isPremium ? 'You have unlocked the full power of your AI Budget Coach.' : 'Unlock the full power of your AI Budget Coach.'}
          </Text>
        </View>

        <View 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-zinc-900/50 border border-amber-500/20 rounded-3xl p-6 mb-8 backdrop-blur-sm"
        >
          <ul className="space-y-4">
            {features.map((feature, i) => (
              <li key={i} className="flex items-center gap-3">
                <CheckCircle2 size={20} className="text-amber-500 shrink-0" />
                <Text className="text-zinc-200">{feature}</Text>
              </li>
            ))}
          </ul>
        </View>

        <View 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {isPremium ? (
            <View className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 text-center">
              <CheckCircle2 size={32} className="text-emerald-500 mx-auto mb-3" />
              <Text className="text-lg font-bold text-emerald-400 mb-1">You are a Premium Member</Text>
              <Text className="text-sm text-zinc-400">Your subscription is active. Enjoy all the features!</Text>
            </View>
          ) : (
            <>
              {errorMsg && (
                <View className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-sm text-red-400 flex items-start gap-3 mb-4">
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  <Text>{errorMsg}</Text>
                </View>
              )}
              
              <TouchableOpacity 
                onPress={handleSubscribe}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-bold py-4 rounded-2xl transition-all active:scale-[0.98] shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Connecting to Secure Checkout...
                  </>
                ) : (
                  <>
                    <Lock size={18} />
                    Start 7-Day Free Trial
                  </>
                )}
              </TouchableOpacity>
              <Text className="text-center text-xs text-zinc-500">
                Then ৳499/month. Cancel anytime. Billed securely via RevenueCat.
              </Text>
            </>
          )}
        </View>
      </View>
    </View>
  );
}
