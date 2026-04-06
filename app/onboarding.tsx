import { View, Text, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native';
import { useState } from 'react';
import { motion, AnimatePresence } from 'react-native';
import { useNavigate } from 'expo-router';
import { useStore } from '../store/useStore';
import { ChevronRight, BrainCircuit, Target, TrendingUp } from 'lucide-react-native';

const slides = [
  {
    title: "Meet Your AI Budget Coach",
    description: "Not just an expense tracker. Get smart advice, predict future spending, and save more.",
    icon: <BrainCircuit className="w-24 h-24 text-emerald-500 mb-8" />
  },
  {
    title: "Track & Achieve Goals",
    description: "Set savings goals for that new phone or vacation, and let AI guide you there.",
    icon: <Target className="w-24 h-24 text-emerald-500 mb-8" />
  },
  {
    title: "Build Better Habits",
    description: "Complete challenges, earn badges, and level up your financial discipline.",
    icon: <TrendingUp className="w-24 h-24 text-emerald-500 mb-8" />
  }
];

export default function Onboarding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const completeOnboarding = useStore(state => state.completeOnboarding);

  const handleNext = () => {
    if (currentSlide === slides.length - 1) {
      completeOnboarding();
      navigate('/login');
    } else {
      setCurrentSlide(prev => prev + 1);
    }
  };

  return (
    <View className="flex flex-col h-[100dvh] bg-zinc-950 text-white p-6 max-w-md mx-auto relative overflow-hidden">
      {/* Background decoration */}
      <View className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-emerald-900/20 to-transparent pointer-events-none" />
      
      <View className="flex-1 flex flex-col items-center justify-center relative z-10">
        <AnimatePresence mode="wait">
          <View
            key={currentSlide}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center text-center"
          >
            {slides[currentSlide].icon}
            <Text className="text-3xl font-bold mb-4 tracking-tight">{slides[currentSlide].title}</Text>
            <Text className="text-zinc-400 text-lg leading-relaxed px-4">
              {slides[currentSlide].description}
            </Text>
          </View>
        </View>
      </View>

      <View className="pb-12 flex flex-col items-center gap-8 relative z-10">
        <View className="flex gap-2">
          {slides.map((_, i) => (
            <View
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentSlide ? 'w-8 bg-emerald-500' : 'w-2 bg-zinc-800'
              }`}
            />
          ))}
        </View>

        <TouchableOpacity
          onPress={handleNext}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors active:scale-[0.98]"
        >
          {currentSlide === slides.length - 1 ? "Get Started" : "Continue"}
          <ChevronRight size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
