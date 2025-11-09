import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, FileCheck, Shield } from 'lucide-react'
import { useWallet } from '../contexts/WalletContext'

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { account, connectWallet, disconnectWallet, isConnected, isConnecting } = useWallet()
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/app', label: 'Dashboard' },
    { path: '/about', label: 'About' }
  ]

  const appNavItems = [
    { path: '/agreements', label: 'Agreements' },
    { path: '/record-proof', label: 'Record Proof' },
    { path: '/verify', label: 'Verify' },
    { path: '/settings', label: 'Settings' }
  ]

  const isAppPage = location.pathname !== '/' && location.pathname !== '/about'

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <nav className="bg-white shadow-sm border-b border-primary-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main navigation row */}
        <div className="flex justify-between items-center h-16">
          {/* Logo and brand */}
          <div className="flex items-center flex-shrink-0 mr-2 sm:mr-4">
            <Link to="/" className="flex items-center space-x-1.5 sm:space-x-2">
              <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-primary-500" />
              <span className="text-sm sm:text-xl font-semibold text-primary-700">
                TrustLink
              </span>
            </Link>
          </div>

          {/* Desktop & Mobile Navigation */}
          <div className="flex items-center space-x-1 sm:space-x-3 md:space-x-6">
            {/* Show only 3 main nav items on mobile, all on desktop */}
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-1.5 sm:px-3 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-primary-500 hover:text-primary-600'
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* Wallet connection - Compact on mobile */}
            <div className="flex items-center">
              {isConnected ? (
                <div className="flex items-center space-x-1 sm:space-x-3">
                  <div className="hidden sm:flex items-center space-x-2 bg-primary-50 px-3 py-2 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-primary-700">
                      {formatAddress(account)}
                    </span>
                  </div>
                  {/* Mobile: Just show indicator */}
                  <div className="sm:hidden w-2 h-2 bg-green-500 rounded-full"></div>
                  <button
                    onClick={disconnectWallet}
                    className="text-xs sm:text-sm text-primary-500 hover:text-primary-600 px-2 sm:px-0"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={connectWallet}
                  className="btn-primary text-xs sm:text-sm px-2 sm:px-4 py-1.5 sm:py-2 whitespace-nowrap"
                  disabled={isConnecting}
                >
                  {isConnecting ? 'Connecting...' : 'Connect'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation