import type { Config } from 'tailwindcss'

export default <Config> {
  content: [
    './app/**/*.{vue,ts}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        mono: ['DM Mono', 'monospace'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: '#0f0e0b',
        paper: '#f5f0e8',
        'paper-dark': '#ede8dc',
        'paper-border': '#d4cfc4',
        muted: '#8a8070',
        red: {
          DEFAULT: '#c0392b',
          dark: '#96281b',
        },
      },
    },
  },
}