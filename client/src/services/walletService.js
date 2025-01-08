import { Connection } from '@solana/web3.js';

const connection = new Connection(process.env.REACT_APP_SOLANA_RPC_URL);

export const getWalletBalance = async (address) => {
  try {
    const balance = await connection.getBalance(address);
    return balance / 1000000000; // Convert lamports to SOL
  } catch (error) {
    console.error('Error fetching balance:', error);
    throw error;
  }
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