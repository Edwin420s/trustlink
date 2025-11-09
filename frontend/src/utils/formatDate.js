export const formatDate = (timestamp, options = {}) => {
  if (!timestamp) return 'N/A'
  
  const date = new Date(timestamp * 1000)
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  }
  
  return date.toLocaleDateString('en-US', defaultOptions)
}

export const formatDateTime = (timestamp) => {
  if (!timestamp) return 'N/A'
  
  const date = new Date(timestamp * 1000)
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const formatRelativeTime = (timestamp) => {
  if (!timestamp) return 'N/A'
  
  const now = Math.floor(Date.now() / 1000)
  const diff = now - timestamp
  
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`
  
  return formatDate(timestamp)
}