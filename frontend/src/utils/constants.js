export const CONTRACT_ADDRESSES = {
  trustLinkCore: import.meta.env.VITE_TRUSTLINK_CORE_ADDRESS || '',
  trustLinkRegistry: import.meta.env.VITE_TRUSTLINK_REGISTRY_ADDRESS || '',
  proofVerifier: import.meta.env.VITE_PROOF_VERIFIER_ADDRESS || ''
}

export const SUPPORTED_FILE_TYPES = [
  '.pdf',
  '.doc',
  '.docx',
  '.txt',
  '.jpg',
  '.jpeg',
  '.png',
  '.gif'
]

export const SUPPORTED_FILE_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif'
]

export const MAX_FILE_SIZE_MB = 10
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

export const NETWORK_CONFIG = {
  chainId: '0xe704',
  chainName: 'Linea Testnet',
  rpcUrl: 'https://rpc.linea.build',
  blockExplorer: 'https://explorer.linea.build',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18
  }
}

export const AGREEMENT_STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  CANCELLED: 'cancelled'
}

export const VERIFICATION_STATUS = {
  VERIFIED: 'verified',
  NOT_VERIFIED: 'not_verified',
  PENDING: 'pending',
  ERROR: 'error'
}

export const ERROR_MESSAGES = {
  WALLET_NOT_CONNECTED: 'Please connect your wallet to continue',
  NETWORK_NOT_SUPPORTED: 'Please switch to Linea Testnet',
  CONTRACT_NOT_DEPLOYED: 'Smart contract not deployed to this network',
  INVALID_ADDRESS: 'Invalid Ethereum address',
  FILE_TOO_LARGE: `File size must be less than ${MAX_FILE_SIZE_MB}MB`,
  UNSUPPORTED_FILE_TYPE: 'File type not supported',
  TRANSACTION_FAILED: 'Transaction failed. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.'
}