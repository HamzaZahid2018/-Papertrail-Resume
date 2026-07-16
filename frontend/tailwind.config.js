/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Premium harmonized color palette
        brand: {
          50: '#f4f6fe',
          100: '#eaedfcf',
          200: '#cbd4fa',
          300: '#9db0f5',
          400: '#6884ee',
          500: '#435ce5', // Primary brand color
          600: '#2f41cc',
          700: '#2632b4',
          800: '#232c92',
          900: '#212975',
          950: '#151948',
        },
        slate: {
          950: '#0b0f19',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Fraunces', 'serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        'glass-light': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
