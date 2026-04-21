import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { QUIZ_TYPES, QuizType } from '@/constants/quiz-types';

export default function QuizTypeScreen() {
  const router = useRouter();
  const { language, topic } = useLocalSearchParams<{ language: string; topic: string }>();

  const handleSelect = (qt: QuizType) => {
    router.push({
      pathname: '/quiz',
      params: {
        language,
        topic,
        quizTypeId: qt.id,
        mode: qt.mode,
        promptType: qt.promptType,
        label: qt.label,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
        <Text style={styles.title}>Quiz style</Text>
        <Text style={styles.subtitle}>{topic} · {language}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {QUIZ_TYPES.map((qt) => (
          <Pressable
            key={qt.id}
            style={({ pressed }) => [styles.card, pressed && { opacity: 0.75 }]}
            onPress={() => handleSelect(qt)}
          >
            <Text style={styles.icon}>{qt.icon}</Text>
            <View style={styles.cardText}>
              <Text style={styles.label}>{qt.label}</Text>
              <Text style={styles.description}>{qt.description}</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
  },
  back: {
    marginBottom: 12,
  },
  backText: {
    color: '#6366f1',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 12,
  },
  card: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  icon: {
    fontSize: 28,
  },
  cardText: {
    flex: 1,
    gap: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  description: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
  },
  arrow: {
    fontSize: 22,
    color: '#4b5563',
  },
});
