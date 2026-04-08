import { View, Text, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Bell, Moon, Sun, Lock, Globe, HelpCircle, ChevronRight, X, Check } from 'lucide-react-native';
import { useRouter, Link } from 'expo-router';
import { useStore } from '../store/useStore';
import { useTranslation } from '../lib/i18n';

const LANGUAGES = ['English', 'Spanish', 'French', 'Bengali', 'Hindi', 'Arabic'];

export default function Settings() {
  const router = useRouter();
  const { darkMode, setDarkMode, notifications, setNotifications, language, setLanguage } = useStore();
  const { t } = useTranslation(language);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  return (
    <View className="flex flex-col min-h-full pb-24">
      <View className="px-6 pt-12 pb-6 sticky top-0 bg-gray-50/80 dark:bg-zinc-950/80 backdrop-blur-md z-10 flex flex-row items-center gap-4">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="w-10 h-10 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full flex items-center justify-center"
        >
          <View style={{width: 20, height: 20, backgroundColor: "gray", borderRadius: 10}} />
        </TouchableOpacity>
        <Text className="text-2xl font-bold">{t('settings')}</Text>
      </View>

      <View className="px-6 space-y-6">
        <View className="bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800 overflow-hidden">
          <View className="p-4 border-b border-zinc-100 dark:border-zinc-800">
            <Text className="text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">{t('preferences')}</Text>
          </View>
          
          <View className="flex flex-row items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800">
            <View className="flex flex-row items-center gap-3">
              <View className="w-8 h-8 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center">
                {darkMode ? <Moon size={18} color="#a1a1aa" /> : <Sun size={18} color="#52525b" />}
              </View>
              <Text className="font-medium text-zinc-900 dark:text-white">{t('darkMode')}</Text>
            </View>
            <TouchableOpacity 
              onPress={() => setDarkMode(!darkMode)}
              className={`w-12 h-6 rounded-full relative ${darkMode ? 'bg-emerald-500' : 'bg-zinc-300 dark:bg-zinc-700'}`}
            >
              <View className={`w-4 h-4 bg-white rounded-full absolute top-1 ${darkMode ? 'right-1' : 'left-1'}`} />
            </TouchableOpacity>
          </View>

          <View className="flex flex-row items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800">
            <View className="flex flex-row items-center gap-3">
              <View className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Bell size={18} color="#2563eb" />
              </View>
              <Text className="font-medium text-zinc-900 dark:text-white">{t('notifications')}</Text>
            </View>
            <TouchableOpacity 
              onPress={() => setNotifications(!notifications)}
              className={`w-12 h-6 rounded-full relative ${notifications ? 'bg-emerald-500' : 'bg-zinc-300 dark:bg-zinc-700'}`}
            >
              <View className={`w-4 h-4 bg-white rounded-full absolute top-1 ${notifications ? 'right-1' : 'left-1'}`} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            onPress={() => setShowLanguageModal(true)}
            className="w-full flex flex-row items-center justify-between p-4"
          >
            <View className="flex flex-row items-center gap-3">
              <View className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <Globe size={18} color="#9333ea" />
              </View>
              <Text className="font-medium text-zinc-900 dark:text-white">{t('language')}</Text>
            </View>
            <View className="flex flex-row items-center gap-2">
              <Text className="text-sm text-zinc-500">{language}</Text>
              <ChevronRight size={20} color="#71717a" />
            </View>
          </TouchableOpacity>
        </View>

        <View className="bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800 overflow-hidden">
          <View className="p-4 border-b border-zinc-100 dark:border-zinc-800">
            <Text className="text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">{t('accountSecurity')}</Text>
          </View>
          
          <Link href="/privacy" className="w-full flex flex-row items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800">
            <View className="flex flex-row items-center gap-3">
              <View className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                <Lock size={18} color="#d97706" />
              </View>
              <Text className="font-medium text-zinc-900 dark:text-white">{t('privacySecurity')}</Text>
            </View>
            <ChevronRight size={20} color="#71717a" />
          </Link>

          <Link href="/help" className="w-full flex flex-row items-center justify-between p-4">
            <View className="flex flex-row items-center gap-3">
              <View className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                <HelpCircle size={18} color="#059669" />
              </View>
              <Text className="font-medium text-zinc-900 dark:text-white">{t('helpSupport')}</Text>
            </View>
            <ChevronRight size={20} color="#71717a" />
          </Link>
        </View>
      </View>

      {showLanguageModal && (
        <View className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <View className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-3xl p-6 shadow-xl">
            <View className="flex flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold text-zinc-900 dark:text-white">{t('selectLanguage')}</Text>
              <TouchableOpacity 
                onPress={() => setShowLanguageModal(false)}
                className="w-8 h-8 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center"
              >
                <X size={16} color="#71717a" />
              </TouchableOpacity>
            </View>

            <View className="space-y-2">
              {LANGUAGES.map(lang => (
                <TouchableOpacity
                  key={lang}
                  onPress={() => {
                    setLanguage(lang);
                    setShowLanguageModal(false);
                  }}
                  className={`w-full flex flex-row items-center justify-between p-4 rounded-2xl ${
                    language === lang 
                      ? 'bg-emerald-50 dark:bg-emerald-900/20' 
                      : 'bg-transparent'
                  }`}
                >
                  <Text className={`${language === lang ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-zinc-900 dark:text-white'}`}>{lang}</Text>
                  {language === lang && <Check size={20} color="#059669" />}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
