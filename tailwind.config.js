/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas:          'var(--color-canvas)',
        surface:         'var(--color-surface)',
        'surface-muted': 'var(--color-surface-muted)',
        'surface-bright':'var(--color-surface-bright)',
        ink:             'var(--color-ink)',
        'ink-muted':     'var(--color-ink-muted)',
        accent:          'var(--color-accent)',
        'accent-hover':  'var(--color-accent-hover)',
        'accent-fg':     'var(--color-accent-fg)',
        focus:           'var(--color-focus)',
        border:          'var(--color-border)',
        highlight:       'var(--color-surface)',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'Fira Code', 'monospace'],
        sans: ['"JetBrains Mono"', 'sans-serif'],
      },
      boxShadow: {
        crisp:    'var(--shadow-crisp)',
        'crisp-lg': 'var(--shadow-crisp-lg)',
        'crisp-sm': 'var(--shadow-crisp-sm)',
        card:     '0 4px 12px 0 rgba(0, 0, 0, 0.25)',
      },
    },
  },
  plugins: [],
}
