/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './resources/**/*.edge',
    './resources/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    screens: {
      'mobilexxs': '20rem',      /* 320px */
      'mobilexs': '21.5625rem',  /* 344px */
      'mobilesm': '23.4375rem',  /* 376px */
      'mobilemd': '30rem',       /* 480px */
      'mobilelg': '35.4375rem',  /* 568px */
      'tabletsm': '47.9375rem',  /* 768px */
      'tabletmd': '50rem',       /* 800px */
      'tabletlg': '62rem',       /* 992px */
      'laptopmd': '75rem',       /* 1200px */
      'xl': '80rem',             /* 1280px */
      'xxl': '96rem',            /* 1536px */
      /* Compatibility aliases */
      'sm': '47.9375rem',
      'md': '50rem',
      'lg': '62rem',
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#800090',
          50: '#FDF4FF',
          100: '#F7B9FF', // shade 0
          150: '#EBA7F4', // shade 0.5
          200: '#DF94E9', // shade 1
          250: '#D382DE', // shade 1.5
          300: '#C76FD3', // shade 2
          400: '#B04ABC', // shade 3
          500: '#9825A6', // shade 4
          600: '#800090', // shade 5 (Base)
          700: '#660073', // shade 6
          800: '#4D0056', // shade 7
          900: '#33003A', // shade 8
          925: '#26002B', // shade 8.5
          950: '#1A001D', // shade 9
          975: '#0D000E', // shade 9.5
          1000: '#000000', // shade 10
          // Direct shade index mapping from Figma Shades.png
          'shade-0': '#F7B9FF',
          'shade-0.5': '#EBA7F4',
          'shade-1': '#DF94E9',
          'shade-1.5': '#D382DE',
          'shade-2': '#C76FD3',
          'shade-3': '#B04ABC',
          'shade-4': '#9825A6',
          'shade-5': '#800090',
          'shade-6': '#660073',
          'shade-7': '#4D0056',
          'shade-8': '#33003A',
          'shade-8.5': '#26002B',
          'shade-9': '#1A001D',
          'shade-9.5': '#0D000E',
          'shade-10': '#000000',
        },
        accent: {
          DEFAULT: '#ECD4ED',
          50: '#FDFBFD', // shade 0.5
          100: '#FBF6FB', // shade 1
          150: '#F9F2FA', // shade 1.5
          200: '#F7EEF8', // shade 2
          300: '#F4E5F4', // shade 3
          400: '#F0DDF1', // shade 4
          500: '#ECD4ED', // shade 5 (Base)
          600: '#D2B3D3', // shade 6
          700: '#B891B9', // shade 7
          800: '#9D70A0', // shade 8
          850: '#905F93', // shade 8.5
          900: '#834E86', // shade 9
          925: '#763E79', // shade 9.5
          950: '#692D6C', // shade 10
          // Direct shade index mapping from Figma Shades.png
          'shade-0': '#FFFFFF',
          'shade-0.5': '#FDFBFD',
          'shade-1': '#FBF6FB',
          'shade-1.5': '#F9F2FA',
          'shade-2': '#F7EEF8',
          'shade-3': '#F4E5F4',
          'shade-4': '#F0DDF1',
          'shade-5': '#ECD4ED',
          'shade-6': '#D2B3D3',
          'shade-7': '#B891B9',
          'shade-8': '#9D70A0',
          'shade-8.5': '#905F93',
          'shade-9': '#834E86',
          'shade-9.5': '#763E79',
          'shade-10': '#692D6C',
        },
        secondary: {
          DEFAULT: '#89CFF0',
          50: '#F3FAFE', // shade 0.5
          100: '#E7F5FC', // shade 1
          150: '#DCF1FB', // shade 1.5
          200: '#D0ECF9', // shade 2
          300: '#B8E2F6', // shade 3
          400: '#A1D9F3', // shade 4
          500: '#89CFF0', // shade 5 (Base)
          600: '#6FB0CE', // shade 6
          700: '#5691AD', // shade 7
          800: '#3C728B', // shade 8
          850: '#2F637A', // shade 8.5
          900: '#23536A', // shade 9
          925: '#164459', // shade 9.5
          950: '#093448', // shade 10
          // Direct shade index mapping from Figma Shades.png
          'shade-0': '#FFFFFF',
          'shade-0.5': '#F3FAFE',
          'shade-1': '#E7F5FC',
          'shade-1.5': '#DCF1FB',
          'shade-2': '#D0ECF9',
          'shade-3': '#B8E2F6',
          'shade-4': '#A1D9F3',
          'shade-5': '#89CFF0',
          'shade-6': '#6FB0CE',
          'shade-7': '#5691AD',
          'shade-8': '#3C728B',
          'shade-8.5': '#2F637A',
          'shade-9': '#23536A',
          'shade-9.5': '#164459',
          'shade-10': '#093448',
        },
        brand: {
          purple: '#800090',
          lilac: '#ECD4ED',
          blue: '#89CFF0',
          dark: '#1A001D',
          light: '#FDFBFD',
        },
      },
      fontFamily: {
        display: ['Anton', 'sans-serif'],
        sans: ['"DM Sans"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1.125rem' }], // 12px / 18px
        sm: ['0.875rem', { lineHeight: '1.25rem' }], // 14px / 20px
        md: ['1rem', { lineHeight: '1.5rem' }], // 16px / 24px
        lg: ['1.125rem', { lineHeight: '1.75rem' }], // 18px / 28px
        xl: ['1.25rem', { lineHeight: '1.875rem' }], // 20px / 30px
        '2xl': ['1.5rem', { lineHeight: '2rem' }], // 24px / 32px
        '3xl': ['1.875rem', { lineHeight: '2.375rem' }], // 30px / 38px
        '4xl': ['2.25rem', { lineHeight: '2.625rem' }], // 36px / 42px
        '5xl': ['3rem', { lineHeight: '1.1' }], // 48px
      },
      borderRadius: {
        'none': '0',
        'sm': '0.25rem', // 4px
        'md': '0.5rem', // 8px
        'lg': '0.75rem', // 12px
        'xl': '1rem', // 16px
        '2xl': '1.25rem', // 20px
        '3xl': '1.5rem', // 24px
        '4xl': '2rem', // 32px
        'full': '9999px',
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 20px -2px rgba(128, 0, 144, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 10px 25px -3px rgba(128, 0, 144, 0.1), 0 4px 10px -2px rgba(0, 0, 0, 0.05)',
        'modal': '0 25px 50px -12px rgba(128, 0, 144, 0.25)',
        'button': '0 4px 14px 0 rgba(128, 0, 144, 0.28)',
      },
    },
  },
  plugins: [],
}
