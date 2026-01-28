import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { theme } from '../theme';
import { Theme } from '../types';

// Create the context with proper typing
const ThemeContext = createContext<Theme | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps): React.JSX.Element {
  const deviceTheme = useColorScheme();

  // Detecta o tema e memoriza para não reprocessar sem necessidade
  const currentTheme = useMemo((): Theme => {
    return deviceTheme === 'dark' ? theme.dark : theme.light;
  }, [deviceTheme]);

  return (
    <ThemeContext.Provider value={currentTheme}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook para usar o tema nas telas
export function useTheme(): Theme {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }

  return context;
}
