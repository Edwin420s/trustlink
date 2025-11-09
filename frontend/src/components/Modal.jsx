import React from 'react'
import { X } from 'lucide-react'

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-primary-700 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-primary-400 hover:text-primary-500 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Modal content */}
          <div>
            {title && (
              <h3 className="text-lg font-semibold text-primary-700 mb-4 pr-8">
                {title}
              </h3>
            )}
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modal