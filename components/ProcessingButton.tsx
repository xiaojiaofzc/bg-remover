'use client'

interface ProcessingButtonProps {
  onClick: () => void
  disabled?: boolean
}

export default function ProcessingButton({ onClick, disabled }: ProcessingButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-8 py-4 text-lg font-semibold text-white bg-gradient-primary rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
    >
      ✨ Remove Background
    </button>
  )
}
