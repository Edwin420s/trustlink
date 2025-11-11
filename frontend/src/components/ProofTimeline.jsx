import React from 'react'
import { CheckCircle, Clock, FileCheck, UserPlus, XCircle } from 'lucide-react'
import { formatDate } from '../utils/formatDate'

/**
 * ProofTimeline Component
 * Visual timeline showing agreement creation → activation → proof recording
 */
const ProofTimeline = ({ agreement, proof }) => {
  if (!agreement) return null

  const events = []

  // Agreement created
  events.push({
    type: 'created',
    timestamp: agreement.createdAt,
    title: 'Agreement Created',
    description: `Initiated by ${agreement.initiator.slice(0, 8)}...`,
    icon: <UserPlus size={20} />,
    completed: true
  })

  // Agreement accepted
  if (agreement.isActive) {
    events.push({
      type: 'accepted',
      timestamp: agreement.acceptedAt || agreement.createdAt,
      title: 'Agreement Activated',
      description: `Accepted by ${agreement.partner.slice(0, 8)}...`,
      icon: <CheckCircle size={20} />,
      completed: true
    })
  }

  // Proof recorded
  if (proof) {
    events.push({
      type: 'proof',
      timestamp: proof.timestamp,
      title: 'Proof Recorded',
      description: `Document verified at this time`,
      icon: <FileCheck size={20} />,
      completed: true
    })

    // Bilateral acknowledgement
    if (proof.requiresBilateralAck) {
      events.push({
        type: 'ack',
        timestamp: proof.acknowledgedAt || null,
        title: 'Partner Acknowledgement',
        description: proof.acknowledgedByPartner 
          ? 'Confirmed by partner' 
          : 'Awaiting confirmation',
        icon: proof.acknowledgedByPartner ? <CheckCircle size={20} /> : <Clock size={20} />,
        completed: proof.acknowledgedByPartner
      })
    }

    // Revoked
    if (proof.isRevoked) {
      events.push({
        type: 'revoked',
        timestamp: proof.revokedAt || proof.timestamp,
        title: 'Proof Revoked',
        description: 'Proof was revoked by participants',
        icon: <XCircle size={20} />,
        completed: true,
        isNegative: true
      })
    }
  }

  return (
    <div className="proof-timeline">
      <h3 className="timeline-title">Verification History</h3>
      <div className="timeline-container">
        {events.map((event, index) => (
          <div 
            key={index} 
            className={`timeline-event ${event.completed ? 'completed' : 'pending'} ${event.isNegative ? 'negative' : ''}`}
          >
            <div className="timeline-marker">
              <div className="marker-icon">{event.icon}</div>
              {index < events.length - 1 && <div className="marker-line" />}
            </div>
            <div className="timeline-content">
              <h4 className="event-title">{event.title}</h4>
              <p className="event-description">{event.description}</p>
              {event.timestamp && (
                <span className="event-time">{formatDate(event.timestamp)}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProofTimeline
