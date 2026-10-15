/**
 * PBYB Design System Tokens
 * Derived from Figma Specifications:
 * - Primary: Purple (#800090)
 * - Accent: Lilac (#ECD4ED)
 * - Secondary: Sky Blue (#89CFF0)
 * - Typography: Anton (Display) & DM Sans (UI / Body)
 */

export const colors = {
  primary: {
    DEFAULT: '#800090',
    50: '#FDF4FF',
    100: '#F7B9FF', // Shade 0
    150: '#EBA7F4', // Shade 0.5
    200: '#DF94E9', // Shade 1
    250: '#D382DE', // Shade 1.5
    300: '#C76FD3', // Shade 2
    400: '#B04ABC', // Shade 3
    500: '#9825A6', // Shade 4
    600: '#800090', // Shade 5 (Base)
    700: '#660073', // Shade 6
    800: '#4D0056', // Shade 7
    900: '#33003A', // Shade 8
    925: '#26002B', // Shade 8.5
    950: '#1A001D', // Shade 9
    975: '#0D000E', // Shade 9.5
    1000: '#000000', // Shade 10
    shades: {
      0: '#F7B9FF',
      0.5: '#EBA7F4',
      1: '#DF94E9',
      1.5: '#D382DE',
      2: '#C76FD3',
      3: '#B04ABC',
      4: '#9825A6',
      5: '#800090',
      6: '#660073',
      7: '#4D0056',
      8: '#33003A',
      8.5: '#26002B',
      9: '#1A001D',
      9.5: '#0D000E',
      10: '#000000',
    },
  },
  accent: {
    DEFAULT: '#ECD4ED',
    50: '#FDFBFD', // Shade 0.5
    100: '#FBF6FB', // Shade 1
    150: '#F9F2FA', // Shade 1.5
    200: '#F7EEF8', // Shade 2
    300: '#F4E5F4', // Shade 3
    400: '#F0DDF1', // Shade 4
    500: '#ECD4ED', // Shade 5 (Base)
    600: '#D2B3D3', // Shade 6
    700: '#B891B9', // Shade 7
    800: '#9D70A0', // Shade 8
    850: '#905F93', // Shade 8.5
    900: '#834E86', // Shade 9
    925: '#763E79', // Shade 9.5
    950: '#692D6C', // Shade 10
    shades: {
      0: '#FFFFFF',
      0.5: '#FDFBFD',
      1: '#FBF6FB',
      1.5: '#F9F2FA',
      2: '#F7EEF8',
      3: '#F4E5F4',
      4: '#F0DDF1',
      5: '#ECD4ED',
      6: '#D2B3D3',
      7: '#B891B9',
      8: '#9D70A0',
      8.5: '#905F93',
      9: '#834E86',
      9.5: '#763E79',
      10: '#692D6C',
    },
  },
  secondary: {
    DEFAULT: '#89CFF0',
    50: '#F3FAFE', // Shade 0.5
    100: '#E7F5FC', // Shade 1
    150: '#DCF1FB', // Shade 1.5
    200: '#D0ECF9', // Shade 2
    300: '#B8E2F6', // Shade 3
    400: '#A1D9F3', // Shade 4
    500: '#89CFF0', // Shade 5 (Base)
    600: '#6FB0CE', // Shade 6
    700: '#5691AD', // Shade 7
    800: '#3C728B', // Shade 8
    850: '#2F637A', // Shade 8.5
    900: '#23536A', // Shade 9
    925: '#164459', // Shade 9.5
    950: '#093448', // Shade 10
    shades: {
      0: '#FFFFFF',
      0.5: '#F3FAFE',
      1: '#E7F5FC',
      1.5: '#DCF1FB',
      2: '#D0ECF9',
      3: '#B8E2F6',
      4: '#A1D9F3',
      5: '#89CFF0',
      6: '#6FB0CE',
      7: '#5691AD',
      8: '#3C728B',
      8.5: '#2F637A',
      9: '#23536A',
      9.5: '#164459',
      10: '#093448',
    },
  },
  semantic: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },
  neutral: {
    white: '#FFFFFF',
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    black: '#000000',
  },
} as const

export const typography = {
  fonts: {
    display: 'Anton, sans-serif',
    sans: '"DM Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  scale: {
    xs: { fontSize: '0.75rem', lineHeight: '1.125rem' }, // 12px / 18px
    sm: { fontSize: '0.875rem', lineHeight: '1.25rem' }, // 14px / 20px
    md: { fontSize: '1rem', lineHeight: '1.5rem' }, // 16px / 24px
    lg: { fontSize: '1.125rem', lineHeight: '1.75rem' }, // 18px / 28px
    xl: { fontSize: '1.25rem', lineHeight: '1.875rem' }, // 20px / 30px
    '2xl': { fontSize: '1.5rem', lineHeight: '2rem' }, // 24px / 32px
    '3xl': { fontSize: '1.875rem', lineHeight: '2.375rem' }, // 30px / 38px
    '4xl': { fontSize: '2.25rem', lineHeight: '2.625rem' }, // 36px / 42px
    '5xl': { fontSize: '3rem', lineHeight: '1.1' }, // 48px
  },
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const

export const radii = {
  none: '0px',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '20px',
  '3xl': '24px',
  '4xl': '32px',
  full: '9999px',
} as const

export const shadows = {
  subtle: '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
  card: '0 4px 20px -2px rgba(128, 0, 144, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.03)',
  cardHover: '0 10px 25px -3px rgba(128, 0, 144, 0.1), 0 4px 10px -2px rgba(0, 0, 0, 0.05)',
  modal: '0 25px 50px -12px rgba(128, 0, 144, 0.25)',
  button: '0 4px 14px 0 rgba(128, 0, 144, 0.28)',
} as const

export type DesignTokens = {
  colors: typeof colors
  typography: typeof typography
  radii: typeof radii
  shadows: typeof shadows
}
