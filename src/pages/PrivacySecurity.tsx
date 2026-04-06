import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Key, Eye, FileText, Download, Trash2, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { formatCurrency } from '../lib/utils';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function PrivacySecurity() {
  const navigate = useNavigate();
  const { user, transactions, goals, challenges, balance } = useStore();
  
  const [resetStatus, setResetStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [showResetPopup, setShowResetPopup] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

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
    <div className="flex flex-col min-h-full pb-24">
      <header className="px-6 pt-12 pb-6 sticky top-0 bg-gray-50/80 dark:bg-zinc-950/80 backdrop-blur-md z-10 flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full flex items-center justify-center"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <h1 className="text-2xl font-bold">Privacy & Security</h1>
      </header>

      <div className="px-6 space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800 p-6 text-center"
        >
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield size={32} />
          </div>
          <h2 className="text-lg font-bold mb-2">Your Data is Secure</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            We use industry-standard encryption to protect your financial data. Your information is never shared with third parties without your explicit consent.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800 overflow-hidden"
        >
          <div className="p-4 border-b border-zinc-100 dark:border-zinc-800">
            <h2 className="text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Account Information</h2>
          </div>
          
          <div className="p-4 border-b border-zinc-100 dark:border-zinc-800">
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">Email Address</p>
            <p className="font-medium">{user?.email}</p>
          </div>
          
          <button 
            onClick={handlePasswordReset}
            disabled={resetStatus === 'loading'}
            className="w-full flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors disabled:opacity-50"
          >
            <div className="flex items-center gap-3">
              <Key size={18} className="text-zinc-400" />
              <span className="font-medium">Change Password</span>
            </div>
            {resetStatus === 'success' && <CheckCircle2 size={18} className="text-emerald-500" />}
            {resetStatus === 'error' && <AlertCircle size={18} className="text-red-500" />}
            {resetStatus === 'loading' && <span className="text-xs text-zinc-500">Sending...</span>}
          </button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800 overflow-hidden"
        >
          <div className="p-4 border-b border-zinc-100 dark:border-zinc-800">
            <h2 className="text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Data Management</h2>
          </div>
          
          <button 
            onClick={handleExportData}
            className="w-full flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Download size={18} className="text-zinc-400" />
              <span className="font-medium">Export My Data</span>
            </div>
          </button>

          <button 
            onClick={() => setShowPrivacyPolicy(true)}
            className="w-full flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <FileText size={18} className="text-zinc-400" />
              <span className="font-medium">Privacy Policy</span>
            </div>
          </button>

          <button className="w-full flex items-center justify-between p-4 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
            <div className="flex items-center gap-3">
              <Trash2 size={18} className="text-red-500" />
              <span className="font-medium text-red-500">Delete Account</span>
            </div>
          </button>
        </motion.div>
      </div>

      <AnimatePresence>
        {showResetPopup && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-6 right-6 bg-emerald-500 text-white p-4 rounded-2xl shadow-lg flex items-center gap-3 z-50"
          >
            <CheckCircle2 size={24} className="shrink-0" />
            <div className="flex-1">
              <h4 className="font-bold text-sm">Reset Link Sent!</h4>
              <p className="text-xs opacity-90">Check your email ({user?.email}) for the password reset link.</p>
            </div>
            <button onClick={() => setShowResetPopup(false)} className="shrink-0 p-1 hover:bg-emerald-600 rounded-full transition-colors">
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPrivacyPolicy && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-3xl p-6 shadow-xl max-h-[80vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6 sticky top-0 bg-white dark:bg-zinc-900 pb-2 border-b border-zinc-100 dark:border-zinc-800">
                <h2 className="text-xl font-bold">Privacy Policy</h2>
                <button 
                  onClick={() => setShowPrivacyPolicy(false)}
                  className="w-8 h-8 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
                <p>
                  <strong>1. Data Collection:</strong> We collect only the information necessary to provide you with our financial tracking services, including your email address and transaction data.
                </p>
                <p>
                  <strong>2. Data Usage:</strong> Your data is used exclusively to generate insights, track your goals, and provide you with a personalized experience. We do not sell your data to third parties.
                </p>
                <p>
                  <strong>3. Security:</strong> We implement industry-standard security measures, including encryption in transit and at rest, to protect your personal information.
                </p>
                <p>
                  <strong>4. Your Rights:</strong> You have the right to access, export, or delete your data at any time using the tools provided in this app.
                </p>
                <p>
                  <strong>5. Changes to Policy:</strong> We may update this policy from time to time. We will notify you of any significant changes.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
