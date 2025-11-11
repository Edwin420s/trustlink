import { ethers } from 'ethers'

/**
 * Hash a file using SHA-256
 * @param {File} file - The file to hash
 * @param {Function} onProgress - Optional progress callback
 * @returns {Promise<string>} The hex hash with 0x prefix
 */
export const hashFile = async (file, onProgress = null) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    if (onProgress) onProgress(0)
    
    reader.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        const progress = (e.loaded / e.total) * 100
        onProgress(Math.round(progress))
      }
    }
    
    reader.onload = async (e) => {
      try {
        if (onProgress) onProgress(95)
        const arrayBuffer = e.target.result
        const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer)
        const hashArray = Array.from(new Uint8Array(hashBuffer))
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
        if (onProgress) onProgress(100)
        resolve('0x' + hashHex)
      } catch (error) {
        reject(error)
      }
    }
    
    reader.onerror = () => reject(reader.error)
    reader.readAsArrayBuffer(file)
  })
}

/**
 * Generate a salted hash for privacy
 * @param {string} documentHash - The original document hash
 * @param {number|string} agreementId - Agreement ID to use as salt
 * @returns {string} Salted hash
 */
export const generateSaltedHash = (documentHash, agreementId) => {
  return ethers.keccak256(
    ethers.solidityPacked(
      ['bytes32', 'uint256'],
      [documentHash, agreementId]
    )
  )
}

/**
 * Validate file size and MIME type
 * @param {File} file - File to validate
 * @param {Array} allowedTypes - Allowed MIME types
 * @param {number} maxSizeMB - Max file size in MB
 * @returns {object} Validation result
 */
export const validateFile = (file, allowedTypes = [], maxSizeMB = 10) => {
  const maxSize = maxSizeMB * 1024 * 1024
  
  // Check file size
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size must be less than ${maxSizeMB}MB`
    }
  }
  
  // Check MIME type if specified
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not supported`
    }
  }
  
  return { valid: true, error: null }
}

/**
 * Format hash for display (shortened)
 * @param {string} hash - Full hash
 * @param {number} chars - Characters to show on each end
 * @returns {string} Formatted hash
 */
export const formatHash = (hash, chars = 8) => {
  if (!hash || hash.length < chars * 2) return hash
  return `${hash.slice(0, chars + 2)}...${hash.slice(-chars)}`
}