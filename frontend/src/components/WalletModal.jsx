import React, { useState, useEffect } from 'react'
import { X, Wallet, ExternalLink } from 'lucide-react'

const WalletModal = ({ isOpen, onClose, onSelectWallet }) => {
  const [availableWallets, setAvailableWallets] = useState([])

  useEffect(() => {
    if (isOpen) {
      detectWallets()
    }
  }, [isOpen])

  const detectWallets = () => {
    const wallets = []

    console.log('🔍 Detecting wallets...')
    console.log('   window.ethereum exists:', !!window.ethereum)
    console.log('   window.ethereum.providers:', window.ethereum?.providers?.length || 'none')
    
    if (window.ethereum?.providers) {
      console.log('   Multiple providers detected:')
      window.ethereum.providers.forEach((p, i) => {
        console.log(`     [${i}] isMetaMask:${p.isMetaMask}, isCoinbase:${p.isCoinbaseWallet}`)
      })
    }

    // Helper to find specific provider
    const findProvider = (check) => {
      if (!window.ethereum) return null
      
      // Check if there are multiple providers
      if (window.ethereum.providers && window.ethereum.providers.length > 0) {
        const found = window.ethereum.providers.find(check)
        console.log('   findProvider result:', found ? 'found' : 'not found')
        return found || null
      }
      
      // Single provider
      const result = check(window.ethereum) ? window.ethereum : null
      console.log('   Single provider check:', result ? 'matched' : 'no match')
      return result
    }

    // MetaMask
    const metaMaskProvider = findProvider(p => p.isMetaMask)
    if (metaMaskProvider) {
      wallets.push({
        id: 'metamask',
        name: 'MetaMask',
        icon: '🦊',
        installed: true,
        type: 'ethereum',
        provider: metaMaskProvider
      })
    } else {
      wallets.push({
        id: 'metamask',
        name: 'MetaMask',
        icon: '🦊',
        installed: false,
        type: 'ethereum',
        installUrl: 'https://metamask.io/download/'
      })
    }

    // Coinbase Wallet
    const coinbaseProvider = findProvider(p => p.isCoinbaseWallet)
    if (coinbaseProvider) {
      wallets.push({
        id: 'coinbase',
        name: 'Coinbase Wallet',
        icon: '💰',
        installed: true,
        type: 'ethereum',
        provider: coinbaseProvider
      })
    } else {
      wallets.push({
        id: 'coinbase',
        name: 'Coinbase Wallet',
        icon: '💰',
        installed: false,
        type: 'ethereum',
        installUrl: 'https://www.coinbase.com/wallet'
      })
    }

    // Trust Wallet
    const trustProvider = findProvider(p => p.isTrust)
    if (trustProvider) {
      wallets.push({
        id: 'trust',
        name: 'Trust Wallet',
        icon: '🛡️',
        installed: true,
        type: 'ethereum',
        provider: trustProvider
      })
    }

    // Brave Wallet
    const braveProvider = findProvider(p => p.isBraveWallet)
    if (braveProvider) {
      wallets.push({
        id: 'brave',
        name: 'Brave Wallet',
        icon: '🦁',
        installed: true,
        type: 'ethereum',
        provider: braveProvider
      })
    }

    // Cardano Wallets
    if (window.cardano?.eternl) {
      wallets.push({
        id: 'eternl',
        name: 'Eternl',
        icon: '₳',
        installed: true,
        type: 'cardano',
        provider: window.cardano.eternl
      })
    }

    if (window.cardano?.nami) {
      wallets.push({
        id: 'nami',
        name: 'Nami',
        icon: '₳',
        installed: true,
        type: 'cardano',
        provider: window.cardano.nami
      })
    }

    if (window.cardano?.yoroi) {
      wallets.push({
        id: 'yoroi',
        name: 'Yoroi',
        icon: '₳',
        installed: true,
        type: 'cardano',
        provider: window.cardano.yoroi
      })
    }

    // Solana Wallets
    if (window.solana?.isPhantom) {
      wallets.push({
        id: 'phantom',
        name: 'Phantom',
        icon: '👻',
        installed: true,
        type: 'solana',
        provider: window.solana
      })
    }

    // Polkadot Wallets
    if (window.injectedWeb3?.['polkadot-js']) {
      wallets.push({
        id: 'polkadot',
        name: 'Polkadot.js',
        icon: '🔴',
        installed: true,
        type: 'polkadot',
        provider: window.injectedWeb3['polkadot-js']
      })
    }

    setAvailableWallets(wallets)
  }

  if (!isOpen) return null

  const ethereumWallets = availableWallets.filter(w => w.type === 'ethereum')
  const cardanoWallets = availableWallets.filter(w => w.type === 'cardano')
  const solanaWallets = availableWallets.filter(w => w.type === 'solana')
  const polkadotWallets = availableWallets.filter(w => w.type === 'polkadot')

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Wallet className="h-6 w-6 text-primary-600" />
            <h2 className="text-xl font-bold text-gray-900">Connect Wallet</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="space-y-6">
            {/* Ethereum Wallets */}
            {ethereumWallets.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700">
                  Ethereum Wallets
                </h3>
                {ethereumWallets.map((wallet) => (
              <button
                key={wallet.id}
                onClick={() => wallet.installed && onSelectWallet(wallet)}
                disabled={!wallet.installed}
                className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                  wallet.installed
                    ? 'border-gray-200 hover:border-primary-500 hover:bg-primary-50 cursor-pointer'
                    : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{wallet.icon}</span>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">{wallet.name}</p>
                    <p className="text-xs text-gray-500">
                      {wallet.installed ? 'Detected' : 'Not installed'}
                    </p>
                  </div>
                </div>
                {!wallet.installed && (
                  <a
                    href={wallet.installUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700"
                  >
                    Install
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </button>
                ))}
              </div>
            )}

            {/* Cardano Wallets */}
            {cardanoWallets.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700">
                  Cardano Wallets
                </h3>
                {cardanoWallets.map((wallet) => (
                  <button
                    key={wallet.id}
                    onClick={() => onSelectWallet(wallet)}
                    className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-gray-200 hover:border-primary-500 hover:bg-primary-50 cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{wallet.icon}</span>
                      <div className="text-left">
                        <p className="font-semibold text-gray-900">{wallet.name}</p>
                        <p className="text-xs text-gray-500">Detected</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Solana Wallets */}
            {solanaWallets.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700">
                  Solana Wallets
                </h3>
                {solanaWallets.map((wallet) => (
                  <button
                    key={wallet.id}
                    onClick={() => onSelectWallet(wallet)}
                    className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-gray-200 hover:border-primary-500 hover:bg-primary-50 cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{wallet.icon}</span>
                      <div className="text-left">
                        <p className="font-semibold text-gray-900">{wallet.name}</p>
                        <p className="text-xs text-gray-500">Detected</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Polkadot Wallets */}
            {polkadotWallets.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700">
                  Polkadot Wallets
                </h3>
                {polkadotWallets.map((wallet) => (
                  <button
                    key={wallet.id}
                    onClick={() => onSelectWallet(wallet)}
                    className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-gray-200 hover:border-primary-500 hover:bg-primary-50 cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{wallet.icon}</span>
                      <div className="text-left">
                        <p className="font-semibold text-gray-900">{wallet.name}</p>
                        <p className="text-xs text-gray-500">Detected</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default WalletModal
