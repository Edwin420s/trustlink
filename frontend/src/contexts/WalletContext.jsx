import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { ethers } from 'ethers'

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

  useEffect(() => {
    let mounted = true

    const setupProvider = async () => {
      try {
        // Check multiple times for MetaMask injection
        const checkForMetaMask = (attempts = 0) => {
          return new Promise((resolve) => {
            // Check specifically for MetaMask, not just any ethereum provider
            if (window.ethereum?.isMetaMask) {
              resolve(true)
            } else if (attempts < 10) {
              setTimeout(() => resolve(checkForMetaMask(attempts + 1)), 100)
            } else {
              resolve(false)
            }
          })
        }

        const hasMetaMask = await checkForMetaMask()
        
        if (!hasMetaMask || !mounted) return

        // Check if already connected
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        if (accounts.length > 0 && mounted) {
          setAccount(accounts[0])
          setProvider(new ethers.BrowserProvider(window.ethereum))
        }

        // Set up event listeners
        window.ethereum.on('accountsChanged', handleAccountsChanged)
        window.ethereum.on('chainChanged', handleChainChanged)

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
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
        window.ethereum.removeListener('chainChanged', handleChainChanged)
      }
    }
  }, [handleAccountsChanged, handleChainChanged])


  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      const message = 'MetaMask is not installed. Please install it from https://metamask.io'
      setError(message)
      alert(message)
      return
    }

    if (!window.ethereum.isMetaMask) {
      const message = 'MetaMask not detected. Please make sure MetaMask is installed and other wallet extensions are disabled.'
      setError(message)
      alert(message)
      return
    }

    setIsConnecting(true)
    setError(null)
    
    try {
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      })
      
      if (accounts.length > 0) {
        setAccount(accounts[0])
        setProvider(new ethers.BrowserProvider(window.ethereum))
      }
    } catch (err) {
      console.error('Error connecting wallet:', err)
      
      let errorMessage = 'Failed to connect wallet'
      
      if (err.code === 4001) {
        errorMessage = 'Connection rejected. Please try again.'
      } else if (err.code === -32002) {
        errorMessage = 'Connection request pending. Please check MetaMask.'
      } else {
        errorMessage = err.message || errorMessage
      }
      
      setError(errorMessage)
      alert(errorMessage)
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
    hasMetaMask: typeof window !== 'undefined' && typeof window.ethereum !== 'undefined'
  }

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
}