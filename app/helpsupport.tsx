import { View, Text, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'react-native';
import { HelpCircle, Mail, MessageCircle, FileText, ChevronRight, X, Send } from 'lucide-react-native';
import { useNavigate } from 'expo-router';

export default function HelpSupport() {
  const navigate = useNavigate();
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState<{text: string, isUser: boolean}[]>([
    { text: "Hi there! How can we help you today?", isUser: false }
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    setMessages(prev => [...prev, { text: chatMessage, isUser: true }]);
    setChatMessage('');

    // Simulate agent reply
    setTimeout(() => {
      setMessages(prev => [...prev, { text: "Thanks for reaching out! An agent will be with you shortly.", isUser: false }]);
    }, 1000);
  };

  const faqs = [
    { q: "How do I add a transaction?", a: "Tap the '+' button on the bottom navigation bar to add a new income or expense." },
    { q: "How are insights generated?", a: "Our AI analyzes your transaction history to provide personalized spending insights and alerts." },
    { q: "Is my data secure?", a: "Yes, your data is encrypted and securely stored in the cloud. You can manage it in Privacy & Security settings." },
    { q: "How do I export my data?", a: "Go to Profile > Settings > Privacy & Security, and tap 'Export My Data' to download a PDF report." }
  ];

  return (
    <View className="flex flex-col min-h-full pb-24">
      <header className="px-6 pt-12 pb-6 sticky top-0 bg-gray-50/80 dark:bg-zinc-950/80 backdrop-blur-md z-10 flex items-center gap-4">
        <TouchableOpacity 
          onPress={() => navigate(-1)}
          className="w-10 h-10 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full flex items-center justify-center"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><Textath d="m15 18-6-6 6-6"/></svg>
        </TouchableOpacity>
        <Text className="text-2xl font-bold">Help & Support</Text>
      </header>

      <View className="px-6 space-y-6">
        <View 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 gap-4"
        >
          <TouchableOpacity 
            onPress={() => setShowChat(true)}
            className="bg-white dark:bg-zinc-900 p-4 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800 flex flex-col items-center justify-center gap-2 text-center transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
          >
            <View className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center">
              <MessageCircle size={24} />
            </View>
            <Text className="font-medium text-sm">Live Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => window.location.href = 'mailto:support@aibudgetcoach.com?subject=Support Request'}
            className="bg-white dark:bg-zinc-900 p-4 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800 flex flex-col items-center justify-center gap-2 text-center transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
          >
            <View className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center">
              <Mail size={24} />
            </View>
            <Text className="font-medium text-sm">Email Us</Text>
          </TouchableOpacity>
        </View>

        <View 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800 overflow-hidden"
        >
          <View className="p-4 border-b border-zinc-100 dark:border-zinc-800">
            <Text className="text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Frequently Asked Questions</Text>
          </View>
          <View className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {faqs.map((faq, i) => (
              <View key={i} className="p-4">
                <Text className="font-bold mb-1">{faq.q}</Text>
                <Text className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{faq.a}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View>
        {showChat && (
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
              className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-3xl shadow-xl overflow-hidden flex flex-col h-[80vh] sm:h-[600px]"
            >
              <View className="flex justify-between items-center p-4 border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <View className="flex items-center gap-3">
                  <View className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center">
                    <MessageCircle size={20} />
                  </View>
                  <View>
                    <Text className="font-bold">Live Support</Text>
                    <Text className="text-xs text-emerald-500">Online</Text>
                  </View>
                </View>
                <TouchableOpacity 
                  onPress={() => setShowChat(false)}
                  className="w-8 h-8 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center"
                >
                  <X size={16} />
                </TouchableOpacity>
              </View>

              <View className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50 dark:bg-zinc-950/50">
                {messages.map((msg, i) => (
                  <View key={i} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                    <View className={`max-w-[80%] p-3 rounded-2xl ${
                      msg.isUser 
                        ? 'bg-emerald-500 text-white rounded-tr-sm' 
                        : 'bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-tl-sm'
                    }`}>
                      <Text className="text-sm">{msg.text}</Text>
                    </View>
                  </View>
                ))}
              </View>

              <View className="p-4 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800">
                <View onSubmit={handleSendMessage} className="flex gap-2">
                  <TextInput 
                    type="text" 
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <TouchableOpacity 
                    type="submit"
                    disabled={!chatMessage.trim()}
                    className="w-12 h-12 bg-emerald-500 text-white rounded-xl flex items-center justify-center disabled:opacity-50 transition-colors"
                  >
                    <Send size={20} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
