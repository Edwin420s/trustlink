import React from 'react'
import { CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react'

const StatusIndicator = ({ status, size = 'md', showLabel = true }) => {
  const statusConfig = {
    active: {
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      label: 'Active'
    },
    pending: {
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      label: 'Pending'
    },
    inactive: {
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      label: 'Inactive'
    },
    warning: {
      icon: AlertCircle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      label: 'Warning'
    }
  }

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  const config = statusConfig[status] || statusConfig.inactive
  const IconComponent = config.icon

  return (
    <div className="flex items-center space-x-2">
      <div className={`flex items-center justify-center ${sizeClasses[size]} ${config.color}`}>
        <IconComponent className="w-full h-full" />
      </div>
      {showLabel && (
        <span className={`text-sm font-medium ${config.color}`}>
          {config.label}
        </span>
      )}
    </div>
  )
}

export default StatusIndicator