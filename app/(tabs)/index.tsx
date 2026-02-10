import {
  View, Text, FlatList, StyleSheet,
  TouchableOpacity, RefreshControl,
} from 'react-native';
import { useRouter }   from 'expo-router';
import { useState }    from 'react';
import { StreamCard }  from '@/components/StreamCard';
import { useWallet }   from '@/context/WalletContext';
import { Colors }      from '@/constants/Colors';
import { Layout }      from '@/constants/Layout';

const T = Colors.dark;

const MOCK_STREAMS = [
  {
    id: '0',
    recipient: 'GBOB1234567890123456789012345678901234567890123456789012',
    ratePerSecond: 116n,
    startTime: 1735689600,
    stopTime:  1738368000,
    cancelled: false,
  },
  {
    id: '1',
    recipient: 'GCAR1234567890123456789012345678901234567890123456789012',
    ratePerSecond: 231n,
    startTime: 1735776000,
    stopTime:  1743552000,
    cancelled: false,
  },
];

export default function StreamsScreen() {
  const { address, loading } = useWallet();
  const router               = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise(r => setTimeout(r, 800));
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text style={styles.muted}>Loading…</Text>
      </View>
    );
  }

  if (!address) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyTitle}>No wallet connected</Text>
        <Text style={styles.muted}>Go to Settings to connect your Stellar wallet.</Text>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => router.push('/settings')}
        >
          <Text style={styles.btnText}>Go to Settings</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={MOCK_STREAMS}
        keyExtractor={s => s.id}
        renderItem={({ item }) => <StreamCard {...item} />}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={T.accent}
          />
        }
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyTitle}>No streams yet</Text>
            <Text style={styles.muted}>Create your first stream to get started.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: T.bg },
  list:      { padding: Layout.spacing.md },
  centered:  { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Layout.spacing.lg },
  emptyTitle:{ color: T.text, fontSize: 18, fontWeight: '600', marginBottom: 8 },
  muted:     { color: T.textMuted, textAlign: 'center', fontSize: 14 },
  btn: {
    marginTop: Layout.spacing.md,
    backgroundColor: T.accent,
    paddingHorizontal: 24, paddingVertical: 12,
    borderRadius: Layout.radius.md,
  },
  btnText: { color: '#fff', fontWeight: '600' },
});
