import React, { useState, useEffect } from 'react'
import { Plus, Search } from 'lucide-react'
import { useWallet } from '../contexts/WalletContext'
import AgreementCard from '../components/AgreementCard'
import Modal from '../components/Modal'

const Agreements = () => {
  const { account, isConnected, provider } = useWallet()
  const [agreements, setAgreements] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newPartner, setNewPartner] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (isConnected) {
      loadAgreements()
    }
  }, [isConnected])

  const loadAgreements = async () => {
    // Mock data - in real app, fetch from contract
    setAgreements([
      {
        id: 1,
        initiator: account,
        partner: '0x7421d123456789abcdef123456789abcdef12345',
        isActive: true,
        createdAt: Math.floor(Date.now() / 1000) - 86400
      },
      {
        id: 2,
        initiator: '0x7421d123456789abcdef123456789abcdef12345',
        partner: account,
        isActive: false,
        createdAt: Math.floor(Date.now() / 1000) - 172800
      }
    ])
  }

  const createAgreement = async (partnerAddress) => {
    setIsLoading(true)
    try {
      // In real app: await createAgreement(contract, partnerAddress, signer)
      console.log('Creating agreement with:', partnerAddress)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Add mock agreement
      const newAgreement = {
        id: agreements.length + 1,
        initiator: account,
        partner: partnerAddress,
        isActive: false,
        createdAt: Math.floor(Date.now() / 1000)
      }
      
      setAgreements(prev => [newAgreement, ...prev])
      setIsModalOpen(false)
      setNewPartner('')
    } catch (error) {
      console.error('Error creating agreement:', error)
      alert('Failed to create agreement. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const acceptAgreement = async (agreementId) => {
    try {
      // In real app: await acceptAgreement(contract, agreementId, signer)
      console.log('Accepting agreement:', agreementId)
      
      // Update local state
      setAgreements(prev => 
        prev.map(ag => 
          ag.id === agreementId ? { ...ag, isActive: true } : ag
        )
      )
    } catch (error) {
      console.error('Error accepting agreement:', error)
      alert('Failed to accept agreement. Please try again.')
    }
  }

  const filteredAgreements = agreements.filter(agreement =>
    agreement.partner.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!isConnected) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card text-center">
          <h2 className="text-2xl font-bold text-primary-700 mb-4">
            Connect Your Wallet
          </h2>
          <p className="text-primary-600">
            Please connect your wallet to view and manage agreements.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary-700 mb-2">
            Agreements
          </h1>
          <p className="text-primary-600">
            Manage your trust agreements with other parties.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary mt-4 sm:mt-0"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Agreement
        </button>
      </div>

      {/* Search */}
      <div className="card mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary-400" />
          <input
            type="text"
            placeholder="Search by partner address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      {/* Agreements Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredAgreements.map((agreement) => (
          <AgreementCard
            key={agreement.id}
            agreement={agreement}
            onAccept={acceptAgreement}
            onView={(agreement) => console.log('View agreement:', agreement)}
          />
        ))}
      </div>

      {filteredAgreements.length === 0 && (
        <div className="card text-center py-12">
          <Users className="h-12 w-12 text-primary-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-primary-700 mb-2">
            No agreements found
          </h3>
          <p className="text-primary-600 mb-4">
            {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first agreement'}
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Agreement
          </button>
        </div>
      )}

      {/* Create Agreement Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Agreement"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-primary-700 mb-2">
              Partner Wallet Address
            </label>
            <input
              type="text"
              placeholder="0x..."
              value={newPartner}
              onChange={(e) => setNewPartner(e.target.value)}
              className="input-field"
            />
            <p className="text-sm text-primary-500 mt-1">
              Enter the wallet address of the person you want to create an agreement with.
            </p>
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              onClick={() => createAgreement(newPartner)}
              disabled={!newPartner || isLoading}
              className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating...' : 'Create Agreement'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Agreements