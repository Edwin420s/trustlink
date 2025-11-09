/**
 * Get MetaMask provider even when multiple wallet extensions are installed
 * This handles conflicts with Eternl, Phantom, and other wallets
 */
export const getMetaMaskProvider = () => {
  // If window.ethereum is MetaMask, return it directly
  if (window.ethereum?.isMetaMask) {
    return window.ethereum
  }

  // If multiple providers exist, find MetaMask
  if (window.ethereum?.providers?.length) {
    return window.ethereum.providers.find(p => p.isMetaMask)
  }

  // Check for legacy MetaMask injection
  if (window.web3?.currentProvider?.isMetaMask) {
    return window.web3.currentProvider
  }

  return null
}

/**
 * Check if MetaMask is installed
 */
export const isMetaMaskInstalled = () => {
  return getMetaMaskProvider() !== null
}

/**
 * Get list of all detected wallet providers
 */
export const getDetectedWallets = () => {
  const wallets = []
  
  if (window.ethereum?.isMetaMask) wallets.push('MetaMask')
  if (window.cardano) wallets.push('Cardano Wallet (Eternl/Nami)')
  if (window.solana) wallets.push('Solana Wallet (Phantom)')
  if (window.ethereum && !window.ethereum.isMetaMask) wallets.push('Other EVM Wallet')
  
  return wallets
}
