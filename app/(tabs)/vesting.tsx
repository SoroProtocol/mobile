import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';

const T = Colors.dark;

const MOCK_SCHEDULES = [
  {
    id: '0',
    beneficiary: 'GBOB1234567890123456789012345678901234567890123456789012',
    totalXlm:    12000,
    cliffTime:   1740787200,
    endTime:     1767225600,
    claimed:     0,
  },
];

function vestingPct(cliff: number, end: number): number {
  const now = Math.floor(Date.now() / 1000);
  if (now < cliff) return 0;
  if (now >= end)  return 100;
  return Math.round(((now - cliff) / (end - cliff)) * 100);
}

function trunc(addr: string) { return `${addr.slice(0,5)}...${addr.slice(-4)}`; }

export default function VestingScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        data={MOCK_SCHEDULES}
        keyExtractor={s => s.id}
        contentContainerStyle={styles.list}
        renderItem={({ item: s }) => {
          const pct = vestingPct(s.cliffTime, s.endTime);
          return (
            <View style={styles.card}>
              <View style={styles.header}>
                <Text style={styles.title}>Schedule #{s.id}</Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>Active</Text>
                </View>
              </View>

              <View style={styles.row}>
                <Text style={styles.key}>Beneficiary</Text>
                <Text style={styles.val}>{trunc(s.beneficiary)}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.key}>Total</Text>
                <Text style={styles.val}>{s.totalXlm.toLocaleString()} XLM</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.key}>Claimed</Text>
                <Text style={styles.val}>{s.claimed} XLM</Text>
              </View>

              <View style={styles.barBg}>
                <View style={[styles.barFill, { width: `${pct}%` as any }]} />
              </View>
              <Text style={styles.pctLabel}>{pct}% vested</Text>

              <TouchableOpacity
                style={styles.claimBtn}
                accessibilityRole="button"
                accessibilityLabel="Claim vested tokens"
              >
                <Text style={styles.claimText}>Claim Vested Tokens</Text>
              </TouchableOpacity>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No vesting schedules.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: T.bg },
  list:      { padding: Layout.spacing.md },
  card: {
    backgroundColor: T.surface,
    borderRadius: Layout.radius.md,
    borderWidth: 1, borderColor: T.border,
    padding: Layout.spacing.md, marginBottom: Layout.spacing.sm,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  title:  { color: T.text, fontWeight: '600', fontSize: 15 },
  badge:  { backgroundColor: 'rgba(34,197,94,0.15)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
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
  emptyText: { color: T.textMuted },
});
