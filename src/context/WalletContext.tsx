import {
  createContext, useContext, useState,
  useCallback, useEffect, ReactNode,
} from 'react';
import * as SecureStore from 'expo-secure-store';

const KEY_ADDRESS = 'wallet_address';
const KEY_SESSION = 'wallet_session';

interface WalletState {
  address:    string | null;
  session:    string | null;
  loading:    boolean;
  error:      string | null;
}

interface WalletCtx extends WalletState {
  setWallet:    (address: string, session: string) => Promise<void>;
  clearWallet:  () => Promise<void>;
}

const Ctx = createContext<WalletCtx | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WalletState>({
    address: null, session: null, loading: true, error: null,
  });

  useEffect(() => {
    void (async () => {
      try {
        const address = await SecureStore.getItemAsync(KEY_ADDRESS);
        const session = await SecureStore.getItemAsync(KEY_SESSION);
        setState({ address, session, loading: false, error: null });
      } catch {
        setState(s => ({ ...s, loading: false }));
      }
    })();
  }, []);

  const setWallet = useCallback(async (address: string, session: string) => {
    await SecureStore.setItemAsync(KEY_ADDRESS, address);
    await SecureStore.setItemAsync(KEY_SESSION, session);
    setState(s => ({ ...s, address, session, error: null }));
  }, []);

  const clearWallet = useCallback(async () => {
    await SecureStore.deleteItemAsync(KEY_ADDRESS);
    await SecureStore.deleteItemAsync(KEY_SESSION);
    setState(s => ({ ...s, address: null, session: null }));
  }, []);

  return (
    <Ctx.Provider value={{ ...state, setWallet, clearWallet }}>
      {children}
    </Ctx.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useWallet must be inside WalletProvider');
  return ctx;
}
