import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

function WalletConnect() {
  const { wallet, connect, disconnect, connected } = useWallet();

  return (
    <div>
      {!connected ? (
        <button onClick={connect}>Connect Wallet</button>
      ) : (
        <button onClick={disconnect}>Disconnect</button>
      )}
    </div>
  );
}

export default WalletConnect; 