/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base backgrounds & surfaces
        page: '#F8F8F5',
        card: '#FFFFFF',
        
        // Typography
        primary: '#252B36',
        secondary: '#777E89',
        muted: '#9FA6B2',
        
        // Sage Brand Palette
        sage: {
          DEFAULT: '#52796F',
          dark: '#3F5E56',
          light: '#84A59D',
          bg: '#EAF1ED',
          subtle: '#F2F6F4'
        },
        
        // Warm Accents
        warm: {
          DEFAULT: '#E6A17E',
          hover: '#D8906D',
          soft: '#F5E8DD',
          subtle: '#FAF3ED'
        },
        
        // Neutral Borders
        line: {
          DEFAULT: '#E9EAE6',
          dark: '#DCDDD8'
        },
        
        // Status System
        success: {
          DEFAULT: '#3B8D70',
          bg: '#EDF7F3',
          border: '#D0EADB'
        },
        warning: {
          DEFAULT: '#D69A48',
          bg: '#FDF6EB',
          border: '#F9E6C9'
        },
        danger: {
          DEFAULT: '#D76C6C',
          bg: '#FDF2F2',
          border: '#F8D4D4'
        },
        info: {
          DEFAULT: '#6489B8',
          bg: '#EEF4FB',
          border: '#D3E3F5'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Manrope', 'Inter', 'sans-serif']
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgba(37, 43, 54, 0.04), 0 1px 2px -1px rgba(37, 43, 54, 0.02)',
        card: '0 4px 12px -2px rgba(37, 43, 54, 0.05), 0 2px 4px -2px rgba(37, 43, 54, 0.03)',
        elevated: '0 12px 24px -4px rgba(37, 43, 54, 0.08), 0 4px 8px -4px rgba(37, 43, 54, 0.03)'
      }
    },
  },
  plugins: [],
}
