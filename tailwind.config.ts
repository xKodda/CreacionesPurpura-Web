import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          fondo: '#eae5fa',         // Fondo principal
          fondoSec: '#e6dcf2',     // Fondo secundario
          fondoDest: '#e4cef2',    // Fondo de elementos destacados
          detalle: '#caa7d9',      // Bordes, detalles
          acento: '#c18bd9',       // Botones principales, acentos
          principal: '#7d418f',    // Texto principal, títulos, botones destacados
        },
        purple: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
        },
      },
    },
  },
  plugins: [],
}

export default config 