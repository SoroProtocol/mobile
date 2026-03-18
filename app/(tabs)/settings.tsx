import {
  View, Text, TouchableOpacity,
  StyleSheet, Switch, Alert,
} from 'react-native';
import { useState }    from 'react';
import { useWallet }   from '@/context/WalletContext';
import { Colors }      from '@/constants/Colors';
import { Layout }      from '@/constants/Layout';

const T = Colors.dark;

export default function SettingsScreen() {
  const { address, clearWallet } = useWallet();
  const [notifications, setNotifications] = useState(true);

  const handleDisconnect = () =>
    Alert.alert('Disconnect Wallet', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Disconnect', style: 'destructive', onPress: () => void clearWallet() },
    ]);

  return (
    <View style={styles.container}>
      {/* Wallet section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Wallet</Text>
        {address ? (
          <View style={styles.item}>
            <View>
              <Text style={styles.itemLabel}>Connected</Text>
              <Text style={styles.itemMono}>{address.slice(0,8)}...{address.slice(-6)}</Text>
            </View>
            <TouchableOpacity style={styles.dangerBtn} onPress={handleDisconnect}>
              <Text style={styles.dangerText}>Disconnect</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.connectBtn}>
            <Text style={styles.connectText}>Connect Wallet</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Notifications */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.item}>
          <Text style={styles.itemLabel}>Push notifications</Text>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: T.surface2, true: T.accent }}
            thumbColor="#fff"
          />
        </View>
      </View>

      {/* App info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        {[
          ['Version', '1.0.0'],
          ['Network', 'Testnet'],
          ['SDK',     '@soroprotocol/sdk v0.2.0'],
        ].map(([k, v]) => (
          <View key={k} style={styles.item}>
            <Text style={styles.itemLabel}>{k}</Text>
            <Text style={styles.itemValue}>{v}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: T.bg, padding: Layout.spacing.md },
  section:   { marginBottom: Layout.spacing.lg },
  sectionTitle: {
    color: T.textMuted, fontSize: 11, fontWeight: '600',
    textTransform: 'uppercase', letterSpacing: 1,
    marginBottom: Layout.spacing.sm,
  },
  item: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: T.surface,
    borderRadius: Layout.radius.md,
    borderWidth: 1, borderColor: T.border,
    padding: Layout.spacing.md,
    marginBottom: 6,
  },
  itemLabel: { color: T.text, fontSize: 14 },
  itemMono:  { color: T.textMuted, fontSize: 12, fontFamily: 'monospace', marginTop: 2 },
  itemValue: { color: T.textMuted, fontSize: 14 },

  dangerBtn:  { borderWidth: 1, borderColor: T.danger, paddingHorizontal: 12, paddingVertical: 6, borderRadius: Layout.radius.md },
  dangerText: { color: T.danger, fontSize: 13, fontWeight: '600' },

  connectBtn: {
    backgroundColor: T.accent, borderRadius: Layout.radius.md,
    padding: Layout.spacing.md, alignItems: 'center',
  },
  connectText: { color: '#fff', fontWeight: '700' },
});
