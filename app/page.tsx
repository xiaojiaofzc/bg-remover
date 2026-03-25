'use client'

import { useState, useRef, DragEvent, ChangeEvent } from 'react'
import UploadArea from '@/components/UploadArea'
import ImagePreview from '@/components/ImagePreview'
import ProcessingButton from '@/components/ProcessingButton'
import DownloadButton from '@/components/DownloadButton'
import ErrorMessage from '@/components/ErrorMessage'
import LoadingSpinner from '@/components/LoadingSpinner'

type ProcessingStatus = 'idle' | 'processing' | 'success' | 'error'

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [originalPreview, setOriginalPreview] = useState<string | null>(null)
  const [resultPreview, setResultPreview] = useState<string | null>(null)
  const [resultBlob, setResultBlob] = useState<Blob | null>(null)
  const [status, setStatus] = useState<ProcessingStatus>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleFileSelect = (file: File) => {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      setErrorMessage('Only JPG, PNG, and WebP formats are supported')
      return
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('File size must be less than 10MB')
      return
    }

    setSelectedFile(file)
    setErrorMessage(null)
    setResultPreview(null)
    setResultBlob(null)
    setStatus('idle')

    // Show original preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setOriginalPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleProcess = async () => {
    if (!selectedFile) return

    setStatus('processing')
    setErrorMessage(null)

    try {
      const formData = new FormData()
      formData.append('image', selectedFile)

      const response = await fetch('/api/remove-bg', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to process image')
      }

      const blob = await response.blob()
      const resultUrl = URL.createObjectURL(blob)
      setResultPreview(resultUrl)
      setResultBlob(blob)
      setStatus('success')
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'An error occurred while processing')
      setStatus('error')
    }
  }

  const handleReset = () => {
    setSelectedFile(null)
    setOriginalPreview(null)
    setResultPreview(null)
    setResultBlob(null)
    setStatus('idle')
    setErrorMessage(null)
  }

  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="text-center py-8 text-white">
        <h1 className="text-4xl font-bold mb-2">🖼️ BG Remover</h1>
        <p className="text-lg opacity-90">Remove image backgrounds with AI</p>
      </header>

      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 pb-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Upload Area */}
          {!originalPreview && (
            <UploadArea onFileSelect={handleFileSelect} />
          )}

          {/* Preview Area */}
          {originalPreview && (
            <div className="grid md:grid-cols-2 gap-6">
              <ImagePreview
                title="Original"
                imageUrl={originalPreview}
                onReset={handleReset}
              />
              <ImagePreview
                title="Result"
                imageUrl={resultPreview}
                isTransparent
              />
            </div>
          )}

          {/* Error Message */}
          <ErrorMessage message={errorMessage} />

          {/* Loading */}
          {status === 'processing' && <LoadingSpinner />}

          {/* Actions */}
          {originalPreview && status !== 'processing' && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ProcessingButton
                onClick={handleProcess}
                disabled={status === 'processing'}
              />
              {status === 'success' && resultBlob && selectedFile && (
                <DownloadButton
                  blob={resultBlob}
                  filename={selectedFile.name.replace(/\.[^/.]+$/, '') + '_nobg.png'}
                />
              )}
            </div>
          )}

          {/* Instructions */}
          {status === 'idle' && !originalPreview && (
            <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-white text-center">
              <p className="mb-2">📁 Click or drag an image to upload</p>
              <p className="text-sm opacity-75">Supports JPG, PNG, WebP • Max 10MB</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-4 text-white/80 text-sm">
        <p>
          Powered by{' '}
          <a href="https://www.remove.bg/" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">
            Remove.bg
          </a>
          {' '}•{' '}
          <a href="https://workers.cloudflare.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">
            Cloudflare Workers
          </a>
        </p>
      </footer>
    </main>
  )
}
