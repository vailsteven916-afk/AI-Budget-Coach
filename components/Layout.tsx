import { View, Text, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native';
import React from 'react';
import { Outlet, NavLink, useLocation } from 'expo-router';
import { Home, PieChart, PlusCircle, Target, User, Sparkles } from 'lucide-react-native';
import { cn } from '../lib/utils';
import { motion } from 'react-native';
import { useTranslation } from '../lib/i18n';
import { useStore } from '../store/useStore';

export default function Layout() {
  const location = useLocation();
  const { language } = useStore();
  const { t } = useTranslation(language);
  const hideNavPaths = ['/login', '/signup', '/onboarding', '/add-transaction'];
  const shouldHideNav = hideNavPaths.includes(location.pathname);

  return (
    <View className="flex flex-col h-[100dvh] bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans overflow-hidden max-w-md mx-auto relative shadow-2xl">
      <ScrollView className="flex-1 overflow-y-auto pb-20 scrollbar-hide">
        <Outlet />
      </ScrollView>

      {!shouldHideNav && (
        <View className="absolute bottom-0 w-full bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 px-6 py-3 pb-safe">
          <ul className="flex justify-between items-center">
            <NavItem to="/" icon={<Home size={24} />} label={t('dashboard')} />
            <NavItem to="/analytics" icon={<PieChart size={24} />} label={t('analytics')} />
            
            <li className="relative -top-6">
              <NavLink to="/add-transaction">
                <View 
                  whileTap={{ scale: 0.9 }}
                  className="bg-emerald-500 text-white p-4 rounded-full shadow-lg shadow-emerald-500/30 flex items-center justify-center"
                >
                  <PlusCircle size={28} />
                </View>
              </NavLink>
            </li>

            <NavItem to="/insights" icon={<Sparkles size={24} />} label={t('insights')} />
            <NavItem to="/profile" icon={<User size={24} />} label={t('profile')} />
          </ul>
        </View>
      )}
    </View>
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
        <Text className="text-[10px] font-medium">{label}</Text>
      </NavLink>
    </li>
  );
}
