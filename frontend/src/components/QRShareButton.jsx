import React, { useState } from 'react'
import { QrCode, X, Download } from 'lucide-react'
import QRCodeStyling from 'qr-code-styling'

/**
 * QRShareButton Component
 * Generates QR code for sharing verification links
 */
const QRShareButton = ({ documentHash, verifyUrl }) => {
  const [showModal, setShowModal] = useState(false)
  const [qrCode, setQrCode] = useState(null)

  const generateQR = () => {
    const url = `${verifyUrl || window.location.origin}/verify?hash=${documentHash}`
    
    const qr = new QRCodeStyling({
      width: 300,
      height: 300,
      data: url,
      margin: 10,
      qrOptions: {
        typeNumber: 0,
        mode: 'Byte',
        errorCorrectionLevel: 'M'
      },
      imageOptions: {
        hideBackgroundDots: true,
        imageSize: 0.4,
        margin: 0
      },
      dotsOptions: {
        color: '#1E293B',
        type: 'rounded'
      },
      backgroundOptions: {
        color: '#ffffff',
      },
      cornersSquareOptions: {
        color: '#3A8DFF',
        type: 'extra-rounded'
      },
      cornersDotOptions: {
        color: '#3A8DFF',
        type: 'dot'
      }
    })

    setQrCode(qr)
    setShowModal(true)

    // Append to modal after render
    setTimeout(() => {
      const container = document.getElementById('qr-container')
      if (container) {
        container.innerHTML = ''
        qr.append(container)
      }
    }, 100)
  }

  const downloadQR = () => {
    if (qrCode) {
      qrCode.download({ name: `trustlink-verify-${documentHash.slice(0, 10)}`, extension: 'png' })
    }
  }

  return (
    <>
      <button onClick={generateQR} className="qr-share-btn" title="Generate QR Code">
        <QrCode size={20} />
        <span>Share as QR</span>
      </button>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content qr-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}>
              <X size={24} />
            </button>

            <h3>Scan to Verify</h3>
            <p className="qr-instructions">
              Anyone can scan this QR code to verify the document on TrustLink.
            </p>

            <div id="qr-container" className="qr-container"></div>

            <div className="qr-actions">
              <button onClick={downloadQR} className="btn btn-primary">
                <Download size={18} />
                Download QR Code
              </button>
              <button onClick={() => setShowModal(false)} className="btn btn-secondary">
                Close
              </button>
            </div>

            <div className="qr-hash-display">
              <p className="text-sm text-gray-500">Document Hash:</p>
              <code className="monospace text-xs">{documentHash}</code>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default QRShareButton
