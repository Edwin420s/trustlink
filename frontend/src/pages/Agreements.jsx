import React, { useState, useEffect } from 'react'
import { Plus, Search, Users } from 'lucide-react'
import { useWallet } from '../contexts/WalletContext'
import AgreementCard from '../components/AgreementCard'
import Modal from '../components/Modal'
import { useContracts } from '../hooks/useContracts'
import { getTrustLinkContract } from '../utils/contract'
import { CONTRACT_ADDRESSES } from '../utils/constants'

const Agreements = () => {
  const { account, isConnected, provider } = useWallet()
  const { createNewAgreement, acceptExistingAgreement } = useContracts()
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
    try {
      if (!CONTRACT_ADDRESSES.trustLinkCore) return
      let browserProvider = provider
      if (!browserProvider && typeof window !== 'undefined' && window.ethereum) {
        const { ethers } = await import('ethers')
        browserProvider = new ethers.BrowserProvider(window.ethereum)
      }
      if (!browserProvider) return
      const contract = getTrustLinkContract(browserProvider, CONTRACT_ADDRESSES.trustLinkCore)
      const ids = await contract.getUserAgreements(account)
      const items = []
      for (const id of ids) {
        const ag = await contract.getAgreement(id)
        items.push({
          id: Number(ag.id ?? id),
          initiator: ag.initiator,
          partner: ag.partner,
          isActive: ag.isActive,
          createdAt: Number(ag.createdAt)
        })
      }
      items.sort((a,b)=>b.createdAt - a.createdAt)
      setAgreements(items)
    } catch (e) {
      console.error('Failed to load agreements:', e)
    }
  }

  const createAgreement = async (partnerAddress) => {
    setIsLoading(true)
    try {
      await createNewAgreement(partnerAddress)
      await loadAgreements()
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
      await acceptExistingAgreement(agreementId)
      await loadAgreements()
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