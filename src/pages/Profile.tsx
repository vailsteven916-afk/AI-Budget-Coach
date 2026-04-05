import { motion } from 'motion/react';
import { User, Settings, Crown, LogOut, ChevronRight, Target, Award, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';

export default function Profile() {
  const challenges = useStore(state => state.challenges);

  return (
    <div className="flex flex-col min-h-full pb-24">
      <header className="px-6 pt-12 pb-6 sticky top-0 bg-gray-50/80 dark:bg-zinc-950/80 backdrop-blur-md z-10">
        <h1 className="text-2xl font-bold">Profile</h1>
      </header>

      <div className="px-6 space-y-6">
        {/* Profile Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 bg-white dark:bg-zinc-900 p-4 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800"
        >
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center">
            <User size={32} />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold">Alex Doe</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Level 4 Saver</p>
          </div>
          <Link to="/premium" className="bg-gradient-to-r from-amber-400 to-amber-600 text-white p-2 rounded-xl shadow-lg shadow-amber-500/20">
            <Crown size={20} />
          </Link>
        </motion.div>

        {/* Active Challenges */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-lg font-bold mb-4">Active Challenges</h3>
          <div className="space-y-3">
            {challenges.map(c => (
              <div key={c.id} className="bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">{c.title}</h4>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{c.progress}/{c.total} d</span>
                </div>
                <div className="h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full" 
                    style={{ width: `${(c.progress / c.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Menu */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800 overflow-hidden"
        >
          <Link to="/goals" className="flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center">
                <Target size={18} />
              </div>
              <span className="font-medium">Savings Goals</span>
            </div>
            <ChevronRight size={20} className="text-zinc-400" />
          </Link>
          
          <button className="w-full flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg flex items-center justify-center">
                <Award size={18} />
              </div>
              <span className="font-medium">Badges & Rewards</span>
            </div>
            <ChevronRight size={20} className="text-zinc-400" />
          </button>

          <button className="w-full flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-lg flex items-center justify-center">
                <Settings size={18} />
              </div>
              <span className="font-medium">Settings</span>
            </div>
            <ChevronRight size={20} className="text-zinc-400" />
          </button>

          <button className="w-full flex items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-lg flex items-center justify-center">
                <LogOut size={18} />
              </div>
              <span className="font-medium text-rose-600 dark:text-rose-400">Log Out</span>
            </div>
          </button>
        </motion.div>
      </div>
    </div>
  );
}
