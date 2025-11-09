import React, { useCallback, useState } from 'react'
import { Upload, File, X } from 'lucide-react'

const FileUploader = ({ onFileSelect, acceptedFileTypes = '*' }) => {
  const [file, setFile] = useState(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFile = useCallback((selectedFile) => {
    if (selectedFile) {
      setFile(selectedFile)
      onFileSelect(selectedFile)
    }
  }, [onFileSelect])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    handleFile(droppedFile)
  }, [handleFile])

  const handleFileInput = useCallback((e) => {
    const selectedFile = e.target.files[0]
    handleFile(selectedFile)
  }, [handleFile])

  const removeFile = useCallback(() => {
    setFile(null)
    onFileSelect(null)
  }, [onFileSelect])

  return (
    <div className="w-full">
      {!file ? (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging 
              ? 'border-primary-500 bg-primary-50' 
              : 'border-primary-200 hover:border-primary-300'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="mx-auto h-12 w-12 text-primary-400 mb-4" />
          <div className="space-y-2">
            <p className="text-lg font-medium text-primary-700">
              Drop your file here
            </p>
            <p className="text-sm text-primary-500">
              or click to browse files
            </p>
          </div>
          <input
            type="file"
            onChange={handleFileInput}
            accept={acceptedFileTypes}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      ) : (
        <div className="border border-primary-200 rounded-lg p-4 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <File className="h-8 w-8 text-primary-500" />
              <div>
                <p className="font-medium text-primary-700">{file.name}</p>
                <p className="text-sm text-primary-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              onClick={removeFile}
              className="p-1 hover:bg-primary-100 rounded transition-colors"
            >
              <X className="h-5 w-5 text-primary-500" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default FileUploader