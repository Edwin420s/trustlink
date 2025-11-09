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
      <section className="bg-white py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary-700 mb-4 sm:mb-6 leading-tight">
              A Better Way to Confirm What's Real
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-primary-600 mb-6 sm:mb-8 max-w-3xl mx-auto px-2">
              TrustLink helps individuals and organizations record and verify digital document authenticity — privately and permanently.
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
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-4">
                <div className="bg-primary-50 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <feature.icon className="h-7 w-7 sm:h-8 sm:w-8 text-primary-500" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-primary-700 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-primary-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 sm:py-16 bg-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-700 mb-3 sm:mb-4">
              Simple. Private. Shared.
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-primary-500 text-white w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 text-lg sm:text-xl font-bold">
                1
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-primary-700 mb-2">
                Agree to Use TrustLink
              </h3>
              <p className="text-primary-600 text-sm px-2">
                Both parties confirm they'll use this system for verification.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-500 text-white w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 text-lg sm:text-xl font-bold">
                2
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-primary-700 mb-2">
                Record a Proof
              </h3>
              <p className="text-primary-600 text-sm px-2">
                Create a permanent record that your document existed.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-500 text-white w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 text-lg sm:text-xl font-bold">
                3
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-primary-700 mb-2">
                Verify Anytime
              </h3>
              <p className="text-primary-600 text-sm px-2">
                Confirm authenticity at any time without sharing data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-700 mb-3 sm:mb-4">
              Who It's For
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
            {useCases.map((useCase, index) => (
              <div key={index} className="card text-center">
                <h3 className="text-lg font-semibold text-primary-700 mb-3">
                  {useCase.category}
                </h3>
                <ul className="space-y-2">
                  {useCase.examples.map((example, idx) => (
                    <li key={idx} className="text-primary-600 text-sm">
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
      <section className="py-12 sm:py-16 md:py-20 bg-primary-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Shield className="h-10 w-10 sm:h-12 sm:w-12 text-white mx-auto mb-3 sm:mb-4" />
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4 px-2">
            Ready to Build Trust in Your Digital Work?
          </h2>
          <p className="text-primary-100 text-base sm:text-lg mb-6 sm:mb-8 px-2">
            Join TrustLink today and start confirming what's real with confidence.
          </p>
          {isConnected ? (
            <Link to="/app" className="btn-secondary bg-white text-primary-700 hover:bg-primary-50 inline-block w-full sm:w-auto">
              Launch App
            </Link>
          ) : (
            <button onClick={connectWallet} className="btn-secondary bg-white text-primary-700 hover:bg-primary-50 w-full sm:w-auto">
              Get Started
            </button>
          )}
        </div>
      </section>
    </div>
  )
}

export default Landing