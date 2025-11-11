import React from 'react'
import { Link } from 'react-router-dom'
import { Shield, CheckCircle, Users, Lock } from 'lucide-react'
import { useWallet } from '../contexts/WalletContext'

const Landing = () => {
  const { connectWallet, isConnected } = useWallet()

  const features = [
    {
      icon: CheckCircle,
      title: 'Document Authenticity',
      description: 'Prove when a document was created and confirm it has not been altered.'
    },
    {
      icon: Users,
      title: 'Mutual Agreements',
      description: 'Both parties agree to use the system, creating a foundation of trust.'
    },
    {
      icon: Lock,
      title: 'Complete Privacy',
      description: 'Your documents never leave your device. Only proof hashes are stored.'
    }
  ]

  const useCases = [
    {
      category: 'Business & Legal',
      examples: ['Contracts', 'NDAs', 'Agreements']
    },
    {
      category: 'Education',
      examples: ['Certificates', 'Transcripts', 'Diplomas']
    },
    {
      category: 'Media & Journalism',
      examples: ['Press Releases', 'Official Statements', 'Reports']
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-white py-12 sm:py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary-700 mb-4 sm:mb-6 leading-tight">
              A Better Way to Confirm<br className="hidden sm:block" /> What's Real
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-primary-600 mb-6 sm:mb-8 max-w-3xl mx-auto px-2 leading-relaxed">
              TrustLink helps individuals and organizations record and verify digital document authenticity privately and permanently.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              {isConnected ? (
                <Link to="/app" className="btn-primary text-base sm:text-lg px-6 sm:px-8 w-full sm:w-auto">
                  Go to Dashboard
                </Link>
              ) : (
                <button onClick={connectWallet} className="btn-primary text-base sm:text-lg px-6 sm:px-8 w-full sm:w-auto">
                  Get Started
                </button>
              )}
              <Link to="/about" className="btn-secondary text-base sm:text-lg px-6 sm:px-8 w-full sm:w-auto">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-12 sm:py-16 bg-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-700 mb-3 sm:mb-4">
              Why Trust Breaks Down Online
            </h2>
            <p className="text-base sm:text-lg text-primary-600 max-w-2xl mx-auto px-2">
              Digital documents can be easily changed, email timestamps aren't reliable proof, and there's no neutral space for trust.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-700 mb-4">
              Why Choose TrustLink
            </h2>
            <p className="text-base sm:text-lg text-primary-600 max-w-2xl mx-auto">
              Built on proven blockchain technology with privacy at its core
            </p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card-interactive text-center group">
                <div className="bg-primary-50 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                  <feature.icon className="h-7 w-7 sm:h-8 sm:w-8 text-primary-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-primary-700 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-primary-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div> 
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 sm:py-16 md:py-20 bg-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-700 mb-3 sm:mb-4">
              How It Works
            </h2>
            <p className="text-base sm:text-lg text-primary-600 max-w-2xl mx-auto">
              Three simple steps to permanent document verification
            </p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10 max-w-5xl mx-auto">
            <div className="relative">
              <div className="card text-center h-full">
                <div className="bg-primary-500 text-white w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 text-xl sm:text-2xl font-bold shadow-lg">
                  1
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-primary-700 mb-3">
                  Agree to Use TrustLink
                </h3>
                <p className="text-primary-600 text-sm leading-relaxed">
                  Both parties confirm they'll use this system for verification.
                </p>
              </div>
              {/* Connector line - hidden on mobile */}
              <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-primary-200 -z-10"></div>
            </div>
            <div className="relative">
              <div className="card text-center h-full">
                <div className="bg-primary-500 text-white w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 text-xl sm:text-2xl font-bold shadow-lg">
                  2
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-primary-700 mb-3">
                  Record a Proof
                </h3>
                <p className="text-primary-600 text-sm leading-relaxed">
                  Create a permanent record that your document existed.
                </p>
              </div>
              <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-primary-200 -z-10"></div>
            </div>
            <div className="card text-center h-full">
              <div className="bg-primary-500 text-white w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 text-xl sm:text-2xl font-bold shadow-lg">
                3
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-primary-700 mb-3">
                Verify Anytime
              </h3>
              <p className="text-primary-600 text-sm leading-relaxed">
                Confirm authenticity at any time without sharing data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-700 mb-3 sm:mb-4">
              Trusted by Professionals
            </h2>
            <p className="text-base sm:text-lg text-primary-600 max-w-2xl mx-auto">
              From businesses to educators, TrustLink serves diverse verification needs
            </p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {useCases.map((useCase, index) => (
              <div key={index} className="card-interactive text-center group">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-xl mb-4 group-hover:scale-110 transition-transform">
                  <CheckCircle className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-primary-700 mb-4">
                  {useCase.category}
                </h3>
                <ul className="space-y-2.5">
                  {useCase.examples.map((example, idx) => (
                    <li key={idx} className="text-primary-600 text-sm flex items-center justify-center">
                      <span className="w-1.5 h-1.5 bg-primary-400 rounded-full mr-2"></span>
                      {example}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 sm:py-20 md:py-24 bg-primary-700 overflow-hidden">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-2xl mb-6">
            <Shield className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 px-2 leading-tight">
            Ready to Build Trust in<br className="hidden sm:block" /> Your Digital Work?
          </h2>
          <p className="text-primary-50 text-base sm:text-lg md:text-xl mb-8 sm:mb-10 px-2 max-w-2xl mx-auto leading-relaxed">
            Join TrustLink today and start confirming what's real with confidence. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
            {isConnected ? (
              <Link to="/app" className="btn-secondary bg-white text-primary-700 hover:bg-primary-50 hover:scale-105 w-full sm:w-auto text-lg shadow-xl">
                Launch Dashboard →
              </Link>
            ) : (
              <>
                <button onClick={connectWallet} className="btn-secondary bg-white text-primary-700 hover:bg-primary-50 hover:scale-105 w-full sm:w-auto text-lg shadow-xl">
                  Get Started Free
                </button>
                <Link to="/about" className="text-white hover:text-primary-100 font-medium transition-colors text-lg">
                  Learn More →
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Landing