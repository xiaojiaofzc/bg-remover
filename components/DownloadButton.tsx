'use client'

interface DownloadButtonProps {
  blob: Blob
  filename: string
}

export default function DownloadButton({ blob, filename }: DownloadButtonProps) {
  const handleDownload = () => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <button
      onClick={handleDownload}
      className="px-8 py-4 text-lg font-semibold text-white bg-success rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-green-600"
    >
      ⬇️ Download
    </button>
  )
}
