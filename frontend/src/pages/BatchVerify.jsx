import React, { useState } from 'react'
import { Upload, FileText, CheckCircle, XCircle } from 'lucide-react'
import { useContracts } from '../hooks/useContracts'
import { formatHash } from '../utils/hashFile'

/**
 * BatchVerify Page
 * Verify multiple document hashes at once
 */
const BatchVerify = () => {
  const { contracts } = useContracts()
  const [hashList, setHashList] = useState('')
  const [results, setResults] = useState([])
  const [isVerifying, setIsVerifying] = useState(false)

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setHashList(event.target.result)
      }
      reader.readAsText(file)
    }
  }

  const parseHashes = (text) => {
    return text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && line.startsWith('0x'))
  }

  const handleBatchVerify = async () => {
    if (!contracts.core) {
      alert('Contract not connected')
      return
    }

    const hashes = parseHashes(hashList)
    if (hashes.length === 0) {
      alert('No valid hashes found')
      return
    }

    if (hashes.length > 50) {
      alert('Maximum 50 hashes per batch')
      return
    }

    setIsVerifying(true)
    setResults([])

    try {
      // Use the batch verify from ProofVerifier if available
      // For now, verify one by one
      const verificationPromises = hashes.map(async (hash) => {
        try {
          const [exists, timestamp, agreementId, submittedBy] = 
            await contracts.core.verifyProof(hash)
          
          return {
            hash,
            exists,
            timestamp: timestamp ? Number(timestamp) : null,
            agreementId: agreementId ? Number(agreementId) : null,
            submittedBy,
            error: null
          }
        } catch (error) {
          return {
            hash,
            exists: false,
            error: error.message
          }
        }
      })

      const verificationResults = await Promise.all(verificationPromises)
      setResults(verificationResults)
    } catch (error) {
      console.error('Batch verification failed:', error)
      alert('Verification failed: ' + error.message)
    } finally {
      setIsVerifying(false)
    }
  }

  const exportResults = () => {
    const csv = [
      'Hash,Exists,Timestamp,AgreementID,SubmittedBy',
      ...results.map(r => 
        `${r.hash},${r.exists},${r.timestamp || ''},${r.agreementId || ''},${r.submittedBy || ''}`
      )
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `trustlink-batch-verification-${Date.now()}.csv`
    a.click()
  }

  const stats = results.length > 0 ? {
    total: results.length,
    verified: results.filter(r => r.exists).length,
    notFound: results.filter(r => !r.exists).length
  } : null

  return (
    <div className="batch-verify-page">
      <div className="page-header">
        <h1>Batch Verification</h1>
        <p>Verify multiple document hashes at once</p>
      </div>

      <div className="batch-input-section">
        <div className="input-methods">
          <div className="method">
            <h3>
              <FileText size={20} />
              Paste Hashes
            </h3>
            <textarea
              value={hashList}
              onChange={(e) => setHashList(e.target.value)}
              placeholder="Enter document hashes (one per line)&#10;0x1234...&#10;0x5678...&#10;0xabcd..."
              rows={10}
              className="hash-textarea"
            />
          </div>

          <div className="method">
            <h3>
              <Upload size={20} />
              Upload Text File
            </h3>
            <div className="file-upload-area">
              <input
                type="file"
                accept=".txt"
                onChange={handleFileUpload}
                id="hash-file"
                className="file-input"
              />
              <label htmlFor="hash-file" className="file-upload-label">
                <FileText size={32} />
                <span>Click to upload .txt file</span>
                <small>One hash per line</small>
              </label>
            </div>
          </div>
        </div>

        <button
          onClick={handleBatchVerify}
          disabled={isVerifying || !hashList.trim()}
          className="btn btn-primary btn-lg"
        >
          {isVerifying ? 'Verifying...' : `Verify ${parseHashes(hashList).length} Hashes`}
        </button>
      </div>

      {stats && (
        <div className="batch-stats">
          <div className="stat-card">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Checked</div>
          </div>
          <div className="stat-card success">
            <div className="stat-value">{stats.verified}</div>
            <div className="stat-label">Verified</div>
          </div>
          <div className="stat-card error">
            <div className="stat-value">{stats.notFound}</div>
            <div className="stat-label">Not Found</div>
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div className="batch-results">
          <div className="results-header">
            <h3>Verification Results</h3>
            <button onClick={exportResults} className="btn btn-secondary">
              Export CSV
            </button>
          </div>

          <div className="results-table">
            <table>
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Document Hash</th>
                  <th>Agreement ID</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, index) => (
                  <tr key={index} className={result.exists ? 'verified' : 'not-found'}>
                    <td>
                      {result.exists ? (
                        <CheckCircle size={20} className="text-green-500" />
                      ) : (
                        <XCircle size={20} className="text-red-500" />
                      )}
                    </td>
                    <td className="monospace">{formatHash(result.hash)}</td>
                    <td>{result.agreementId || '-'}</td>
                    <td>
                      {result.timestamp 
                        ? new Date(result.timestamp * 1000).toLocaleString()
                        : '-'
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default BatchVerify
