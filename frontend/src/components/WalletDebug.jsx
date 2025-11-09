import React from 'react'
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react'

const WalletDebug = () => {
  const checkWalletStatus = () => {
    console.log('=== WALLET DEBUG INFO ===')
    console.log('window.ethereum exists:', !!window.ethereum)
    console.log('window.ethereum.isMetaMask:', window.ethereum?.isMetaMask)
    console.log('window.ethereum.request exists:', typeof window.ethereum?.request === 'function')
    console.log('Multiple providers:', window.ethereum?.providers?.length || 0)
    
    if (window.ethereum?.providers) {
      console.log('Providers:', window.ethereum.providers.map(p => ({
        isMetaMask: p.isMetaMask,
        isCoinbaseWallet: p.isCoinbaseWallet
      })))
    }
    
    console.log('Other wallets:')
    console.log('  - Cardano:', !!window.cardano)
    console.log('  - Solana:', !!window.solana)
    console.log('  - Polkadot:', !!window.injectedWeb3)
    console.log('========================')
  }

  const testConnection = async () => {
    console.log('🧪 Testing direct connection...')
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      console.log('✅ Success! Accounts:', accounts)
      alert('✅ Connection successful!\n\nAccount: ' + accounts[0])
    } catch (err) {
      console.error('❌ Test failed:', err)
      alert('❌ Test failed:\n\n' + err.message)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border-2 border-gray-300 rounded-lg shadow-lg p-4 max-w-sm">
      <h3 className="font-bold text-gray-800 mb-3">🔧 Wallet Debug</h3>
      
      <div className="space-y-2 text-sm">
        <button
          onClick={checkWalletStatus}
          className="w-full px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
        >
          Check Wallet Status (Console)
        </button>
        
        <button
          onClick={testConnection}
          className="w-full px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-xs"
        >
          Test Direct Connection
        </button>
        
        <div className="text-xs text-gray-600 pt-2 border-t">
          Open DevTools Console (F12) to see detailed logs
        </div>
      </div>
    </div>
  )
}

export default WalletDebug
