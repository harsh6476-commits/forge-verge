/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // V2 Palette — deep slate canvas, warm ivory cards, teal active, amber current marker
        canvas:          '#17212B',   // deep slate/navy app background
        surface:         '#F4EFE5',   // warm ivory — main cards
        'surface-muted': '#E8E0D3',   // secondary panels
        'surface-bright':'#FFFDF8',   // topic rows / input surfaces
        ink:             '#17202A',   // primary text on light surfaces
        'ink-muted':     '#52616B',   // secondary text
        accent:          '#0D6B66',   // teal — active controls, progress, selected
        'accent-hover':  '#095650',
        'accent-fg':     '#FFFFFF',
        success:         '#1F6B45',   // completed items
        'success-soft':  '#DDEDE3',
        focus:           '#F2B544',   // amber — current milestone marker / focus ring
        border:          '#293743',   // subtle border on slate background
        // Legacy compat aliases kept for gradual migration
        highlight:       '#F4EFE5',
      },
      fontFamily: {
        // Inter/Manrope for body; JetBrains Mono reserved for code/metadata
        sans: ['Inter', 'Manrope', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Fira Code', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        crisp:    '3px 3px 0px 0px rgba(23, 32, 43, 0.60)',
        'crisp-lg': '5px 5px 0px 0px rgba(23, 32, 43, 0.60)',
        'crisp-sm': '2px 2px 0px 0px rgba(23, 32, 43, 0.50)',
        card:     '0 2px 8px 0 rgba(23, 32, 43, 0.12)',
      },
    },
  },
  plugins: [],
}
