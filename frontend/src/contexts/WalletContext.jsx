import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { ethers } from 'ethers'
import WalletModal from '../components/WalletModal'

const WalletContext = createContext()

export const useWallet = () => {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null)
  const [provider, setProvider] = useState(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState(null)
  const [showWalletModal, setShowWalletModal] = useState(false)

  const disconnectWallet = useCallback(() => {
    setAccount(null)
    setProvider(null)
    setError(null)
  }, [])

  const handleAccountsChanged = useCallback((accounts) => {
    if (accounts.length === 0) {
      disconnectWallet()
    } else {
      setAccount(accounts[0])
      if (window.ethereum) {
        setProvider(new ethers.BrowserProvider(window.ethereum))
      }
    }
  }, [disconnectWallet])

  const handleChainChanged = useCallback(() => {
    window.location.reload()
  }, [])

  // Don't auto-connect on mount - wait for user action
  useEffect(() => {
    // Only set up event listeners, don't auto-connect
    if (window.ethereum?.on) {
      window.ethereum.on('accountsChanged', handleAccountsChanged)
      window.ethereum.on('chainChanged', handleChainChanged)
    }

    return () => {
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
        window.ethereum.removeListener('chainChanged', handleChainChanged)
      }
    }
  }, [handleAccountsChanged, handleChainChanged])


  const connectWallet = () => {
    // Open the wallet selection modal
    setShowWalletModal(true)
  }

  const handleWalletSelect = async (wallet) => {
    setShowWalletModal(false)
    setIsConnecting(true)
    setError(null)
    
    console.log('💼 Connecting to wallet:', wallet.name, '(', wallet.type, ')')
    console.log('📦 Provider object:', wallet.provider)
    console.log('📦 Provider properties:', {
      isMetaMask: wallet.provider?.isMetaMask,
      isCoinbaseWallet: wallet.provider?.isCoinbaseWallet,
      hasRequest: typeof wallet.provider?.request === 'function'
    })
    
    try {
      let address = null

      // Handle different wallet types
      if (wallet.type === 'ethereum') {
        console.log('🦊 Connecting to Ethereum wallet...')
        
        // Verify provider is valid
        if (!wallet.provider || typeof wallet.provider.request !== 'function') {
          throw new Error('Invalid provider: missing request method')
        }
        
        // Check if MetaMask is locked
        try {
          const isUnlocked = await wallet.provider._metamask?.isUnlocked?.()
          console.log('🔓 MetaMask locked status:', isUnlocked === false ? 'LOCKED' : 'unlocked')
          if (isUnlocked === false) {
            throw new Error('MetaMask is locked. Please unlock it and try again.')
          }
        } catch (e) {
          console.log('   Could not check lock status:', e.message)
        }
        
        // Ethereum wallets (MetaMask, Coinbase, etc.)
        console.log('📞 Calling eth_requestAccounts...')
        console.log('⏳ Waiting for MetaMask popup... (30 second timeout)')
        
        // Add timeout to prevent hanging
        const accountsPromise = wallet.provider.request({ 
          method: 'eth_requestAccounts' 
        })
        
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Connection timeout. MetaMask popup did not appear. Please:\n1. Check if MetaMask is unlocked\n2. Look for MetaMask popup (might be hidden)\n3. Try disabling other wallet extensions temporarily')), 30000)
        )
        
        const accounts = await Promise.race([accountsPromise, timeoutPromise])
        
        console.log('✅ Ethereum accounts received:', accounts)
        if (accounts && accounts.length > 0) {
          address = accounts[0]
          setProvider(new ethers.BrowserProvider(wallet.provider))
        }
      } else if (wallet.type === 'cardano') {
        console.log('₳ Connecting to Cardano wallet...')
        // Cardano wallets (Eternl, Nami, Yoroi)
        const api = await wallet.provider.enable()
        console.log('✅ Cardano API enabled:', api)
        
        // Get change address (most commonly used)
        const changeAddress = await api.getChangeAddress()
        console.log('📬 Cardano address:', changeAddress)
        
        if (changeAddress) {
          address = changeAddress
          // Store Cardano API for later use
          setProvider({ cardanoApi: api, type: 'cardano', walletName: wallet.name })
        }
      } else if (wallet.type === 'solana') {
        console.log('👻 Connecting to Solana wallet...')
        // Solana wallets (Phantom)
        const resp = await wallet.provider.connect()
        console.log('✅ Solana connected:', resp)
        if (resp?.publicKey) {
          address = resp.publicKey.toString()
          setProvider({ solanaProvider: wallet.provider, type: 'solana' })
        }
      } else if (wallet.type === 'polkadot') {
        // Polkadot wallets
        console.log('🔴 Polkadot wallet not yet supported')
        alert('Polkadot wallet support coming soon!')
        setIsConnecting(false)
        return
      }

      if (address) {
        setAccount(address)
        console.log('✅ Wallet connected successfully!')
        console.log('   Address:', address)
      } else {
        throw new Error('No address returned from wallet')
      }
    } catch (err) {
      console.error('❌ Wallet connection error:', err)
      console.error('   Error code:', err.code)
      console.error('   Error message:', err.message)
      
      let errorMessage = 'Failed to connect wallet'
      
      if (err.code === 4001 || err.message?.includes('rejected') || err.message?.includes('User rejected')) {
        errorMessage = 'You rejected the connection request.'
      } else if (err.code === -32002) {
        errorMessage = 'Connection request pending. Please check your wallet extension.'
      } else if (err.message?.includes('enable')) {
        errorMessage = `Failed to enable ${wallet.name}. Make sure the extension is unlocked and try again.`
      } else {
        errorMessage = err.message || errorMessage
      }
      
      setError(errorMessage)
      alert('❌ Connection Failed\n\n' + errorMessage)
    } finally {
      setIsConnecting(false)
    }
  }

  const value = {
    account,
    provider,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
    isConnected: !!account,
    hasMetaMask: typeof window !== 'undefined' && !!window.ethereum?.isMetaMask
  }

  return (
    <WalletContext.Provider value={value}>
      {children}
      <WalletModal 
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        onSelectWallet={handleWalletSelect}
      />
    </WalletContext.Provider>
  )
}