/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // For Cloudflare Pages
  serverExternalPackages: [],
}

module.exports = nextConfig
