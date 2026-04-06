import { View, Text, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'react-native';
import { Shield, Key, Eye, FileText, Download, Trash2, X, CheckCircle2, AlertCircle } from 'lucide-react-native';
import { useNavigate } from 'expo-router';
import { useStore } from '../store/useStore';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { formatCurrency } from '../lib/utils';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function PrivacySecurity() {
  const navigate = useNavigate();
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

    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text('Financial Data Export', 14, 22);
    
    // User Info
    doc.setFontSize(12);
    doc.text(`Email: ${user?.email || 'N/A'}`, 14, 32);
    doc.text(`Current Balance: ${formatCurrency(balance)}`, 14, 40);
    doc.text(`Export Date: ${new Date().toLocaleDateString()}`, 14, 48);

    let yPos = 60;

    // Transactions Table
    if (transactions.length > 0) {
      doc.setFontSize(16);
      doc.text('Transactions', 14, yPos);
      autoTable(doc, {
        startY: yPos + 5,
        head: [['Date', 'Type', 'Category', 'Amount', 'Note']],
        body: transactions.map(t => [
          new Date(t.date).toLocaleDateString(),
          t.type,
          t.category,
          t.amount.toString(),
          t.note || ''
        ]),
      });
      yPos = (doc as any).lastAutoTable.finalY + 15;
    }

    // Goals Table
    if (goals.length > 0) {
      // Check if we need a new page
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
      doc.setFontSize(16);
      doc.text('Savings Goals', 14, yPos);
      autoTable(doc, {
        startY: yPos + 5,
        head: [['Title', 'Target', 'Current', 'Deadline']],
        body: goals.map(g => [
          g.title,
          g.targetAmount.toString(),
          g.currentAmount.toString(),
          new Date(g.deadline).toLocaleDateString()
        ]),
      });
    }

    doc.save('financial_data.pdf');
  };

  return (
    <View className="flex flex-col min-h-full pb-24">
      <header className="px-6 pt-12 pb-6 sticky top-0 bg-gray-50/80 dark:bg-zinc-950/80 backdrop-blur-md z-10 flex items-center gap-4">
        <TouchableOpacity 
          onPress={() => navigate(-1)}
          className="w-10 h-10 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full flex items-center justify-center"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><Textath d="m15 18-6-6 6-6"/></svg>
        </TouchableOpacity>
        <Text className="text-2xl font-bold">Privacy & Security</Text>
      </header>

      <View className="px-6 space-y-6">
        <View 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800 p-6 text-center"
        >
          <View className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield size={32} />
          </View>
          <Text className="text-lg font-bold mb-2">Your Data is Secure</Text>
          <Text className="text-sm text-zinc-500 dark:text-zinc-400">
            We use industry-standard encryption to protect your financial data. Your information is never shared with third parties without your explicit consent.
          </Text>
        </View>

        <View 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800 overflow-hidden"
        >
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
            className="w-full flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors disabled:opacity-50"
          >
            <View className="flex items-center gap-3">
              <Key size={18} className="text-zinc-400" />
              <Text className="font-medium">Change Password</Text>
            </View>
            {resetStatus === 'success' && <CheckCircle2 size={18} className="text-emerald-500" />}
            {resetStatus === 'error' && <AlertCircle size={18} className="text-red-500" />}
            {resetStatus === 'loading' && <Text className="text-xs text-zinc-500">Sending...</Text>}
          </TouchableOpacity>
        </View>

        <View 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800 overflow-hidden"
        >
          <View className="p-4 border-b border-zinc-100 dark:border-zinc-800">
            <Text className="text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Data Management</Text>
          </View>
          
          <TouchableOpacity 
            onPress={handleExportData}
            className="w-full flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
          >
            <View className="flex items-center gap-3">
              <Download size={18} className="text-zinc-400" />
              <Text className="font-medium">Export My Data</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => setShowPrivacyPolicy(true)}
            className="w-full flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
          >
            <View className="flex items-center gap-3">
              <FileText size={18} className="text-zinc-400" />
              <Text className="font-medium">Privacy Policy</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity className="w-full flex items-center justify-between p-4 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
            <View className="flex items-center gap-3">
              <Trash2 size={18} className="text-red-500" />
              <Text className="font-medium text-red-500">Delete Account</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View>
        {showResetPopup && (
          <View
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-6 right-6 bg-emerald-500 text-white p-4 rounded-2xl shadow-lg flex items-center gap-3 z-50"
          >
            <CheckCircle2 size={24} className="shrink-0" />
            <View className="flex-1">
              <Text className="font-bold text-sm">Reset Link Sent!</Text>
              <Text className="text-xs opacity-90">Check your email ({user?.email}) for the password reset link.</Text>
            </View>
            <TouchableOpacity onPress={() => setShowResetPopup(false)} className="shrink-0 p-1 hover:bg-emerald-600 rounded-full transition-colors">
              <X size={16} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View>
        {showPremiumAlert && (
          <View 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          >
            <View 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-3xl p-6 shadow-xl text-center"
            >
              <View className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield size={32} />
              </View>
              <Text className="text-xl font-bold mb-2">Premium Feature</Text>
              <Text className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
                Exporting data to PDF is a premium feature. Upgrade to Premium to unlock this and many other features!
              </Text>
              <View className="flex gap-3">
                <TouchableOpacity 
                  onPress={() => setShowPremiumAlert(false)}
                  className="flex-1 py-3 rounded-xl font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors"
                >
                  Cancel
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => {
                    setShowPremiumAlert(false);
                    navigate('/premium');
                  }}
                  className="flex-1 py-3 rounded-xl font-medium bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/20 transition-transform active:scale-95"
                >
                  Upgrade
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>

      <View>
        {showPrivacyPolicy && (
          <View 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          >
            <View 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-3xl p-6 shadow-xl max-h-[80vh] overflow-y-auto"
            >
              <View className="flex justify-between items-center mb-6 sticky top-0 bg-white dark:bg-zinc-900 pb-2 border-b border-zinc-100 dark:border-zinc-800">
                <Text className="text-xl font-bold">Privacy Policy</Text>
                <TouchableOpacity 
                  onPress={() => setShowPrivacyPolicy(false)}
                  className="w-8 h-8 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center"
                >
                  <X size={16} />
                </TouchableOpacity>
              </View>

              <View className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
                <Text>
                  <strong>1. Data Collection:</strong> We collect only the information necessary to provide you with our financial tracking services, including your email address and transaction data.
                </Text>
                <Text>
                  <strong>2. Data Usage:</strong> Your data is used exclusively to generate insights, track your goals, and provide you with a personalized experience. We do not sell your data to third parties.
                </Text>
                <Text>
                  <strong>3. Security:</strong> We implement industry-standard security measures, including encryption in transit and at rest, to protect your personal information.
                </Text>
                <Text>
                  <strong>4. Your Rights:</strong> You have the right to access, export, or delete your data at any time using the tools provided in this app.
                </Text>
                <Text>
                  <strong>5. Changes to Policy:</strong> We may update this policy from time to time. We will notify you of any significant changes.
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
