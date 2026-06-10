import { Stack }                from 'expo-router';
import { StatusBar }            from 'expo-status-bar';
import { SafeAreaProvider }     from 'react-native-safe-area-context';
import { WalletProvider }       from '@/context/WalletContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <WalletProvider>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false }} />
      </WalletProvider>
    </SafeAreaProvider>
  );
}
