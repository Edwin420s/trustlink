import { ethers } from 'ethers'

const TRUSTLINK_CORE_ABI = [
  "function createAgreement(address partner) external returns (uint256)",
  "function acceptAgreement(uint256 agreementId) external",
  "function cancelAgreement(uint256 agreementId) external",
  "function recordProof(uint256 agreementId, bytes32 documentHash) external",
  "function recordProofWithAck(uint256 agreementId, bytes32 documentHash) external",
  "function acknowledgeProof(bytes32 documentHash) external",
  "function proposeRevocation(bytes32 documentHash) external",
  "function revokeProof(bytes32 documentHash) external",
  "function generateSaltedHash(bytes32 documentHash, uint256 agreementId) external pure returns (bytes32)",
  "function verifyProof(bytes32 documentHash) external view returns (bool, uint256, uint256, address)",
  "function getProof(bytes32 documentHash) external view returns (tuple(uint256 agreementId, bytes32 documentHash, uint256 timestamp, address submittedBy, bool requiresBilateralAck, bool acknowledgedByPartner, bool isRevoked))",
  "function getUserAgreements(address user) external view returns (uint256[])",
  "function getAgreement(uint256 agreementId) external view returns (tuple(uint256 id, address initiator, address partner, bool isActive, uint256 createdAt))",
  "function isAgreementActive(uint256 agreementId) external view returns (bool)",
  "function getTotalAgreements() external view returns (uint256)",
  "event AgreementCreated(uint256 indexed id, address indexed initiator, address indexed partner)",
  "event AgreementAccepted(uint256 indexed id, address partner)",
  "event AgreementCancelled(uint256 indexed id, address cancelledBy)",
  "event ProofRecorded(uint256 indexed agreementId, bytes32 indexed documentHash, address indexed submittedBy)",
  "event ProofAcknowledged(bytes32 indexed documentHash, address acknowledgedBy)",
  "event ProofRevocationProposed(bytes32 indexed documentHash, address proposedBy)",
  "event ProofRevoked(bytes32 indexed documentHash, address revokedBy)"
]

export const getTrustLinkContract = (provider, address) => {
  return new ethers.Contract(address, TRUSTLINK_CORE_ABI, provider)
}

// Agreement functions
export const createAgreement = async (contract, partnerAddress, signer) => {
  const tx = await contract.connect(signer).createAgreement(partnerAddress)
  const receipt = await tx.wait()
  return receipt
}

export const acceptAgreement = async (contract, agreementId, signer) => {
  const tx = await contract.connect(signer).acceptAgreement(agreementId)
  return await tx.wait()
}

export const cancelAgreement = async (contract, agreementId, signer) => {
  const tx = await contract.connect(signer).cancelAgreement(agreementId)
  return await tx.wait()
}

// Proof recording functions
export const recordProof = async (contract, agreementId, documentHash, signer) => {
  const tx = await contract.connect(signer).recordProof(agreementId, documentHash)
  return await tx.wait()
}

export const recordProofWithAck = async (contract, agreementId, documentHash, signer) => {
  const tx = await contract.connect(signer).recordProofWithAck(agreementId, documentHash)
  return await tx.wait()
}

export const acknowledgeProof = async (contract, documentHash, signer) => {
  const tx = await contract.connect(signer).acknowledgeProof(documentHash)
  return await tx.wait()
}

// Revocation functions
export const proposeRevocation = async (contract, documentHash, signer) => {
  const tx = await contract.connect(signer).proposeRevocation(documentHash)
  return await tx.wait()
}

export const revokeProof = async (contract, documentHash, signer) => {
  const tx = await contract.connect(signer).revokeProof(documentHash)
  return await tx.wait()
}

// Verification functions
export const verifyProof = async (contract, documentHash) => {
  return await contract.verifyProof(documentHash)
}

export const getProof = async (contract, documentHash) => {
  return await contract.getProof(documentHash)
}

// Agreement queries
export const getUserAgreements = async (contract, userAddress) => {
  return await contract.getUserAgreements(userAddress)
}

export const getAgreement = async (contract, agreementId) => {
  return await contract.getAgreement(agreementId)
}

export const isAgreementActive = async (contract, agreementId) => {
  return await contract.isAgreementActive(agreementId)
}

// Utility functions
export const generateSaltedHash = async (contract, documentHash, agreementId) => {
  return await contract.generateSaltedHash(documentHash, agreementId)
}