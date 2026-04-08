import { View, Text, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useStore } from '../store/useStore';
import { ChevronRight, BrainCircuit, Target, TrendingUp } from 'lucide-react-native';

const slides = [
  {
    title: "Meet Your AI Budget Coach",
    description: "Not just an expense tracker. Get smart advice, predict future spending, and save more.",
    icon: <BrainCircuit size={96} color="#10b981" />
  },
  {
    title: "Track & Achieve Goals",
    description: "Set savings goals for that new phone or vacation, and let AI guide you there.",
    icon: <Target size={96} color="#10b981" />
  },
  {
    title: "Build Better Habits",
    description: "Complete challenges, earn badges, and level up your financial discipline.",
    icon: <TrendingUp size={96} color="#10b981" />
  }
];

export default function Onboarding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();
  const completeOnboarding = useStore(state => state.completeOnboarding);

  const handleNext = () => {
    if (currentSlide === slides.length - 1) {
      completeOnboarding();
      router.push('/login');
    } else {
      setCurrentSlide(prev => prev + 1);
    }
  };

  return (
    <View className="flex flex-col h-full bg-zinc-950 p-6">
      <View className="absolute top-0 left-0 w-full h-1/2 bg-emerald-900/20" />
      
      <View className="flex-1 flex flex-col items-center justify-center z-10">
        <View className="flex flex-col items-center text-center">
          <View className="mb-8">
            {slides[currentSlide].icon}
          </View>
          <Text className="text-3xl font-bold mb-4 text-white text-center">{slides[currentSlide].title}</Text>
          <Text className="text-zinc-400 text-lg text-center px-4">
            {slides[currentSlide].description}
          </Text>
        </View>
      </View>

      <View className="pb-12 flex flex-col items-center gap-8 z-10">
        <View className="flex flex-row gap-2">
          {slides.map((_, i) => (
            <View
              key={i} 
              className={`h-1.5 rounded-full ${
                i === currentSlide ? 'w-8 bg-emerald-500' : 'w-2 bg-zinc-800'
              }`}
            />
          ))}
        </View>

        <TouchableOpacity
          onPress={handleNext} 
          className="w-full bg-emerald-500 py-4 rounded-2xl flex flex-row items-center justify-center gap-2"
        >
          <Text className="text-white font-semibold">
            {currentSlide === slides.length - 1 ? "Get Started" : "Continue"}
          </Text>
          <ChevronRight size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
