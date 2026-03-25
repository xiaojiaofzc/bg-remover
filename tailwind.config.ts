import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f8f9ff',
          100: '#f0f3ff',
          500: '#667eea',
          600: '#5a6fd6',
          700: '#764ba2',
        },
        success: '#10b981',
        error: '#ef4444',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      },
      boxShadow: {
        'card': '0 4px 15px rgba(0,0,0,0.1)',
        'card-hover': '0 6px 20px rgba(102, 126, 234, 0.4)',
      },
      borderRadius: {
        'xl': '15px',
        '2xl': '20px',
      },
    },
  },
  plugins: [],
}
export default config
