const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  txHash: {
    type: String,
    required: true,
    unique: true,
    match: [/^0x[a-fA-F0-9]{64}$/, 'Invalid transaction hash'],
  },
  blockNumber: {
    type: Number,
    required: true,
  },
  blockHash: {
    type: String,
    required: true,
  },
  from: {
    type: String,
    required: true,
    lowercase: true,
    match: [/^0x[a-fA-F0-9]{40}$/, 'Invalid from address'],
  },
  to: {
    type: String,
    required: true,
    lowercase: true,
    match: [/^0x[a-fA-F0-9]{40}$/, 'Invalid to address'],
  },
  value: {
    type: String, // Store as string to handle large numbers
    required: true,
  },
  gasUsed: {
    type: String,
    required: true,
  },
  gasPrice: {
    type: String,
    required: true,
  },
  network: {
    type: String,
    required: true,
    enum: ['ethereum', 'polygon', 'bsc'],
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'failed'],
    default: 'pending',
  },
  type: {
    type: String,
    enum: ['transfer', 'contract_interaction', 'token_transfer', 'nft_transfer'],
    default: 'transfer',
  },
  tokenAddress: {
    type: String,
    lowercase: true,
    match: [/^0x[a-fA-F0-9]{40}$/, 'Invalid token address'],
  },
  tokenSymbol: String,
  tokenDecimals: Number,
  nonce: Number,
  input: String, // Transaction input data
  logs: [{
    address: String,
    topics: [String],
    data: String,
  }],
  metadata: {
    description: String,
    tags: [String],
    category: String,
  },
  nft: {
    tokenId: String,
    name: String,
    description: String,
    image: String,
    metadata: mongoose.Schema.Types.Mixed,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  confirmations: {
    type: Number,
    default: 0,
  },
  timestamp: {
    type: Date,
    required: true,
  },
}, {
  timestamps: true,
});

// Indexes for better query performance
TransactionSchema.index({ txHash: 1 });
TransactionSchema.index({ from: 1, timestamp: -1 });
TransactionSchema.index({ to: 1, timestamp: -1 });
TransactionSchema.index({ network: 1, status: 1 });
TransactionSchema.index({ user: 1, timestamp: -1 });

// Virtual for formatted value
TransactionSchema.virtual('formattedValue').get(function() {
  const { formatEther } = require('../config/web3');
  return formatEther(this.value);
});

// Method to check if transaction is confirmed
TransactionSchema.methods.isConfirmed = function() {
  return this.status === 'confirmed' && this.confirmations >= 12;
};

module.exports = mongoose.model('Transaction', TransactionSchema); 