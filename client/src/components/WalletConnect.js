import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

function WalletConnect() {
  const { wallet, connect, disconnect, connected } = useWallet();

  return (
    <div className="wallet-connect">
      {!connected ? (
        <button 
          onClick={connect}
          className="connect-button"
        >
          Connect Wallet
        </button>
      ) : (
        <div className="wallet-info">
          <span>{wallet?.adapter?.publicKey?.toString().slice(0,4)}...
                {wallet?.adapter?.publicKey?.toString().slice(-4)}</span>
          <button onClick={disconnect}>Disconnect</button>
        </div>
      )}
    </div>
  );
}

export default WalletConnect; 