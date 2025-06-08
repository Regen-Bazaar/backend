const { Web3 } = require('web3');
const { ethers } = require('ethers');

// Network configurations
const networks = {
  ethereum: {
    name: 'Ethereum Mainnet',
    chainId: 1,
    rpcUrl: process.env.ETHEREUM_RPC_URL,
    currency: 'ETH',
  },
  polygon: {
    name: 'Polygon Mainnet',
    chainId: 137,
    rpcUrl: process.env.POLYGON_RPC_URL,
    currency: 'MATIC',
  },
  bsc: {
    name: 'BSC Mainnet',
    chainId: 56,
    rpcUrl: process.env.BSC_RPC_URL,
    currency: 'BNB',
  },
};

// Web3 instances
const web3Instances = {};
const ethersProviders = {};

// Initialize Web3 instances for each network
Object.keys(networks).forEach((networkKey) => {
  const network = networks[networkKey];
  if (network.rpcUrl) {
    try {
      // Web3.js instance
      web3Instances[networkKey] = new Web3(network.rpcUrl);
      
      // Ethers.js provider
      ethersProviders[networkKey] = new ethers.JsonRpcProvider(network.rpcUrl);
      
      console.log(`🌐 ${network.name} Web3 instance initialized`);
    } catch (error) {
      console.error(`❌ Failed to initialize ${network.name}:`, error.message);
    }
  }
});

// Utility functions
const getWeb3Instance = (network = 'ethereum') => {
  const instance = web3Instances[network];
  if (!instance) {
    throw new Error(`Web3 instance for ${network} not available`);
  }
  return instance;
};

const getEthersProvider = (network = 'ethereum') => {
  const provider = ethersProviders[network];
  if (!provider) {
    throw new Error(`Ethers provider for ${network} not available`);
  }
  return provider;
};

const getNetworkInfo = (network) => {
  return networks[network] || null;
};

const isValidAddress = (address) => {
  try {
    return ethers.isAddress(address);
  } catch (error) {
    return false;
  }
};

const formatEther = (wei) => {
  return ethers.formatEther(wei);
};

const parseEther = (ether) => {
  return ethers.parseEther(ether);
};

module.exports = {
  networks,
  web3Instances,
  ethersProviders,
  getWeb3Instance,
  getEthersProvider,
  getNetworkInfo,
  isValidAddress,
  formatEther,
  parseEther,
}; 