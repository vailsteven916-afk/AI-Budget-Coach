import React from 'react';
import { motion } from 'motion/react';
import { HelpCircle, Mail, MessageCircle, FileText, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function HelpSupport() {
  const navigate = useNavigate();

  const faqs = [
    { q: "How do I add a transaction?", a: "Tap the '+' button on the bottom navigation bar to add a new income or expense." },
    { q: "How are insights generated?", a: "Our AI analyzes your transaction history to provide personalized spending insights and alerts." },
    { q: "Is my data secure?", a: "Yes, your data is encrypted and securely stored in the cloud. You can manage it in Privacy & Security settings." },
    { q: "How do I export my data?", a: "Go to Profile > Settings > Privacy & Security, and tap 'Export My Data' to download a PDF report." }
  ];

  return (
    <div className="flex flex-col min-h-full pb-24">
      <header className="px-6 pt-12 pb-6 sticky top-0 bg-gray-50/80 dark:bg-zinc-950/80 backdrop-blur-md z-10 flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full flex items-center justify-center"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <h1 className="text-2xl font-bold">Help & Support</h1>
      </header>

      <div className="px-6 space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 gap-4"
        >
          <button className="bg-white dark:bg-zinc-900 p-4 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800 flex flex-col items-center justify-center gap-2 text-center transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center">
              <MessageCircle size={24} />
            </div>
            <span className="font-medium text-sm">Live Chat</span>
          </button>
          <button className="bg-white dark:bg-zinc-900 p-4 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800 flex flex-col items-center justify-center gap-2 text-center transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center">
              <Mail size={24} />
            </div>
            <span className="font-medium text-sm">Email Us</span>
          </button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800 overflow-hidden"
        >
          <div className="p-4 border-b border-zinc-100 dark:border-zinc-800">
            <h2 className="text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Frequently Asked Questions</h2>
          </div>
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {faqs.map((faq, i) => (
              <div key={i} className="p-4">
                <h3 className="font-bold mb-1">{faq.q}</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
