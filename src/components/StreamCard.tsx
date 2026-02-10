import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors }   from '@/constants/Colors';
import { Layout }   from '@/constants/Layout';

export interface StreamCardProps {
  id:            string;
  recipient:     string;
  ratePerSecond: bigint;
  startTime:     number;
  stopTime:      number;
  cancelled:     boolean;
}

const T = Colors.dark;

function truncate(addr: string) {
  return `${addr.slice(0, 5)}...${addr.slice(-4)}`;
}

function progressPct(start: number, stop: number): number {
  const now     = Math.floor(Date.now() / 1000);
  const elapsed = Math.max(0, Math.min(now, stop) - start);
  return stop > start ? Math.round((elapsed / (stop - start)) * 100) : 0;
}

export function StreamCard({ id, recipient, ratePerSecond, startTime, stopTime, cancelled }: StreamCardProps) {
  const router = useRouter();
  const pct    = progressPct(startTime, stopTime);
  const perDay = (Number(ratePerSecond) * 86400 / 1e7).toFixed(2);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/stream/${id}`)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={styles.id}>Stream #{id}</Text>
        <View style={[styles.badge, cancelled ? styles.badgeCancelled : styles.badgeActive]}>
          <Text style={[styles.badgeText, { color: cancelled ? T.danger : T.success }]}>
            {cancelled ? 'Cancelled' : 'Active'}
          </Text>
        </View>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>To</Text>
        <Text style={styles.value}>{truncate(recipient)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Rate</Text>
        <Text style={styles.value}>{perDay} XLM/day</Text>
      </View>

      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${pct}%` as any }]} />
      </View>
      <Text style={styles.pct}>{pct}% elapsed</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: T.surface,
    borderRadius:    Layout.radius.md,
    borderWidth:     1,
    borderColor:     T.border,
    padding:         Layout.spacing.md,
    marginBottom:    Layout.spacing.sm,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  id:     { color: T.text, fontWeight: '600', fontSize: 15 },
  badge:  { paddingHorizontal: 8, paddingVertical: 3, borderRadius: Layout.radius.full },
  badgeActive:    { backgroundColor: 'rgba(34,197,94,0.15)' },
  badgeCancelled: { backgroundColor: 'rgba(239,68,68,0.15)' },
  badgeText: { fontSize: 12, fontWeight: '600' },
  row:   { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  label: { color: T.textMuted, fontSize: 13 },
  value: { color: T.text, fontSize: 13, fontFamily: 'monospace' },
  barBg: {
    height: 4, backgroundColor: T.surface2,
    borderRadius: 2, overflow: 'hidden', marginTop: 10,
  },
  barFill: { height: '100%', backgroundColor: T.accent, borderRadius: 2 },
  pct:    { color: T.textMuted, fontSize: 11, marginTop: 4 },
});
