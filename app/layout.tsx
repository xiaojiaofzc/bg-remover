import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BG Remover - Remove Image Backgrounds',
  description: 'Fast, free, and easy-to-use online tool for removing backgrounds from images using AI.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-primary">{children}</body>
    </html>
  )
}
