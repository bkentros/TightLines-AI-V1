import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🎣</Text>
      <Text style={styles.title}>TightLines AI</Text>
      <Text style={styles.subtitle}>Your AI fishing companion</Text>
      <Text style={styles.note}>Build is working. Let's go fishing.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a1628',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  logo: {
    fontSize: 64,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: '#7eb8d4',
  },
  note: {
    marginTop: 24,
    fontSize: 14,
    color: '#4a7fa8',
    fontStyle: 'italic',
  },
});
