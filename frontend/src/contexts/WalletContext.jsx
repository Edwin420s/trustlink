import React, { createContext, useContext, useState, useEffect } from 'react'
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

  useEffect(() => {
    checkIfWalletConnected()
  }, [])

  const checkIfWalletConnected = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' })
      if (accounts.length > 0) {
        setAccount(accounts[0])
        setProvider(new ethers.BrowserProvider(window.ethereum))
      }
    }
  }

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask to use this application')
      return
    }

    setIsConnecting(true)
    try {
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      })
      setAccount(accounts[0])
      setProvider(new ethers.BrowserProvider(window.ethereum))
    } catch (error) {
      console.error('Error connecting wallet:', error)
      alert('Failed to connect wallet. Please try again.')
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    setAccount(null)
    setProvider(null)
  }

  const value = {
    account,
    provider,
    isConnecting,
    connectWallet,
    disconnectWallet,
    isConnected: !!account
  }

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
}