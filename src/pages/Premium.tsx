import { motion } from 'motion/react';
import { Crown, CheckCircle2, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Premium() {
  const navigate = useNavigate();

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
    <div className="flex flex-col h-[100dvh] bg-zinc-950 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-amber-900/20 via-zinc-950 to-zinc-950 pointer-events-none" />
      
      <header className="px-6 pt-12 pb-6 flex items-center gap-4 relative z-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-zinc-400 hover:text-white">
          <ChevronLeft size={24} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-6 pb-24 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center text-center mb-10"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-amber-500/20 rotate-12">
            <Crown size={40} className="text-white -rotate-12" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Upgrade to Premium</h1>
          <p className="text-zinc-400">Unlock the full power of your AI Budget Coach.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-zinc-900/50 border border-amber-500/20 rounded-3xl p-6 mb-8 backdrop-blur-sm"
        >
          <ul className="space-y-4">
            {features.map((feature, i) => (
              <li key={i} className="flex items-center gap-3">
                <CheckCircle2 size={20} className="text-amber-500 shrink-0" />
                <span className="text-zinc-200">{feature}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-bold py-4 rounded-2xl transition-all active:scale-[0.98] shadow-lg shadow-amber-500/20">
            Start 7-Day Free Trial
          </button>
          <p className="text-center text-xs text-zinc-500">
            Then ৳499/month. Cancel anytime.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
