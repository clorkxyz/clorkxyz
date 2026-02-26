'use client';

// Lightweight wallet context — connects to Phantom/Solflare directly
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface WalletContextType {
  publicKey: string | null;
  connected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  signMessage: (message: Uint8Array) => Promise<Uint8Array | null>;
}

const WalletContext = createContext<WalletContextType>({
  publicKey: null, connected: false, connect: async () => {}, disconnect: () => {}, signMessage: async () => null,
});

export const useWallet = () => useContext(WalletContext);

declare global {
  interface Window {
    solana?: {
      isPhantom?: boolean;
      connect: () => Promise<{ publicKey: { toString: () => string } }>;
      disconnect: () => Promise<void>;
      signMessage: (message: Uint8Array, encoding: string) => Promise<{ signature: Uint8Array }>;
      publicKey?: { toString: () => string };
    };
  }
}

export default function Providers({ children }: { children: ReactNode }) {
  const [publicKey, setPublicKey] = useState<string | null>(null);

  const connect = useCallback(async () => {
    if (typeof window === 'undefined') return;
    const phantom = window.solana;
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
  }, []);

  const disconnect = useCallback(() => {
    window.solana?.disconnect();
    setPublicKey(null);
  }, []);

  const signMessage = useCallback(async (message: Uint8Array) => {
    if (!window.solana) return null;
    try {
      const { signature } = await window.solana.signMessage(message, 'utf8');
      return signature;
    } catch { return null; }
  }, []);

  return (
    <WalletContext.Provider value={{ publicKey, connected: !!publicKey, connect, disconnect, signMessage }}>
      {children}
    </WalletContext.Provider>
  );
}
