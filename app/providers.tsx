'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface WalletContextType {
  publicKey: string | null;
  connected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  signMessage: (message: Uint8Array) => Promise<Uint8Array | null>;
  signAndSendTransaction: (transaction: Uint8Array) => Promise<string | null>;
  getProvider: () => PhantomProvider | null;
}

interface PhantomProvider {
  isPhantom?: boolean;
  connect: () => Promise<{ publicKey: { toString: () => string; toBytes: () => Uint8Array } }>;
  disconnect: () => Promise<void>;
  signMessage: (message: Uint8Array, encoding: string) => Promise<{ signature: Uint8Array }>;
  signAndSendTransaction: (transaction: unknown) => Promise<{ signature: string }>;
  signTransaction: (transaction: unknown) => Promise<unknown>;
  publicKey?: { toString: () => string; toBytes: () => Uint8Array };
}

const WalletContext = createContext<WalletContextType>({
  publicKey: null, connected: false, connect: async () => {}, disconnect: () => {},
  signMessage: async () => null, signAndSendTransaction: async () => null, getProvider: () => null,
});

export const useWallet = () => useContext(WalletContext);

export default function Providers({ children }: { children: ReactNode }) {
  const [publicKey, setPublicKey] = useState<string | null>(null);

  const getProvider = useCallback((): PhantomProvider | null => {
    if (typeof window === 'undefined') return null;
    return (window as unknown as { solana?: PhantomProvider }).solana || null;
  }, []);

  const connect = useCallback(async () => {
    const phantom = getProvider();
    if (!phantom?.isPhantom) {
      window.open('https://phantom.app/', '_blank');
      return;
    }
    try {
      const resp = await phantom.connect();
      setPublicKey(resp.publicKey.toString());
    } catch (e) {
      console.error('connect failed:', e);
    }
  }, [getProvider]);

  const disconnect = useCallback(() => {
    getProvider()?.disconnect();
    setPublicKey(null);
  }, [getProvider]);

  const signMessage = useCallback(async (message: Uint8Array) => {
    const phantom = getProvider();
    if (!phantom) return null;
    try {
      const { signature } = await phantom.signMessage(message, 'utf8');
      return signature;
    } catch { return null; }
  }, [getProvider]);

  const signAndSendTransaction = useCallback(async (transaction: Uint8Array) => {
    const phantom = getProvider();
    if (!phantom) return null;
    try {
      const { signature } = await phantom.signAndSendTransaction(transaction);
      return signature;
    } catch { return null; }
  }, [getProvider]);

  return (
    <WalletContext.Provider value={{ publicKey, connected: !!publicKey, connect, disconnect, signMessage, signAndSendTransaction, getProvider }}>
      {children}
    </WalletContext.Provider>
  );
}
