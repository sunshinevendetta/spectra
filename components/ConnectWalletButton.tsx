'use client';

import { useConnect, useDisconnect, useAccount } from 'wagmi';
import { base } from 'wagmi/chains';

export default function ConnectWalletButton() {
  const { address, isConnected, chainId } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  const isOnBase = chainId === base.id;

  if (isConnected) {
    return (
      <div style={{ textAlign: 'center', margin: '2rem 0' }}>
        <p style={{ marginBottom: '0.8rem', fontSize: '1rem' }}>
          {address?.slice(0, 6)}...{address?.slice(-4)}
          {isOnBase ? <span style={{ color: '#00ff00', fontWeight: 'bold' }}> ✓ Base</span> : <span style={{ color: 'red' }}> ⚠️ Wrong network</span>}
        </p>
        <button onClick={() => disconnect()} style={buttonStyle}>
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center', margin: '2rem 0' }}>
      <p style={{ marginBottom: '1.5rem', color: '#666', fontSize: '1.1rem' }}>
        Connect with Base Smart Wallet or Coinbase Wallet
      </p>
      {connectors.map((connector) => (
        <button
          key={connector.id}
          onClick={() => connect({ connector })}
          disabled={isPending}
          style={{
            ...buttonStyle,
            margin: '0.6rem',
            background: connector.name.includes('Coinbase') ? '#0052FF' : '#000000',
            opacity: isPending ? 0.6 : 1,
          }}
        >
          {isPending ? 'Connecting...' : getButtonLabel(connector.name)}
        </button>
      ))}
    </div>
  );
}

function getButtonLabel(name: string) {
  if (name.includes('Coinbase')) return 'Coinbase / Base Smart Wallet';
  if (name.includes('WalletConnect')) return 'Other Wallet (QR Code)';
  return name;
}

const buttonStyle = {
  padding: '16px 32px',
  fontSize: '1.2rem',
  color: 'white',
  border: 'none',
  borderRadius: '16px',
  cursor: 'pointer',
  fontWeight: '600',
};
