import React, { useState, useEffect } from 'react'
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react'

const MetaMaskStatus = () => {
  const [status, setStatus] = useState({
    hasWindow: false,
    hasEthereum: false,
    isMetaMask: false,
    otherWallets: []
  })

  useEffect(() => {
    const checkStatus = () => {
      const hasWindow = typeof window !== 'undefined'
      const hasEthereum = typeof window.ethereum !== 'undefined'
      const isMetaMask = window.ethereum?.isMetaMask || false
      
      // Check for other wallet extensions
      const otherWallets = []
      if (window.cardano) otherWallets.push('Cardano (Eternl/Nami)')
      if (window.solana) otherWallets.push('Solana (Phantom)')
      if (window.ethereum && !window.ethereum.isMetaMask) otherWallets.push('Other EVM wallet')

      setStatus({
        hasWindow,
        hasEthereum,
        isMetaMask,
        otherWallets
      })
    }

    checkStatus()
    
    // Recheck after delays to catch late injections
    const timer1 = setTimeout(checkStatus, 500)
    const timer2 = setTimeout(checkStatus, 1000)
    const timer3 = setTimeout(checkStatus, 2000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [])

  if (status.isMetaMask) {
    return null // Don't show if MetaMask is detected
  }

  return (
    <div className="fixed bottom-2 right-2 left-2 sm:bottom-4 sm:right-4 sm:left-auto max-w-md bg-white border border-amber-200 rounded-lg shadow-lg p-3 sm:p-4 z-50">
      <div className="flex items-start space-x-3">
        <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="font-semibold text-primary-700 mb-2">
            MetaMask Detection Status
          </h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              {status.hasWindow ? 
                <CheckCircle className="h-4 w-4 text-green-600" /> : 
                <XCircle className="h-4 w-4 text-red-600" />
              }
              <span>Window object: {status.hasWindow ? 'Available' : 'Not found'}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              {status.hasEthereum ? 
                <CheckCircle className="h-4 w-4 text-green-600" /> : 
                <XCircle className="h-4 w-4 text-red-600" />
              }
              <span>Ethereum provider: {status.hasEthereum ? 'Found' : 'Not found'}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              {status.isMetaMask ? 
                <CheckCircle className="h-4 w-4 text-green-600" /> : 
                <XCircle className="h-4 w-4 text-red-600" />
              }
              <span>MetaMask: {status.isMetaMask ? 'Detected' : 'Not detected'}</span>
            </div>

            {status.otherWallets.length > 0 && (
              <div className="mt-2 pt-2 border-t border-amber-200">
                <p className="text-amber-800 font-medium mb-1">Other wallets detected:</p>
                <ul className="list-disc list-inside text-amber-700">
                  {status.otherWallets.map((wallet, i) => (
                    <li key={i}>{wallet}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {!status.isMetaMask && (
            <div className="mt-3 pt-3 border-t border-amber-200">
              <p className="text-sm text-primary-600 mb-2">
                <strong>To fix this:</strong>
              </p>
              <ol className="list-decimal list-inside text-sm text-primary-600 space-y-1">
                <li>Install MetaMask from <a href="https://metamask.io" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">metamask.io</a></li>
                <li>Disable other wallet extensions temporarily</li>
                <li>Refresh this page</li>
                <li>Click "Connect Wallet"</li>
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MetaMaskStatus
