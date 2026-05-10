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
        brand: '#C4420A',
        confirm: '#1A7A3A',
        cancel: '#6B7280',
        'card-bg': '#FFF7F0',
        error: '#DC2626',
      },
      fontFamily: {
        nunito: ['Nunito', 'sans-serif'],
      },
      minWidth: {
        touch: '72px',
      },
      minHeight: {
        touch: '72px',
      },
    },
  },
  plugins: [],
}
export default config
