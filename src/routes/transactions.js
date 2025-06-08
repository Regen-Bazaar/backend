const express = require('express');
const router = express.Router();
const {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionStatus,
  getTransactionsByAddress,
  getTransactionStats,
} = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');
const {
  validateEthereumTxHash,
  validateWalletAddress,
  validateNetwork,
  validatePagination,
  handleValidationErrors,
} = require('../middleware/validation');
const { body, query } = require('express-validator');

// All routes are protected
router.use(protect);

// @route   GET /api/transactions
// @desc    Get user transactions with filtering and pagination
// @access  Private
router.get('/', [
  validatePagination,
  query('network').optional().isIn(['ethereum', 'polygon', 'bsc']).withMessage('Invalid network'),
  query('status').optional().isIn(['pending', 'confirmed', 'failed']).withMessage('Invalid status'),
  query('type').optional().isIn(['transfer', 'contract_interaction', 'token_transfer', 'nft_transfer']).withMessage('Invalid type'),
  query('from').optional().custom((value) => {
    const { isValidAddress } = require('../config/web3');
    if (!isValidAddress(value)) {
      throw new Error('Invalid from address');
    }
    return true;
  }),
  query('to').optional().custom((value) => {
    const { isValidAddress } = require('../config/web3');
    if (!isValidAddress(value)) {
      throw new Error('Invalid to address');
    }
    return true;
  }),
  handleValidationErrors,
], getTransactions);

// @route   POST /api/transactions
// @desc    Create/import new transaction
// @access  Private
router.post('/', [
  validateEthereumTxHash('txHash'),
  validateNetwork(),
  body('blockNumber').isInt({ min: 0 }).withMessage('Block number must be a positive integer'),
  body('from').custom((value) => {
    const { isValidAddress } = require('../config/web3');
    if (!isValidAddress(value)) {
      throw new Error('Invalid from address');
    }
    return true;
  }),
  body('to').custom((value) => {
    const { isValidAddress } = require('../config/web3');
    if (!isValidAddress(value)) {
      throw new Error('Invalid to address');
    }
    return true;
  }),
  body('value').isNumeric().withMessage('Value must be numeric'),
  body('gasUsed').isNumeric().withMessage('Gas used must be numeric'),
  body('gasPrice').isNumeric().withMessage('Gas price must be numeric'),
  body('timestamp').isISO8601().withMessage('Invalid timestamp'),
  body('type').optional().isIn(['transfer', 'contract_interaction', 'token_transfer', 'nft_transfer']).withMessage('Invalid transaction type'),
  handleValidationErrors,
], createTransaction);

// @route   GET /api/transactions/stats
// @desc    Get transaction statistics
// @access  Private
router.get('/stats', [
  query('network').optional().isIn(['ethereum', 'polygon', 'bsc']).withMessage('Invalid network'),
  query('period').optional().isIn(['24h', '7d', '30d', '90d', '1y']).withMessage('Invalid period'),
  handleValidationErrors,
], getTransactionStats);

// @route   GET /api/transactions/address/:address
// @desc    Get transactions for specific address
// @access  Private
router.get('/address/:address', [
  validatePagination,
  query('network').optional().isIn(['ethereum', 'polygon', 'bsc']).withMessage('Invalid network'),
  handleValidationErrors,
], getTransactionsByAddress);

// @route   GET /api/transactions/:txHash
// @desc    Get specific transaction
// @access  Private
router.get('/:txHash', getTransaction);

// @route   PUT /api/transactions/:txHash
// @desc    Update transaction metadata
// @access  Private
router.put('/:txHash', [
  body('metadata.description').optional().isLength({ max: 500 }).withMessage('Description too long'),
  body('metadata.tags').optional().isArray().withMessage('Tags must be an array'),
  body('metadata.category').optional().isLength({ max: 50 }).withMessage('Category too long'),
  handleValidationErrors,
], updateTransaction);

// @route   DELETE /api/transactions/:txHash
// @desc    Delete transaction
// @access  Private
router.delete('/:txHash', deleteTransaction);

// @route   GET /api/transactions/:txHash/status
// @desc    Get transaction status from blockchain
// @access  Private
router.get('/:txHash/status', [
  query('network').isIn(['ethereum', 'polygon', 'bsc']).withMessage('Network is required and must be valid'),
  handleValidationErrors,
], getTransactionStatus);

module.exports = router; 