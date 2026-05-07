import {
  View, Text, FlatList, StyleSheet,
  TouchableOpacity, RefreshControl,
} from 'react-native';
import { useRouter }   from 'expo-router';
import { StreamCard }  from '@/components/StreamCard';
import { useWallet }   from '@/context/WalletContext';
import { useStreams }  from '@/hooks/useStreams';
import { Colors }      from '@/constants/Colors';
import { Layout }      from '@/constants/Layout';

const T = Colors.dark;

export default function StreamsScreen() {
  const { address, loading: walletLoading } = useWallet();
  const router = useRouter();
  const { streams, loading, error, refetch } = useStreams(address);

  if (walletLoading) {
    return (
      <View style={styles.centered}>
        <Text style={styles.muted}>Loading wallet…</Text>
      </View>
    );
  }

  if (!address) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyTitle}>No wallet connected</Text>
        <Text style={styles.muted}>Go to Settings to connect your Stellar wallet.</Text>
        <TouchableOpacity style={styles.btn} onPress={() => router.push('/settings')}>
          <Text style={styles.btnText}>Go to Settings</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error}</Text>
        <TouchableOpacity style={styles.btn} onPress={refetch}>
          <Text style={styles.btnText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={streams}
        keyExtractor={s => s.id}
        renderItem={({ item }) => (
          <StreamCard
            id={item.id}
            recipient={item.recipient}
            ratePerSecond={BigInt(item.ratePerSecond || '0')}
            startTime={item.startTime}
            stopTime={item.stopTime}
            cancelled={item.status === 'cancelled'}
          />
        )}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} tintColor={T.accent} />
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.centered}>
              <Text style={styles.emptyTitle}>No streams yet</Text>
              <Text style={styles.muted}>Create your first stream to get started.</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: T.bg },
  list:      { padding: Layout.spacing.md, flexGrow: 1 },
  centered:  {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    padding: Layout.spacing.lg, minHeight: 300,
  },
  emptyTitle:{ color: T.text, fontSize: 18, fontWeight: '600', marginBottom: 8, textAlign: 'center' },
  muted:     { color: T.textMuted, textAlign: 'center', fontSize: 14, lineHeight: 20 },
  error:     { color: T.danger, textAlign: 'center', marginBottom: 12 },
  btn: {
    marginTop: Layout.spacing.md,
    backgroundColor: T.accent,
    paddingHorizontal: 24, paddingVertical: 12,
    borderRadius: Layout.radius.md,
  },
  btnText: { color: '#fff', fontWeight: '600' },
});
