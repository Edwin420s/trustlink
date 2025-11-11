import React, { useState, useEffect } from 'react'
import { Search, ExternalLink, FileCheck } from 'lucide-react'
import { useContracts } from '../hooks/useContracts'
import { formatHash } from '../utils/hashFile'
import { formatDate } from '../utils/formatDate'
import { CONTRACT_ADDRESSES, NETWORK_CONFIG } from '../utils/constants'

/**
 * PublicRegistry Page
 * Browse publicly visible proofs from the TrustLinkRegistry
 */
const PublicRegistry = () => {
  const { contracts } = useContracts()
  const [searchAddress, setSearchAddress] = useState('')
  const [publicProofs, setPublicProofs] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedProof, setSelectedProof] = useState(null)

  const handleSearch = async () => {
    if (!contracts.core || !searchAddress) return

    setLoading(true)
    try {
      // Connect to TrustLinkRegistry
      const registryAddress = CONTRACT_ADDRESSES.trustLinkRegistry
      if (!registryAddress) {
        alert('Registry contract not configured')
        return
      }

      const registryAbi = [
        "function getUserPublicProofs(address user) external view returns (bytes32[])",
        "function verifyPublicProof(bytes32 documentHash) external view returns (bool, uint256, uint256, address)"
      ]

      const registry = new ethers.Contract(
        registryAddress,
        registryAbi,
        contracts.core.provider
      )

      // Get public proof hashes for address
      const hashes = await registry.getUserPublicProofs(searchAddress)

      // Fetch details for each hash
      const proofDetails = await Promise.all(
        hashes.map(async (hash) => {
          const [verified, timestamp, agreementId, submittedBy] = 
            await registry.verifyPublicProof(hash)
          
          return {
            hash,
            verified,
            timestamp: Number(timestamp),
            agreementId: Number(agreementId),
            submittedBy
          }
        })
      )

      setPublicProofs(proofDetails.filter(p => p.verified))
    } catch (error) {
      console.error('Failed to fetch public proofs:', error)
      alert('Failed to load public proofs: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const viewProofDetails = async (proof) => {
    setSelectedProof(proof)
  }

  return (
    <div className="public-registry-page">
      <div className="page-header">
        <h1>Public Registry</h1>
        <p>Browse publicly verifiable proofs</p>
      </div>

      <div className="registry-search">
        <div className="search-box">
          <input
            type="text"
            placeholder="Enter address to view their public proofs..."
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="search-input"
          />
          <button 
            onClick={handleSearch} 
            disabled={loading}
            className="btn btn-primary"
          >
            <Search size={18} />
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {publicProofs.length > 0 && (
        <div className="registry-results">
          <h3>
            <FileCheck size={20} />
            {publicProofs.length} Public {publicProofs.length === 1 ? 'Proof' : 'Proofs'}
          </h3>

          <div className="proofs-grid">
            {publicProofs.map((proof, index) => (
              <div key={index} className="proof-card public">
                <div className="proof-header">
                  <span className="badge badge-success">Public</span>
                  <span className="proof-date">{formatDate(proof.timestamp)}</span>
                </div>

                <div className="proof-body">
                  <div className="proof-field">
                    <label>Document Hash:</label>
                    <code className="monospace">{formatHash(proof.hash)}</code>
                  </div>

                  <div className="proof-field">
                    <label>Agreement ID:</label>
                    <span>#{proof.agreementId}</span>
                  </div>

                  <div className="proof-field">
                    <label>Submitted By:</label>
                    <code className="monospace">{formatHash(proof.submittedBy, 6)}</code>
                  </div>
                </div>

                <div className="proof-actions">
                  <button 
                    onClick={() => viewProofDetails(proof)}
                    className="btn btn-sm btn-secondary"
                  >
                    View Details
                  </button>
                  <a
                    href={`${NETWORK_CONFIG.blockExplorer}/address/${proof.submittedBy}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-link"
                  >
                    <ExternalLink size={14} />
                    Explorer
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {publicProofs.length === 0 && searchAddress && !loading && (
        <div className="empty-state">
          <FileCheck size={64} className="text-gray-400" />
          <h3>No Public Proofs</h3>
          <p>This address has not made any proofs publicly visible.</p>
        </div>
      )}

      {!searchAddress && !loading && (
        <div className="empty-state">
          <Search size={64} className="text-gray-400" />
          <h3>Search for Public Proofs</h3>
          <p>Enter an address to view their publicly verifiable documents.</p>
        </div>
      )}

      {selectedProof && (
        <div className="modal-overlay" onClick={() => setSelectedProof(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Proof Details</h3>
            <div className="proof-details-modal">
              <div className="detail-row">
                <span className="label">Document Hash:</span>
                <code className="value monospace">{selectedProof.hash}</code>
              </div>
              <div className="detail-row">
                <span className="label">Timestamp:</span>
                <span className="value">{formatDate(selectedProof.timestamp)}</span>
              </div>
              <div className="detail-row">
                <span className="label">Agreement ID:</span>
                <span className="value">#{selectedProof.agreementId}</span>
              </div>
              <div className="detail-row">
                <span className="label">Submitted By:</span>
                <code className="value monospace">{selectedProof.submittedBy}</code>
              </div>
              <div className="detail-row">
                <span className="label">Visibility:</span>
                <span className="badge badge-success">Public</span>
              </div>
            </div>
            <button onClick={() => setSelectedProof(null)} className="btn btn-primary">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default PublicRegistry
