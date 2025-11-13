import React, { useState, useEffect } from 'react'
import { Upload, FileCheck, Calendar } from 'lucide-react'
import { useWallet } from '../contexts/WalletContext'
import FileUploader from '../components/FileUploader'
import { hashFile } from '../utils/hashFile'
import { getTrustLinkContract } from '../utils/contract'
import { CONTRACT_ADDRESSES } from '../utils/constants'
import { useContracts } from '../hooks/useContracts'

const RecordProof = () => {
  const { account, isConnected, provider } = useWallet()
  const { recordDocumentProof } = useContracts()

  const [selectedFile, setSelectedFile] = useState(null)
  const [selectedAgreement, setSelectedAgreement] = useState('')
  const [agreements, setAgreements] = useState([])
  const [isRecording, setIsRecording] = useState(false)
  const [recordedProof, setRecordedProof] = useState(null)

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
        items.push({ id: Number(ag.id ?? id), partner: ag.initiator.toLowerCase() === account.toLowerCase() ? ag.partner : ag.initiator, isActive: ag.isActive })
      }
      setAgreements(items)
    } catch (e) {
      console.error('Failed to load agreements:', e)
    }
  }

  const handleFileSelect = (file) => {
    setSelectedFile(file)
    setRecordedProof(null)
  }

  const recordProof = async () => {
    if (!selectedFile || !selectedAgreement) {
      alert('Please select a file and an agreement')
      return
    }

    setIsRecording(true)
    try {
      // Hash the file locally
      const fileHash = await hashFile(selectedFile)
      await recordDocumentProof(Number(selectedAgreement), fileHash)
      setRecordedProof({ agreementId: Number(selectedAgreement), documentHash: fileHash, timestamp: Math.floor(Date.now() / 1000), fileName: selectedFile.name })
      
      // Reset form
      setSelectedFile(null)
      setSelectedAgreement('')
    } catch (error) {
      console.error('Error recording proof:', error)
      alert('Failed to record proof. Please try again.')
    } finally {
      setIsRecording(false)
    }
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!isConnected) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card text-center">
          <h2 className="text-2xl font-bold text-primary-700 mb-4">
            Connect Your Wallet
          </h2>
          <p className="text-primary-600">
            Please connect your wallet to record document proofs.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary-700 mb-2">
          Record Proof
        </h1>
        <p className="text-primary-600">
          Create a permanent record of your document under an active agreement.
        </p>
      </div>

      {recordedProof ? (
        /* Success State */
        <div className="card text-center">
          <div className="bg-green-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileCheck className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-primary-700 mb-2">
            Proof Recorded Successfully
          </h2>
          <p className="text-primary-600 mb-6">
            Your document proof has been permanently recorded on the network.
          </p>
          
          <div className="bg-primary-50 rounded-lg p-4 text-left max-w-md mx-auto mb-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-primary-600">File:</span>
                <span className="font-medium text-primary-700">{recordedProof.fileName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-primary-600">Agreement:</span>
                <span className="font-medium text-primary-700">#{recordedProof.agreementId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-primary-600">Timestamp:</span>
                <span className="font-medium text-primary-700">{formatDate(recordedProof.timestamp)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-primary-600">Proof Hash:</span>
                <span className="font-medium text-primary-700 text-sm">
                  {recordedProof.documentHash.slice(0, 16)}...
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3 justify-center">
            <button
              onClick={() => setRecordedProof(null)}
              className="btn-primary"
            >
              Record Another Proof
            </button>
          </div>
        </div>
      ) : (
        /* Recording Form */
        <div className="card">
          <div className="space-y-6">
            {/* Agreement Selection */}
            <div>
              <label className="block text-sm font-medium text-primary-700 mb-2">
                Select Agreement
              </label>
              <select
                value={selectedAgreement}
                onChange={(e) => setSelectedAgreement(e.target.value)}
                className="input-field"
              >
                <option value="">Choose an agreement...</option>
                {agreements
                  .filter(ag => ag.isActive)
                  .map(agreement => (
                    <option key={agreement.id} value={agreement.id}>
                      Agreement #{agreement.id} with {agreement.partner.slice(0, 8)}...
                    </option>
                  ))
                }
              </select>
              <p className="text-sm text-primary-500 mt-1">
                Only active agreements are available for recording proofs.
              </p>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-primary-700 mb-2">
                Document to Record
              </label>
              <FileUploader
                onFileSelect={handleFileSelect}
                acceptedFileTypes=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
              />
              <p className="text-sm text-primary-500 mt-1">
                Your file stays private. Only a unique digital fingerprint is recorded.
              </p>
            </div>

            {/* Action Button */}
            <button
              onClick={recordProof}
              disabled={!selectedFile || !selectedAgreement || isRecording}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRecording ? (
                <>
                  <Upload className="h-5 w-5 mr-2 animate-pulse" />
                  Recording Proof...
                </>
              ) : (
                <>
                  <FileCheck className="h-5 w-5 mr-2" />
                  Record Proof
                </>
              )}
            </button>

            {/* Security Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-blue-800 mb-1">
                    Privacy First
                  </h4>
                  <p className="text-sm text-blue-700">
                    Your document never leaves your device. We only record a cryptographic fingerprint that proves the document existed at this moment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RecordProof