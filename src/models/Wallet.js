const mongoose = require('mongoose');

const WalletSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^0x[a-fA-F0-9]{40}$/, 'Invalid wallet address'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  label: {
    type: String,
    default: 'Main Wallet',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  balances: [{
    network: {
      type: String,
      enum: ['ethereum', 'polygon', 'bsc'],
      required: true,
    },
    nativeBalance: {
      type: String, // Store as string to handle large numbers
      default: '0',
    },
    tokens: [{
      address: {
        type: String,
        lowercase: true,
        match: [/^0x[a-fA-F0-9]{40}$/, 'Invalid token address'],
      },
      symbol: String,
      name: String,
      decimals: Number,
      balance: String,
      price: Number, // USD price
      lastUpdated: {
        type: Date,
        default: Date.now,
      },
    }],
    nfts: [{
      contractAddress: {
        type: String,
        lowercase: true,
        match: [/^0x[a-fA-F0-9]{40}$/, 'Invalid contract address'],
      },
      tokenId: String,
      name: String,
      description: String,
      image: String,
      metadata: mongoose.Schema.Types.Mixed,
      lastUpdated: {
        type: Date,
        default: Date.now,
      },
    }],
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  }],
  transactionCount: {
    type: Number,
    default: 0,
  },
  firstTransactionDate: Date,
  lastTransactionDate: Date,
  tags: [String],
  notes: String,
}, {
  timestamps: true,
});

// Indexes
WalletSchema.index({ address: 1 });
WalletSchema.index({ user: 1 });
WalletSchema.index({ 'balances.network': 1 });

// Virtual for total USD value
WalletSchema.virtual('totalUSDValue').get(function() {
  let total = 0;
  this.balances.forEach(balance => {
    balance.tokens.forEach(token => {
      if (token.price && token.balance) {
        const tokenBalance = parseFloat(token.balance) / Math.pow(10, token.decimals || 18);
        total += tokenBalance * token.price;
      }
    });
  });
  return total;
});

// Method to get balance for specific network
WalletSchema.methods.getNetworkBalance = function(network) {
  return this.balances.find(balance => balance.network === network);
};

// Method to update balance for specific network
WalletSchema.methods.updateNetworkBalance = function(network, balanceData) {
  const existingBalance = this.balances.find(balance => balance.network === network);
  
  if (existingBalance) {
    Object.assign(existingBalance, balanceData);
    existingBalance.lastUpdated = new Date();
  } else {
    this.balances.push({
      network,
      ...balanceData,
      lastUpdated: new Date(),
    });
  }
  
  return this.save();
};

// Method to add or update token balance
WalletSchema.methods.updateTokenBalance = function(network, tokenData) {
  let networkBalance = this.balances.find(balance => balance.network === network);
  
  if (!networkBalance) {
    networkBalance = {
      network,
      nativeBalance: '0',
      tokens: [],
      nfts: [],
      lastUpdated: new Date(),
    };
    this.balances.push(networkBalance);
  }
  
  const existingToken = networkBalance.tokens.find(token => 
    token.address.toLowerCase() === tokenData.address.toLowerCase()
  );
  
  if (existingToken) {
    Object.assign(existingToken, tokenData);
    existingToken.lastUpdated = new Date();
  } else {
    networkBalance.tokens.push({
      ...tokenData,
      lastUpdated: new Date(),
    });
  }
  
  networkBalance.lastUpdated = new Date();
  return this.save();
};

module.exports = mongoose.model('Wallet', WalletSchema); 