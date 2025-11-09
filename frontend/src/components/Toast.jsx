import React from 'react'
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react'

const Toast = ({ message, type = 'info', onClose }) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-400" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-400" />
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-400" />
      default:
        return <AlertCircle className="h-5 w-5 text-blue-400" />
    }
  }

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200'
      case 'error':
        return 'bg-red-50 border-red-200'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200'
      default:
        return 'bg-blue-50 border-blue-200'
    }
  }

  const getTextColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-800'
      case 'error':
        return 'text-red-800'
      case 'warning':
        return 'text-yellow-800'
      default:
        return 'text-blue-800'
    }
  }

  return (
    <div className={`flex items-center p-4 border rounded-lg ${getBackgroundColor()} ${getTextColor()} shadow-sm`}>
      <div className="flex-shrink-0">
        {getIcon()}
      </div>
      <div className="ml-3 flex-1">
        <p className="text-sm font-medium">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="ml-4 flex-shrink-0 hover:opacity-70 transition-opacity"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

export default Toast