/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#090a0f',
        surface: '#12141c',
        'surface-hover': '#1a1d28',
        border: '#242838',
        'border-subtle': '#181b26',
        primary: {
          DEFAULT: '#10b981', // Deep Emerald / Green
          hover: '#059669',
          light: '#34d399',
          dark: '#047857',
        },
        accent: {
          blue: '#3b82f6',
          purple: '#8b5cf6',
          amber: '#f59e0b',
          rose: '#f43f5e',
          cyan: '#06b6d4',
        },
        muted: '#8b949e',
        'muted-foreground': '#c9d1d9',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

