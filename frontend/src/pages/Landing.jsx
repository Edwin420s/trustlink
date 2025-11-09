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
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-primary-700 mb-6">
              A Better Way to Confirm What's Real
            </h1>
            <p className="text-xl text-primary-600 mb-8 max-w-3xl mx-auto">
              TrustLink helps individuals and organizations record and verify digital document authenticity — privately and permanently.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {isConnected ? (
                <Link to="/app" className="btn-primary text-lg px-8">
                  Go to Dashboard
                </Link>
              ) : (
                <button onClick={connectWallet} className="btn-primary text-lg px-8">
                  Get Started
                </button>
              )}
              <Link to="/about" className="btn-secondary text-lg px-8">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 bg-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary-700 mb-4">
              Why Trust Breaks Down Online
            </h2>
            <p className="text-lg text-primary-600 max-w-2xl mx-auto">
              Digital documents can be easily changed, email timestamps aren't reliable proof, and there's no neutral space for trust.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-primary-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-primary-500" />
                </div>
                <h3 className="text-xl font-semibold text-primary-700 mb-2">
                  {feature.title}
                </h3>
                <p className="text-primary-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary-700 mb-4">
              Simple. Private. Shared.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-primary-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-lg font-semibold text-primary-700 mb-2">
                Agree to Use TrustLink
              </h3>
              <p className="text-primary-600 text-sm">
                Both parties confirm they'll use this system for verification.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-lg font-semibold text-primary-700 mb-2">
                Record a Proof
              </h3>
              <p className="text-primary-600 text-sm">
                Create a permanent record that your document existed.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-lg font-semibold text-primary-700 mb-2">
                Verify Anytime
              </h3>
              <p className="text-primary-600 text-sm">
                Confirm authenticity at any time without sharing data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary-700 mb-4">
              Who It's For
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
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
      <section className="py-16 bg-primary-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Shield className="h-12 w-12 text-white mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Build Trust in Your Digital Work?
          </h2>
          <p className="text-primary-100 text-lg mb-8">
            Join TrustLink today and start confirming what's real with confidence.
          </p>
          {isConnected ? (
            <Link to="/app" className="btn-secondary bg-white text-primary-700 hover:bg-primary-50">
              Launch App
            </Link>
          ) : (
            <button onClick={connectWallet} className="btn-secondary bg-white text-primary-700 hover:bg-primary-50">
              Get Started
            </button>
          )}
        </div>
      </section>
    </div>
  )
}

export default Landing