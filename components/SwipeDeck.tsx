import React, { useCallback, useRef } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { QuizCard } from '@/lib/generate-quiz';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.35;
const ROTATION_FACTOR = 12;
const STACK_OFFSET = 10;

type Props = {
  cards: QuizCard[];
  currentIndex: number;
  onSwipeRight: () => void;
  onSwipeLeft: () => void;
  mode: 'scored' | 'swipe';
};

function Card({
  card,
  isTop,
  stackIndex,
  onSwipeRight,
  onSwipeLeft,
  mode,
}: {
  card: QuizCard;
  isTop: boolean;
  stackIndex: number;
  onSwipeRight: () => void;
  onSwipeLeft: () => void;
  mode: 'scored' | 'swipe';
}) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const finish = useCallback(
    (direction: 'right' | 'left') => {
      if (direction === 'right') onSwipeRight();
      else onSwipeLeft();
    },
    [onSwipeRight, onSwipeLeft]
  );

  const pan = Gesture.Pan()
    .enabled(isTop)
    .onUpdate((e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY * 0.3;
    })
    .onEnd((e) => {
      if (Math.abs(e.translationX) > SWIPE_THRESHOLD) {
        const dir = e.translationX > 0 ? 1 : -1;
        translateX.value = withTiming(dir * SCREEN_WIDTH * 1.5, { duration: 280 });
        runOnJS(finish)(dir > 0 ? 'right' : 'left');
      } else {
        translateX.value = withSpring(0, { damping: 15 });
        translateY.value = withSpring(0, { damping: 15 });
      }
    });

  const cardStyle = useAnimatedStyle(() => {
    const scale = isTop ? 1 : 1 - stackIndex * 0.04;
    const yOffset = isTop ? translateY.value : stackIndex * STACK_OFFSET;
    return {
      transform: [
        { translateX: isTop ? translateX.value : 0 },
        { translateY: yOffset },
        { rotate: isTop ? `${(translateX.value / SCREEN_WIDTH) * ROTATION_FACTOR}deg` : '0deg' },
        { scale },
      ],
      zIndex: isTop ? 10 : 10 - stackIndex,
    };
  });

  const yesOpacity = useAnimatedStyle(() => ({
    opacity: Math.max(0, translateX.value / SWIPE_THRESHOLD),
  }));
  const noOpacity = useAnimatedStyle(() => ({
    opacity: Math.max(0, -translateX.value / SWIPE_THRESHOLD),
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.card, { backgroundColor: card.color }, cardStyle]}>
        {isTop && mode === 'scored' && (
          <>
            <Animated.View style={[styles.indicator, styles.yesIndicator, yesOpacity]}>
              <Text style={styles.indicatorText}>YES ✓</Text>
            </Animated.View>
            <Animated.View style={[styles.indicator, styles.noIndicator, noOpacity]}>
              <Text style={styles.indicatorText}>NO ✗</Text>
            </Animated.View>
          </>
        )}
        <Text style={styles.questionText}>{card.question}</Text>
        {isTop && mode === 'swipe' && (
          <Text style={styles.hint}>Swipe to continue</Text>
        )}
      </Animated.View>
    </GestureDetector>
  );
}

export default function SwipeDeck({ cards, currentIndex, onSwipeRight, onSwipeLeft, mode }: Props) {
  const visibleCards = cards.slice(currentIndex, currentIndex + 3);

  return (
    <View style={styles.deck}>
      {[...visibleCards].reverse().map((card, reversedIdx) => {
        const stackIndex = visibleCards.length - 1 - reversedIdx;
        const isTop = stackIndex === 0;
        return (
          <Card
            key={`${currentIndex}-${stackIndex}`}
            card={card}
            isTop={isTop}
            stackIndex={stackIndex}
            onSwipeRight={onSwipeRight}
            onSwipeLeft={onSwipeLeft}
            mode={mode}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  deck: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    position: 'absolute',
    width: SCREEN_WIDTH - 48,
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
  questionText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 32,
  },
  hint: {
    position: 'absolute',
    bottom: 24,
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
  },
  indicator: {
    position: 'absolute',
    top: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 3,
  },
  yesIndicator: {
    left: 24,
    borderColor: '#4ade80',
    transform: [{ rotate: '-15deg' }],
  },
  noIndicator: {
    right: 24,
    borderColor: '#f87171',
    transform: [{ rotate: '15deg' }],
  },
  indicatorText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
  },
});
