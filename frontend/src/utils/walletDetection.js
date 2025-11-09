/**
 * Utility for detecting and selecting the correct wallet provider
 * Handles multiple wallet extensions (MetaMask, Eternl, Phantom, etc.)
 */

/**
 * Get all available wallet providers
 */
export const getAvailableWallets = () => {
  const wallets = []

  if (typeof window === 'undefined') return wallets

  // Check for MetaMask
  if (window.ethereum?.isMetaMask) {
    wallets.push({
      name: 'MetaMask',
      provider: window.ethereum,
      icon: '🦊',
      type: 'ethereum'
    })
  }

  // Check for Coinbase Wallet
  if (window.ethereum?.isCoinbaseWallet) {
    wallets.push({
      name: 'Coinbase Wallet',
      provider: window.ethereum,
      icon: '💰',
      type: 'ethereum'
    })
  }

  // Check for multiple providers (when multiple wallets are installed)
  if (window.ethereum?.providers) {
    window.ethereum.providers.forEach(provider => {
      if (provider.isMetaMask) {
        wallets.push({
          name: 'MetaMask',
          provider: provider,
          icon: '🦊',
          type: 'ethereum'
        })
      }
      if (provider.isCoinbaseWallet) {
        wallets.push({
          name: 'Coinbase Wallet',
          provider: provider,
          icon: '💰',
          type: 'ethereum'
        })
      }
    })
  }

  // Check for Cardano wallets (non-EVM)
  if (window.cardano) {
    const cardanoWallets = []
    if (window.cardano.eternl) cardanoWallets.push('Eternl')
    if (window.cardano.nami) cardanoWallets.push('Nami')
    if (window.cardano.yoroi) cardanoWallets.push('Yoroi')
    
    cardanoWallets.forEach(name => {
      wallets.push({
        name,
        provider: null,
        icon: '₳',
        type: 'cardano',
        warning: 'Cardano wallets are not compatible with Ethereum dApps'
      })
    })
  }

  // Check for Phantom (Solana)
  if (window.phantom?.solana) {
    wallets.push({
      name: 'Phantom',
      provider: null,
      icon: '👻',
      type: 'solana',
      warning: 'Phantom is a Solana wallet and not compatible with Ethereum dApps'
    })
  }

  // Check for Polkadot.js
  if (window.injectedWeb3) {
    wallets.push({
      name: 'Polkadot.js',
      provider: null,
      icon: '🔴',
      type: 'polkadot',
      warning: 'Polkadot wallets are not compatible with Ethereum dApps'
    })
  }

  return wallets
}

/**
 * Get MetaMask provider specifically
 */
export const getMetaMaskProvider = () => {
  if (typeof window === 'undefined') {
    console.log('🔍 getMetaMaskProvider: window is undefined (SSR)')
    return null
  }

  // Check if ethereum object exists
  if (!window.ethereum) {
    console.log('❌ getMetaMaskProvider: window.ethereum not found')
    return null
  }

  console.log('🔍 getMetaMaskProvider: window.ethereum found')

  // If there are multiple providers, find MetaMask
  if (window.ethereum.providers) {
    console.log('🔍 Multiple providers detected:', window.ethereum.providers.length)
    const mmProvider = window.ethereum.providers.find(provider => provider.isMetaMask)
    if (mmProvider) {
      console.log('✅ MetaMask found in providers array')
      return mmProvider
    }
    console.log('❌ MetaMask not found in providers array')
    return null
  }

  // Check if the single ethereum provider is MetaMask
  if (window.ethereum.isMetaMask) {
    console.log('✅ Single ethereum provider is MetaMask')
    return window.ethereum
  }

  console.log('❌ Single ethereum provider is not MetaMask')
  return null
}

/**
 * Check if MetaMask is installed
 */
export const isMetaMaskInstalled = () => {
  return getMetaMaskProvider() !== null
}

/**
 * Wait for provider to be injected (some wallets inject asynchronously)
 */
export const waitForProvider = (maxAttempts = 20, interval = 100) => {
  return new Promise((resolve) => {
    let attempts = 0

    const check = () => {
      const provider = getMetaMaskProvider()
      if (provider) {
        resolve(provider)
      } else if (attempts < maxAttempts) {
        attempts++
        setTimeout(check, interval)
      } else {
        resolve(null)
      }
    }

    check()
  })
}

/**
 * Get non-Ethereum wallets for warning messages
 */
export const getNonEthereumWallets = () => {
  const wallets = getAvailableWallets()
  return wallets.filter(w => w.type !== 'ethereum')
}

/**
 * Check for wallet conflicts
 */
export const hasWalletConflicts = () => {
  const wallets = getAvailableWallets()
  const nonEthWallets = wallets.filter(w => w.type !== 'ethereum')
  return nonEthWallets.length > 0
}

/**
 * Get wallet info for debugging
 */
export const getWalletDebugInfo = () => {
  const info = {
    hasEthereum: typeof window !== 'undefined' && typeof window.ethereum !== 'undefined',
    hasMetaMask: isMetaMaskInstalled(),
    hasMultipleProviders: window.ethereum?.providers?.length > 1,
    availableWallets: getAvailableWallets(),
    ethereumProperties: {}
  }

  if (window.ethereum) {
    info.ethereumProperties = {
      isMetaMask: window.ethereum.isMetaMask,
      isCoinbaseWallet: window.ethereum.isCoinbaseWallet,
      isPhantom: window.ethereum.isPhantom,
      isBraveWallet: window.ethereum.isBraveWallet,
      providersCount: window.ethereum.providers?.length || 0
    }
  }

  return info
}
