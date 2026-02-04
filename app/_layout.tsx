import { Stack }          from 'expo-router';
import { StatusBar }      from 'expo-status-bar';
import { WalletProvider } from '@/context/WalletContext';

export default function RootLayout() {
  return (
    <WalletProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }} />
    </WalletProvider>
  );
}
