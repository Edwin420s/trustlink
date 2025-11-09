import React from 'react'
import { User, Calendar, CheckCircle, Clock } from 'lucide-react'

const AgreementCard = ({ agreement, onAccept, onView }) => {
  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatAddress = (address) => {
    return `${address.slice(0, 8)}...${address.slice(-6)}`
  }

  const getStatusConfig = (agreement) => {
    if (agreement.isActive) {
      return {
        icon: CheckCircle,
        text: 'Active',
        color: 'text-green-600',
        bgColor: 'bg-green-50'
      }
    } else if (agreement.partner && !agreement.isActive) {
      return {
        icon: Clock,
        text: 'Pending',
        color: 'text-amber-600',
        bgColor: 'bg-amber-50'
      }
    } else {
      return {
        icon: Clock,
        text: 'Waiting',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50'
      }
    }
  }

  const statusConfig = getStatusConfig(agreement)

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary-50 rounded-lg">
            <User className="h-5 w-5 text-primary-500" />
          </div>
          <div>
            <p className="font-medium text-primary-700">
              Agreement #{agreement.id.toString()}
            </p>
            <p className="text-sm text-primary-500">
              With {formatAddress(agreement.partner)}
            </p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bgColor} ${statusConfig.color}`}>
          <statusConfig.icon className="h-4 w-4 inline mr-1" />
          {statusConfig.text}
        </div>
      </div>

      <div className="flex items-center space-x-4 text-sm text-primary-500 mb-4">
        <div className="flex items-center space-x-1">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(agreement.createdAt)}</span>
        </div>
      </div>

      <div className="flex space-x-2">
        {!agreement.isActive && agreement.partner && (
          <button
            onClick={() => onAccept(agreement.id)}
            className="btn-primary flex-1 text-sm py-2"
          >
            Accept Agreement
          </button>
        )}
        <button
          onClick={() => onView(agreement)}
          className="btn-secondary flex-1 text-sm py-2"
        >
          View Details
        </button>
      </div>
    </div>
  )
}

export default AgreementCard