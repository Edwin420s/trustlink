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
  const [rawProvider, setRawProvider] = useState(null)
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
    }
  }, [disconnectWallet])

  const handleChainChanged = useCallback(() => {
    window.location.reload()
  }, [])

  // Attach listeners to the selected raw EVM provider only
  useEffect(() => {
    if (!rawProvider?.on) return
    rawProvider.on('accountsChanged', handleAccountsChanged)
    rawProvider.on('chainChanged', handleChainChanged)
    return () => {
      try { rawProvider.removeListener?.('accountsChanged', handleAccountsChanged) } catch {}
      try { rawProvider.removeListener?.('chainChanged', handleChainChanged) } catch {}
    }
  }, [rawProvider, handleAccountsChanged, handleChainChanged])


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
        
        // Only run MetaMask-specific lock check when the selected wallet is MetaMask
        const isSelectedMetaMask = (wallet.id === 'metamask') || /metamask/i.test(wallet.name || '')
        if (isSelectedMetaMask && wallet.provider?._metamask?.isUnlocked) {
          try {
            const isUnlocked = await wallet.provider._metamask?.isUnlocked?.()
            console.log('🔓 MetaMask locked status:', isUnlocked === false ? 'LOCKED' : 'unlocked')
            if (isUnlocked === false) {
              setError('MetaMask is locked. Please unlock it and try again.')
              alert('MetaMask is locked. Please unlock it and try again.')
              setIsConnecting(false)
              return
            }
          } catch (e) {
            console.log('   Could not check lock status:', e.message)
          }
        }
        
        // Ethereum wallets (EVM providers)
        console.log('📞 Calling eth_requestAccounts on selected wallet...')
        console.log('⏳ Waiting for wallet popup... (30 second timeout)')
        
        // Add timeout to prevent hanging
        const accountsPromise = wallet.provider.request({ 
          method: 'eth_requestAccounts' 
        })
        
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Connection timeout. Wallet popup did not appear. Please:\n1. Ensure the selected wallet is unlocked\n2. Look for the wallet popup (it may be hidden)\n3. Temporarily disable other wallet extensions if they interfere')), 30000)
        )
        
        let accounts
        try {
          accounts = await Promise.race([accountsPromise, timeoutPromise])
        } catch (e) {
          if (e.code === -32002) {
            setError('Connection request pending. Please check your wallet extension.')
            alert('Connection request pending. Please check your wallet extension.')
            setIsConnecting(false)
            return
          }
          throw e
        }
        
        console.log('✅ Ethereum accounts received:', accounts)
        if (accounts && accounts.length > 0) {
          address = accounts[0]
          const browserProvider = new ethers.BrowserProvider(wallet.provider)
          setProvider(browserProvider)
          setRawProvider(wallet.provider)
        }
      } else if (wallet.type === 'cardano') {
        console.log('₳ Connecting to Cardano wallet...')
        // Cardano wallets (Eternl, Nami, Yoroi)
        let api
        try {
          api = await wallet.provider.enable()
        } catch (e) {
          console.log('   enable() failed:', e)
          throw e
        }
        console.log('✅ Cardano API enabled:', api)
        
        // Get change address (most commonly used)
        let changeAddress = null
        try {
          changeAddress = await api.getChangeAddress()
        } catch (e) {
          console.log('   getChangeAddress failed:', e)
          try {
            const used = await api.getUsedAddresses()
            changeAddress = used && used.length > 0 ? used[0] : null
          } catch (e2) {
            console.log('   getUsedAddresses failed:', e2)
            try {
              const rewards = await api.getRewardAddresses()
              changeAddress = rewards && rewards.length > 0 ? rewards[0] : null
            } catch (e3) {
              console.log('   getRewardAddresses failed:', e3)
            }
          }
        }
        console.log('📬 Cardano address:', changeAddress)
        
        if (changeAddress) {
          address = changeAddress
          setProvider({ cardanoApi: api, type: 'cardano', walletName: wallet.name })
        } else {
          throw new Error('Failed to obtain Cardano address from wallet')
        }
      } else if (wallet.type === 'solana') {
        console.log('👻 Connecting to Solana wallet...')
        // Solana wallets (Phantom)
        const resp = await wallet.provider.connect().catch(async (e) => {
          if (wallet.provider?.isConnected) {
            return { publicKey: wallet.provider.publicKey }
          }
          throw e
        })
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