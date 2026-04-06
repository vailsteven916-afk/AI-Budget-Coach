import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Home, PieChart, PlusCircle, Target, User, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { useTranslation } from '../lib/i18n';
import { useStore } from '../store/useStore';

export default function Layout() {
  const location = useLocation();
  const { language } = useStore();
  const { t } = useTranslation(language);
  const hideNavPaths = ['/login', '/signup', '/onboarding', '/add-transaction'];
  const shouldHideNav = hideNavPaths.includes(location.pathname);

  return (
    <div className="flex flex-col h-[100dvh] bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans overflow-hidden max-w-md mx-auto relative shadow-2xl">
      <main className="flex-1 overflow-y-auto pb-20 scrollbar-hide">
        <Outlet />
      </main>

      {!shouldHideNav && (
        <nav className="absolute bottom-0 w-full bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 px-6 py-3 pb-safe">
          <ul className="flex justify-between items-center">
            <NavItem to="/" icon={<Home size={24} />} label={t('dashboard')} />
            <NavItem to="/analytics" icon={<PieChart size={24} />} label={t('analytics')} />
            
            <li className="relative -top-6">
              <NavLink to="/add-transaction">
                <motion.div 
                  whileTap={{ scale: 0.9 }}
                  className="bg-emerald-500 text-white p-4 rounded-full shadow-lg shadow-emerald-500/30 flex items-center justify-center"
                >
                  <PlusCircle size={28} />
                </motion.div>
              </NavLink>
            </li>

            <NavItem to="/insights" icon={<Sparkles size={24} />} label={t('insights')} />
            <NavItem to="/profile" icon={<User size={24} />} label={t('profile')} />
          </ul>
        </nav>
      )}
    </div>
  );
}

function NavItem({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          cn(
            "flex flex-col items-center gap-1 transition-colors",
            isActive ? "text-emerald-500" : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
          )
        }
      >
        {icon}
        <span className="text-[10px] font-medium">{label}</span>
      </NavLink>
    </li>
  );
}
