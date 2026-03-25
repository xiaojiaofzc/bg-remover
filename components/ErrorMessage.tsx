'use client'

interface ErrorMessageProps {
  message: string | null
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) return null

  return (
    <div className="bg-red-50 border border-error text-error px-6 py-4 rounded-xl text-center">
      ⚠️ {message}
    </div>
  )
}
