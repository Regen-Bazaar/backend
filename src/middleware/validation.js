const { body, param, query, validationResult } = require('express-validator');
const { isValidAddress } = require('../config/web3');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
  }
  next();
};

// Common validation rules
const validateWalletAddress = (field = 'address') => {
  return body(field)
    .custom((value) => {
      if (!isValidAddress(value)) {
        throw new Error('Invalid wallet address');
      }
      return true;
    });
};

const validateEthereumTxHash = (field = 'txHash') => {
  return body(field)
    .matches(/^0x[a-fA-F0-9]{64}$/)
    .withMessage('Invalid transaction hash');
};

const validateNetwork = (field = 'network') => {
  return body(field)
    .isIn(['ethereum', 'polygon', 'bsc'])
    .withMessage('Invalid network. Must be ethereum, polygon, or bsc');
};

// User validation rules
const validateUserRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('walletAddress')
    .optional()
    .custom((value) => {
      if (value && !isValidAddress(value)) {
        throw new Error('Invalid wallet address');
      }
      return true;
    }),
  handleValidationErrors,
];

const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors,
];

// Transaction validation rules
const validateTransaction = [
  validateWalletAddress('from'),
  validateWalletAddress('to'),
  body('amount')
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('Amount must be a positive number'),
  validateNetwork(),
  handleValidationErrors,
];

// Wallet signature validation
const validateWalletSignature = [
  validateWalletAddress('address'),
  body('signature')
    .matches(/^0x[a-fA-F0-9]+$/)
    .withMessage('Invalid signature format'),
  body('message')
    .notEmpty()
    .withMessage('Message is required'),
  handleValidationErrors,
];

// Pagination validation
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  handleValidationErrors,
];

module.exports = {
  handleValidationErrors,
  validateWalletAddress,
  validateEthereumTxHash,
  validateNetwork,
  validateUserRegistration,
  validateUserLogin,
  validateTransaction,
  validateWalletSignature,
  validatePagination,
}; 