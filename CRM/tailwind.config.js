/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Poppins', 'Roboto', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        primary: {
          DEFAULT: '#2563eb', // blue-600
          light: '#3b82f6', // blue-500
          dark: '#1e40af', // blue-800
        },
        accent: {
          DEFAULT: '#14b8a6', // teal-500
          light: '#5eead4', // teal-300
          dark: '#0f766e', // teal-800
        },
        background: '#f8fafc', // slate-50
        surface: '#ffffff',
        muted: '#64748b', // slate-500
        border: '#e2e8f0', // slate-200
      },
      borderRadius: {
        lg: '1rem',
        xl: '1.5rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        card: '0 2px 8px 0 rgba(16,30,54,0.08)',
        modal: '0 8px 32px 0 rgba(16,30,54,0.16)',
      },
    },
  },
  plugins: [],
}
