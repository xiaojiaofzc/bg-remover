'use client'

import { useRef, DragEvent, ChangeEvent } from 'react'

interface UploadAreaProps {
  onFileSelect: (file: File) => void
}

export default function UploadArea({ onFileSelect }: UploadAreaProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.currentTarget.classList.add('border-primary-500', 'bg-primary-50')
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.currentTarget.classList.remove('border-primary-500', 'bg-primary-50')
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.currentTarget.classList.remove('border-primary-500', 'bg-primary-50')
    
    const file = e.dataTransfer.files[0]
    if (file) {
      onFileSelect(file)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onFileSelect(file)
    }
  }

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="bg-white rounded-xl p-12 text-center cursor-pointer transition-all duration-300 border-3 border-dashed border-gray-300 hover:border-primary-500 hover:bg-primary-50 shadow-card"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />
      
      <div className="text-6xl mb-4">📁</div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        Click or drag image to upload
      </h2>
      <p className="text-gray-600 mb-4">
        Your image will be processed immediately
      </p>
      <div className="text-sm text-gray-400">
        Supports JPG, PNG, WebP • Max 10MB
      </div>
    </div>
  )
}
