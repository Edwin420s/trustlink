import React from 'react'
import { CheckCircle, XCircle, AlertCircle, Clock, FileCheck, ShieldX } from 'lucide-react'
import { formatHash } from '../utils/hashFile'
import { formatDate } from '../utils/formatDate'

/**
 * VerificationResult Component
 * Displays verification results with clear trust states
 */
const VerificationResult = ({ result, onCopy, explorerUrl }) => {
  if (!result) return null

  const renderState = () => {
    // Not found
    if (!result.exists) {
      return (
        <div className="verification-result not-found">
          <div className="result-icon">
            <XCircle size={48} className="text-red-500" />
          </div>
          <h3 className="result-title">No Record Found</h3>
          <p className="result-description">
            This document has no verification record in TrustLink.
            It may never have been registered, or the hash doesn't match.
          </p>
        </div>
      )
    }

    // Revoked
    if (result.isRevoked) {
      return (
        <div className="verification-result revoked">
          <div className="result-icon">
            <ShieldX size={48} className="text-orange-500" />
          </div>
          <h3 className="result-title">Proof Revoked</h3>
          <p className="result-description">
            This proof was revoked by the participants.
            The document was recorded but is no longer considered valid.
          </p>
          {renderDetails()}
        </div>
      )
    }

    // Awaiting acknowledgement
    if (result.requiresBilateralAck && !result.acknowledgedByPartner) {
      return (
        <div className="verification-result pending">
          <div className="result-icon">
            <Clock size={48} className="text-yellow-500" />
          </div>
          <h3 className="result-title">Awaiting Partner Acknowledgement</h3>
          <p className="result-description">
            This proof was recorded but requires confirmation from the partner.
            It will be fully verified once acknowledged by both parties.
          </p>
          {renderDetails()}
        </div>
      )
    }

    // Inactive agreement
    if (!result.agreementActive) {
      return (
        <div className="verification-result inactive">
          <div className="result-icon">
            <AlertCircle size={48} className="text-amber-500" />
          </div>
          <h3 className="result-title">Agreement Inactive</h3>
          <p className="result-description">
            This proof exists but the associated agreement is no longer active.
            The proof was recorded at the time shown below.
          </p>
          {renderDetails()}
        </div>
      )
    }

    // Fully verified
    return (
      <div className="verification-result verified">
        <div className="result-icon">
          <CheckCircle size={48} className="text-green-500" />
        </div>
        <h3 className="result-title">Document Verified</h3>
        <p className="result-description">
          ✅ <strong>This document was confirmed</strong> on the date shown below.
          <br />
          <strong>This means:</strong> The exact file existed at that time and is linked to Agreement #{result.agreementId}.
          <br />
          <strong>This does NOT mean:</strong> The contents are factually correct or legally binding without review.
        </p>
        {renderDetails()}
      </div>
    )
  }

  const renderDetails = () => (
    <div className="verification-details">
      <div className="detail-row">
        <span className="detail-label">Document Hash:</span>
        <span className="detail-value monospace">
          {formatHash(result.documentHash)}
          <button 
            onClick={() => onCopy(result.documentHash)}
            className="copy-btn"
            title="Copy full hash"
          >
            📋
          </button>
        </span>
      </div>

      <div className="detail-row">
        <span className="detail-label">Recorded:</span>
        <span className="detail-value">
          {formatDate(result.timestamp)}
        </span>
      </div>

      <div className="detail-row">
        <span className="detail-label">Submitted By:</span>
        <span className="detail-value monospace">
          {formatHash(result.submittedBy, 6)}
        </span>
      </div>

      <div className="detail-row">
        <span className="detail-label">Agreement ID:</span>
        <span className="detail-value">
          #{result.agreementId}
        </span>
      </div>

      {result.requiresBilateralAck && (
        <div className="detail-row">
          <span className="detail-label">Status:</span>
          <span className="detail-value">
            {result.acknowledgedByPartner ? (
              <span className="badge badge-success">
                <FileCheck size={14} /> Acknowledged by partner
              </span>
            ) : (
              <span className="badge badge-warning">
                <Clock size={14} /> Pending acknowledgement
              </span>
            )}
          </span>
        </div>
      )}

      {explorerUrl && (
        <div className="detail-row">
          <a 
            href={`${explorerUrl}/tx/${result.transactionHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="explorer-link"
          >
            View on Block Explorer →
          </a>
        </div>
      )}
    </div>
  )

  return (
    <div className="verification-result-container">
      {renderState()}
    </div>
  )
}

export default VerificationResult
