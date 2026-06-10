import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  DimensionValue, ActivityIndicator,
} from 'react-native';
import { useEffect, useState } from 'react';
import { useWallet }    from '@/context/WalletContext';
import { vestingApi, type ApiVestingSchedule } from '@/services/api';
import { Colors }       from '@/constants/Colors';
import { Layout }       from '@/constants/Layout';

const T = Colors.dark;

function vestingPct(cliff: number, end: number): number {
  const now = Math.floor(Date.now() / 1000);
  if (now < cliff) return 0;
  if (now >= end)  return 100;
  if (end === cliff) return 100;
  return Math.round(((now - cliff) / (end - cliff)) * 100);
}

function trunc(addr: string) { return `${addr.slice(0,5)}...${addr.slice(-4)}`; }
function fmt(stroops: string) {
  return (Number(stroops) / 1e7).toLocaleString(undefined, { maximumFractionDigits: 2 });
}

export default function VestingScreen() {
  const { address, loading: walletLoading } = useWallet();
  const [schedules, setSchedules] = useState<ApiVestingSchedule[]>([]);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState<string | null>(null);

  const load = () => {
    if (!address) { setSchedules([]); return; }
    setLoading(true);
    vestingApi.list(address)
      .then(setSchedules)
      .catch(e => setError(e instanceof Error ? e.message : 'Failed to load schedules'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [address]);

  if (walletLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={T.accent} />
      </View>
    );
  }

  if (!address) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>Connect your wallet to view vesting schedules.</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={[styles.emptyText, { color: T.danger }]}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={schedules}
        keyExtractor={s => s.id}
        contentContainerStyle={styles.list}
        refreshing={loading}
        onRefresh={load}
        renderItem={({ item: s }) => {
          const pct = vestingPct(s.cliffTime, s.endTime);
          return (
            <View style={styles.card}>
              <View style={styles.header}>
                <Text style={styles.title}>Schedule #{s.id}</Text>
                <View style={[styles.badge, s.revoked && styles.badgeRevoked]}>
                  <Text style={[styles.badgeText, s.revoked && { color: T.danger }]}>
                    {s.revoked ? 'Revoked' : 'Active'}
                  </Text>
                </View>
              </View>

              <View style={styles.row}>
                <Text style={styles.key}>Beneficiary</Text>
                <Text style={styles.val}>{trunc(s.beneficiary)}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.key}>Total</Text>
                <Text style={styles.val}>{fmt(s.totalAmount)} XLM</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.key}>Claimed</Text>
                <Text style={styles.val}>{fmt(s.claimed)} XLM</Text>
              </View>

              <View style={styles.barBg}>
                <View style={[styles.barFill, { width: `${pct}%` as DimensionValue }]} />
              </View>
              <Text style={styles.pctLabel}>{pct}% vested</Text>

              {!s.revoked && (
                <TouchableOpacity
                  style={styles.claimBtn}
                  accessibilityRole="button"
                  accessibilityLabel="Claim vested tokens"
                >
                  <Text style={styles.claimText}>Claim Vested Tokens</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        }}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No vesting schedules found.</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: T.bg },
  list:      { padding: Layout.spacing.md },
  centered:  { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Layout.spacing.lg },
  card: {
    backgroundColor: T.surface,
    borderRadius: Layout.radius.md,
    borderWidth: 1, borderColor: T.border,
    padding: Layout.spacing.md, marginBottom: Layout.spacing.sm,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  title:  { color: T.text, fontWeight: '600', fontSize: 15 },
  badge:  { backgroundColor: 'rgba(34,197,94,0.15)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  badgeRevoked: { backgroundColor: 'rgba(239,68,68,0.15)' },
  badgeText: { color: T.success, fontSize: 11, fontWeight: '600' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  key: { color: T.textMuted, fontSize: 13 },
  val: { color: T.text, fontSize: 13, fontFamily: 'monospace' },
  barBg:  { height: 4, backgroundColor: T.surface2, borderRadius: 2, overflow: 'hidden', marginTop: 10 },
  barFill:{ height: '100%', backgroundColor: '#a855f7', borderRadius: 2 },
  pctLabel:{ color: T.textMuted, fontSize: 11, marginTop: 4, marginBottom: 10 },
  claimBtn: {
    backgroundColor: T.accent, borderRadius: Layout.radius.md,
    padding: Layout.spacing.sm + 2, alignItems: 'center', marginTop: 4,
  },
  claimText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  empty:     { alignItems: 'center', marginTop: 60 },
  emptyText: { color: T.textMuted, textAlign: 'center' },
});
