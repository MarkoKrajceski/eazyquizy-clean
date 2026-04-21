import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LANGUAGES, Language } from '@/constants/languages';

export default function LanguageScreen() {
  const router = useRouter();

  const renderItem = ({ item }: { item: Language }) => (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.8 }]}
      onPress={() => router.push({ pathname: '/topic', params: { language: item.name } })}
    >
      <LinearGradient
        colors={item.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <Text style={styles.flag}>{item.flag}</Text>
        <Text style={styles.native}>{item.native}</Text>
        <Text style={styles.name}>{item.name}</Text>
      </LinearGradient>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>EazyQuizy</Text>
        <Text style={styles.subtitle}>Pick a language</Text>
      </View>
      <FlatList
        data={LANGUAGES}
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
    paddingTop: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
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
    borderRadius: 16,
    overflow: 'hidden',
    aspectRatio: 1,
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  flag: {
    fontSize: 32,
    marginBottom: 8,
  },
  native: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
  },
  name: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 2,
    textAlign: 'center',
  },
});
