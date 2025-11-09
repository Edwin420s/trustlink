import React from 'react'
import { Link } from 'react-router-dom'
import { Shield, Github, Mail, ExternalLink } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-primary-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Shield className="h-8 w-8 text-white" />
              <span className="text-xl font-bold">TrustLink</span>
            </Link>
            <p className="text-primary-100 text-sm mb-4">
              A better way to confirm what's real. Record and verify digital document authenticity privately and permanently.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com/Edwin420s/trustlink"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-100 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="mailto:eduedwyn5@gmail.com"
                className="text-primary-100 hover:text-white transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-primary-100 hover:text-white text-sm transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/app" className="text-primary-100 hover:text-white text-sm transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-primary-100 hover:text-white text-sm transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/verify" className="text-primary-100 hover:text-white text-sm transition-colors">
                  Verify Document
                </Link>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-white font-semibold mb-4">Features</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/agreements" className="text-primary-100 hover:text-white text-sm transition-colors">
                  Agreements
                </Link>
              </li>
              <li>
                <Link to="/record-proof" className="text-primary-100 hover:text-white text-sm transition-colors">
                  Record Proof
                </Link>
              </li>
              <li>
                <Link to="/verify" className="text-primary-100 hover:text-white text-sm transition-colors">
                  Verify
                </Link>
              </li>
              <li>
                <Link to="/settings" className="text-primary-100 hover:text-white text-sm transition-colors">
                  Settings
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com/Edwin420s/trustlink"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-100 hover:text-white text-sm transition-colors inline-flex items-center gap-1"
                >
                  Documentation
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://metamask.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-100 hover:text-white text-sm transition-colors inline-flex items-center gap-1"
                >
                  Get MetaMask
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://linea.build"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-100 hover:text-white text-sm transition-colors inline-flex items-center gap-1"
                >
                  Linea Network
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="mailto:eduedwyn5@gmail.com"
                  className="text-primary-100 hover:text-white text-sm transition-colors"
                >
                  Contact Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-primary-600">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-primary-100 text-sm text-center sm:text-left">
              <p>© {currentYear} TrustLink. Built for ETH Safari Hackathon 2025.</p>
              <p className="mt-1">Created by Edwin Mwiti</p>
            </div>
            <div className="flex flex-wrap justify-center sm:justify-end gap-4 text-sm">
              <span className="text-primary-100">Powered by Linea</span>
              <span className="text-primary-200">•</span>
              <a
                href="https://github.com/Edwin420s/trustlink/blob/main/LICENSE"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-100 hover:text-white transition-colors"
              >
                MIT License
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
