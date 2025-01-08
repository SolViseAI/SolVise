const router = require('express').Router();
const solanaService = require('../services/solanaService');
const Transaction = require('../models/Transaction');

// Get wallet balance
router.get('/wallet/:address/balance', async (req, res) => {
  try {
    const balance = await solanaService.getBalance(req.params.address);
    res.json({ balance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get wallet transactions
router.get('/wallet/:address/transactions', async (req, res) => {
  try {
    const transactions = await solanaService.getTransactions(req.params.address);
    res.json({ transactions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 