/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      /* ─── Typography ─── */
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'stat': ['2rem', { lineHeight: '1.2', fontWeight: '700' }],
        'stat-lg': ['2.5rem', { lineHeight: '1.1', fontWeight: '700' }],
      },

      /* ─── Color System ─── */
      colors: {
        brand: {
          50:  '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
        },
        surface: {
          bg:      '#F0F4FA',
          card:    '#FFFFFF',
          sidebar: '#FFFFFF',
          panel:   '#F8FAFC',
          hover:   '#F1F5F9',
          active:  '#EEF2FF',
          overlay: 'rgba(15, 23, 42, 0.4)',
        },
        text: {
          primary:   '#0F172A',
          secondary: '#475569',
          muted:     '#94A3B8',
          inverse:   '#FFFFFF',
          link:      '#4F46E5',
        },
        status: {
          success:   '#10B981',
          successBg: '#ECFDF5',
          successLt: '#D1FAE5',
          danger:    '#EF4444',
          dangerBg:  '#FEF2F2',
          dangerLt:  '#FECACA',
          warning:   '#F59E0B',
          warningBg: '#FFFBEB',
          info:      '#3B82F6',
          infoBg:    '#EFF6FF',
        },
        border: {
          light:   '#E2E8F0',
          DEFAULT: '#CBD5E1',
          strong:  '#94A3B8',
        },
      },

      /* ─── Spacing ─── */
      spacing: {
        'sidebar':     '260px',
        'sidebar-collapsed': '72px',
        'panel':       '320px',
        'topbar':      '64px',
        'card-gap':    '20px',
        'section-gap': '32px',
        'safe-top':    'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
      },

      /* ─── Border Radius ─── */
      borderRadius: {
        'card':   '16px',
        'btn':    '10px',
        'badge':  '20px',
        'input':  '10px',
        'avatar': '50%',
        'xl':     '1rem',
        '2xl':    '1.25rem',
      },

      /* ─── Shadows ─── */
      boxShadow: {
        'card':       '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'card-lg':    '0 8px 24px rgba(0, 0, 0, 0.1)',
        'sidebar':    '2px 0 8px rgba(0, 0, 0, 0.04)',
        'panel':      '-2px 0 8px rgba(0, 0, 0, 0.04)',
        'stat':       '0 2px 8px rgba(0, 0, 0, 0.06)',
        'btn':        '0 1px 2px rgba(0, 0, 0, 0.05)',
        'btn-hover':  '0 2px 6px rgba(0, 0, 0, 0.1)',
        'dropdown':   '0 10px 40px rgba(0, 0, 0, 0.12)',
        'inner':      'inset 0 2px 4px rgba(0, 0, 0, 0.04)',
      },

      /* ─── Backdrop Blur ─── */
      backdropBlur: {
        xs: '2px',
      },

      /* ─── Keyframes ─── */
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%':   { opacity: '0', transform: 'translateY(-12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%':   { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.5' },
        },
        countUp: {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },

      /* ─── Animations ─── */
      animation: {
        'fade-in':       'fadeIn 0.3s ease-out',
        'slide-up':      'slideUp 0.35s ease-out',
        'slide-down':    'slideDown 0.35s ease-out',
        'slide-in-right':'slideInRight 0.35s ease-out',
        'scale-in':      'scaleIn 0.25s ease-out',
        'shimmer':       'shimmer 2s infinite linear',
        'pulse-slow':    'pulse 2.5s ease-in-out infinite',
        'count-up':      'countUp 0.5s ease-out',
      },

      /* ─── Screens ─── */
      screens: {
        'xs':  '475px',
        'sm':  '640px',
        'md':  '768px',
        'lg':  '1024px',
        'xl':  '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [],
}
