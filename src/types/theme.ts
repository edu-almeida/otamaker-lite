export interface ColorScale {
  50?: string;
  100?: string;
  200?: string;
  400?: string;
  500: string;
  600?: string;
  900?: string;
}

export interface Palette {
  coral: ColorScale;
  yellow: ColorScale;
  gray: {
    0: string;
    50: string;
    100: string;
    200: string;
    400: string;
    500: string;
    900: string;
  };
  dark: {
    bg: string;
    surface: string;
    surfaceHigh: string;
    border: string;
    text: string;
    textSecondary: string;
  };
  success: string;
  error: string;
  info: string;
  black: string;
}

export interface ThemeColors {
  primary: string;
  primaryLight: string;
  secondary: string;
  background: string;
  surface: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  notification: string;
  overlay: string;       // For masks and modals
  surfaceVariant: string; // Additional surface level
  success: string;
  error: string;
  info: string;
}

export interface Typography {
  fontFamily: {
    regular: string;
    medium: string;
    bold: string;
    light: string;
  };
  weight: {
    regular: string;
    medium: string;
    bold: string;
    light: string;
  };
  size: {
    xxs: number;
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
    xxxl: number;
    huge: number;
  };
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
  };
}

export interface Spacing {
  none: number;
  xxs: number;
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
  xxxl: number;
  huge: number;
}

export interface ShadowStyle {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

export interface Shadows {
  soft: ShadowStyle;
  medium: ShadowStyle;
  strong: ShadowStyle;
  top: ShadowStyle;
  sm: ShadowStyle;
  md: ShadowStyle;
  lg: ShadowStyle;
}

export interface BorderRadius {
  none: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  round: number;
}

export interface FontConfig {
  fontFamily: string;
  fontWeight: string;
}

export interface Fonts {
  regular: FontConfig;
  medium: FontConfig;
  light: FontConfig;
  thin: FontConfig;
}

export interface Theme {
  dark: boolean;
  colors: ThemeColors;
  typography: Typography;
  spacing: Spacing;
  shadows: Shadows;
  borderRadius: BorderRadius;
  fonts: Fonts;
}
