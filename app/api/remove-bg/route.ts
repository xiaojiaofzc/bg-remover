import { NextRequest, NextResponse } from 'next/server'

const REMOVE_BG_API_URL = 'https://api.remove.bg/v1.0/removebg'

export async function POST(request: NextRequest) {
  try {
    // Get API key from environment
    const apiKey = process.env.REMOVE_BG_API_KEY
    if (!apiKey || apiKey === 'your-api-key-here') {
      return NextResponse.json(
        { error: 'API key not configured', detail: 'Please configure your Remove.bg API key' },
        { status: 500 }
      )
    }

    // Parse multipart form data
    const formData = await request.formData()
    const imageFile = formData.get('image')

    if (!imageFile || !(imageFile instanceof File)) {
      return NextResponse.json(
        { error: 'No image provided', detail: 'Please upload an image file' },
        { status: 400 }
      )
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!validTypes.includes(imageFile.type)) {
      return NextResponse.json(
        { error: 'Invalid file type', detail: 'Only JPG, PNG, and WebP are supported' },
        { status: 400 }
      )
    }

    // Validate file size (10MB)
    if (imageFile.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large', detail: 'File size must be less than 10MB' },
        { status: 400 }
      )
    }

    // Call Remove.bg API
    const removeBgFormData = new FormData()
    removeBgFormData.append('image_file', imageFile)
    removeBgFormData.append('size', 'auto')
    removeBgFormData.append('format', 'png')

    const response = await fetch(REMOVE_BG_API_URL, {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey,
      },
      body: removeBgFormData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Remove.bg API error:', errorText)

      let errorMessage = 'Failed to remove background'
      if (response.status === 402) {
        errorMessage = 'API credits exhausted'
      } else if (response.status === 403) {
        errorMessage = 'Invalid API key'
      }

      return NextResponse.json(
        { error: errorMessage, detail: errorText },
        { status: response.status }
      )
    }

    // Return the processed image
    const resultBuffer = await response.arrayBuffer()
    
    return new NextResponse(resultBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': 'attachment; filename="removed-bg.png"',
      },
    })
  } catch (error) {
    console.error('Error in remove-bg API:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', detail: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
