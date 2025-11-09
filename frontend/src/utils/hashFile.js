export const hashFile = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target.result
        const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer)
        const hashArray = Array.from(new Uint8Array(hashBuffer))
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
        resolve('0x' + hashHex)
      } catch (error) {
        reject(error)
      }
    }
    
    reader.onerror = () => reject(reader.error)
    reader.readAsArrayBuffer(file)
  })
}

export const validateFile = (file, maxSizeMB = 10) => {
  const maxSize = maxSizeMB * 1024 * 1024
  
  if (file.size > maxSize) {
    throw new Error(`File size must be less than ${maxSizeMB}MB`)
  }
  
  return true
}