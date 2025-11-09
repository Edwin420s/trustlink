import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, FileCheck, Shield } from 'lucide-react'
import { useWallet } from '../contexts/WalletContext'

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { account, connectWallet, disconnectWallet, isConnected } = useWallet()
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
    <nav className="bg-white shadow-sm border-b border-primary-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-primary-500" />
              <span className="text-xl font-semibold text-primary-700">
                TrustLink
              </span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {(isAppPage ? appNavItems : navItems).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-primary-500 hover:text-primary-600'
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* Wallet connection */}
            <div className="flex items-center space-x-4">
              {isConnected ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 bg-primary-50 px-3 py-2 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-primary-700">
                      {formatAddress(account)}
                    </span>
                  </div>
                  <button
                    onClick={disconnectWallet}
                    className="text-sm text-primary-500 hover:text-primary-600"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={connectWallet}
                  className="btn-primary text-sm"
                  disabled={isConnecting}
                >
                  {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                </button>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-primary-500 hover:text-primary-600"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-primary-100">
            <div className="flex flex-col space-y-3">
              {(isAppPage ? appNavItems : navItems).map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === item.path
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-primary-500 hover:text-primary-600'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Mobile wallet connection */}
              <div className="pt-4 border-t border-primary-100">
                {isConnected ? (
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-primary-700">
                        {formatAddress(account)}
                      </span>
                    </div>
                    <button
                      onClick={disconnectWallet}
                      className="text-left text-sm text-primary-500 hover:text-primary-600"
                    >
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={connectWallet}
                    className="btn-primary w-full"
                    disabled={isConnecting}
                  >
                    {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navigation