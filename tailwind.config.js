export default {
  content: ['./index.html', './**/*.{vue,js,ts}'],
  theme: {
    extend: {
      colors: {
        page: 'var(--color-bg-page)',
        surface: 'var(--color-bg-surface)',

        text: {
          main: 'var(--color-text-primary)',
          muted: 'var(--color-text-secondary)',
        },

        border: 'var(--color-border)',

        brand: {
          DEFAULT: 'var(--color-brand)',
          hover: 'var(--color-brand-hover)',
        },
      },

      spacing: {
        'app-xs': 'var(--space-xs)',
        'app-sm': 'var(--space-sm)',
        'app-md': 'var(--space-md)',
        'app-lg': 'var(--space-lg)',
        'app-xl': 'var(--space-xl)',
        'app-2xl': 'var(--space-2xl)',
      },

      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
      },

      maxWidth: {
        app: '1200px',
        content: '800px',
      },
      fontFamily: {
        sans: ['"Open Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
