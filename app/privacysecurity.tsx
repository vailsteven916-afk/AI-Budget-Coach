import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { Shield, Key, Eye, FileText, Download, Trash2, X, CheckCircle2, AlertCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../store/useStore';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { formatCurrency } from '../lib/utils';

export default function PrivacySecurity() {
  const router = useRouter();
  const { user, transactions, goals, challenges, balance, isPremium } = useStore();
  
  const [resetStatus, setResetStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [showResetPopup, setShowResetPopup] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showPremiumAlert, setShowPremiumAlert] = useState(false);

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    setResetStatus('loading');
    try {
      await sendPasswordResetEmail(auth, user.email);
      setResetStatus('success');
      setShowResetPopup(true);
      setTimeout(() => {
        setResetStatus('idle');
        setShowResetPopup(false);
      }, 5000);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      setResetStatus('error');
      setTimeout(() => setResetStatus('idle'), 3000);
    }
  };

  const handleExportData = () => {
    if (!isPremium) {
      setShowPremiumAlert(true);
      return;
    }
    // PDF export not supported natively without additional libraries
    alert("Export feature requires native PDF library integration.");
  };

  return (
    <View className="flex flex-col min-h-full pb-24">
      <View className="px-6 pt-12 pb-6 sticky top-0 bg-gray-50/80 dark:bg-zinc-950/80 backdrop-blur-md z-10 flex flex-row items-center gap-4">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="w-10 h-10 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full flex items-center justify-center"
        >
          <View style={{width: 20, height: 20, backgroundColor: "gray", borderRadius: 10}} />
        </TouchableOpacity>
        <Text className="text-2xl font-bold">Privacy & Security</Text>
      </View>

      <View className="px-6 space-y-6">
        <View className="bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800 p-6 text-center">
          <View className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield size={32} color="#059669" />
          </View>
          <Text className="text-lg font-bold mb-2">Your Data is Secure</Text>
          <Text className="text-sm text-zinc-500 dark:text-zinc-400">
            We use industry-standard encryption to protect your financial data. Your information is never shared with third parties without your explicit consent.
          </Text>
        </View>

        <View className="bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800 overflow-hidden">
          <View className="p-4 border-b border-zinc-100 dark:border-zinc-800">
            <Text className="text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Account Information</Text>
          </View>
          
          <View className="p-4 border-b border-zinc-100 dark:border-zinc-800">
            <Text className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">Email Address</Text>
            <Text className="font-medium">{user?.email}</Text>
          </View>
          
          <TouchableOpacity 
            onPress={handlePasswordReset}
            disabled={resetStatus === 'loading'}
            className="w-full flex flex-row items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800"
          >
            <View className="flex flex-row items-center gap-3">
              <Key size={18} color="#a1a1aa" />
              <Text className="font-medium">Change Password</Text>
            </View>
            {resetStatus === 'success' && <CheckCircle2 size={18} color="#10b981" />}
            {resetStatus === 'error' && <AlertCircle size={18} color="#ef4444" />}
            {resetStatus === 'loading' && <Text className="text-xs text-zinc-500">Sending...</Text>}
          </TouchableOpacity>
        </View>

        <View className="bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800 overflow-hidden">
          <View className="p-4 border-b border-zinc-100 dark:border-zinc-800">
            <Text className="text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Data Management</Text>
          </View>
          
          <TouchableOpacity 
            onPress={handleExportData}
            className="w-full flex flex-row items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800"
          >
            <View className="flex flex-row items-center gap-3">
              <Download size={18} color="#a1a1aa" />
              <Text className="font-medium">Export My Data</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => setShowPrivacyPolicy(true)}
            className="w-full flex flex-row items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800"
          >
            <View className="flex flex-row items-center gap-3">
              <FileText size={18} color="#a1a1aa" />
              <Text className="font-medium">Privacy Policy</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity className="w-full flex flex-row items-center justify-between p-4">
            <View className="flex flex-row items-center gap-3">
              <Trash2 size={18} color="#ef4444" />
              <Text className="font-medium text-red-500">Delete Account</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {showResetPopup && (
        <View className="absolute bottom-24 left-6 right-6 bg-emerald-500 p-4 rounded-2xl shadow-lg flex flex-row items-center gap-3 z-50">
          <CheckCircle2 size={24} color="white" />
          <View className="flex-1">
            <Text className="font-bold text-sm text-white">Reset Link Sent!</Text>
            <Text className="text-xs text-white opacity-90">Check your email ({user?.email}) for the password reset link.</Text>
          </View>
          <TouchableOpacity onPress={() => setShowResetPopup(false)} className="p-1">
            <X size={16} color="white" />
          </TouchableOpacity>
        </View>
      )}

      {showPremiumAlert && (
        <View className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <View className="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-3xl p-6 shadow-xl text-center">
            <View className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield size={32} color="#d97706" />
            </View>
            <Text className="text-xl font-bold mb-2 text-zinc-900 dark:text-white">Premium Feature</Text>
            <Text className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
              Exporting data to PDF is a premium feature. Upgrade to Premium to unlock this and many other features!
            </Text>
            <View className="flex flex-row gap-3">
              <TouchableOpacity 
                onPress={() => setShowPremiumAlert(false)}
                className="flex-1 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 items-center"
              >
                <Text className="font-medium text-zinc-600 dark:text-zinc-300">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => {
                  setShowPremiumAlert(false);
                  router.push('/premium');
                }}
                className="flex-1 py-3 rounded-xl bg-amber-500 items-center"
              >
                <Text className="font-medium text-white">Upgrade</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {showPrivacyPolicy && (
        <View className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <View className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-3xl p-6 shadow-xl max-h-[80%]">
            <View className="flex flex-row justify-between items-center mb-6 pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <Text className="text-xl font-bold text-zinc-900 dark:text-white">Privacy Policy</Text>
              <TouchableOpacity 
                onPress={() => setShowPrivacyPolicy(false)}
                className="w-8 h-8 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center"
              >
                <X size={16} color="#71717a" />
              </TouchableOpacity>
            </View>

            <ScrollView className="space-y-4">
              <Text className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                <Text className="font-bold">1. Data Collection:</Text> We collect only the information necessary to provide you with our financial tracking services, including your email address and transaction data.
              </Text>
              <Text className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                <Text className="font-bold">2. Data Usage:</Text> Your data is used exclusively to generate insights, track your goals, and provide you with a personalized experience. We do not sell your data to third parties.
              </Text>
              <Text className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                <Text className="font-bold">3. Security:</Text> We implement industry-standard security measures, including encryption in transit and at rest, to protect your personal information.
              </Text>
              <Text className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                <Text className="font-bold">4. Your Rights:</Text> You have the right to access, export, or delete your data at any time using the tools provided in this app.
              </Text>
              <Text className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                <Text className="font-bold">5. Changes to Policy:</Text> We may update this policy from time to time. We will notify you of any significant changes.
              </Text>
            </ScrollView>
          </View>
        </View>
      )}
    </View>
  );
}
