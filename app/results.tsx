import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

export default function ResultsScreen() {
  const router = useRouter();
  const { mode, score, total, language, topic, promptType, label } = useLocalSearchParams<{
    mode: string;
    score: string;
    total: string;
    language: string;
    topic: string;
    promptType: string;
    label: string;
  }>();

  const isScored = mode === 'scored';
  const scoreNum = parseInt(score ?? '0', 10);
  const totalNum = parseInt(total ?? '10', 10);
  const pct = isScored ? Math.round((scoreNum / totalNum) * 100) : 100;

  const message =
    !isScored
      ? "All done! 🎉"
      : pct >= 80
      ? "Excellent! 🎉"
      : pct >= 50
      ? "Good job! 👍"
      : "Keep practicing! 💪";

  const gradientColors: [string, string] =
    !isScored
      ? ['#6366f1', '#8b5cf6']
      : pct >= 80
      ? ['#16a34a', '#15803d']
      : pct >= 50
      ? ['#ca8a04', '#b45309']
      : ['#dc2626', '#b91c1c'];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <LinearGradient colors={gradientColors} style={styles.scoreCircle}>
          {isScored ? (
            <>
              <Text style={styles.scoreNum}>{scoreNum}/{totalNum}</Text>
              <Text style={styles.scorePct}>{pct}%</Text>
            </>
          ) : (
            <Text style={styles.doneIcon}>🎉</Text>
          )}
        </LinearGradient>

        <Text style={styles.message}>{message}</Text>
        <Text style={styles.meta}>{label} · {topic} · {language}</Text>

        <View style={styles.actions}>
          <Pressable
            style={({ pressed }) => [styles.btn, styles.primaryBtn, pressed && { opacity: 0.85 }]}
            onPress={() =>
              router.replace({
                pathname: '/quiz',
                params: { language, topic, mode, promptType, label },
              })
            }
          >
            <Text style={styles.btnText}>Try Again</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.btn, styles.secondaryBtn, pressed && { opacity: 0.75 }]}
            onPress={() => router.dismissAll()}
          >
            <Text style={[styles.btnText, { color: '#6366f1' }]}>Home</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
  },
  inner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 20,
  },
  scoreCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  scoreNum: {
    fontSize: 36,
    fontWeight: '800',
    color: '#ffffff',
  },
  scorePct: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.75)',
  },
  doneIcon: {
    fontSize: 64,
  },
  message: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
  },
  meta: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  actions: {
    width: '100%',
    gap: 12,
    marginTop: 16,
  },
  btn: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  primaryBtn: {
    backgroundColor: '#6366f1',
  },
  secondaryBtn: {
    backgroundColor: '#1a1a2e',
  },
  btnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
});
