import { Connection } from '@solana/web3.js';

const connection = new Connection(process.env.REACT_APP_SOLANA_RPC_URL);

// Add retry logic for failed requests
const withRetry = async (fn, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * i));
    }
  }
};

export const getWalletBalance = async (address) => {
  return withRetry(async () => {
    const balance = await connection.getBalance(address);
    return balance / 1000000000;
  });
};

export const getTransactionHistory = async (address) => {
  try {
    const transactions = await connection.getConfirmedSignaturesForAddress2(address);
    return transactions;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
}; 