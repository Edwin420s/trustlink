# 🚀 Quick Start

## Setup (5 minutes)

```bash
# 1. Install dependencies
npm install
cd frontend && npm install && cd ..

# 2. Compile contracts
npm run compile

# 3. Run tests (optional but recommended)
npm test

# 4. Create .env file
cp .env.example .env
# Edit .env and add your PRIVATE_KEY and LINEA_RPC_URL

# 5. Deploy contracts
npm run deploy
# ✅ Contract addresses auto-inject to frontend/.env

# 6. Start frontend
cd frontend
npm run dev
```

Visit: `http://localhost:3000`

---

## Key Features to Test

### 1. Basic Flow
- Create agreement with partner address
- Partner accepts agreement
- Record proof (upload file)
- Verify document

### 2. Enhanced Features
- **Bilateral Ack**: Check "Require acknowledgement" when recording
- **Salted Hash**: Check "Use salted hash" for privacy
- **Batch Verify**: Go to `/batch-verify` to verify multiple hashes
- **Public Registry**: Go to `/public-registry` to browse public proofs
- **Language**: Click Globe icon to switch to Swahili

### 3. Advanced Actions
- **Revoke Proof**: Click "Revoke" on proof details
- **Cancel Agreement**: Click "Cancel" on agreement card
- **Share via QR**: Click "Share as QR" on verification result
- **View Timeline**: See visual timeline on proof details page

---

## Contract Functions

### Core Functions
```javascript
// Create agreement
createAgreement(partnerAddress)

// Accept agreement
acceptAgreement(agreementId)

// Record proof (standard)
recordProof(agreementId, documentHash)

// Record proof requiring bilateral ack
recordProofWithAck(agreementId, documentHash)

// Partner acknowledges
acknowledgeProof(documentHash)

// Revoke proof
revokeProof(documentHash)

// Cancel agreement
cancelAgreement(agreementId)

// Verify proof
verifyProof(documentHash) → (exists, timestamp, agreementId, submitter)

// Get full proof details
getProof(documentHash) → Proof struct
```

### Utility Functions
```javascript
// Generate salted hash
generateSaltedHash(documentHash, agreementId)

// Check agreement status
isAgreementActive(agreementId)

// Get agreement details
getAgreement(agreementId)
```

---

## Deployment to Testnet

```bash
# Configure .env
LINEA_RPC_URL=https://rpc.linea.build
PRIVATE_KEY=your_private_key
LINEASCAN_API_KEY=your_api_key

# Deploy
npm run deploy

# Verify on explorer (optional)
npx hardhat verify --network lineaTestnet DEPLOYED_ADDRESS
```

---

## Troubleshooting

### Tests fail?
```bash
npm run clean
npm run compile
npm test
```

### Frontend won't start?
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Contract addresses not showing?
Manually create `frontend/.env`:
```env
VITE_TRUSTLINK_CORE_ADDRESS=0x...
VITE_TRUSTLINK_REGISTRY_ADDRESS=0x...
VITE_PROOF_VERIFIER_ADDRESS=0x...
```

---

## Next Steps

1. ✅ **Test locally** - Try all features
2. ✅ **Deploy to testnet** - Get testnet ETH from faucet
3. ✅ **Record demo** - Show all features working
4. ✅ **Prepare pitch** - Highlight UX improvements
5. ✅ **Submit** - DoraHacks platform

**You're ready for ETH Safari! 🦁**
