/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        blue: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        emerald: {
          50: '#f0fdf4',
          200: '#bbf7d0',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        },
        amber: {
          400: '#fbbf24',
          500: '#f59e0b',
        },
        orange: {
          500: '#f97316',
        },
        purple: {
          600: '#7c3aed',
        },
        red: {
          50: '#fef2f2',
          600: '#dc2626',
        },
      },
      animation: {
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
