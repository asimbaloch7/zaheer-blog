/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#1c1917',
          muted: '#57534e',
          faint: '#a8a29e',
        },
        paper: {
          DEFAULT: '#f6f3ec',
          card: '#fffcf7',
          dark: '#e4dfd4',
        },
        pine: {
          50: '#f0f7f6',
          100: '#dceeea',
          200: '#b7d8d2',
          700: '#1a5c56',
          800: '#134844',
          900: '#0c3330',
        },
      },
      fontFamily: {
        serif: ['"Source Serif 4"', 'Georgia', 'Cambria', 'serif'],
        sans: ['"Source Sans 3"', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        measure: '72ch',
      },
    },
  },
  plugins: [],
}
