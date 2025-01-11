import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { getWalletBalance } from '../services/walletService';

function Dashboard() {
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (publicKey) {
      loadWalletData();
    }
  }, [publicKey]);

  const loadWalletData = async () => {
    try {
      const walletBalance = await getWalletBalance(publicKey.toString());
      setBalance(walletBalance);
    } catch (error) {
      console.error('Error loading wallet data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="dashboard">
      <h2>Wallet Dashboard</h2>
      <div className="balance-section">
        <h3>Balance</h3>
        <p>{balance} SOL</p>
      </div>
    </div>
  );
}

export default Dashboard; 