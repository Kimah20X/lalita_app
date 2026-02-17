import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const slides = [
  {
    id: 1,
    title: 'Welcome to Lalita, x!',
    subtitle: 'Your trusted savings companion',
    description: 'Save smart, learn fast, stay safe, and grow strong. Join thousands of women traders building wealth and also join Ajo Groups.',
    icon: 'wallet-outline',
  },
  {
    id: 2,
    title: 'Earn Rewards',
    subtitle: 'Get rewarded for saving',
    description: 'Unlock achievements, earn points, and learn from success stories of women just like you.',
    icon: 'medal-outline',
  }
];

export default function Onboarding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      router.replace('/auth/signup');
    }
  };

  const handleSkip = () => {
    router.replace('/auth/signup');
  };

  const slide = slides[currentSlide];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={[styles.iconBox, { backgroundColor: colors.primary + '20' }]}>
            <Ionicons name={slide.icon as any} size={60} color={colors.primary} />
          </View>
        </View>

        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.primary }]}>{slide.title}</Text>
          <Text style={[styles.subtitle, { color: colors.text }]}>{slide.subtitle}</Text>
          <Text style={[styles.description, { color: colors.icon }]}>{slide.description}</Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.indicatorContainer}>
            {slides.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  { backgroundColor: index === currentSlide ? colors.primary : colors.primary + '30' }
                ]}
              />
            ))}
          </View>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={handleNext}
          >
            <Text style={styles.buttonText}>{currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text style={[styles.skipText, { color: colors.icon }]}>Skip</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 40,
  },
  iconBox: {
    width: 120,
    height: 120,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  footer: {
    width: '100%',
    alignItems: 'center',
  },
  indicatorContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  indicator: {
    height: 8,
    width: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  button: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  skipButton: {
    padding: 8,
  },
  skipText: {
    fontSize: 16,
  },
});
