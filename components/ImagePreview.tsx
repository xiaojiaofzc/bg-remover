'use client'

interface ImagePreviewProps {
  title: string
  imageUrl: string | null
  isTransparent?: boolean
  onReset?: () => void
}

export default function ImagePreview({ title, imageUrl, isTransparent = false, onReset }: ImagePreviewProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        {onReset && (
          <button
            onClick={onReset}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            ✕ Close
          </button>
        )}
      </div>
      
      <div
        className={`relative min-h-[200px] rounded-lg flex items-center justify-center overflow-hidden ${
          isTransparent
            ? 'bg-[length:20px_20px] bg-[position:0_0,10px_10px] bg-repeat'
            : ''
        }`}
        style={
          isTransparent
            ? {
                backgroundColor: '#f0f0f0',
                backgroundImage: `
                  linear-gradient(45deg, #e0e0e0 25%, transparent 25%),
                  linear-gradient(-45deg, #e0e0e0 25%, transparent 25%),
                  linear-gradient(45deg, transparent 75%, #e0e0e0 75%),
                  linear-gradient(-45deg, transparent 75%, #e0e0e0 75%)
                `,
              }
            : { backgroundColor: '#f9f9f9' }
        }
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="max-w-full max-h-[300px] rounded-lg object-contain"
          />
        ) : (
          <div className="text-gray-400 text-center py-12">
            <div className="text-4xl mb-2">🖼️</div>
            <p className="text-sm">No image</p>
          </div>
        )}
      </div>
    </div>
  )
}
