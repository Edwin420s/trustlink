import React, { useState, useEffect } from 'react'
import { AlertCircle, CheckCircle, XCircle, Wallet } from 'lucide-react'
import { useWallet } from '../contexts/WalletContext'

const MetaMaskStatus = () => {
  const { hasMetaMask, detectedWallets, isConnected } = useWallet()
  const [showDebug, setShowDebug] = useState(false)


  // Hide if connected and MetaMask is working (unless debug mode)
  if (isConnected && hasMetaMask && !showDebug) {
    return null
  }

  const ethWallets = detectedWallets.filter(w => w.type === 'ethereum')
  const nonEthWallets = detectedWallets.filter(w => w.type !== 'ethereum')

  return (
    <div className="bg-blue-50 border-l-4 border-blue-400 p-3 sm:p-4 mx-4 sm:mx-6 lg:mx-8 my-4 max-w-7xl">
      <div className="flex flex-col sm:flex-row items-start">
        <div className="flex-shrink-0">
          <Wallet className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
        </div>
        <div className="ml-0 sm:ml-3 mt-2 sm:mt-0 flex-1">
          <h3 className="text-sm sm:text-base font-medium text-blue-900">
            🔍 Wallet Detection Status
          </h3>
          <div className="mt-3 text-xs sm:text-sm text-blue-800 space-y-3">
            {/* MetaMask Status */}
            <div className="flex items-center gap-2">
              {hasMetaMask ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
              <span className="font-medium">MetaMask: {hasMetaMask ? '✅ Detected' : '❌ Not Found'}</span>
            </div>

            {/* All Detected Wallets */}
            {detectedWallets.length > 0 && (
              <div className="bg-white/50 rounded-lg p-3">
                <p className="font-medium mb-2">Detected Wallets ({detectedWallets.length}):</p>
                <ul className="space-y-2">
                  {detectedWallets.map((wallet, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-lg">{wallet.icon}</span>
                      <span>{wallet.name}</span>
                      {wallet.type !== 'ethereum' && (
                        <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                          {wallet.type}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Non-Ethereum Wallet Warning */}
            {nonEthWallets.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <span className="font-medium text-amber-900">⚠️ Non-Ethereum Wallets Detected</span>
                </div>
                <p className="text-xs text-amber-800 mb-2">
                  The following wallets are not compatible with Ethereum dApps and may interfere with MetaMask:
                </p>
                <ul className="text-xs text-amber-700 ml-4 space-y-1">
                  {nonEthWallets.map((w, i) => (
                    <li key={i}>• {w.name} ({w.type})</li>
                  ))}
                </ul>
                <p className="text-xs text-amber-700 mt-2">
                  💡 Consider disabling these extensions for this site if you experience connection issues.
                </p>
              </div>
            )}

            {/* Instructions */}
            {!hasMetaMask && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="font-medium mb-2 text-green-900">📝 To use this dApp:</p>
                <ol className="list-decimal ml-5 space-y-1 text-green-800">
                  <li>Install MetaMask from <a href="https://metamask.io" target="_blank" rel="noopener noreferrer" className="text-primary-600 underline font-medium">metamask.io</a></li>
                  <li>Refresh this page</li>
                  <li>Click "Connect Wallet" button</li>
                </ol>
              </div>
            )}

            {/* Connected Status */}
            {isConnected && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 font-medium">✅ Wallet Successfully Connected!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MetaMaskStatus
