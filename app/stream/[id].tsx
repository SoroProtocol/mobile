import {
  View, Text, TouchableOpacity,
  StyleSheet, Alert, ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BalanceCounter } from '@/components/BalanceCounter';
import { Colors }         from '@/constants/Colors';
import { Layout }         from '@/constants/Layout';

const T = Colors.dark;

const MOCK: Record<string, any> = {
  '0': {
    id: '0',
    sender:    'GABC1234567890123456789012345678901234567890123456789012',
    recipient: 'GBOB1234567890123456789012345678901234567890123456789012',
    token:     'XLM',
    ratePerSecond: 116n,
    startTime: 1735689600,
    stopTime:  1738368000,
    withdrawn: 1_000_000n,
    cancelled: false,
  },
};

function trunc(addr: string) { return `${addr.slice(0,6)}...${addr.slice(-4)}`; }

export default function StreamDetail() {
  const { id }  = useLocalSearchParams<{ id: string }>();
  const router  = useRouter();
  const stream  = MOCK[id ?? ''];

  if (!stream) {
    return (
      <View style={styles.centered}>
        <Text style={styles.notFound}>Stream not found.</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleWithdraw = () =>
    Alert.alert('Withdraw', 'This will claim your accrued balance.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Withdraw', onPress: () => {} },
    ]);

  const handleCancel = () =>
    Alert.alert('Cancel Stream', 'Accrued balance goes to recipient. Are you sure?', [
      { text: 'Keep Stream', style: 'cancel' },
      { text: 'Cancel Stream', style: 'destructive', onPress: () => {} },
    ]);

  const perDay = (Number(stream.ratePerSecond) * 86400 / 1e7).toFixed(4);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      {/* Balance card */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Withdrawable Balance</Text>
        <BalanceCounter
          ratePerSecond={stream.ratePerSecond}
          withdrawn={stream.withdrawn}
          startTime={stream.startTime}
          stopTime={stream.stopTime}
          style={styles.balanceValue}
        />
        <Text style={styles.balanceRate}>{perDay} XLM/day</Text>
      </View>

      {/* Details */}
      <View style={styles.card}>
        {[
          ['From',   trunc(stream.sender)],
          ['To',     trunc(stream.recipient)],
          ['Token',  stream.token],
          ['Status', stream.cancelled ? 'Cancelled' : 'Active'],
        ].map(([k, v]) => (
          <View key={k} style={styles.row}>
            <Text style={styles.rowKey}>{k}</Text>
            <Text style={styles.rowVal}>{v}</Text>
          </View>
        ))}
      </View>

      {/* Actions */}
      {!stream.cancelled && (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.btnWithdraw} onPress={handleWithdraw}>
            <Text style={styles.btnText}>Withdraw</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnCancel} onPress={handleCancel}>
            <Text style={styles.btnCancelText}>Cancel Stream</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll:   { flex: 1, backgroundColor: T.bg },
  content:  { padding: Layout.spacing.md },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  notFound: { color: T.textMuted, fontSize: 16 },
  back:     { color: T.accent, marginTop: 12 },

  balanceCard: {
    background: 'transparent',
    borderRadius: Layout.radius.lg,
    backgroundColor: '#1e1b4b',
    borderWidth: 1, borderColor: T.accent,
    padding: Layout.spacing.lg,
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  balanceLabel: { color: T.textMuted, fontSize: 13, marginBottom: 8 },
  balanceValue: { fontSize: 36, marginBottom: 4 },
  balanceRate:  { color: T.textMuted, fontSize: 13 },

  card: {
    backgroundColor: T.surface,
    borderRadius:    Layout.radius.md,
    borderWidth: 1, borderColor: T.border,
    marginBottom: Layout.spacing.md,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row', justifyContent: 'space-between',
    padding: Layout.spacing.md,
    borderBottomWidth: 1, borderBottomColor: T.border,
  },
  rowKey: { color: T.textMuted, fontSize: 14 },
  rowVal: { color: T.text, fontSize: 14, fontFamily: 'monospace' },

  actions: { gap: 12 },
  btnWithdraw: {
    backgroundColor: T.success,
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.md,
    alignItems: 'center',
  },
  btnCancel: {
    backgroundColor: 'transparent',
    borderRadius: Layout.radius.md,
    borderWidth: 1, borderColor: T.danger,
    padding: Layout.spacing.md,
    alignItems: 'center',
  },
  btnText:       { color: '#fff', fontWeight: '700', fontSize: 15 },
  btnCancelText: { color: T.danger, fontWeight: '700', fontSize: 15 },
});
