import { palette } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';
import { shadows } from './shadows';

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
  },
};

const fonts = {
  regular: { fontFamily: typography.fontFamily.regular, fontWeight: typography.weight.regular },
  medium: { fontFamily: typography.fontFamily.medium, fontWeight: typography.weight.medium },
  light: { fontFamily: typography.fontFamily.light, fontWeight: typography.weight.light },
  thin: { fontFamily: typography.fontFamily.light, fontWeight: typography.weight.light },
};

export const lightTheme = {
  dark: false,
  colors: {
    primary: palette.coral[500],
    primaryLight: palette.coral[200],
    secondary: palette.yellow[500],
    background: palette.gray[50],
    surface: palette.gray[0],
    card: palette.gray[0],
    text: palette.gray[900],
    textSecondary: palette.gray[500],
    border: palette.gray[200],
    notification: palette.coral[600],
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

export const darkTheme = {
  dark: true,
  colors: {
    primary: palette.coral[500],
    primaryLight: palette.coral[900],
    secondary: palette.yellow[400],
    background: palette.dark.bg,
    surface: palette.dark.surface,
    card: palette.dark.surface,
    text: palette.gray[0],
    textSecondary: palette.gray[400],
    border: palette.dark.border,
    notification: palette.coral[500],
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
