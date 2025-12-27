"use client";

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useEffect, useState } from 'react';

export default function ConnectWalletButton() {
  const { isConnected, address } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const [mounted, setMounted] = useState(false);

  // Prevent SSR/client mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Show nothing until mounted (prevents hydration error)
  if (!mounted) {
    return (
      <div className="flex flex-col items-center gap-6">
        <div className="h-12 w-64 bg-white/10 rounded-2xl animate-pulse" />
        <div className="h-12 w-64 bg-white/10 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (isConnected) {
    return (
      <div className="text-center space-y-4">
        <p className="text-white/80">
          Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
        </p>
        <button
          onClick={() => disconnect()}
          className="px-8 py-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-bold transition-all"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {connectors.map((connector) => (
        <button
          key={connector.id}
          onClick={() => connect({ connector })}
          disabled={isPending}
          className={`
            px-8 py-5 text-xl font-bold rounded-2xl transition-all
            ${connector.id === 'coinbaseWallet' || connector.id === 'coinbaseSmartWallet'
              ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-2xl shadow-blue-600/30'
              : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
            }
            ${isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          {isPending && connector.id === connectors.find(c => c.id === connector.id)?.id
            ? 'Connecting...'
            : connector.id === 'coinbaseWallet' || connector.id === 'coinbaseSmartWallet'
              ? 'Coinbase / Base Smart Wallet'
              : 'Other Wallet (QR Code)'
          }
        </button>
      ))}
    </div>
  );
}