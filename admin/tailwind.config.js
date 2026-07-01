/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#C8181E',
          hover:   '#a81318',
          light:   '#f9e5e6'
        },
        secondary: {
          DEFAULT: '#2E8B3A',
          hover:   '#246e2e',
          light:   '#e8f5ea'
        },
        dark: {
          DEFAULT: '#1a1a2e',
          800:     '#16213e',
          700:     '#0f3460'
        }
      },
      fontFamily: {
        sans:    ['Inter', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif']
      }
    }
  },
  plugins: []
}
