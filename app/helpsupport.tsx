import { View, Text, TouchableOpacity, TextInput, ScrollView, Linking } from 'react-native';
import React, { useState } from 'react';
import { HelpCircle, Mail, MessageCircle, FileText, ChevronRight, X, Send } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function HelpSupport() {
  const router = useRouter();
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState<{text: string, isUser: boolean}[]>([
    { text: "Hi there! How can we help you today?", isUser: false }
  ]);

  const handleSendMessage = () => {
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
      <View className="px-6 pt-12 pb-6 sticky top-0 bg-gray-50/80 dark:bg-zinc-950/80 backdrop-blur-md z-10 flex flex-row items-center gap-4">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="w-10 h-10 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full flex items-center justify-center"
        >
          <View style={{width: 20, height: 20, backgroundColor: "gray", borderRadius: 10}} />
        </TouchableOpacity>
        <Text className="text-2xl font-bold">Help & Support</Text>
      </View>

      <View className="px-6 space-y-6">
        <View className="flex flex-row justify-between gap-4">
          <TouchableOpacity 
            onPress={() => setShowChat(true)}
            className="flex-1 bg-white dark:bg-zinc-900 p-4 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800 flex flex-col items-center justify-center gap-2 text-center"
          >
            <View className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <MessageCircle size={24} color="#2563eb" />
            </View>
            <Text className="font-medium text-sm">Live Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => Linking.openURL('mailto:support@aibudgetcoach.com?subject=Support Request')}
            className="flex-1 bg-white dark:bg-zinc-900 p-4 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800 flex flex-col items-center justify-center gap-2 text-center"
          >
            <View className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
              <Mail size={24} color="#059669" />
            </View>
            <Text className="font-medium text-sm">Email Us</Text>
          </TouchableOpacity>
        </View>

        <View className="bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800 overflow-hidden">
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

      {showChat && (
        <View className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <View className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-3xl shadow-xl overflow-hidden flex flex-col h-[80%]">
            <View className="flex flex-row justify-between items-center p-4 border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <View className="flex flex-row items-center gap-3">
                <View className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <MessageCircle size={20} color="#2563eb" />
                </View>
                <View>
                  <Text className="font-bold text-zinc-900 dark:text-white">Live Support</Text>
                  <Text className="text-xs text-emerald-500">Online</Text>
                </View>
              </View>
              <TouchableOpacity 
                onPress={() => setShowChat(false)}
                className="w-8 h-8 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center"
              >
                <X size={16} color="#71717a" />
              </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 p-4 bg-zinc-50 dark:bg-zinc-950/50">
              {messages.map((msg, i) => (
                <View key={i} className={`flex flex-row mb-4 ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                  <View className={`max-w-[80%] p-3 rounded-2xl ${
                    msg.isUser 
                      ? 'bg-emerald-500 rounded-tr-sm' 
                      : 'bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-tl-sm'
                  }`}>
                    <Text className={`text-sm ${msg.isUser ? 'text-white' : 'text-zinc-900 dark:text-white'}`}>{msg.text}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>

            <View className="p-4 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800">
              <View className="flex flex-row gap-2">
                <TextInput 
                  value={chatMessage}
                  onChangeText={setChatMessage}
                  placeholder="Type a message..."
                  className="flex-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-white"
                />
                <TouchableOpacity 
                  onPress={handleSendMessage}
                  disabled={!chatMessage.trim()}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${!chatMessage.trim() ? 'bg-emerald-500/50' : 'bg-emerald-500'}`}
                >
                  <Send size={20} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
