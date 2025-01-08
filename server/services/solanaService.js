const { Connection, PublicKey } = require('@solana/web3.js');

class SolanaService {
  constructor() {
    this.connection = new Connection(process.env.SOLANA_RPC_URL);
  }

  async getBalance(address) {
    try {
      const publicKey = new PublicKey(address);
      const balance = await this.connection.getBalance(publicKey);
      return balance / 1000000000; // Convert lamports to SOL
    } catch (error) {
      console.error('Error getting balance:', error);
      throw error;
    }
  }

  async getTransactions(address) {
    try {
      const publicKey = new PublicKey(address);
      const transactions = await this.connection.getConfirmedSignaturesForAddress2(publicKey);
      return transactions;
    } catch (error) {
      console.error('Error getting transactions:', error);
      throw error;
    }
  }
}

module.exports = new SolanaService(); 