const express = require('express');
const router = express.Router();
const {
  getNetworks,
  getBlockchainInfo,
  getGasPrice,
  estimateGas,
  getTokenInfo,
  validateAddress,
  getBalance,
  sendTransaction,
} = require('../controllers/web3Controller');
const { protect } = require('../middleware/auth');
const {
  validateWalletAddress,
  validateNetwork,
  handleValidationErrors,
} = require('../middleware/validation');
const { body, query } = require('express-validator');

// @route   GET /api/web3/networks
// @desc    Get supported networks
// @access  Public
router.get('/networks', getNetworks);

// @route   GET /api/web3/blockchain-info
// @desc    Get blockchain information
// @access  Public
router.get('/blockchain-info', [
  query('network').isIn(['ethereum', 'polygon', 'bsc']).withMessage('Valid network required'),
  handleValidationErrors,
], getBlockchainInfo);

// @route   GET /api/web3/gas-price
// @desc    Get current gas price
// @access  Public
router.get('/gas-price', [
  query('network').isIn(['ethereum', 'polygon', 'bsc']).withMessage('Valid network required'),
  handleValidationErrors,
], getGasPrice);

// @route   POST /api/web3/estimate-gas
// @desc    Estimate gas for transaction
// @access  Private
router.post('/estimate-gas', protect, [
  validateNetwork(),
  validateWalletAddress('from'),
  validateWalletAddress('to'),
  body('value').optional().isNumeric().withMessage('Value must be numeric'),
  body('data').optional().isString().withMessage('Data must be string'),
  handleValidationErrors,
], estimateGas);

// @route   GET /api/web3/token-info
// @desc    Get token information
// @access  Public
router.get('/token-info', [
  query('network').isIn(['ethereum', 'polygon', 'bsc']).withMessage('Valid network required'),
  query('address').custom((value) => {
    const { isValidAddress } = require('../config/web3');
    if (!isValidAddress(value)) {
      throw new Error('Invalid token address');
    }
    return true;
  }),
  handleValidationErrors,
], getTokenInfo);

// @route   POST /api/web3/validate-address
// @desc    Validate wallet address
// @access  Public
router.post('/validate-address', [
  body('address').notEmpty().withMessage('Address is required'),
  handleValidationErrors,
], validateAddress);

// @route   GET /api/web3/balance
// @desc    Get wallet balance
// @access  Private
router.get('/balance', protect, [
  query('network').isIn(['ethereum', 'polygon', 'bsc']).withMessage('Valid network required'),
  query('address').custom((value) => {
    const { isValidAddress } = require('../config/web3');
    if (!isValidAddress(value)) {
      throw new Error('Invalid wallet address');
    }
    return true;
  }),
  handleValidationErrors,
], getBalance);

// @route   POST /api/web3/send-transaction
// @desc    Send transaction (for testing purposes)
// @access  Private
router.post('/send-transaction', protect, [
  validateNetwork(),
  validateWalletAddress('from'),
  validateWalletAddress('to'),
  body('value').isNumeric().withMessage('Value must be numeric'),
  body('privateKey').isString().withMessage('Private key required'),
  handleValidationErrors,
], sendTransaction);

module.exports = router; 