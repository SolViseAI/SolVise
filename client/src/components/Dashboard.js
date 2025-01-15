import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { getWalletBalance, getTransactionHistory } from '../services/walletService';

function Dashboard() {
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (publicKey) {
      loadWalletData();
    } else {
      setLoading(false); // Not loading if no wallet is connected
      setBalance(0);
      setTransactions([]);
    }
  }, [publicKey]);

  const loadWalletData = async () => {
    try {
      setLoading(true);
      setError(null); // Reset error state before loading

      // Fetch balance and transactions in parallel
      const [walletBalance, txHistory] = await Promise.all([
        getWalletBalance(publicKey.toString()),
        getTransactionHistory(publicKey.toString())
      ]);

      setBalance(walletBalance);
      setTransactions(txHistory);
    } catch (error) {
      console.error('Error loading wallet data:', error);
      setError(error.message || 'Failed to load wallet data');
      setBalance(0);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  if (!publicKey) return <div>Please connect your wallet</div>;
  if (error) return <div className="error-message">Error: {error}</div>;
  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard">
      <h2>Wallet Dashboard</h2>
      <div className="balance-section">
        <h3>Balance</h3>
        <p>{balance.toFixed(4)} SOL</p>
      </div>
      
      <div className="transactions-section">
        <h3>Recent Transactions</h3>
        {transactions.length > 0 ? (
          <div className="transaction-list">
            {transactions.slice(0, 5).map((tx, index) => (
              <div key={tx.signature} className="transaction-item">
                <span>Transaction {index + 1}</span>
                <span>{new Date(tx.blockTime * 1000).toLocaleDateString()}</span>
                <a 
                  href={`https://explorer.solana.com/tx/${tx.signature}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  View
                </a>
              </div>
            ))}
          </div>
        ) : (
          <p>No recent transactions</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard; 