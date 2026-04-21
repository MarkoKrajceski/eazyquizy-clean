import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TOPICS, Topic } from '@/constants/topics';

export default function TopicScreen() {
  const router = useRouter();
  const { language } = useLocalSearchParams<{ language: string }>();

  const renderItem = ({ item }: { item: Topic }) => (
    <Pressable
      style={({ pressed }) => [styles.card, { borderLeftColor: item.color }, pressed && { opacity: 0.75 }]}
      onPress={() =>
        router.push({ pathname: '/quiz-type', params: { language, topic: item.name } })
      }
    >
      <Text style={styles.icon}>{item.icon}</Text>
      <Text style={styles.label}>{item.name}</Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
        <Text style={styles.title}>Pick a topic</Text>
        <Text style={styles.subtitle}>{language}</Text>
      </View>
      <FlatList
        data={TOPICS}
        renderItem={renderItem}
        keyExtractor={(item) => item.name}
        numColumns={2}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
      />
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
  },
  row: {
    gap: 12,
    marginBottom: 12,
  },
  card: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    gap: 10,
  },
  icon: {
    fontSize: 28,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
});
