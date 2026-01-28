import { Palette } from '../types';

export const palette: Palette = {
  // BRAND: Rose (Nova cor principal)
  coral: {
    50: '#FFF1F2',   // Tom muito claro para backgrounds
    100: '#FFE4E6',  // Tom claro
    200: '#FECDD3',  // Tom mais claro para Dark Mode
    500: '#BE123C',  // COR BASE (Nova cor principal)
    600: '#9F1239',  // Estado de clique (Pressed)
    900: '#4C0519',  // Tom escuro
  },

  // ACCENT: Laranja para raridade/favorito (Substituindo amarelo)
  yellow: {
    400: '#FB923C', // Laranja claro
    500: '#F97316', // Laranja vibrante
  },

  // NEUTRALS: Baseado no padrão Gmail
  gray: {
    0: '#E3D8D2',        // Bege/creme claro (background principal)
    50: '#F6F8FC',       // Cinza azulado claro (surface - não usado)
    100: '#F3F4F6',
    200: '#E5E7EB',
    400: '#9CA3AF',
    500: '#6B7280',
    900: '#1A202C',
  },

  // DARK SYSTEM: Instagram Style (True Black / OLED)
  dark: {
    bg: '#0A0A0A',         // Very Dark Grey (lighter than true black)
    surface: '#121212',    // Dark grey for cards and surfaces
    surfaceHigh: '#1C1C1E', // Elevate headers or active items
    border: '#262626',      // Very subtle border
    text: '#FFFFFF',       // Clean white text
    textSecondary: '#A8A8A8', // Muted grey for secondary text
  },

  // FEEDBACK
  success: '#48BB78',
  error: '#F56565',
  info: '#4299E1',
  black: '#000000',
};

export const colors = {
  ...palette,
  // Semantic aliases can be added here if needed, but the main theme logic will handle light/dark mapping
};
