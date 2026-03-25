# 🖼️ BG Remover

> Image Background Remover - Remove image backgrounds with AI

A fast, free, and easy-to-use online tool for removing backgrounds from images. Built with Next.js, Tailwind CSS, and Cloudflare Workers.

## ✨ Features

- ⚡ **Fast** - Process images in seconds
- 🎯 **Accurate** - AI-powered background removal
- 📱 **Responsive** - Works on desktop and mobile
- 🔒 **Private** - No image storage, processed in memory
- 🆓 **Free** - 50 free images per month with Remove.bg

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Backend**: Cloudflare Workers / Pages
- **AI API**: Remove.bg

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm
- Cloudflare account
- Remove.bg API key

### Installation

```bash
# Clone the repository
git clone https://github.com/xiaojiaofzc/bg-remover.git
cd bg-remover

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local
# Edit .env.local and add your Remove.bg API key

# Run locally
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start.

### Configuration

Create a `.env.local` file in the root directory:

```env
REMOVE_BG_API_KEY=your-api-key-here
```

Get your API key at [https://www.remove.bg/api](https://www.remove.bg/api)

## 📁 Project Structure

```
bg-remover/
├── app/
│   ├── api/
│   │   └── remove-bg/
│   │       └── route.ts      # Remove.bg API integration
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Main page
├── components/
│   ├── DownloadButton.tsx    # Download result button
│   ├── ErrorMessage.tsx      # Error display
│   ├── ImagePreview.tsx      # Image preview with transparent bg
│   ├── LoadingSpinner.tsx    # Loading animation
│   ├── ProcessingButton.tsx  # Process image button
│   └── UploadArea.tsx        # Drag & drop upload
├── public/                   # Static assets
├── .env.example              # Environment template
├── .gitignore
├── next.config.js            # Next.js configuration
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
└── wrangler.toml             # Cloudflare Pages config
```

## 🌐 Deployment

### Deploy to Cloudflare Pages

```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Build and deploy
npm run build
wrangler pages deploy .next
```

### Other Platforms

The app can also be deployed to Vercel, Netlify, or any Node.js hosting:

```bash
npm run build
npm start
```

## 🧪 Local Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run start
```

## 📄 License

MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

- [Remove.bg](https://www.remove.bg/) - Background removal API
- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Cloudflare](https://cloudflare.com/) - Edge computing platform
