import React, { useState } from 'react'
import { useWallet } from '../contexts/WalletContext'

const Settings = () => {
  const { account, disconnectWallet } = useWallet()
  const [activeTab, setActiveTab] = useState('account')

  const formatAddress = (address) => {
    return `${address.slice(0, 8)}...${address.slice(-6)}`
  }

  const tabs = [
    { id: 'account', label: 'Account' },
    { id: 'network', label: 'Network' },
    { id: 'preferences', label: 'Preferences' }
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary-700 mb-2">
          Settings
        </h1>
        <p className="text-primary-600">
          Manage your account preferences and application settings.
        </p>
      </div>

      <div className="card">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="md:w-64 mb-6 md:mb-0 md:mr-8">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-primary-500 hover:text-primary-600'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            {activeTab === 'account' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-primary-700">
                  Account Information
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-primary-700 mb-2">
                      Connected Wallet
                    </label>
                    <div className="flex items-center space-x-3 p-3 bg-primary-50 rounded-lg">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-mono text-primary-700">
                        {formatAddress(account)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary-700 mb-2">
                      Network
                    </label>
                    <div className="p-3 bg-primary-50 rounded-lg">
                      <span className="text-primary-700">Linea Testnet</span>
                    </div>
                  </div>

                  <button
                    onClick={disconnectWallet}
                    className="btn-secondary text-red-600 border-red-200 hover:bg-red-50"
                  >
                    Disconnect Wallet
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'network' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-primary-700">
                  Network Settings
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-primary-700 mb-2">
                      Current Network
                    </label>
                    <select className="input-field">
                      <option>Linea Testnet</option>
                      <option disabled>Ethereum Mainnet (Coming Soon)</option>
                      <option disabled>Polygon Mainnet (Coming Soon)</option>
                    </select>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-blue-800 mb-1">
                      Network Information
                    </h4>
                    <p className="text-sm text-blue-700">
                      TrustLink is currently deployed on Linea Testnet for testing and demonstration purposes. 
                      Mainnet deployment will follow after thorough testing and security audits.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-primary-700">
                  Application Preferences
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-primary-700 mb-1">
                        Dark Mode
                      </label>
                      <p className="text-sm text-primary-500">
                        Switch between light and dark themes
                      </p>
                    </div>
                    <button className="btn-secondary text-sm">
                      Coming Soon
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-primary-700 mb-1">
                        Email Notifications
                      </label>
                      <p className="text-sm text-primary-500">
                        Receive updates about your agreements
                      </p>
                    </div>
                    <button className="btn-secondary text-sm">
                      Coming Soon
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-primary-700 mb-1">
                        Language
                      </label>
                      <p className="text-sm text-primary-500">
                        Choose your preferred language
                      </p>
                    </div>
                    <select className="input-field w-32" disabled>
                      <option>English</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* App Info */}
      <div className="card mt-6">
        <h3 className="text-lg font-semibold text-primary-700 mb-4">
          Application Information
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-primary-600">Version:</span>
            <span className="text-primary-700 ml-2">1.0.0</span>
          </div>
          <div>
            <span className="text-primary-600">License:</span>
            <span className="text-primary-700 ml-2">MIT</span>
          </div>
          <div>
            <span className="text-primary-600">Built for:</span>
            <span className="text-primary-700 ml-2">ETH Safari Hackathon 2025</span>
          </div>
          <div>
            <span className="text-primary-600">Track:</span>
            <span className="text-primary-700 ml-2">Aqua Protocol Bounty</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings