import React, { useState } from 'react'
import { Search, CheckCircle, XCircle, Clock } from 'lucide-react'
import { useWallet } from '../contexts/WalletContext'
import FileUploader from '../components/FileUploader'
import { hashFile } from '../utils/hashFile'

const Verify = () => {
  const { isConnected } = useWallet()
  const [selectedFile, setSelectedFile] = useState(null)
  const [verificationResult, setVerificationResult] = useState(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [manualHash, setManualHash] = useState('')

  const handleFileSelect = (file) => {
    setSelectedFile(file)
    setVerificationResult(null)
    setManualHash('')
  }

  const verifyProof = async () => {
    let fileHash

    if (selectedFile) {
      fileHash = await hashFile(selectedFile)
    } else if (manualHash) {
      fileHash = manualHash.startsWith('0x') ? manualHash : '0x' + manualHash
    } else {
      alert('Please provide a file or hash to verify')
      return
    }

    setIsVerifying(true)
    try {
      // In real app: const result = await verifyProof(contract, fileHash)
      // Mock verification
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simulate different results
      const mockResults = [
        {
          exists: true,
          timestamp: Math.floor(Date.now() / 1000) - 86400,
          agreementId: 1,
          submittedBy: '0x7421d123456789abcdef123456789abcdef12345'
        },
        {
          exists: false,
          timestamp: 0,
          agreementId: 0,
          submittedBy: '0x0000000000000000000000000000000000000000'
        }
      ]
      
      const result = Math.random() > 0.3 ? mockResults[0] : mockResults[1]
      setVerificationResult(result)
    } catch (error) {
      console.error('Error verifying proof:', error)
      alert('Failed to verify proof. Please try again.')
    } finally {
      setIsVerifying(false)
    }
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A'
    return new Date(timestamp * 1000).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatAddress = (address) => {
    if (!address || address === '0x0000000000000000000000000000000000000000') return 'N/A'
    return `${address.slice(0, 8)}...${address.slice(-6)}`
  }

  const resetForm = () => {
    setSelectedFile(null)
    setVerificationResult(null)
    setManualHash('')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary-700 mb-2">
          Verify Document
        </h1>
        <p className="text-primary-600">
          Confirm the authenticity of any document by uploading it or entering its proof hash.
        </p>
      </div>

      {!verificationResult ? (
        /* Verification Form */
        <div className="card">
          <div className="space-y-6">
            {/* File Upload Option */}
            <div>
              <label className="block text-sm font-medium text-primary-700 mb-2">
                Upload Document to Verify
              </label>
              <FileUploader
                onFileSelect={handleFileSelect}
                acceptedFileTypes="*"
              />
            </div>

            {/* OR Separator */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-primary-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-primary-500">Or</span>
              </div>
            </div>

            {/* Manual Hash Input */}
            <div>
              <label className="block text-sm font-medium text-primary-700 mb-2">
                Enter Proof Hash Manually
              </label>
              <input
                type="text"
                placeholder="0x..."
                value={manualHash}
                onChange={(e) => {
                  setManualHash(e.target.value)
                  setSelectedFile(null)
                  setVerificationResult(null)
                }}
                className="input-field font-mono"
              />
            </div>

            {/* Verify Button */}
            <button
              onClick={verifyProof}
              disabled={(!selectedFile && !manualHash) || isVerifying}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isVerifying ? (
                <>
                  <Clock className="h-5 w-5 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Search className="h-5 w-5 mr-2" />
                  Verify Document
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* Verification Result */
        <div className="card">
          <div className="text-center mb-6">
            {verificationResult.exists ? (
              <div className="bg-green-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            ) : (
              <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            )}
            
            <h2 className="text-2xl font-bold text-primary-700 mb-2">
              {verificationResult.exists ? 'Document Verified' : 'No Record Found'}
            </h2>
            <p className="text-primary-600">
              {verificationResult.exists 
                ? 'This document has been verified and recorded in our system.'
                : 'This document has not been recorded or the proof hash is invalid.'
              }
            </p>
          </div>

          {verificationResult.exists && (
            <div className="bg-primary-50 rounded-lg p-4 mb-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-primary-600">Recorded On:</span>
                  <span className="font-medium text-primary-700">
                    {formatDate(verificationResult.timestamp)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary-600">Agreement ID:</span>
                  <span className="font-medium text-primary-700">
                    #{verificationResult.agreementId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary-600">Submitted By:</span>
                  <span className="font-medium text-primary-700">
                    {formatAddress(verificationResult.submittedBy)}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="flex space-x-3">
            <button
              onClick={resetForm}
              className="btn-primary flex-1"
            >
              Verify Another Document
            </button>
          </div>
        </div>
      )}

      {/* Information Section */}
      <div className="card mt-6">
        <h3 className="text-lg font-semibold text-primary-700 mb-4">
          About Verification
        </h3>
        <div className="space-y-3 text-primary-600">
          <p>
            Verification checks if a document's unique fingerprint has been recorded in our system. 
            This confirms the document existed at a specific time and has not been altered.
          </p>
          <p>
            <strong>Note:</strong> Verification only confirms authenticity, not the content's accuracy or truthfulness.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Verify