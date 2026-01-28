import { palette } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';
import { shadows } from './shadows';
import { Theme, BorderRadius, Fonts } from '../types';

// Export individual tokens for direct usage
export const tokens = {
  colors: palette,
  typography: typography,
  spacing: spacing,
  shadows: shadows,
  borderRadius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 20,
    round: 9999,
  } as BorderRadius,
};

const fonts: Fonts = {
  regular: { fontFamily: typography.fontFamily.regular, fontWeight: typography.weight.regular },
  medium: { fontFamily: typography.fontFamily.medium, fontWeight: typography.weight.medium },
  light: { fontFamily: typography.fontFamily.light, fontWeight: typography.weight.light },
  thin: { fontFamily: typography.fontFamily.light, fontWeight: typography.weight.light },
};

export const lightTheme: Theme = {
  dark: false,
  colors: {
    primary: palette.coral[500],
    primaryLight: palette.coral[200]!,
    secondary: palette.yellow[500],
    background: '#EBE4E0',      // Bege claro (fundo das telas)
    surface: '#F5F1EF',         // Off-white bege (cards)
    card: '#F5F1EF',            // Off-white bege (cards)
    text: palette.gray[900],
    textSecondary: palette.gray[500],
    border: palette.gray[200],
    notification: palette.coral[600]!,
    overlay: 'rgba(255, 255, 255, 0.85)',
    surfaceVariant: palette.gray[50],
    success: palette.success,
    error: palette.error,
    info: palette.info,
  },
  typography,
  spacing,
  shadows,
  borderRadius: tokens.borderRadius,
  fonts, // Required by React Navigation
};

export const darkTheme: Theme = {
  dark: true,
  colors: {
    primary: '#FF3B5C',                // Vibrant Instagram/TikTok Style Pink-Red
    primaryLight: 'rgba(255, 59, 92, 0.15)',
    secondary: palette.yellow[400]!,
    background: palette.dark.bg,
    surface: palette.dark.surface,
    card: palette.dark.surface,
    text: palette.dark.text,           
    textSecondary: palette.dark.textSecondary, 
    border: palette.dark.border,
    notification: '#FF3B5C',
    overlay: 'rgba(0, 0, 0, 0.9)',     // Much darker overlay
    surfaceVariant: palette.dark.surfaceHigh,
    success: palette.success,
    error: palette.error,
    info: palette.info,
  },
  typography,
  spacing,
  shadows,
  borderRadius: tokens.borderRadius,
  fonts, // Required by React Navigation
};

export const theme = {
  light: lightTheme,
  dark: darkTheme,
};

export { palette, typography, spacing, shadows };
