export const validateEthereumAddress = (address) => {
  if (!address) return false
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

export const validateFileType = (file, allowedTypes = []) => {
  if (allowedTypes.length === 0) return true
  
  const fileExtension = file.name.split('.').pop()?.toLowerCase()
  const mimeType = file.type
  
  return allowedTypes.some(type => {
    if (type.startsWith('.')) {
      return type.toLowerCase() === `.${fileExtension}`
    }
    return type === mimeType
  })
}

export const validateFileSize = (file, maxSizeMB = 10) => {
  const maxSize = maxSizeMB * 1024 * 1024
  return file.size <= maxSize
}

export const validateAgreementId = (id) => {
  if (!id || isNaN(id) || id <= 0) return false
  return true
}

export const validateDocumentHash = (hash) => {
  if (!hash) return false
  return /^0x[a-fA-F0-9]{64}$/.test(hash)
}

export const getValidationError = (field, value, rules = {}) => {
  const {
    required = false,
    minLength,
    maxLength,
    pattern,
    customValidator
  } = rules

  if (required && (!value || value.trim() === '')) {
    return `${field} is required`
  }

  if (minLength && value && value.length < minLength) {
    return `${field} must be at least ${minLength} characters`
  }

  if (maxLength && value && value.length > maxLength) {
    return `${field} must be less than ${maxLength} characters`
  }

  if (pattern && value && !pattern.test(value)) {
    return `${field} format is invalid`
  }

  if (customValidator && value) {
    const customError = customValidator(value)
    if (customError) return customError
  }

  return null
}