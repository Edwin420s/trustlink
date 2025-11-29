# 🛡️ TrustLink

**A Better Way to Confirm What's Real**

TrustLink is a fully decentralized proof and agreement platform that enables individuals and organizations to create mutual agreements and record verifiable document proofs on-chain — privately, permanently, and transparently.

Built for **ETH Safari Hackathon 2025** | **Aqua Protocol Bounty Track**

• Live Demo: [TrustLink – Confirm What’s Real](https://trustlink-fawn.vercel.app/)

---
 
## 📋 Table of Contents

- [Overview](#-overview)
- [Problem Statement](#-problem-statement)
- [Solution](#-solution)
- [Key Features](#-key-features)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Technology Stack](#-technology-stack)
- [Installation & Setup](#-installation--setup)
- [Smart Contract Documentation](#-smart-contract-documentation)
- [Frontend Application](#-frontend-application)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Security Considerations](#-security-considerations)
- [Use Cases](#-use-cases)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🌍 Overview

TrustLink addresses the fundamental challenge of digital trust: **how can we verify the authenticity of digital documents without compromising privacy?**

In today's digital world, documents can be easily altered, timestamps can be faked, and trust relationships lack neutral verification systems. TrustLink solves this by:

- Creating **cryptographic proofs** of document authenticity
- Establishing **mutual agreements** between parties
- Storing **only document hashes** on-chain (never the actual data)
- Providing **instant verification** for anyone, anywhere

---

## 🎯 Problem Statement

### The Trust Gap in Digital Africa

- **Forged Documents**: Academic certificates, business contracts, and legal documents are frequently forged
- **Altered Records**: Digital files can be modified without trace, causing disputes
- **No Neutral Proof**: Email timestamps and centralized systems can be manipulated
- **Privacy vs Transparency**: Existing solutions either expose data or provide no verification
- **Accessibility**: Complex blockchain solutions exclude non-technical users

### Real-World Impact

- Businesses lose money due to invoice disputes
- Universities struggle to verify credentials
- Journalists face accusations of content manipulation
- Freelancers can't prove work delivery dates
- NGOs need tamper-proof audit trails

---

## 💡 Solution

TrustLink provides a **privacy-first, blockchain-based verification system** that:

1. **Mutual Agreement Layer**: Two or more parties agree to use the platform
2. **Local Hashing**: Documents are hashed on the user's device (never uploaded)
3. **On-Chain Proof**: Only the SHA-256 hash is recorded on-chain with timestamp
4. **Universal Verification**: Anyone can verify authenticity without accessing content
5. **Optional Transparency**: Proofs can be made publicly visible for institutions

### How It Works

```
User Device → Hash Document Locally → Record Hash On-Chain → Permanent Proof
```

- **No data leaves your device**
- **No centralized storage**
- **No trust required in third parties**

---

## 🆕 What’s Included

- Core smart contracts for agreements and proofs
- Privacy-first frontend (local hashing, no uploads)
- Real on-chain interactions (create, accept, record, verify)
- Multi-wallet support (MetaMask, Core, OKX, etc.)

---

## ✨ Key Features

### Core Features

- ✅ **Mutual Agreements**: Create two-party agreements with cryptographic verification
- ✅ **Document Proofs**: Record SHA-256 hashes without exposing document content
- ✅ **Instant Verification**: Verify document authenticity in real-time
- ✅ **Zero Data Exposure**: Only hashes stored on-chain - complete privacy
- ✅ **Public Registry**: Optional public visibility for transparency use cases
- ✅ **Gas Optimized**: Efficient contract design for low-cost transactions

### Technical Features

- **EVM Compatible**: Deploy on any EVM-compatible blockchain
- **Event-Driven**: Real-time updates via smart contract events
- **Batch Operations**: Verify multiple documents at once
- **Modular Design**: Separate contracts for core logic, registry, and verification
- **Custom Errors**: Gas-efficient error handling
- **Access Control**: Role-based permissions for agreement participants

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
│  • Landing Page   • Dashboard   • Agreements            │
│  • Record Proof   • Verify      • Settings              │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Wallet Integration (ethers.js)              │
│  • MetaMask Connection  • Transaction Signing           │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│               Smart Contracts (Solidity)                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │TrustLinkCore │  │   Registry   │  │  Verifier    │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│           Blockchain Network (EVM - Linea)               │
│  • Linea Testnet   • Linea Mainnet   • Polygon Amoy    │
└─────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
trustlink/
├── contracts/                      # Smart contracts
│   ├── TrustLinkCore.sol          # Main contract - agreements & proofs
│   ├── TrustLinkRegistry.sol      # Public/private proof visibility
│   ├── ProofVerifier.sol          # Lightweight verification interface
│   └── interfaces/
│       └── ITrustLinkCore.sol     # Core interface definition
│
├── frontend/                       # React application
│   ├── public/
│   │   └── shield.svg             # Logo asset
│   ├── src/
│   │   ├── components/            # Reusable UI components
│   │   │   ├── Navigation.jsx
│   │   │   ├── FileUploader.jsx
│   │   │   ├── AgreementCard.jsx
│   │   │   ├── VerificationResult.jsx    # ⭐ NEW: Enhanced verification display
│   │   │   ├── ProofTimeline.jsx         # ⭐ NEW: Visual timeline
│   │   │   ├── QRShareButton.jsx         # ⭐ NEW: QR code generation
│   │   │   ├── LanguageSwitcher.jsx      # ⭐ NEW: EN/SW toggle
│   │   │   ├── Modal.jsx
│   │   │   ├── StatusIndicator.jsx
│   │   │   └── Toast.jsx
│   │   ├── contexts/              # React context providers
│   │   │   ├── WalletContext.jsx
│   │   │   └── AppContext.jsx
│   │   ├── hooks/                 # Custom React hooks
│   │   │   ├── useContracts.js
│   │   │   └── useLocalStorage.js
│   │   ├── pages/                 # Application pages
│   │   │   ├── Landing.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Agreements.jsx
│   │   │   ├── RecordProof.jsx
│   │   │   ├── Verify.jsx
│   │   │   ├── BatchVerify.jsx           # ⭐ NEW: Batch verification
│   │   │   ├── PublicRegistry.jsx        # ⭐ NEW: Public proof explorer
│   │   │   ├── About.jsx
│   │   │   └── Settings.jsx
│   │   ├── utils/                 # Utility functions
│   │   │   ├── constants.js
│   │   │   ├── contract.js               # Updated with new functions
│   │   │   ├── formatDate.js
│   │   │   ├── hashFile.js               # Enhanced with salting & validation
│   │   │   ├── localization.js           # ⭐ NEW: EN/SW translations
│   │   │   ├── network.js
│   │   │   └── validation.js
│   │   ├── styles/                # Global styles
│   │   │   ├── theme.css
│   │   │   └── layout.css
│   │   ├── App.jsx                # Main app component
│   │   └── main.jsx               # Entry point
│   ├── .env.example               # Environment variables template
│   ├── index.html                 # HTML template
│   ├── package.json               # Frontend dependencies
│   ├── vite.config.js             # Vite configuration
│   └── tailwind.config.js         # Tailwind CSS config
│
├── scripts/                        # Deployment scripts
│   └── deploy.js                  # Contract deployment script
│
├── test/                           # Smart contract tests
│   ├── TrustLinkCore.test.js      # Core contract test suite
│   ├── TrustLinkCore.advanced.test.js  # ⭐ NEW: Advanced features tests
│   └── TrustLinkRegistry.test.js       # ⭐ NEW: Registry tests
│
├── .github/workflows/              # CI/CD
│   └── test.yml                   # ⭐ NEW: Automated testing pipeline
│
├── .env.example                    # Environment variables template
├── .gitignore                      # Git ignore rules
├── hardhat.config.js               # Hardhat configuration
├── package.json                    # Project dependencies
├── LICENSE                         # MIT License
└── README.md                       # This file
```

---

## 🔧 Technology Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **Ethers.js 6** - Ethereum interaction
- **React Router** - Client-side routing
- **Lucide React** - Icon library
- **React Toastify** - Notifications

### Blockchain
- **Solidity 0.8.20** - Smart contract language
- **Hardhat** - Development environment
- **EVM** - Execution environment
- **Linea** - Primary deployment network

### Testing & Deployment
- **Chai** - Assertion library
- **Hardhat Network** - Local testing
- **Hardhat Verify** - Contract verification
- **Vercel** - Frontend hosting

---

## 🚀 Installation & Setup

> **⚡ Quick Start**: See [QUICKSTART.md](./QUICKSTART.md) for 5-minute setup guide

### Prerequisites

- **Node.js** 16.x or higher
- **npm** or **yarn**
- **MetaMask** or compatible Web3 wallet
- **Git**

### Step 1: Clone the Repository

```bash
git clone https://github.com/Edwin420s/trustlink.git
cd trustlink
```

### Step 2: Install Dependencies

```bash
# Install root dependencies (for smart contracts)
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### Step 3: Configure Environment Variables

#### Root `.env` (for smart contracts)

```bash
cp .env.example .env
```

Edit `.env` and add:

```env
LINEA_RPC_URL=https://rpc.linea.build
PRIVATE_KEY=your_wallet_private_key_here
LINEASCAN_API_KEY=your_lineascan_api_key_here
```

#### Frontend `.env` (for React app)

```bash
cd frontend
cp .env.example .env
```

Edit `frontend/.env` and add:

```env
VITE_TRUSTLINK_CORE_ADDRESS=0x...  # Add after deployment
VITE_TRUSTLINK_REGISTRY_ADDRESS=0x...
VITE_PROOF_VERIFIER_ADDRESS=0x...
```

### Step 4: Compile Smart Contracts

```bash
npm run compile
```

### Step 5: Run Tests

```bash
npm test
```

### Step 6: Deploy Contracts

```bash
# Deploy to Linea Testnet
npm run deploy

# Or deploy to other networks
npm run deploy:amoy     # Polygon Amoy Testnet
npm run deploy:mainnet  # Linea Mainnet
```

**Copy the deployed contract addresses and update `frontend/.env`**

### Step 7: Start Frontend

```bash
cd frontend
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 📜 Smart Contract Documentation

### TrustLinkCore

**Primary contract handling agreements and proof recording.**

#### Key Functions

##### `createAgreement(address partner) → uint256`
Creates a new agreement between the caller and partner.

**Parameters:**
- `partner` - Address of the other party

**Returns:**
- Agreement ID

**Events:**
- `AgreementCreated(uint256 id, address initiator, address partner)`

---

##### `acceptAgreement(uint256 agreementId)`
Accepts a pending agreement (only callable by partner).

**Parameters:**
- `agreementId` - ID of agreement to accept

**Events:**
- `AgreementAccepted(uint256 id, address partner)`

---

##### `recordProof(uint256 agreementId, bytes32 documentHash)`
Records a document proof under an active agreement.

**Parameters:**
- `agreementId` - Active agreement ID
- `documentHash` - SHA-256 hash of document

**Events:**
- `ProofRecorded(uint256 agreementId, bytes32 documentHash, address submittedBy)`

---

##### `verifyProof(bytes32 documentHash) → (bool, uint256, uint256, address)`
Verifies if a document proof exists.

**Parameters:**
- `documentHash` - Document hash to verify

**Returns:**
- `exists` - Whether proof exists
- `timestamp` - When proof was recorded
- `agreementId` - Associated agreement
- `submittedBy` - Who recorded the proof

---

### TrustLinkRegistry

**Optional contract for public/private proof visibility control.**

#### Key Functions

##### `setProofVisibility(bytes32 documentHash, bool isPublic)`
Sets proof visibility (public or private).

**Events:**
- `ProofVisibilitySet(bytes32 documentHash, bool isPublic, address setBy)`

---

### ProofVerifier

**Lightweight verification interface for external integrations.**

#### Key Functions

##### `verify(bytes32 documentHash) → (bool, uint256, address)`
Simple proof verification with event emission.

##### `batchVerify(bytes32[] documentHashes) → bool[]`
Verify multiple proofs at once.

---

## 🎨 Frontend Application

### Pages

#### **Landing Page** (`/`)
- Hero section with value proposition
- Feature highlights
- Use case examples
- Call-to-action buttons

#### **Dashboard** (`/app`)
- Account overview
- Quick stats (agreements, proofs)
- Quick action buttons
- Recent activity feed

#### **Agreements** (`/agreements`)
- List all agreements
- Create new agreements
- Accept pending invitations
- Search and filter

#### **Record Proof** (`/record-proof`)
- Select active agreement
- Upload document for hashing
- Record proof on-chain
- Success confirmation

#### **Verify** (`/verify`)
- Upload document or enter hash
- Verify authenticity
- Display verification results
- Historical proof data

#### **Settings** (`/settings`)
- Wallet information
- Network details
- User preferences

#### **About** (`/about`)
- Project mission
- Technology stack
- Team information
- Hackathon details

---

## 🧪 Testing

### Run Smart Contract Tests

```bash
npm test
```

### Run with Coverage

```bash
npm run test:coverage
```

### Test Structure

```javascript
describe("TrustLinkCore", function () {
  it("Should create a new agreement")
  it("Should accept agreement by partner")
  it("Should record proof under active agreement")
  it("Should verify existing proof")
  it("Should reject unauthorized actions")
})
```

### Test Results

All tests pass with 100% coverage on core functions:
- ✅ Agreement creation
- ✅ Agreement acceptance
- ✅ Proof recording
- ✅ Proof verification
- ✅ Access control
- ✅ Error handling

---

## 🌐 Deployment

### Deploy to Linea Testnet

```bash
npm run deploy
```

### Deploy to Polygon Amoy

```bash
npm run deploy:amoy
```

### Deploy to Linea Mainnet

```bash
npm run deploy:mainnet
```

### Verify Contracts on Block Explorer

```bash
npx hardhat verify --network lineaTestnet DEPLOYED_ADDRESS
```

### Frontend Deployment (Vercel)

```bash
cd frontend
npm run build
vercel --prod
```

---

## 📦 Deployed Contracts (Linea Sepolia)

- **Network**: Linea Sepolia (chainId 59141)
- **Explorer**: https://sepolia.lineascan.build

- **TrustLinkCore**: `0x3b56d2910b9f29F16AB5b1878e588a76b3dC4E21`  
  Explorer: https://sepolia.lineascan.build/address/0x3b56d2910b9f29F16AB5b1878e588a76b3dC4E21
- **TrustLinkRegistry**: `0x3d59d1eAcE73de3b30F523F91C9EE1B08DA999C5`  
  Explorer: https://sepolia.lineascan.build/address/0x3d59d1eAcE73de3b30F523F91C9EE1B08DA999C5
- **ProofVerifier**: `0xc60548f8cdC5B87f6c9b39eda53067e4f173e9D6`  
  Explorer: https://sepolia.lineascan.build/address/0xc60548f8cdC5B87f6c9b39eda53067e4f173e9D6

---

## 🔐 Security Considerations

### Data Privacy
- ✅ **No documents stored**: Only SHA-256 hashes on-chain
- ✅ **Local hashing**: All hashing done client-side
- ✅ **Zero knowledge**: Proof verification without data exposure

### Smart Contract Security
- ✅ **Access control**: Modifiers enforce participant permissions
- ✅ **Custom errors**: Gas-efficient error handling
- ✅ **Reentrancy protection**: No external calls before state changes
- ✅ **Overflow protection**: Solidity 0.8.20 built-in safety
- ✅ **Immutable proofs**: Once recorded, proofs cannot be altered

### Best Practices
- ✅ **Compiler optimization**: 200 runs for balanced gas costs
- ✅ **Event emission**: All state changes emit events
- ✅ **Comprehensive testing**: Full test coverage
- ✅ **Code documentation**: Detailed NatSpec comments

---

## 🎓 Use Cases

### Business & Legal
- **Contracts & NDAs**: Timestamp agreements and prevent disputes
- **Invoice Verification**: Prove delivery dates and payment terms
- **Partnership Agreements**: Mutual consent with cryptographic proof

### Education
- **Certificate Verification**: Universities verify graduate credentials
- **Transcript Authentication**: Employers verify academic records
- **Research Timestamping**: Prove original research dates

### Media & Journalism
- **Press Releases**: Verify official statements
- **Photo Authentication**: Prove when images were captured
- **Source Protection**: Verify document integrity without revealing sources

### Healthcare
- **Medical Records**: Immutable patient record integrity
- **Prescription Verification**: Prevent medication fraud
- **Lab Results**: Tamper-proof test results

### Supply Chain
- **Product Authenticity**: Verify genuine products
- **Certificate of Origin**: Prove source and manufacturing date
- **Quality Reports**: Immutable compliance records

---

## 🗺️ Roadmap

### Phase 1: MVP (Current)
- ✅ Core smart contracts
- ✅ Frontend application
- ✅ Wallet integration
- ✅ Basic verification

### Phase 2: Enhanced Features (Q2 2025)
- ⏳ Multi-party agreements (>2 participants)
- ⏳ Mobile PWA
- ⏳ Batch operations UI
- ⏳ Organization dashboards

### Phase 3: Ecosystem Growth (Q3 2025)
- ⏳ API for third-party integration
- ⏳ Browser extension
- ⏳ AI-powered document insights
- ⏳ Multi-chain deployment

### Phase 4: Enterprise (Q4 2025)
- ⏳ Enterprise SaaS offering
- ⏳ Branded verification badges
- ⏳ Advanced analytics
- ⏳ Compliance reporting

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Report Bugs
Open an issue with:
- Description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)

### Suggest Features
Open an issue with:
- Feature description
- Use case explanation
- Why it would be valuable

### Submit Pull Requests
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Contact

**Edwin Mwiti**  
Project Lead & Developer

- **Email**: eduedwyn5@gmail.com
- **GitHub**: [@Edwin420s](https://github.com/Edwin420s)
- **Project**: [TrustLink](https://github.com/Edwin420s/trustlink)

---

## 🏆 Hackathon Submission

### ETH Safari Hackathon 2025

**Event**: ETH Safari Hackathon 2025 (Virtual)  
**Prize Pool**: $4,000  
**Tracks**:  
- Aqua Protocol Bounty — Improve the UI/UX of the Aqua Protocol website (Design Bounty)  
- ETH Safari Evolution Challenge — Bold ideas to improve the hackathon experience (Winner gets a sponsored trip to DevCon 2025 in Argentina)  
**Network**: EVM-Compatible (Linea Testnet)

#### Highlights
- Privacy-first design with zero data exposure
- Clean, accessible UX for non-technical users
- Fully decentralized architecture
- Real-world impact focus for African ecosystem

#### Demo Links
- **Live App**: https://trustlink-fawn.vercel.app/ — TrustLink: Confirm What’s Real


---

## 🙏 Acknowledgments

- **ETH Safari Team** - For organizing an amazing hackathon
- **Aqua Protocol** - For inspiring cryptographic trust solutions
- **Linea** - For providing fast, low-cost EVM infrastructure
- **Open Source Community** - For the incredible tools and libraries

---

<div align="center">

**Built with ❤️ for a more trustworthy digital future**

[⬆ Back to Top](#️-trustlink)

</div>
