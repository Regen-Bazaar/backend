# Web3 Backend API

A robust Node.js Express backend for Web3 applications with MongoDB integration, supporting multiple blockchain networks (Ethereum, Polygon, BSC).

## Features

- 🔐 JWT Authentication & Wallet-based Authentication
- 🌐 Multi-network support (Ethereum, Polygon, BSC)
- 💾 MongoDB integration with Mongoose
- 🔒 Security middleware (Helmet, CORS, Rate limiting)
- ✅ Input validation with express-validator
- 📊 Transaction tracking and wallet management
- 🚀 RESTful API design
- 🧪 Test-ready structure

## Tech Stack

- **Runtime**: Node.js (>=18.0.0)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Blockchain**: Web3.js & Ethers.js
- **Authentication**: JWT & Wallet signatures
- **Validation**: express-validator
- **Security**: Helmet, CORS, bcryptjs

## Quick Start

### Prerequisites

- Node.js (>=18.0.0)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start MongoDB (if running locally):

```bash
mongod
```

5. Run the application:

```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3000` (or your configured PORT).

## Environment Variables

Copy `.env.example` to `.env` and configure:

- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `ETHEREUM_RPC_URL`: Ethereum RPC endpoint
- `POLYGON_RPC_URL`: Polygon RPC endpoint
- `BSC_RPC_URL`: BSC RPC endpoint

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/wallet-login` - Login with wallet signature
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Wallets

- `GET /api/wallets` - Get user wallets
- `POST /api/wallets` - Add wallet
- `GET /api/wallets/:address` - Get wallet details
- `GET /api/wallets/:address/balance` - Get wallet balance
- `GET /api/wallets/:address/transactions` - Get wallet transactions

### Transactions

- `GET /api/transactions` - Get transactions
- `POST /api/transactions` - Create transaction
- `GET /api/transactions/:txHash` - Get transaction details
- `GET /api/transactions/stats` - Get transaction statistics

### Web3

- `GET /api/web3/networks` - Get supported networks
- `GET /api/web3/gas-price` - Get current gas price
- `POST /api/web3/estimate-gas` - Estimate gas for transaction
- `GET /api/web3/balance` - Get wallet balance

### Users

- `GET /api/users` - Get users (admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user

### RWIP

- `POST /api/rwip/purchase` - Record a RWIP (NFT) purchase

  **Request Body:**

  ```json
  {
    "txHash": "0x...",
    "blockNumber": 123456,
    "blockHash": "0x...",
    "buyerAddress": "0x...",
    "sellerAddress": "0x...",
    "price": "1000000000000000000", // in wei
    "network": "ethereum",
    "nft": {
      "tokenId": "1",
      "name": "RWIP #1",
      "description": "Rare Web3 Investment Pass",
      "image": "https://...",
      "metadata": {
        /* ... */
      }
    },
    "gasUsed": "21000",
    "gasPrice": "1000000000",
    "timestamp": "2024-06-01T12:00:00Z",
    "tokenAddress": "0x...",
    "tokenSymbol": "RWIP",
    "tokenDecimals": 18,
    "logs": [],
    "metadata": { "category": "rwip" }
  }
  ```

  **Response:**

  ```json
  {
    "success": true,
    "transaction": {
      /* Transaction object with all details */
    }
  }
  ```

## Project Structure

```
src/
├── config/
│   ├── database.js      # MongoDB connection
│   └── web3.js          # Web3 configuration
├── middleware/
│   ├── auth.js          # Authentication middleware
│   ├── errorHandler.js  # Error handling
│   └── validation.js    # Input validation
├── models/
│   ├── User.js          # User model
│   ├── Wallet.js        # Wallet model
│   └── Transaction.js   # Transaction model
├── routes/
│   ├── index.js         # Main router
│   ├── auth.js          # Auth routes
│   ├── users.js         # User routes
│   ├── wallets.js       # Wallet routes
│   ├── transactions.js  # Transaction routes
│   └── web3.js          # Web3 routes
├── controllers/         # Route controllers (to be implemented)
└── server.js           # Main server file
```

## Development

### Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

### Adding Controllers

The route files are set up but controllers need to be implemented. Create controller files in `src/controllers/`:

- `authController.js`
- `userController.js`
- `walletController.js`
- `transactionController.js`
- `web3Controller.js`

## Security Features

- JWT token authentication
- Wallet signature verification
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation and sanitization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License
