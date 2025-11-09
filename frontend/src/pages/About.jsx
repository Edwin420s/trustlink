import React from 'react'
import { Shield, Users, Eye, Code } from 'lucide-react'

const About = () => {
  const teamMembers = [
    {
      name: 'Edwin Mwiti',
      role: 'Project Lead & Developer',
      email: 'eduedwyn5@gmail.com'
    }
  ]

  const techStack = [
    {
      category: 'Frontend',
      items: ['React', 'Vite', 'Tailwind CSS', 'Ethers.js']
    },
    {
      category: 'Blockchain',
      items: ['Solidity', 'EVM', 'Linea Testnet', 'Smart Contracts']
    },
    {
      category: 'Infrastructure',
      items: ['Vercel', 'GitHub', 'Hardhat']
    }
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary-700 mb-4">
          About TrustLink
        </h1>
        <p className="text-xl text-primary-600 max-w-3xl mx-auto">
          Building digital trust through transparency, privacy, and permanent verification.
        </p>
      </div>

      {/* Mission Section */}
      <div className="card mb-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-bold text-primary-700 mb-4">
              Our Mission
            </h2>
            <p className="text-primary-600 mb-4">
              TrustLink was created to solve a fundamental problem in the digital age: 
              how can we trust digital documents and agreements when they can be so easily altered?
            </p>
            <p className="text-primary-600">
              We believe in a future where digital trust is accessible to everyone — 
              individuals, businesses, and institutions alike — without compromising privacy or relying on centralized authorities.
            </p>
          </div>
          <div className="bg-primary-50 rounded-xl p-8">
            <Shield className="h-12 w-12 text-primary-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-primary-700 text-center mb-2">
              Privacy First Design
            </h3>
            <p className="text-primary-600 text-center">
              Your documents never leave your device. We only record cryptographic proofs, ensuring complete privacy while providing undeniable verification.
            </p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="card mb-8">
        <h2 className="text-2xl font-bold text-primary-700 mb-6">
          How TrustLink Works
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-primary-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-primary-500" />
            </div>
            <h3 className="text-lg font-semibold text-primary-700 mb-2">
              Mutual Agreement
            </h3>
            <p className="text-primary-600 text-sm">
              Two or more parties agree to use TrustLink as their verification system, creating a foundation of trust.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-primary-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Code className="h-6 w-6 text-primary-500" />
            </div>
            <h3 className="text-lg font-semibold text-primary-700 mb-2">
              Proof Recording
            </h3>
            <p className="text-primary-600 text-sm">
              Documents are hashed locally and the fingerprint is permanently recorded on the blockchain.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-primary-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Eye className="h-6 w-6 text-primary-500" />
            </div>
            <h3 className="text-lg font-semibold text-primary-700 mb-2">
              Transparent Verification
            </h3>
            <p className="text-primary-600 text-sm">
              Anyone can verify document authenticity at any time, ensuring permanent and transparent trust.
            </p>
          </div>
        </div>
      </div>

      {/* Technology Stack */}
      <div className="card mb-8">
        <h2 className="text-2xl font-bold text-primary-700 mb-6">
          Technology Stack
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {techStack.map((stack, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold text-primary-700 mb-3">
                {stack.category}
              </h3>
              <ul className="space-y-2">
                {stack.items.map((item, idx) => (
                  <li key={idx} className="text-primary-600 text-sm">
                    • {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div className="card">
        <h2 className="text-2xl font-bold text-primary-700 mb-6">
          Project Team
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member, index) => (
            <div key={index} className="text-center">
              <div className="bg-primary-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary-500" />
              </div>
              <h3 className="text-lg font-semibold text-primary-700 mb-1">
                {member.name}
              </h3>
              <p className="text-primary-600 text-sm mb-2">
                {member.role}
              </p>
              <p className="text-primary-500 text-sm">
                {member.email}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Hackathon Info */}
      <div className="card mt-8">
        <h2 className="text-2xl font-bold text-primary-700 mb-4">
          ETH Safari Hackathon 2025
        </h2>
        <div className="space-y-4 text-primary-600">
          <p>
            TrustLink was developed for the ETH Safari Hackathon 2025 as part of the Aqua Protocol Bounty track.
          </p>
          <p>
            This project demonstrates how blockchain technology can be used to create practical, real-world solutions 
            that enhance digital trust and transparency while preserving user privacy.
          </p>
          <p>
            <strong>Track:</strong> Aqua Protocol Bounty<br />
            <strong>Focus:</strong> UI/UX Improvement & Real-World Verification Use Cases<br />
            <strong>Network:</strong> EVM-Compatible (Linea Testnet)
          </p>
        </div>
      </div>
    </div>
  )
}

export default About