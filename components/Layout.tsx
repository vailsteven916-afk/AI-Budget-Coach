import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import { Slot, Link, usePathname } from 'expo-router';
import { Home, PieChart, PlusCircle, Target, User, Sparkles } from 'lucide-react-native';
import { cn } from '../lib/utils';
import { useTranslation } from '../lib/i18n';
import { useStore } from '../store/useStore';

export default function Layout() {
  const pathname = usePathname();
  const { language } = useStore();
  const { t } = useTranslation(language);
  const hideNavPaths = ['/login', '/signup', '/onboarding', '/add-transaction'];
  const shouldHideNav = hideNavPaths.includes(pathname);

  return (
    <View className="flex flex-col h-full bg-gray-50 dark:bg-zinc-950">
      <View className="flex-1">
        <Slot />
      </View>

      {!shouldHideNav && (
        <View className="absolute bottom-0 w-full bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 px-6 py-3 pb-8">
          <View className="flex flex-row justify-between items-center">
            <NavItem to="/" icon={<Home size={24} color={pathname === '/' ? '#10b981' : '#a1a1aa'} />} label={t('dashboard')} isActive={pathname === '/'} />
            <NavItem to="/analytics" icon={<PieChart size={24} color={pathname === '/analytics' ? '#10b981' : '#a1a1aa'} />} label={t('analytics')} isActive={pathname === '/analytics'} />
            
            <View className="relative -top-6">
              <Link href="/add-transaction" asChild>
                <TouchableOpacity className="bg-emerald-500 p-4 rounded-full shadow-lg flex items-center justify-center">
                  <PlusCircle size={28} color="white" />
                </TouchableOpacity>
              </Link>
            </View>

            <NavItem to="/insights" icon={<Sparkles size={24} color={pathname === '/insights' ? '#10b981' : '#a1a1aa'} />} label={t('insights')} isActive={pathname === '/insights'} />
            <NavItem to="/profile" icon={<User size={24} color={pathname === '/profile' ? '#10b981' : '#a1a1aa'} />} label={t('profile')} isActive={pathname === '/profile'} />
          </View>
        </View>
      )}
    </View>
  );
}

function NavItem({ to, icon, label, isActive }: { to: string; icon: React.ReactNode; label: string; isActive: boolean }) {
  return (
    <Link href={to as any} asChild>
      <TouchableOpacity className="flex flex-col items-center gap-1">
        {icon}
        <Text className={`text-[10px] font-medium ${isActive ? 'text-emerald-500' : 'text-zinc-400'}`}>{label}</Text>
      </TouchableOpacity>
    </Link>
  );
}
