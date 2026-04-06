import { View, Text, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'react-native';
import { Bell, Moon, Sun, Lock, Globe, HelpCircle, ChevronRight, X, Check } from 'lucide-react-native';
import { useNavigate, Link } from 'expo-router';
import { useStore } from '../store/useStore';
import { useTranslation } from '../lib/i18n';

const LANGUAGES = ['English', 'Spanish', 'French', 'Bengali', 'Hindi', 'Arabic'];

export default function Settings() {
  const navigate = useNavigate();
  const { darkMode, setDarkMode, notifications, setNotifications, language, setLanguage } = useStore();
  const { t } = useTranslation(language);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  return (
    <View className="flex flex-col min-h-full pb-24">
      <header className="px-6 pt-12 pb-6 sticky top-0 bg-gray-50/80 dark:bg-zinc-950/80 backdrop-blur-md z-10 flex items-center gap-4">
        <TouchableOpacity 
          onPress={() => navigate(-1)}
          className="w-10 h-10 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full flex items-center justify-center"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><Textath d="m15 18-6-6 6-6"/></svg>
        </TouchableOpacity>
        <Text className="text-2xl font-bold">{t('settings')}</Text>
      </header>

      <View className="px-6 space-y-6">
        <View 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800 overflow-hidden"
        >
          <View className="p-4 border-b border-zinc-100 dark:border-zinc-800">
            <Text className="text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">{t('preferences')}</Text>
          </View>
          
          <View className="flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800">
            <View className="flex items-center gap-3">
              <View className="w-8 h-8 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-lg flex items-center justify-center">
                {darkMode ? <Moon size={18} /> : <Sun size={18} />}
              </View>
              <Text className="font-medium">{t('darkMode')}</Text>
            </View>
            <TouchableOpacity 
              onPress={() => setDarkMode(!darkMode)}
              className={`w-12 h-6 rounded-full transition-colors relative ${darkMode ? 'bg-emerald-500' : 'bg-zinc-300 dark:bg-zinc-700'}`}
            >
              <View className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${darkMode ? 'translate-x-7' : 'translate-x-1'}`} />
            </TouchableOpacity>
          </View>

          <View className="flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800">
            <View className="flex items-center gap-3">
              <View className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center">
                <Bell size={18} />
              </View>
              <Text className="font-medium">{t('notifications')}</Text>
            </View>
            <TouchableOpacity 
              onPress={() => setNotifications(!notifications)}
              className={`w-12 h-6 rounded-full transition-colors relative ${notifications ? 'bg-emerald-500' : 'bg-zinc-300 dark:bg-zinc-700'}`}
            >
              <View className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${notifications ? 'translate-x-7' : 'translate-x-1'}`} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            onPress={() => setShowLanguageModal(true)}
            className="w-full flex items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
          >
            <View className="flex items-center gap-3">
              <View className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg flex items-center justify-center">
                <Globe size={18} />
              </View>
              <Text className="font-medium">{t('language')}</Text>
            </View>
            <View className="flex items-center gap-2 text-zinc-500">
              <Text className="text-sm">{language}</Text>
              <ChevronRight size={20} />
            </View>
          </TouchableOpacity>
        </View>

        <View 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800 overflow-hidden"
        >
          <View className="p-4 border-b border-zinc-100 dark:border-zinc-800">
            <Text className="text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">{t('accountSecurity')}</Text>
          </View>
          
          <Link href="/privacy" className="w-full flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
            <View className="flex items-center gap-3">
              <View className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg flex items-center justify-center">
                <Lock size={18} />
              </View>
              <Text className="font-medium">{t('privacySecurity')}</Text>
            </View>
            <ChevronRight size={20} className="text-zinc-400" />
          </Link>

          <Link href="/help" className="w-full flex items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
            <View className="flex items-center gap-3">
              <View className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg flex items-center justify-center">
                <HelpCircle size={18} />
              </View>
              <Text className="font-medium">{t('helpSupport')}</Text>
            </View>
            <ChevronRight size={20} className="text-zinc-400" />
          </Link>
        </View>
      </View>

      <View>
        {showLanguageModal && (
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
              className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-3xl p-6 shadow-xl"
            >
              <View className="flex justify-between items-center mb-6">
                <Text className="text-xl font-bold">{t('selectLanguage')}</Text>
                <TouchableOpacity 
                  onPress={() => setShowLanguageModal(false)}
                  className="w-8 h-8 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center"
                >
                  <X size={16} />
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
                    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-colors ${
                      language === lang 
                        ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-bold' 
                        : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                    }`}
                  >
                    <Text>{lang}</Text>
                    {language === lang && <Check size={20} />}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
