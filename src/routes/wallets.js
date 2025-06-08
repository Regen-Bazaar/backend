const express = require('express');
const router = express.Router();
const {
  getWallets,
  getWallet,
  addWallet,
  updateWallet,
  deleteWallet,
  getWalletBalance,
  updateWalletBalance,
  getWalletTransactions,
  getWalletTokens,
  getWalletNFTs,
} = require('../controllers/walletController');
const { protect } = require('../middleware/auth');
const {
  validateWalletAddress,
  validateNetwork,
  validatePagination,
  handleValidationErrors,
} = require('../middleware/validation');
const { body } = require('express-validator');

// All routes are protected
router.use(protect);

// @route   GET /api/wallets
// @desc    Get all user wallets
// @access  Private
router.get('/', validatePagination, getWallets);

// @route   POST /api/wallets
// @desc    Add new wallet
// @access  Private
router.post('/', [
  validateWalletAddress('address'),
  body('label').optional().isLength({ min: 1, max: 50 }).withMessage('Label must be 1-50 characters'),
  handleValidationErrors,
], addWallet);

// @route   GET /api/wallets/:address
// @desc    Get specific wallet
// @access  Private
router.get('/:address', getWallet);

// @route   PUT /api/wallets/:address
// @desc    Update wallet
// @access  Private
router.put('/:address', [
  body('label').optional().isLength({ min: 1, max: 50 }).withMessage('Label must be 1-50 characters'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('notes').optional().isLength({ max: 500 }).withMessage('Notes must be less than 500 characters'),
  handleValidationErrors,
], updateWallet);

// @route   DELETE /api/wallets/:address
// @desc    Delete wallet
// @access  Private
router.delete('/:address', deleteWallet);

// @route   GET /api/wallets/:address/balance
// @desc    Get wallet balance for all networks
// @access  Private
router.get('/:address/balance', getWalletBalance);

// @route   POST /api/wallets/:address/balance
// @desc    Update wallet balance for specific network
// @access  Private
router.post('/:address/balance', [
  validateNetwork(),
  handleValidationErrors,
], updateWalletBalance);

// @route   GET /api/wallets/:address/transactions
// @desc    Get wallet transactions
// @access  Private
router.get('/:address/transactions', validatePagination, getWalletTransactions);

// @route   GET /api/wallets/:address/tokens
// @desc    Get wallet tokens
// @access  Private
router.get('/:address/tokens', [
  validateNetwork(),
  handleValidationErrors,
], getWalletTokens);

// @route   GET /api/wallets/:address/nfts
// @desc    Get wallet NFTs
// @access  Private
router.get('/:address/nfts', [
  validateNetwork(),
  handleValidationErrors,
], getWalletNFTs);

module.exports = router; 