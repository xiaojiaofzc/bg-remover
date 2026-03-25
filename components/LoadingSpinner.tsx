'use client'

export default function LoadingSpinner() {
  return (
    <div className="text-center py-12">
      <div className="inline-block w-12 h-12 border-4 border-gray-200 border-t-primary-500 rounded-full animate-spin mb-4" />
      <p className="text-gray-600">Removing background...</p>
    </div>
  )
}
