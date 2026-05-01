import {
  View, Text, TouchableOpacity,
  StyleSheet, Alert, ScrollView, ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useStream }        from '@/hooks/useStreams';
import { useWallet }        from '@/context/WalletContext';
import { BalanceCounter }   from '@/components/BalanceCounter';
import { Colors }           from '@/constants/Colors';
import { Layout }           from '@/constants/Layout';

const T = Colors.dark;

function trunc(addr: string) { return `${addr.slice(0,6)}...${addr.slice(-4)}`; }

export default function StreamDetail() {
  const { id }   = useLocalSearchParams<{ id: string }>();
  const router   = useRouter();
  const { address } = useWallet();
  const { stream, loading, error } = useStream(id ?? null);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={T.accent} size="large" />
      </View>
    );
  }

  if (error || !stream) {
    return (
      <View style={styles.centered}>
        <Text style={styles.notFound}>{error ?? 'Stream not found.'}</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isSender    = address === stream.sender;
  const isRecipient = address === stream.recipient;
  const isActive    = stream.status === 'active';
  const perDay      = (Number(stream.ratePerSecond) * 86400 / 1e7).toFixed(4);

  const handleWithdraw = () =>
    Alert.alert('Withdraw', 'Claim your accrued balance now?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Withdraw', onPress: () => {} },
    ]);

  const handleCancel = () =>
    Alert.alert('Cancel Stream', 'Accrued balance goes to recipient. This cannot be undone.', [
      { text: 'Keep Stream', style: 'cancel' },
      { text: 'Cancel Stream', style: 'destructive', onPress: () => {} },
    ]);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Withdrawable Balance</Text>
        <BalanceCounter
          ratePerSecond={BigInt(stream.ratePerSecond)}
          withdrawn={BigInt(stream.withdrawn)}
          startTime={stream.startTime}
          stopTime={stream.stopTime}
          style={styles.balanceValue}
        />
        <Text style={styles.balanceRate}>{perDay} XLM/day</Text>
      </View>

      <View style={styles.card}>
        {([
          ['From',   trunc(stream.sender)],
          ['To',     trunc(stream.recipient)],
          ['Token',  stream.token === 'native' ? 'XLM' : trunc(stream.token)],
          ['Status', stream.status.charAt(0).toUpperCase() + stream.status.slice(1)],
        ] as [string, string][]).map(([k, v]) => (
          <View key={k} style={styles.row}>
            <Text style={styles.rowKey}>{k}</Text>
            <Text style={styles.rowVal}>{v}</Text>
          </View>
        ))}
      </View>

      {isActive && (
        <View style={styles.actions}>
          {isRecipient && (
            <TouchableOpacity style={styles.btnWithdraw} onPress={handleWithdraw}>
              <Text style={styles.btnText}>Withdraw</Text>
            </TouchableOpacity>
          )}
          {isSender && (
            <TouchableOpacity style={styles.btnCancel} onPress={handleCancel}>
              <Text style={styles.btnCancelText}>Cancel Stream</Text>
            </TouchableOpacity>
          )}
          {!isSender && !isRecipient && (
            <Text style={styles.notParty}>Connect the sender or recipient wallet to take action.</Text>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll:    { flex: 1, backgroundColor: T.bg },
  content:   { padding: Layout.spacing.md },
  centered:  { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: T.bg },
  notFound:  { color: T.textMuted, fontSize: 16, marginBottom: 12 },
  backBtn:   { marginBottom: Layout.spacing.md },
  backText:  { color: T.accent, fontSize: 14 },

  balanceCard: {
    backgroundColor: '#1e1b4b',
    borderRadius: Layout.radius.lg,
    borderWidth: 1, borderColor: T.accent,
    padding: Layout.spacing.lg,
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  balanceLabel: { color: T.textMuted, fontSize: 13, marginBottom: 8 },
  balanceValue: { fontSize: 32, marginBottom: 4 },
  balanceRate:  { color: T.textMuted, fontSize: 13 },

  card: {
    backgroundColor: T.surface,
    borderRadius: Layout.radius.md,
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
    backgroundColor: T.success, borderRadius: Layout.radius.md,
    padding: Layout.spacing.md, alignItems: 'center',
  },
  btnCancel: {
    backgroundColor: 'transparent', borderRadius: Layout.radius.md,
    borderWidth: 1, borderColor: T.danger,
    padding: Layout.spacing.md, alignItems: 'center',
  },
  btnText:      { color: '#fff', fontWeight: '700', fontSize: 15 },
  btnCancelText:{ color: T.danger, fontWeight: '700', fontSize: 15 },
  notParty:     { color: T.textMuted, textAlign: 'center', fontSize: 13 },
});
