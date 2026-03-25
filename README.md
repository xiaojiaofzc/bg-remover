# 🖼️ BG Remover

> Image Background Remover - Remove image backgrounds with AI

A fast, free, and easy-to-use online tool for removing backgrounds from images. Built with Cloudflare Workers and Remove.bg API.

## ✨ Features

- ⚡ **Fast** - Process images in seconds
- 🎯 **Accurate** - AI-powered background removal
- 📱 **Responsive** - Works on desktop and mobile
- 🔒 **Private** - No image storage, processed in memory
- 🆓 **Free** - 50 free images per month

## 🛠️ Tech Stack

- **Frontend**: Vanilla HTML/CSS/JS
- **Backend**: Cloudflare Workers
- **AI API**: Remove.bg
- **Deployment**: Cloudflare Pages/Workers

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

# Configure your API key
cp wrangler.toml.example wrangler.toml
# Edit wrangler.toml and add your Remove.bg API key

# Deploy to Cloudflare Workers
npx wrangler deploy
```

### Configuration

Create a `wrangler.toml` file:

```toml
name = "bg-remover"
main = "src/worker.js"
compatibility_date = "2024-01-01"

[vars]
REMOVE_BG_API_KEY = "your-api-key-here"
```

## 📖 Documentation

- [MVP Requirements Document](./docs/MVP.md)

## 🧪 Local Development

```bash
# Start local dev server
npm run dev

# Or use Wrangler directly
npx wrangler dev
```

## 📄 License

MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

- [Remove.bg](https://www.remove.bg/) - Background removal API
- [Cloudflare Workers](https://workers.cloudflare.com/) - Edge computing platform
