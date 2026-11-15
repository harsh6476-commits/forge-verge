/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // User color specification:
        // Main contrast & background: #A5A79B
        // Highlighted color: #E8D2B5
        // Contrast adding color to balance out both: #590907
        // Black logos, text, outline as zinc-200, shadows
        canvas: '#A5A79B',
        highlight: '#E8D2B5',
        accent: '#590907',
        'accent-hover': '#420605',
        'accent-soft': '#59090715',
        ink: '#000000',
        inkmuted: '#1f201d',
        outline: '#e4e4e7', // zinc-200
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'Fira Code', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['"JetBrains Mono"', 'monospace'],
      },
      letterSpacing: {
        tighter: '-0.02em',
        tight: '0.01em',
        normal: '0.05em',
        wide: '0.08em',
        wider: '0.12em',
        widest: '0.18em',
      },
      boxShadow: {
        crisp: '4px 4px 0px 0px rgba(0, 0, 0, 0.95)',
        'crisp-lg': '6px 6px 0px 0px rgba(0, 0, 0, 0.95)',
        'crisp-sm': '2px 2px 0px 0px rgba(0, 0, 0, 0.95)',
        deep: '0 20px 35px -5px rgba(89, 9, 7, 0.3), 0 10px 15px -5px rgba(0, 0, 0, 0.4)',
        glow: '0 0 20px 2px rgba(89, 9, 7, 0.25)',
      },
    },
  },
  plugins: [],
}
