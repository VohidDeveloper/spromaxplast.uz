/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js}'
  ],
  theme: {
    extend: {
      colors: {
        // Brand asosiy ranglar
        primary: {
          DEFAULT: '#C8181E',  // Qizil — ishonch va kuch
          dark:    '#A01218',
          light:   '#E03038'
        },
        secondary: {
          DEFAULT: '#2E8B3A',  // Yashil — ekologiya va sifat
          dark:    '#1F6028',
          light:   '#3DAF4D'
        },
        neutral: {
          50:  '#F9F9F9',
          100: '#F0F0F0',
          200: '#E0E0E0',
          700: '#444444',
          900: '#1A1A1A'
        }
      },
      fontFamily: {
        // Korporativ tipografiya
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Montserrat', 'system-ui', 'sans-serif']
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '1.5rem',
          lg: '2rem'
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out'
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%':   { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' }
        }
      }
    }
  },
  plugins: []
}
