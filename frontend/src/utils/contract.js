import { ethers } from 'ethers'

const TRUSTLINK_CORE_ABI = [
  "function createAgreement(address partner) external",
  "function acceptAgreement(uint256 agreementId) external",
  "function recordProof(uint256 agreementId, bytes32 documentHash) external",
  "function verifyProof(bytes32 documentHash) external view returns (bool, uint256, uint256, address)",
  "function getUserAgreements(address user) external view returns (uint256[])",
  "function agreements(uint256) external view returns (uint256 id, address initiator, address partner, bool isActive, uint256 createdAt)",
  "event AgreementCreated(uint256 indexed id, address indexed initiator, address indexed partner)",
  "event AgreementAccepted(uint256 indexed id, address partner)",
  "event ProofRecorded(uint256 indexed agreementId, bytes32 documentHash, address submittedBy)"
]

export const getTrustLinkContract = (provider, address) => {
  return new ethers.Contract(address, TRUSTLINK_CORE_ABI, provider)
}

export const createAgreement = async (contract, partnerAddress, signer) => {
  const tx = await contract.connect(signer).createAgreement(partnerAddress)
  return await tx.wait()
}

export const acceptAgreement = async (contract, agreementId, signer) => {
  const tx = await contract.connect(signer).acceptAgreement(agreementId)
  return await tx.wait()
}

export const recordProof = async (contract, agreementId, documentHash, signer) => {
  const tx = await contract.connect(signer).recordProof(agreementId, documentHash)
  return await tx.wait()
}

export const verifyProof = async (contract, documentHash) => {
  return await contract.verifyProof(documentHash)
}