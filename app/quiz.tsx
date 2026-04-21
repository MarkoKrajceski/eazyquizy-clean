import { useEffect, useRef, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { generateQuiz, QuizCard } from '@/lib/generate-quiz';
import SwipeDeck from '@/components/SwipeDeck';
import FlipDeck from '@/components/FlipDeck';

type Mode = 'scored' | 'flip' | 'swipe';

export default function QuizScreen() {
  const router = useRouter();
  const { language, topic, mode, promptType, label } = useLocalSearchParams<{
    language: string;
    topic: string;
    mode: Mode;
    promptType: string;
    label: string;
  }>();

  const [cards, setCards] = useState<QuizCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const scoreRef = useRef(0);
  const incorrectRef = useRef<number[]>([]);

  useEffect(() => {
    generateQuiz(topic, language, promptType, mode === 'flip' ? 'flip' : mode === 'scored' ? 'scored' : 'swipe')
      .then(setCards)
      .catch((e: Error) => setError(e.message || 'Failed to generate quiz.'))
      .finally(() => setLoading(false));
  }, []);

  const handleSwipeRight = () => {
    if (mode === 'scored' && cards[currentIndex]?.answer === 'Yes') {
      scoreRef.current += 1;
    } else if (mode === 'scored') {
      incorrectRef.current.push(currentIndex);
    }
    advance();
  };

  const handleSwipeLeft = () => {
    if (mode === 'scored' && cards[currentIndex]?.answer === 'No') {
      scoreRef.current += 1;
    } else if (mode === 'scored') {
      incorrectRef.current.push(currentIndex);
    }
    advance();
  };

  const advance = () => {
    const next = currentIndex + 1;
    if (next >= cards.length) {
      router.replace({
        pathname: '/results',
        params: {
          mode,
          score: scoreRef.current,
          total: cards.length,
          language,
          topic,
          promptType,
          label,
        },
      });
    } else {
      setCurrentIndex(next);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={styles.loadingText}>Generating your quiz…</Text>
          <Text style={styles.loadingSubText}>{topic} · {language}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable style={styles.retryBtn} onPress={() => router.back()}>
            <Text style={styles.retryText}>Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backText}>✕</Text>
        </Pressable>
        <View style={styles.headerMeta}>
          <Text style={styles.labelText}>{label}</Text>
          <Text style={styles.progress}>{currentIndex + 1} / {cards.length}</Text>
        </View>
      </View>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${((currentIndex) / cards.length) * 100}%` }]} />
      </View>

      {mode === 'flip' ? (
        <FlipDeck cards={cards} currentIndex={currentIndex} onNext={advance} />
      ) : (
        <>
          <SwipeDeck
            cards={cards}
            currentIndex={currentIndex}
            onSwipeRight={handleSwipeRight}
            onSwipeLeft={handleSwipeLeft}
            mode={mode === 'scored' ? 'scored' : 'swipe'}
          />
          {mode === 'scored' && (
            <View style={styles.swipeHints}>
              <Text style={styles.hintNo}>← NO</Text>
              <Text style={styles.hintYes}>YES →</Text>
            </View>
          )}
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 16,
  },
  back: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    fontSize: 16,
    color: '#9ca3af',
  },
  headerMeta: {
    flex: 1,
    alignItems: 'center',
  },
  labelText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  progress: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  progressBar: {
    height: 3,
    backgroundColor: '#1a1a2e',
    marginHorizontal: 20,
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6366f1',
    borderRadius: 2,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 32,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  loadingSubText: {
    fontSize: 14,
    color: '#6b7280',
  },
  errorIcon: {
    fontSize: 48,
  },
  errorText: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 24,
  },
  retryBtn: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 14,
    marginTop: 8,
  },
  retryText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  swipeHints: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    paddingBottom: 24,
    paddingTop: 8,
  },
  hintNo: {
    fontSize: 14,
    fontWeight: '700',
    color: '#f87171',
  },
  hintYes: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4ade80',
  },
});
