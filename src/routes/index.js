const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth');
const userRoutes = require('./users');
const walletRoutes = require('./wallets');
const transactionRoutes = require('./transactions');
const web3Routes = require('./web3');

// API version and info
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Web3 Backend API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      wallets: '/api/wallets',
      transactions: '/api/transactions',
      web3: '/api/web3',
    },
    documentation: '/api/docs',
  });
});

// Route mounting
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/wallets', walletRoutes);
router.use('/transactions', transactionRoutes);
router.use('/web3', web3Routes);

module.exports = router; 