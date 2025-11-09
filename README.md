# TrustLink - Decentralized Proof & Agreement Platform

**TrustLink** enables individuals and organizations to create mutual agreements and record verifiable document proofs onchain - privately and permanently.

## 🎯 Features

- **Mutual Agreements**: Create two-party agreements with cryptographic verification
- **Document Proofs**: Record SHA-256 hashes without exposing document content
- **Instant Verification**: Verify document authenticity in real-time
- **Zero Data Exposure**: Only hashes stored onchain - complete privacy
- **Public Registry**: Optional public visibility for transparency
- **Gas Optimized**: Efficient contract design for low-cost transactions

## 📁 Project Structure

```
trustlink/
├── contracts/
│   ├── TrustLinkCore.sol          # Main contract - agreements & proofs
│   ├── TrustLinkRegistry.sol      # Public/private proof visibility
│   ├── ProofVerifier.sol          # Lightweight verification interface
│   └── interfaces/
│       └── ITrustLinkCore.sol     # Core interface definition
├── scripts/
│   └── deploy.js                  # Deployment script
├── hardhat.config.js              # Hardhat configuration
├── package.json                   # Dependencies & scripts
└── .env.example                   # Environment variables template
```

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- npm or yarn
- MetaMask or compatible wallet

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Add your private key and RPC URLs to .env
```

### Compile Contracts

```bash
npm run compile
```

### Deploy to Linea Testnet

```bash
npm run deploy
```

### Deploy to Other Networks

```bash
# Linea Mainnet
npm run deploy:mainnet

# Polygon Amoy Testnet
npm run deploy:amoy
```

## 📋 Smart Contracts

### TrustLinkCore

Main contract handling:
- Agreement creation and acceptance
- Proof recording (document hash only)
- Proof verification
- Agreement management

**Key Functions:**
- `createAgreement(address partner)` - Create new agreement
- `acceptAgreement(uint256 agreementId)` - Accept pending agreement
- `recordProof(uint256 agreementId, bytes32 documentHash)` - Record proof
- `verifyProof(bytes32 documentHash)` - Verify proof existence

### TrustLinkRegistry

Optional registry for:
- Public/private proof visibility control
- Public verification interface
- User proof tracking

### ProofVerifier

Lightweight contract for:
- Simple verification interface
- Batch proof verification
- External application integration

## 🔧 Development

### Run Tests

```bash
npm test
```

### Generate Coverage Report

```bash
npm run test:coverage
```

### Verify Contracts on Block Explorer

```bash
npm run verify -- DEPLOYED_CONTRACT_ADDRESS --network lineaTestnet
```

### Clean Build Artifacts

```bash
npm run clean
```

## 🌐 Supported Networks

- **Linea Testnet** (Recommended for testing)
- **Linea Mainnet** (Production)
- **Polygon Amoy Testnet**
- Any EVM-compatible chain

## 🔐 Security

- Only document hashes stored onchain
- Custom error handling for gas efficiency
- Access control modifiers on all state-changing functions
- Solidity 0.8.20 with built-in overflow protection
- Optimized with 200 runs

## 📊 Gas Optimization

- Efficient storage patterns
- Custom errors instead of require strings
- View functions for read operations
- Batch operations support
- Optimizer enabled

## 🎓 Use Cases

- **Freelancer-Client Agreements**: Verifiable work delivery
- **Legal Documents**: Tamper-proof document timestamping
- **Academic Certificates**: Verifiable credential proofs
- **Supply Chain**: Product authenticity verification
- **Media & Journalism**: Content verification
- **Healthcare**: Medical record integrity

## 📝 License

MIT License - see LICENSE file for details

## 👨‍💻 Author

**Edwin Mwiti** - ETH Safari Hackathon 2025

## 🏆 Hackathon Submission

Built for **ETH Safari Hackathon 2025** - Aqua Protocol Bounty Track

**Track**: Building applications with cryptographic trust and verification
**Focus**: Improving UX for decentralized proof systems
**Innovation**: Universal proof platform for African digital economy

---

**Note**: This project uses only onchain data storage. No centralized servers or databases are required.
