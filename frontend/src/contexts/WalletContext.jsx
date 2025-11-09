import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { ethers } from 'ethers'
import { 
  getMetaMaskProvider, 
  isMetaMaskInstalled, 
  waitForProvider,
  getAvailableWallets,
  hasWalletConflicts 
} from '../utils/walletDetection'

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
  const [detectedWallets, setDetectedWallets] = useState([])
  const [metaMaskProvider, setMetaMaskProvider] = useState(null)

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
      const mmProvider = getMetaMaskProvider()
      if (mmProvider) {
        setProvider(new ethers.BrowserProvider(mmProvider))
      }
    }
  }, [disconnectWallet])

  const handleChainChanged = useCallback(() => {
    window.location.reload()
  }, [])

  useEffect(() => {
    let mounted = true

    const setupProvider = async () => {
      try {
        // Detect all available wallets
        const wallets = getAvailableWallets()
        if (mounted) {
          setDetectedWallets(wallets)
        }

        // Wait for MetaMask to be injected
        const mmProvider = await waitForProvider()
        
        if (!mmProvider || !mounted) {
          console.log('MetaMask not found after waiting')
          return
        }

        if (mounted) {
          setMetaMaskProvider(mmProvider)
        }

        // Check if already connected
        try {
          const accounts = await mmProvider.request({ method: 'eth_accounts' })
          if (accounts.length > 0 && mounted) {
            setAccount(accounts[0])
            setProvider(new ethers.BrowserProvider(mmProvider))
          }
        } catch (err) {
          console.log('No existing connection:', err.message)
        }

        // Set up event listeners
        if (mmProvider.on) {
          mmProvider.on('accountsChanged', handleAccountsChanged)
          mmProvider.on('chainChanged', handleChainChanged)
        }

      } catch (err) {
        console.error('Error setting up provider:', err)
        if (mounted) {
          setError(err.message)
        }
      }
    }

    setupProvider()

    return () => {
      mounted = false
      const provider = getMetaMaskProvider()
      if (provider?.removeListener) {
        provider.removeListener('accountsChanged', handleAccountsChanged)
        provider.removeListener('chainChanged', handleChainChanged)
      }
    }
  }, [handleAccountsChanged, handleChainChanged])


  const connectWallet = async () => {
    console.log('🔵 Connect Wallet button clicked')
    
    // Check if MetaMask is installed
    if (!isMetaMaskInstalled()) {
      const message = '🦊 MetaMask is not installed!\n\nPlease install MetaMask from https://metamask.io to use this dApp.'
      console.error('❌ MetaMask not found')
      setError(message)
      alert(message)
      return
    }

    console.log('✅ MetaMask detected, starting connection...')

    setIsConnecting(true)
    setError(null)
    
    try {
      // Get the MetaMask provider specifically
      const mmProvider = getMetaMaskProvider()
      
      if (!mmProvider) {
        throw new Error('MetaMask provider not found. Please refresh the page.')
      }

      console.log('🔵 Requesting accounts from MetaMask...')

      // Request account access
      const accounts = await mmProvider.request({ 
        method: 'eth_requestAccounts' 
      })
      
      console.log('📩 Received accounts:', accounts)
      
      if (accounts.length > 0) {
        setAccount(accounts[0])
        setProvider(new ethers.BrowserProvider(mmProvider))
        setMetaMaskProvider(mmProvider)
        console.log('✅ Wallet connected successfully!')
        console.log('   Address:', accounts[0])
      }
    } catch (err) {
      console.error('❌ Error connecting wallet:', err)
      console.error('   Error code:', err.code)
      console.error('   Error message:', err.message)
      
      let errorMessage = 'Failed to connect wallet'
      
      if (err.code === 4001) {
        errorMessage = 'You rejected the connection request. Please try again if you want to connect.'
      } else if (err.code === -32002) {
        errorMessage = 'Connection request already pending. Please check your MetaMask extension.'
      } else if (err.message?.includes('not found')) {
        errorMessage = 'MetaMask not detected. Please make sure it is installed and enabled.'
      } else {
        errorMessage = err.message || errorMessage
      }
      
      setError(errorMessage)
      alert(errorMessage)
    } finally {
      setIsConnecting(false)
      console.log('🔵 Connection attempt finished')
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
    hasMetaMask: isMetaMaskInstalled(),
    detectedWallets,
    metaMaskProvider
  }

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
}