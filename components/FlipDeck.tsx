import React, { useState } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { QuizCard } from '@/lib/generate-quiz';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type Props = {
  cards: QuizCard[];
  currentIndex: number;
  onNext: () => void;
};

function FlipCard({
  card,
  onNext,
}: {
  card: QuizCard;
  onNext: () => void;
}) {
  const rotation = useSharedValue(0);
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => {
    const target = flipped ? 0 : 1;
    rotation.value = withSpring(target, { damping: 12, stiffness: 90 });
    setFlipped(!flipped);
  };

  const frontStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${interpolate(rotation.value, [0, 1], [0, 180])}deg` }],
    backfaceVisibility: 'hidden',
    opacity: interpolate(rotation.value, [0, 0.5, 1], [1, 0, 0]),
  }));

  const backStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${interpolate(rotation.value, [0, 1], [180, 360])}deg` }],
    backfaceVisibility: 'hidden',
    opacity: interpolate(rotation.value, [0, 0.5, 1], [0, 0, 1]),
    position: 'absolute',
  }));

  return (
    <View style={styles.flipContainer}>
      <Pressable onPress={handleFlip} style={styles.pressArea}>
        <Animated.View style={[styles.card, { backgroundColor: card.color }, frontStyle]}>
          <Text style={styles.questionText}>{card.question}</Text>
          <Text style={styles.tapHint}>Tap to reveal answer</Text>
        </Animated.View>
        <Animated.View style={[styles.card, styles.backCard, backStyle]}>
          <Text style={styles.answerLabel}>Answer</Text>
          <Text style={styles.answerText}>{card.answer}</Text>
        </Animated.View>
      </Pressable>

      <Pressable
        style={({ pressed }) => [styles.nextBtn, pressed && { opacity: 0.8 }]}
        onPress={() => {
          rotation.value = withSpring(0, { damping: 12 });
          setFlipped(false);
          setTimeout(onNext, 100);
        }}
      >
        <Text style={styles.nextText}>Next →</Text>
      </Pressable>
    </View>
  );
}

export default function FlipDeck({ cards, currentIndex, onNext }: Props) {
  if (currentIndex >= cards.length) return null;
  return (
    <FlipCard
      key={currentIndex}
      card={cards[currentIndex]}
      onNext={onNext}
    />
  );
}

const styles = StyleSheet.create({
  flipContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  pressArea: {
    width: SCREEN_WIDTH - 48,
    minHeight: 340,
  },
  card: {
    width: '100%',
    minHeight: 340,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },
  backCard: {
    backgroundColor: '#1a1a2e',
    borderWidth: 2,
    borderColor: '#374151',
  },
  questionText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 32,
  },
  tapHint: {
    position: 'absolute',
    bottom: 24,
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
  },
  answerLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6366f1',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  answerText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 30,
  },
  nextBtn: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 16,
  },
  nextText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
});
